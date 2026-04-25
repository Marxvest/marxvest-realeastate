"use client";

import { MARXVEST_WHATSAPP_URL } from "@/lib/ai-assistant/constants";

export default function WhatsAppCTA() {
  return (
    <a
      href={MARXVEST_WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      className="block rounded-xl bg-[var(--brand-primary-dark)] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[var(--brand-primary)]"
    >
      Continue on WhatsApp
    </a>
  );
}
