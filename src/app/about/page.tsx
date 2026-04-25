import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About Marxvest Real Estate",
  description:
    "Learn about Marxvest Real Estate and how we help buyers access verified land, guided inspections, clear documentation, and confident property investment support in Nigeria.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="pb-24">
      <section className="mx-auto grid w-[var(--page-width)] gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="section-cap">About Marxvest</div>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-5xl font-semibold text-[var(--brand-text)] sm:text-6xl">
            Helping buyers secure verified land in Nigeria with greater clarity.
          </h1>
        </div>
        <div className="space-y-6 text-lg leading-8 text-[var(--brand-text-muted)]">
          <p>
            Marxvest Real Estate helps buyers approach land acquisition with
            stronger confidence, clearer information, and a more guided
            transaction experience. Our focus is on inspected estates,
            documentation visibility, practical payment guidance, and honest
            support from inquiry to allocation.
          </p>
          <p>
            We serve first-time land buyers, diaspora investors, and long-term
            property investors who want to compare estates, understand title
            posture, schedule inspections, and move forward through a transparent
            process instead of guesswork.
          </p>
          <p>
            Marxvest Spec Limited remains the operating business behind this
            platform, while Marxvest Real Estate is the public-facing brand used
            to guide buyers through verified land opportunities in Lagos, Ogun
            State, Ikorodu, Sagamu, Alabata, and other developing corridors.
          </p>
        </div>
      </section>
    </main>
  );
}
