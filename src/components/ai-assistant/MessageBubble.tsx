"use client";

import type { ChatMessage } from "@/types/ai-assistant";

type MessageBubbleProps = {
  message: ChatMessage;
};

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "rounded-br-sm bg-[var(--brand-primary)] text-white"
            : "rounded-bl-sm bg-[var(--brand-surface)] text-[var(--brand-text)]"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
