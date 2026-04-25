"use client";

import { useEffect, useRef, useState } from "react";

import { ASSISTANT_NAME, WELCOME_MESSAGE } from "@/lib/ai-assistant/constants";
import { sendAssistantMessage } from "@/lib/ai-assistant/chat-client";
import {
  getOrCreateVisitorId,
  getStoredConversationId,
  storeConversationId,
} from "@/lib/ai-assistant/local-storage";
import type { ChatMessage } from "@/types/ai-assistant";

import LeadForm from "./LeadForm";
import MessageBubble from "./MessageBubble";
import PromptChips from "./PromptChips";
import WhatsAppCTA from "./WhatsAppCTA";

type ChatWindowProps = {
  onClose: () => void;
};

function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

export default function ChatWindow({ onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage("assistant", WELCOME_MESSAGE),
  ]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setConversationId(getStoredConversationId());
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showLeadForm]);

  async function sendMessage(rawMessage?: string) {
    const message = (rawMessage || input).trim();

    if (!message || isSending) {
      return;
    }

    const userMessage = createMessage("user", message);
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsSending(true);
    setError(null);

    try {
      const visitorId = getOrCreateVisitorId();
      const response = await sendAssistantMessage({
        conversationId,
        visitorId,
        message,
        pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
      });

      if (response.conversationId && response.conversationId !== conversationId) {
        setConversationId(response.conversationId);
        storeConversationId(response.conversationId);
      }

      setMessages((current) => [
        ...current,
        createMessage("assistant", response.reply),
      ]);

      if (response.shouldCaptureLead) {
        setShowLeadForm(true);
      }
    } catch {
      setError("The assistant is temporarily unavailable. You can continue on WhatsApp.");
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  return (
    <section className="fixed bottom-[5.5rem] right-4 z-[70] flex h-[75vh] max-h-[680px] w-[calc(100vw-2rem)] max-w-md flex-col overflow-hidden rounded-3xl border border-[var(--brand-border)] bg-white shadow-[0_30px_90px_rgba(7,18,45,0.22)] sm:bottom-[14.8rem] sm:right-7">
      <header className="flex items-center justify-between bg-[var(--brand-primary-dark)] px-5 py-4 text-white">
        <div>
          <h2 className="text-sm font-semibold">{ASSISTANT_NAME}</h2>
          <p className="text-xs text-white/72">Sales and support assistant</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full px-2 py-1 text-xl leading-none text-white/90 hover:bg-white/10"
          aria-label="Close assistant"
        >
          ×
        </button>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isSending ? (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm bg-[var(--brand-surface)] px-4 py-2 text-sm text-[var(--brand-text-muted)]">
              Marxvest assistant is typing...
            </div>
          </div>
        ) : null}

        {showLeadForm ? (
          <div className="space-y-3">
            <p className="text-sm text-[var(--brand-text-muted)]">
              To help you better, please leave your details and a Marxvest consultant can follow up.
            </p>
            <LeadForm conversationId={conversationId} />
          </div>
        ) : null}

        {error ? (
          <div className="space-y-3 rounded-2xl border border-[rgba(181,39,79,0.16)] bg-[rgba(181,39,79,0.06)] p-4">
            <p className="text-sm font-medium text-[var(--brand-danger)]">{error}</p>
            <WhatsAppCTA />
          </div>
        ) : null}

        <div ref={scrollRef} />
      </div>

      <PromptChips
        onSelect={(prompt) => void sendMessage(prompt)}
        disabled={isSending}
      />

      <div className="border-t border-[var(--brand-border)] p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={isSending}
            className="min-w-0 flex-1 rounded-xl border border-[var(--brand-border-strong)] px-3 py-3 text-sm outline-none focus:border-[var(--brand-primary)] disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="Ask about estates, payment, inspection..."
          />
          <button
            type="submit"
            disabled={isSending || !input.trim()}
            className="rounded-xl bg-[var(--brand-primary-dark)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-primary)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
}
