import { trustFramework } from "@/lib/site-data";

export default function TrustPage() {
  return (
    <main className="pb-24">
      <section className="mx-auto w-[var(--page-width)] py-16">
        <div className="max-w-4xl">
          <div className="section-cap">Trust & legal</div>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-5xl font-semibold text-[var(--brand-text)] sm:text-6xl">
            The public sales experience is backed by clearer rules, guided inspections, and visible intent.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--brand-text-muted)]">
            This page explains the operating posture behind Marxvest&apos;s public
            website: why buyer actions are staged, how document confidence is handled,
            and which values shape the investment experience.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[2.2rem] border border-[var(--brand-border)] bg-white p-8">
            <div className="section-cap">Vision</div>
            <p className="mt-6 text-lg leading-8 text-[var(--brand-text-muted)]">
              {trustFramework.vision}
            </p>
          </section>

          <section className="rounded-[2.2rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-8">
            <div className="section-cap">Mission</div>
            <p className="mt-6 text-lg leading-8 text-[var(--brand-text-muted)]">
              {trustFramework.mission}
            </p>
          </section>
        </div>

        <section className="mt-10 rounded-[2.4rem] border border-[var(--brand-border)] bg-white p-8 sm:p-10">
          <div className="section-cap">Core values</div>
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {trustFramework.values.map((value) => (
              <article
                key={value.title}
                className="rounded-[1.6rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-5"
              >
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--brand-text)]">
                  {value.title}
                </h2>
                <p className="mt-3 text-base leading-7 text-[var(--brand-text-muted)]">
                  {value.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[2.4rem] bg-[var(--brand-primary-dark)] p-8 text-white sm:p-10">
          <div className="section-cap !text-white before:!bg-white/60">
            Legal posture
          </div>
          <div className="mt-8 grid gap-4">
            {trustFramework.legalNotes.map((note) => (
              <div key={note} className="border-t border-white/12 pt-5 text-base leading-7 text-white/82">
                {note}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
