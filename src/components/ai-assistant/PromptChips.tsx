"use client";

import { SUGGESTED_PROMPTS } from "@/lib/ai-assistant/constants";

type PromptChipsProps = {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
};

export default function PromptChips({
  onSelect,
  disabled,
}: PromptChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 px-4 pb-3">
      {SUGGESTED_PROMPTS.map((item) => (
        <button
          key={item.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(item.prompt)}
          className="rounded-full border border-[rgba(29,78,216,0.14)] bg-[rgba(29,78,216,0.06)] px-3 py-1.5 text-xs font-medium text-[var(--brand-primary)] transition hover:bg-[rgba(29,78,216,0.1)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
