import { NextResponse } from "next/server";
import OpenAI from "openai";

import { createSupabaseServiceClient } from "@/lib/ai-assistant/supabase-server";
import {
  buildFallbackReply,
  buildMarxvestSystemPrompt,
  detectLeadIntent,
  getFallbackAssistantContext,
  suggestEstate,
} from "@/lib/ai-assistant/prompt";
import type { ChatApiRequest } from "@/types/ai-assistant";

export const runtime = "nodejs";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

function isValidMessage(message: unknown): message is string {
  return (
    typeof message === "string" &&
    message.trim().length > 0 &&
    message.length <= 3000
  );
}

async function loadAssistantContext() {
  try {
    const supabase = createSupabaseServiceClient();
    const [{ data: estates }, { data: faqs }] = await Promise.all([
      supabase
        .from("ai_estates")
        .select(
          "name, location, category, description, payment_plan, title_document, starting_price",
        )
        .eq("is_active", true)
        .order("created_at", { ascending: true }),
      supabase
        .from("ai_faqs")
        .select("question, answer")
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .limit(20),
    ]);

    return {
      context: {
        estates: estates || [],
        faqs: faqs || [],
      },
      supabase,
    };
  } catch {
    return {
      context: getFallbackAssistantContext(),
      supabase: null,
    };
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatApiRequest;

    if (!isValidMessage(body.message)) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const { context, supabase } = await loadAssistantContext();
    const shouldCaptureLead = detectLeadIntent(body.message);
    const suggestedEstate = suggestEstate(body.message);
    let conversationId = body.conversationId || crypto.randomUUID();

    if (supabase && !body.conversationId) {
      const { data: conversation, error: conversationError } = await supabase
        .from("ai_conversations")
        .insert({
          id: conversationId,
          visitor_id: body.visitorId,
          page_url: body.pageUrl,
          source: "website",
        })
        .select("id")
        .single();

      if (!conversationError && conversation?.id) {
        conversationId = conversation.id;
      }
    }

    if (supabase) {
      await supabase.from("ai_messages").insert({
        conversation_id: conversationId,
        role: "user",
        content: body.message.trim(),
      });
    }

    let reply: string;

    if (openai) {
      try {
        let orderedHistory:
          | Array<{
              role: "user" | "assistant" | "system";
              content: string;
            }>
          | undefined;

        if (supabase) {
          const { data: history } = await supabase
            .from("ai_messages")
            .select("role, content")
            .eq("conversation_id", conversationId)
            .order("created_at", { ascending: false })
            .limit(10);

          orderedHistory = (history || []).reverse().map((message) => ({
            role: message.role as "user" | "assistant" | "system",
            content: message.content as string,
          }));
        }

        const completion = await openai.chat.completions.create({
          model: "gpt-4.1-mini",
          temperature: 0.4,
          messages: [
            {
              role: "system",
              content: buildMarxvestSystemPrompt(context),
            },
            ...(orderedHistory || []),
            { role: "user", content: body.message.trim() },
          ],
        });

        reply =
          completion.choices[0]?.message?.content ||
          "I am sorry, I could not process that request. Please contact Marxvest on WhatsApp for assistance.";
      } catch (error) {
        console.error("AI assistant OpenAI fallback:", error);
        reply = buildFallbackReply(body.message).reply;
      }
    } else {
      reply = buildFallbackReply(body.message).reply;
    }

    if (supabase) {
      await supabase.from("ai_messages").insert({
        conversation_id: conversationId,
        role: "assistant",
        content: reply,
        model: openai ? "gpt-4.1-mini" : "fallback",
        metadata: {
          shouldCaptureLead,
          suggestedEstate,
        },
      });

      await supabase
        .from("ai_conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);
    }

    return NextResponse.json({
      conversationId,
      reply,
      shouldCaptureLead,
      suggestedEstate,
    });
  } catch (error) {
    console.error("AI assistant chat error:", error);

    return NextResponse.json(
      {
        error:
          "The assistant is temporarily unavailable. Please continue on WhatsApp.",
      },
      { status: 500 },
    );
  }
}
