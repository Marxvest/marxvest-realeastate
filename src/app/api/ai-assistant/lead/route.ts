import { NextResponse } from "next/server";

import { createSupabaseServiceClient } from "@/lib/ai-assistant/supabase-server";
import type { LeadPayload } from "@/types/ai-assistant";

type LeadRequest = LeadPayload & {
  conversationId?: string | null;
};

function clean(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadRequest;
    const name = clean(body.name);
    const phone = clean(body.phone);

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and WhatsApp number are required" },
        { status: 400 },
      );
    }

    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase
      .from("ai_leads")
      .insert({
        conversation_id: body.conversationId || null,
        name,
        phone,
        email: clean(body.email),
        estate_interest: clean(body.estateInterest),
        budget: clean(body.budget),
        buying_purpose: clean(body.buyingPurpose),
        timeline: clean(body.timeline),
        conversation_summary: clean(body.conversationSummary),
        source: "website_assistant",
      })
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    if (body.conversationId) {
      await supabase
        .from("ai_conversations")
        .update({ status: "lead_captured" })
        .eq("id", body.conversationId);
    }

    return NextResponse.json({ ok: true, leadId: data.id });
  } catch (error) {
    console.error("AI assistant lead error:", error);
    return NextResponse.json({ error: "Could not save lead" }, { status: 500 });
  }
}
