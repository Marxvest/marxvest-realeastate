"use client";

import { useState, useTransition } from "react";

type PaymentButtonProps = {
  listingSlug: string;
  planType: "full" | "installment";
  label: string;
};

export function PaymentButton({
  listingSlug,
  planType,
  label,
}: PaymentButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() =>
          startTransition(async () => {
            setError(null);

            const response = await fetch("/api/payments/paystack/initialize", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ listingSlug, planType }),
            });

            const payload = (await response.json()) as {
              authorizationUrl?: string;
              error?: string;
            };

            if (!response.ok || !payload.authorizationUrl) {
              setError(payload.error ?? "Unable to start the payment flow.");
              return;
            }

            window.location.assign(payload.authorizationUrl);
          })
        }
        className="inline-flex items-center justify-center rounded-full bg-[var(--brand-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-primary-dark)] disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isPending}
      >
        {isPending ? "Preparing checkout..." : label}
      </button>
      {error ? (
        <p className="text-sm text-[var(--brand-danger)]">{error}</p>
      ) : null}
    </div>
  );
}
