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
      className="fixed bottom-5 right-5 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-primary-dark)] text-white shadow-[0_18px_48px_rgba(7,18,45,0.32)] transition hover:-translate-y-0.5 hover:bg-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-offset-2 sm:bottom-[10.5rem] sm:right-7"
    >
      {isOpen ? <X size={22} /> : <MessageCircle size={24} />}
    </button>
  );
}
