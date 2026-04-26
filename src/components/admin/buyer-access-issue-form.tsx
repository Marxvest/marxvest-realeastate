"use client";

import { useActionState, useMemo, useState } from "react";

import {
  issueBuyerAccessLinkAction,
} from "@/actions/buyer-access";
import {
  initialBuyerAccessActionState,
  type BuyerAccessActionState,
} from "@/lib/buyer-access-action-state";

function CopyLinkButton({ shareUrl }: { shareUrl: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center justify-center rounded-full border border-[var(--brand-border-strong)] px-4 py-2 text-sm font-semibold text-[var(--brand-text)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
    >
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}

function ActionMessage({ state }: { state: BuyerAccessActionState }) {
  if (state.status === "idle" || !state.message) {
    return null;
  }

  return (
    <div
      className={`rounded-[1.5rem] border px-4 py-4 text-sm leading-7 ${
        state.status === "success"
          ? "border-[rgba(29,78,216,0.16)] bg-[rgba(29,78,216,0.06)] text-[var(--brand-text)]"
          : "border-[rgba(181,39,79,0.16)] bg-[rgba(181,39,79,0.06)] text-[var(--brand-danger)]"
      }`}
    >
      <p>{state.message}</p>
      {state.status === "success" && state.shareUrl ? (
        <div className="mt-4 space-y-3">
          <input
            type="text"
            readOnly
            value={state.shareUrl}
            className="w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3 text-sm text-[var(--brand-text)]"
          />
          <div className="flex flex-wrap gap-3">
            <CopyLinkButton shareUrl={state.shareUrl} />
            <a
              href={state.shareUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[var(--brand-primary-dark)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-primary)]"
            >
              Open link
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function BuyerAccessIssueForm() {
  const [state, formAction, isPending] = useActionState(
    issueBuyerAccessLinkAction,
    initialBuyerAccessActionState,
  );

  const deliveryOptions = useMemo(
    () => [
      { value: "manual", label: "Manual send" },
      { value: "whatsapp", label: "WhatsApp" },
      { value: "email", label: "Email" },
    ],
    [],
  );

  return (
    <form action={formAction} className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <ActionMessage state={state} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[var(--brand-text)]" htmlFor="buyer-access-name">
          Buyer full name
        </label>
        <input
          id="buyer-access-name"
          name="buyerName"
          type="text"
          required
          className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[var(--brand-text)]" htmlFor="buyer-access-email">
          Buyer email
        </label>
        <input
          id="buyer-access-email"
          name="buyerEmail"
          type="email"
          required
          className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[var(--brand-text)]" htmlFor="buyer-access-phone">
          Buyer phone
        </label>
        <input
          id="buyer-access-phone"
          name="buyerPhone"
          type="tel"
          required
          className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[var(--brand-text)]" htmlFor="buyer-access-estate">
          Estate / property reference
        </label>
        <input
          id="buyer-access-estate"
          name="estateName"
          type="text"
          required
          className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="block text-sm font-semibold text-[var(--brand-text)]" htmlFor="buyer-access-drive">
          Google Drive folder URL or folder ID
        </label>
        <input
          id="buyer-access-drive"
          name="driveFolderInput"
          type="text"
          required
          className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[var(--brand-text)]" htmlFor="buyer-access-delivery-channel">
          Delivery channel
        </label>
        <select
          id="buyer-access-delivery-channel"
          name="deliveryChannel"
          defaultValue="manual"
          className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
        >
          {deliveryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[var(--brand-text)]" htmlFor="buyer-access-delivery-note">
          Delivery note
        </label>
        <input
          id="buyer-access-delivery-note"
          name="deliveryNote"
          type="text"
          placeholder="Optional handoff note"
          className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="block text-sm font-semibold text-[var(--brand-text)]" htmlFor="buyer-access-payment-note">
          Internal payment note
        </label>
        <textarea
          id="buyer-access-payment-note"
          name="paymentNote"
          rows={3}
          placeholder="Optional internal note confirming manual payment review"
          className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
        />
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-full bg-[var(--brand-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Issuing secure link..." : "Issue secure buyer link"}
        </button>
      </div>
    </form>
  );
}
