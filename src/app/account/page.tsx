import Link from "next/link";

export default function AccountPage() {
  return (
    <main className="pb-24">
      <section className="mx-auto grid w-[var(--page-width)] gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="section-cap">Buyer account</div>
          <h1 className="font-[family-name:var(--font-display)] text-5xl font-semibold text-[var(--brand-text)] sm:text-6xl">
            The buyer account flow is archived for now.
          </h1>
          <p className="text-lg leading-8 text-[var(--brand-text-muted)]">
            Marxvest is currently routing product interest through direct agent
            contact and guided site inspections. Online account access and
            checkout actions are paused while the buyer flow is reviewed.
          </p>
        </div>

        <div className="rounded-[2.2rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-8">
          <div className="space-y-5">
            <div className="text-xs uppercase tracking-[0.28em] text-[var(--brand-primary)]">
              Current next steps
            </div>
            <p className="text-base leading-7 text-[var(--brand-text-muted)]">
              Speak with an agent for property questions, pricing guidance, and
              document review. Use site inspection booking when you are ready to
              schedule a guided visit.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-[var(--brand-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-primary-dark)]"
              >
                Contact Agent
              </Link>
              <Link
                href="/booking"
                className="inline-flex items-center justify-center rounded-full border border-[var(--brand-border-strong)] px-5 py-3 text-sm font-semibold text-[var(--brand-text)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
              >
                Book Site Inspection
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
