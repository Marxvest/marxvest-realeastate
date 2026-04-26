"use client";

import { House } from "lucide-react";

import type { ChatMessage } from "@/types/ai-assistant";

type MessageBubbleProps = {
  message: ChatMessage;
};

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex items-end gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser ? (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand-primary-dark)] text-white shadow-[0_12px_28px_rgba(7,18,45,0.16)]">
          <House className="h-[1.125rem] w-[1.125rem]" />
        </div>
      ) : null}

      <div
        className={`max-w-[min(86%,24rem)] rounded-[1.55rem] px-4 py-3 text-[0.98rem] leading-8 shadow-[0_14px_34px_rgba(7,18,45,0.06)] sm:text-sm sm:leading-7 ${
          isUser
            ? "rounded-br-md bg-[linear-gradient(180deg,#2d5ef4_0%,#1d4ed8_100%)] text-white"
            : "rounded-bl-md border border-[rgba(12,27,89,0.06)] bg-[var(--brand-surface)] text-[var(--brand-text)]"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
