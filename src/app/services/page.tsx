import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { buildNoIndexMetadata } from "@/lib/seo";
import { investorProfiles, processSteps, serviceHighlights } from "@/lib/site-data";

export const metadata = buildNoIndexMetadata(
  "Marxvest services",
  "Overview of Marxvest Real Estate acquisition support, site inspections, and buyer guidance.",
  "/services",
);

export default function ServicesPage() {
  return (
    <main className="pb-24">
      <section className="mx-auto w-[var(--page-width)] py-16">
        <RevealOnScroll from="left">
          <div className="max-w-4xl">
            <div className="section-cap">Services</div>
            <h1 className="mt-6 font-[family-name:var(--font-display)] text-5xl font-semibold text-[var(--brand-text)] sm:text-6xl">
              Acquisition support, guided inspections, and tighter buyer control.
            </h1>
          </div>
        </RevealOnScroll>

        <section className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <RevealOnScroll from="left">
            <div>
              <div className="section-cap">Who we serve</div>
              <h2 className="mt-5 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--brand-text)] sm:text-4xl">
                Built for buyers treating land as a long-term asset class.
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-8 text-[var(--brand-text-muted)]">
                Marxvest is structured for investors who want verified land, guided
                inspections, and a cleaner path from inquiry to allocation.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid gap-4 sm:grid-cols-2">
            {investorProfiles.map((profile, index) => (
              <RevealOnScroll
                key={profile}
                from={index % 2 === 0 ? "up" : "right"}
                delayMs={index * 70}
              >
                <div className="rounded-[1.6rem] border border-[var(--brand-border)] bg-white px-5 py-5 text-base leading-7 text-[var(--brand-text-muted)]">
                  {profile}
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </section>

        <RevealOnScroll from="up" delayMs={80}>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {serviceHighlights.map((item) => (
              <article
                key={item.title}
                className="rounded-[2rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-6"
              >
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--brand-text)]">
                  {item.title}
                </h2>
                <p className="mt-4 text-base leading-7 text-[var(--brand-text-muted)]">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll from="up" delayMs={120}>
          <div className="mt-12 rounded-[2.2rem] bg-[var(--brand-primary-dark)] p-8 text-white">
            <div className="section-cap !text-white before:!bg-white/60">Flow</div>
            <ol className="mt-8 grid gap-4 text-base leading-7 text-white/84 lg:grid-cols-5">
              {processSteps.map((step, index) => (
                <li key={step} className="border-t border-white/12 pt-5">
                  <div className="text-sm font-semibold text-white">0{index + 1}</div>
                  <p className="mt-3">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </RevealOnScroll>
      </section>
    </main>
  );
}
