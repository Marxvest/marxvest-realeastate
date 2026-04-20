export default function PaystackCallbackPage() {
  return (
    <main className="pb-24">
      <section className="mx-auto w-[var(--page-width)] py-20">
        <div className="max-w-3xl rounded-[2.2rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-8">
          <div className="section-cap">Paystack callback</div>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-4xl font-semibold text-[var(--brand-text)] sm:text-5xl">
            Online payment integration is archived for now.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[var(--brand-text-muted)]">
            Paystack checkout, callback handling, and dashboard payment actions
            are paused while the buyer flow is reviewed. Please contact an agent
            for the current acquisition process.
          </p>
        </div>
      </section>
    </main>
  );
}
