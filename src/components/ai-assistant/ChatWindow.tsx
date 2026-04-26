"use client";

import { useEffect, useRef, useState } from "react";
import { House, SendHorizonal, X } from "lucide-react";

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

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

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
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[75] bg-[rgba(7,18,45,0.18)] backdrop-blur-[2px] sm:bg-transparent sm:backdrop-blur-0"
        aria-hidden="true"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-label={ASSISTANT_NAME}
        className="fixed inset-0 z-[80] flex h-[100svh] w-screen flex-col bg-white sm:inset-auto sm:bottom-[14.8rem] sm:right-7 sm:h-[min(78vh,720px)] sm:w-[26rem] sm:max-w-[calc(100vw-3.5rem)] sm:overflow-hidden sm:rounded-[2rem] sm:border sm:border-[var(--brand-border)] sm:shadow-[0_30px_90px_rgba(7,18,45,0.22)]"
      >
        <header className="flex items-center justify-between bg-[var(--brand-primary-dark)] px-5 py-5 text-white sm:px-5 sm:py-4">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-full border border-[rgba(88,165,255,0.5)] bg-[linear-gradient(180deg,rgba(16,36,89,0.92)_0%,rgba(8,18,52,1)_100%)] shadow-[0_14px_32px_rgba(0,0,0,0.18)]">
              <House className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-[1.18rem] font-semibold leading-none sm:text-sm">
                {ASSISTANT_NAME}
              </h2>
              <p className="mt-1 text-[0.98rem] text-white/72 sm:text-xs">
                Sales and support assistant
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-2 text-sm font-medium text-white/92 transition hover:bg-white/12 sm:px-3.5"
            aria-label="Close assistant"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] px-5 py-6 sm:px-4 sm:py-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {isSending ? (
              <div className="flex items-end gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand-primary-dark)] text-white shadow-[0_12px_28px_rgba(7,18,45,0.16)]">
                  <House className="h-[1.125rem] w-[1.125rem]" />
                </div>
                <div className="rounded-[1.55rem] rounded-bl-md border border-[rgba(12,27,89,0.06)] bg-[var(--brand-surface)] px-4 py-3 text-[0.98rem] text-[var(--brand-text-muted)] shadow-[0_14px_34px_rgba(7,18,45,0.06)] sm:text-sm">
                  Marxvest assistant is typing...
                </div>
              </div>
            ) : null}

            {showLeadForm ? (
              <div className="space-y-3 rounded-[1.7rem] border border-[var(--brand-border)] bg-white p-4 shadow-[0_14px_34px_rgba(7,18,45,0.05)]">
                <p className="text-sm leading-7 text-[var(--brand-text-muted)]">
                  To help you better, please leave your details and a Marxvest consultant can follow up.
                </p>
                <LeadForm conversationId={conversationId} />
              </div>
            ) : null}

            {error ? (
              <div className="space-y-3 rounded-[1.7rem] border border-[rgba(181,39,79,0.16)] bg-[rgba(181,39,79,0.06)] p-4">
                <p className="text-sm font-medium text-[var(--brand-danger)]">{error}</p>
                <WhatsAppCTA />
              </div>
            ) : null}

            <div ref={scrollRef} />
          </div>
        </div>

        <div className="border-t border-[var(--brand-border)] bg-white">
          <PromptChips
            onSelect={(prompt) => void sendMessage(prompt)}
            disabled={isSending}
          />

          <div className="border-t border-[var(--brand-border)] px-5 py-4 sm:px-4">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                disabled={isSending}
                className="min-w-0 flex-1 rounded-[1.35rem] border border-[var(--brand-border-strong)] px-4 py-3.5 text-[1rem] text-[var(--brand-text)] outline-none transition focus:border-[var(--brand-primary)] disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-xl sm:px-3 sm:py-3 sm:text-sm"
                placeholder="Type your question..."
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[1.35rem] bg-[linear-gradient(180deg,#2d5ef4_0%,#1d4ed8_100%)] px-5 py-3.5 text-[1rem] font-semibold text-white shadow-[0_16px_32px_rgba(29,78,216,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_36px_rgba(29,78,216,0.28)] disabled:cursor-not-allowed disabled:opacity-60 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
              >
                <SendHorizonal className="h-[1.125rem] w-[1.125rem]" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
