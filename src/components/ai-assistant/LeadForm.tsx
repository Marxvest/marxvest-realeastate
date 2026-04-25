"use client";

import { useState } from "react";

import { submitAssistantLead } from "@/lib/ai-assistant/chat-client";
import type { LeadPayload } from "@/types/ai-assistant";

import WhatsAppCTA from "./WhatsAppCTA";

type LeadFormProps = {
  conversationId?: string | null;
  onSubmitted?: () => void;
};

export default function LeadForm({
  conversationId,
  onSubmitted,
}: LeadFormProps) {
  const [form, setForm] = useState<LeadPayload>({
    name: "",
    phone: "",
    email: "",
    estateInterest: "",
    budget: "",
    buyingPurpose: "",
    timeline: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(name: keyof LeadPayload, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.phone.trim()) {
      setError("Please provide your name and WhatsApp number.");
      return;
    }

    try {
      setIsSubmitting(true);
      await submitAssistantLead({ ...form, conversationId });
      setSubmitted(true);
      onSubmitted?.();
    } catch {
      setError("Could not submit your details. Please continue on WhatsApp instead.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="space-y-3 rounded-2xl border border-[rgba(29,78,216,0.14)] bg-[rgba(29,78,216,0.05)] p-4">
        <p className="text-sm font-medium text-[var(--brand-text)]">
          Thank you. A Marxvest consultant can follow up with you shortly.
        </p>
        <WhatsAppCTA />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-2xl border border-[var(--brand-border)] bg-white p-4"
    >
      <div>
        <label
          htmlFor="assistant-name"
          className="mb-1 block text-xs font-medium text-[var(--brand-text-muted)]"
        >
          Name *
        </label>
        <input
          id="assistant-name"
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
          className="w-full rounded-lg border border-[var(--brand-border-strong)] px-3 py-2 text-sm outline-none focus:border-[var(--brand-primary)]"
          placeholder="Your full name"
        />
      </div>

      <div>
        <label
          htmlFor="assistant-phone"
          className="mb-1 block text-xs font-medium text-[var(--brand-text-muted)]"
        >
          WhatsApp number *
        </label>
        <input
          id="assistant-phone"
          value={form.phone}
          onChange={(event) => updateField("phone", event.target.value)}
          className="w-full rounded-lg border border-[var(--brand-border-strong)] px-3 py-2 text-sm outline-none focus:border-[var(--brand-primary)]"
          placeholder="e.g. 080..."
        />
      </div>

      <div>
        <label
          htmlFor="assistant-email"
          className="mb-1 block text-xs font-medium text-[var(--brand-text-muted)]"
        >
          Email
        </label>
        <input
          id="assistant-email"
          type="email"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          className="w-full rounded-lg border border-[var(--brand-border-strong)] px-3 py-2 text-sm outline-none focus:border-[var(--brand-primary)]"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="assistant-estate"
          className="mb-1 block text-xs font-medium text-[var(--brand-text-muted)]"
        >
          Estate interest
        </label>
        <select
          id="assistant-estate"
          value={form.estateInterest}
          onChange={(event) => updateField("estateInterest", event.target.value)}
          className="w-full rounded-lg border border-[var(--brand-border-strong)] px-3 py-2 text-sm outline-none focus:border-[var(--brand-primary)]"
        >
          <option value="">Select estate</option>
          <option value="Kings Court Estate">Kings Court Estate</option>
          <option value="Billionaires Court Estate">Billionaires Court Estate</option>
          <option value="EverRich Farmland">EverRich Farmland</option>
          <option value="Not sure yet">Not sure yet</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="assistant-budget"
          className="mb-1 block text-xs font-medium text-[var(--brand-text-muted)]"
        >
          Budget range
        </label>
        <input
          id="assistant-budget"
          value={form.budget}
          onChange={(event) => updateField("budget", event.target.value)}
          className="w-full rounded-lg border border-[var(--brand-border-strong)] px-3 py-2 text-sm outline-none focus:border-[var(--brand-primary)]"
          placeholder="e.g. 2m - 5m"
        />
      </div>

      <div>
        <label
          htmlFor="assistant-purpose"
          className="mb-1 block text-xs font-medium text-[var(--brand-text-muted)]"
        >
          Purpose
        </label>
        <select
          id="assistant-purpose"
          value={form.buyingPurpose}
          onChange={(event) => updateField("buyingPurpose", event.target.value)}
          className="w-full rounded-lg border border-[var(--brand-border-strong)] px-3 py-2 text-sm outline-none focus:border-[var(--brand-primary)]"
        >
          <option value="">Select purpose</option>
          <option value="Residential">Residential</option>
          <option value="Investment">Investment</option>
          <option value="Agriculture">Agriculture</option>
          <option value="Land banking">Land banking</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="assistant-timeline"
          className="mb-1 block text-xs font-medium text-[var(--brand-text-muted)]"
        >
          Timeline
        </label>
        <select
          id="assistant-timeline"
          value={form.timeline}
          onChange={(event) => updateField("timeline", event.target.value)}
          className="w-full rounded-lg border border-[var(--brand-border-strong)] px-3 py-2 text-sm outline-none focus:border-[var(--brand-primary)]"
        >
          <option value="">Select timeline</option>
          <option value="Immediately">Immediately</option>
          <option value="This month">This month</option>
          <option value="1-3 months">1-3 months</option>
          <option value="Just researching">Just researching</option>
        </select>
      </div>

      {error ? <p className="text-xs font-medium text-[var(--brand-danger)]">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-[var(--brand-primary-dark)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-primary)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : "Submit my details"}
      </button>
    </form>
  );
}
