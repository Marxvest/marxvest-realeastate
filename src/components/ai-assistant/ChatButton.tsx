"use client";

import { MessageCircle, X } from "lucide-react";

type ChatButtonProps = {
  isOpen: boolean;
  onClick: () => void;
};

export default function ChatButton({ isOpen, onClick }: ChatButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isOpen ? "Close Marxvest assistant" : "Open Marxvest assistant"}
      className="fixed right-3.5 top-1/2 z-[70] flex h-10 w-10 -translate-y-1 items-center justify-center rounded-full bg-[var(--brand-primary-dark)] text-white shadow-[0_18px_48px_rgba(7,18,45,0.32)] transition hover:-translate-y-[0.3rem] hover:bg-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-offset-2 sm:top-auto sm:right-7 sm:h-14 sm:w-14 sm:translate-y-0 sm:hover:-translate-y-0.5 sm:bottom-[10.5rem]"
    >
      {isOpen ? (
        <X className="h-4 w-4 sm:h-[22px] sm:w-[22px]" />
      ) : (
        <MessageCircle className="h-4.5 w-4.5 sm:h-6 sm:w-6" />
      )}
    </button>
  );
}
