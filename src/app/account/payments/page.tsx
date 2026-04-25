import Link from "next/link";

import { buildNoIndexMetadata } from "@/lib/seo";

export const metadata = buildNoIndexMetadata(
  "Payment guidance",
  "Payment guidance page for buyers completing a Marxvest Real Estate transaction with advisor support.",
  "/account/payments",
);

export default function PaymentsPage() {
  return (
    <main className="pb-24">
      <section className="mx-auto w-[var(--page-width)] py-16">
        <div className="max-w-3xl space-y-5">
          <div className="section-cap">Payments</div>
          <h1 className="font-[family-name:var(--font-display)] text-5xl font-semibold text-[var(--brand-text)] sm:text-6xl">
            Payment guidance is handled with direct buyer support.
          </h1>
          <p className="text-lg leading-8 text-[var(--brand-text-muted)]">
            Marxvest confirms payment steps directly with buyers after estate
            review, documentation conversations, and inspection planning. Please
            contact an advisor for the current acquisition process attached to
            your selected property.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-[var(--brand-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-primary-dark)]"
          >
            Contact Marxvest Real Estate
          </Link>
        </div>
      </section>
    </main>
  );
}
