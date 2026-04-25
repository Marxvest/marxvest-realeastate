import Link from "next/link";

import { buildNoIndexMetadata } from "@/lib/seo";

export const metadata = buildNoIndexMetadata(
  "Buyer account support",
  "Buyer support page for ongoing Marxvest Real Estate transactions and guided next steps.",
  "/account",
);

export default function AccountPage() {
  return (
    <main className="pb-24">
      <section className="mx-auto grid w-[var(--page-width)] gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="section-cap">Buyer account</div>
          <h1 className="font-[family-name:var(--font-display)] text-5xl font-semibold text-[var(--brand-text)] sm:text-6xl">
            Buyer support continues through guided next steps.
          </h1>
          <p className="text-lg leading-8 text-[var(--brand-text-muted)]">
            Marxvest currently supports active buyers through direct advisor
            contact, guided site inspections, and document review conversations.
            Use the links below when you need clarification on an estate or want
            to schedule the next step in your purchase journey.
          </p>
        </div>

        <div className="rounded-[2.2rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-8">
          <div className="space-y-5">
            <div className="text-xs uppercase tracking-[0.28em] text-[var(--brand-primary)]">
              Current next steps
            </div>
            <p className="text-base leading-7 text-[var(--brand-text-muted)]">
              Speak with an advisor for estate questions, pricing guidance,
              documentation support, and inspection planning before payment or
              allocation discussions continue.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-[var(--brand-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-primary-dark)]"
              >
                Contact Marxvest Real Estate
              </Link>
              <Link
                href="/booking"
                className="inline-flex items-center justify-center rounded-full border border-[var(--brand-border-strong)] px-5 py-3 text-sm font-semibold text-[var(--brand-text)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
              >
                Book a site inspection
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
