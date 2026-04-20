export default function AboutPage() {
  return (
    <main className="pb-24">
      <section className="mx-auto grid w-[var(--page-width)] gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="section-cap">About Marxvest</div>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-5xl font-semibold text-[var(--brand-text)] sm:text-6xl">
            A land-first company with a stricter transaction standard.
          </h1>
        </div>
        <div className="space-y-6 text-lg leading-8 text-[var(--brand-text-muted)]">
          <p>
            Marxvest Spec Limited is not positioned as a generic real-estate
            brochure brand. The company is framed here as a focused land and
            estate operator built around documentation clarity, sales discipline,
            and structured digital conversion.
          </p>
          <p>
            The mark itself suggests upward motion and performance, so the new
            interface avoids lifestyle excess and leans into a sharper,
            blue-led corporate posture. Every public page is designed to make
            the business feel more credible than the previous WordPress site.
          </p>
        </div>
      </section>
    </main>
  );
}
