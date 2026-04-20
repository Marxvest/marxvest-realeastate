import Link from "next/link";

export default function PaymentsPage() {
  return (
    <main className="pb-24">
      <section className="mx-auto w-[var(--page-width)] py-16">
        <div className="max-w-3xl space-y-5">
          <div className="section-cap">Payments</div>
          <h1 className="font-[family-name:var(--font-display)] text-5xl font-semibold text-[var(--brand-text)] sm:text-6xl">
            Online payment integration is archived for now.
          </h1>
          <p className="text-lg leading-8 text-[var(--brand-text-muted)]">
            Paystack checkout and buyer dashboard payment actions are currently
            paused. Please contact an agent for the current acquisition process.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-[var(--brand-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-primary-dark)]"
          >
            Contact Agent
          </Link>
        </div>
      </section>
    </main>
  );
}
