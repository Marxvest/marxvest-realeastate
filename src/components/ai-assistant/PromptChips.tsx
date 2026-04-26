"use client";

import { CalendarDays, CreditCard, Search, TentTree } from "lucide-react";

import { SUGGESTED_PROMPTS } from "@/lib/ai-assistant/constants";

type PromptChipsProps = {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
};

export default function PromptChips({
  onSelect,
  disabled,
}: PromptChipsProps) {
  const icons = {
    "available-estates": Search,
    "payment-plan": CreditCard,
    "buy-land": TentTree,
    inspection: CalendarDays,
  } as const;

  return (
    <div className="grid grid-cols-2 gap-3 px-5 py-4 sm:flex sm:flex-wrap sm:px-4 sm:py-3">
      {SUGGESTED_PROMPTS.map((item) => {
        const Icon = icons[item.id as keyof typeof icons];

        return (
          <button
            key={item.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(item.prompt)}
            className="flex min-h-14 items-center justify-start gap-3 rounded-[1.4rem] border border-[rgba(29,78,216,0.14)] bg-white px-4 py-3 text-left text-sm font-medium text-[var(--brand-primary)] shadow-[0_10px_30px_rgba(7,18,45,0.05)] transition hover:border-[rgba(29,78,216,0.22)] hover:bg-[rgba(29,78,216,0.03)] disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-0 sm:w-auto sm:rounded-full sm:px-4 sm:py-2.5 sm:text-xs"
          >
            <Icon className="h-4 w-4 shrink-0 sm:h-3.5 sm:w-3.5" />
            <span className="leading-tight">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
