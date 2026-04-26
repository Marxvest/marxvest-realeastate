"use client";

import { useActionState, useState } from "react";

import {
  regenerateBuyerAccessLinkAction,
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
      className="inline-flex items-center justify-center rounded-full border border-[var(--brand-border-strong)] px-3 py-2 text-xs font-semibold text-[var(--brand-text)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
    >
      {copied ? "Copied" : "Copy new link"}
    </button>
  );
}

function RegenerateMessage({ state }: { state: BuyerAccessActionState }) {
  if (state.status === "idle" || !state.message) {
    return null;
  }

  return (
    <div
      className={`rounded-[1.2rem] border px-3 py-3 text-xs leading-6 ${
        state.status === "success"
          ? "border-[rgba(29,78,216,0.16)] bg-[rgba(29,78,216,0.06)] text-[var(--brand-text)]"
          : "border-[rgba(181,39,79,0.16)] bg-[rgba(181,39,79,0.06)] text-[var(--brand-danger)]"
      }`}
    >
      <p>{state.message}</p>
      {state.status === "success" && state.shareUrl ? (
        <div className="mt-3 space-y-2">
          <input
            type="text"
            readOnly
            value={state.shareUrl}
            className="w-full rounded-xl border border-[var(--brand-border)] bg-white px-3 py-2 text-xs text-[var(--brand-text)]"
          />
          <div className="flex flex-wrap gap-2">
            <CopyLinkButton shareUrl={state.shareUrl} />
            <a
              href={state.shareUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[var(--brand-primary-dark)] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[var(--brand-primary)]"
            >
              Open
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function BuyerAccessLinkActions({ linkId }: { linkId: string }) {
  const [state, formAction, isPending] = useActionState(
    regenerateBuyerAccessLinkAction,
    initialBuyerAccessActionState,
  );

  return (
    <div className="space-y-3">
      <form action={formAction} className="flex flex-wrap gap-2">
        <input type="hidden" name="linkId" value={linkId} />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-full border border-[var(--brand-border-strong)] px-3 py-2 text-xs font-semibold text-[var(--brand-text)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Regenerating..." : "Regenerate"}
        </button>
      </form>
      <RegenerateMessage state={state} />
    </div>
  );
}
