import Image from "next/image";
import Link from "next/link";

import { HeroImageSlider } from "@/components/hero-image-slider";
import { ListingCard } from "@/components/listing-card";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import {
  company,
  featuredListings,
  homepageAbout,
  homepageBanners,
  processSteps,
  serviceHighlights,
  trustPoints,
  trustFramework,
} from "@/lib/site-data";

const heroTrustMetrics = [
  {
    label: "Clients",
    value: "100+",
  },
  {
    label: "Estates",
    value: "3+",
  },
  {
    label: "Partners",
    value: "50+",
  },
  {
    label: "Awards",
    value: "10+",
  },
] as const;

const heroSlides = [
  {
    src: "/images/hero-image.jpeg",
    alt: "Marxvest luxury estate exterior",
    objectPosition: "62% center",
  },
  {
    src: "/images/gate-house-1.webp",
    alt: "Marxvest gated estate entrance",
    objectPosition: "50% center",
  },
  {
    src: "/images/gate-house-2.webp",
    alt: "Marxvest premium estate entrance view",
    objectPosition: "50% center",
  },
  {
    src: "/images/gate-house-3.webp",
    alt: "Marxvest clean estate architecture entrance",
    objectPosition: "50% center",
  },
] as const;

function AboutVideoFrame({
  mobile = false,
}: {
  mobile?: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[1.75rem] border border-[var(--brand-border)] bg-[var(--brand-text)] ${
        mobile ? "aspect-[9/13]" : "aspect-[0.88/1]"
      }`}
    >
      {homepageAbout.video.src ? (
        <video
          src={homepageAbout.video.src}
          poster={homepageAbout.video.poster}
          autoPlay
          controls
          loop
          muted
          preload="metadata"
          playsInline
          className="h-full w-full object-cover"
          aria-label={homepageAbout.video.alt}
        />
      ) : (
        <Image
          src={homepageAbout.video.poster}
          alt={homepageAbout.video.alt}
          fill
          sizes={
            mobile
              ? "100vw"
              : "(min-width: 1280px) 26vw, (min-width: 1024px) 30vw, 100vw"
          }
          className="object-cover transition duration-500 group-hover:scale-[1.02]"
        />
      )}
      <div className="absolute right-5 top-5 rounded-full bg-white/88 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[var(--brand-text)]">
        {homepageAbout.video.label}
      </div>
      {!homepageAbout.video.src ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(9,20,51,0.72)] via-[rgba(9,20,51,0.14)] to-transparent p-5 sm:p-6">
          <div className="text-sm font-semibold text-white">Introduction</div>
          <div className="text-xs text-white/72">
            {homepageAbout.video.duration}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="pb-24">
      <section className="hero-stage relative isolate -mt-[var(--sticky-shell-height)] overflow-hidden pt-[var(--sticky-shell-height)] text-white">
        <HeroImageSlider slides={heroSlides} />
        <div className="hero-stage-overlay absolute inset-0" />
        <div className="hero-stage-glow absolute inset-0" />

        <div className="relative z-10 mx-auto flex min-h-[calc(80svh-var(--sticky-shell-height))] w-[var(--page-width)] flex-col justify-between gap-4 pt-5 pb-4 sm:min-h-[calc(90svh-var(--sticky-shell-height))] sm:gap-5 sm:pt-7 sm:pb-8 lg:min-h-[calc(100svh-var(--sticky-shell-height))] lg:pt-10 lg:pb-10">
          <div className="max-w-[35rem] pt-1 sm:pt-2">
            <RevealOnScroll from="left">
              <div className="section-cap max-w-[92%] !text-[var(--brand-white)] before:!bg-white/48">
                Documentation-first land acquisition
              </div>
            </RevealOnScroll>

            <RevealOnScroll from="left" delayMs={110}>
              <h1 className="mt-4 max-w-[92%] font-[family-name:var(--font-display)] text-[clamp(2.125rem,7.8vw,3rem)] font-[360] leading-[0.96] tracking-[-0.04em] text-[var(--brand-white)] sm:max-w-[560px] sm:text-[clamp(2.8rem,4.1vw,4.2rem)] sm:font-[380] sm:leading-[0.94] sm:tracking-[-0.065em]">
                <span className="block whitespace-nowrap">Secure Verified Land</span>
                <span className="block whitespace-nowrap">Investments in Nigeria</span>
              </h1>
            </RevealOnScroll>

            <RevealOnScroll from="up" delayMs={170}>
              <p className="mt-4 max-w-[95%] text-[1.0625rem] leading-[1.55] text-white/82 sm:mt-3 sm:max-w-[25rem] sm:text-[0.95rem] sm:leading-7">
                Traceable plots, guided inspections, and flexible payment
                options backed by full legal documentation.
              </p>
            </RevealOnScroll>

            <RevealOnScroll from="up" delayMs={220}>
              <div className="mt-[22px] flex flex-col gap-[14px] sm:mt-5 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  href="/booking"
                  className="inline-flex h-14 w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#E9D9BD,#D8BE93)] px-6 text-[17px] font-semibold text-[var(--brand-text)] shadow-[0_10px_30px_rgba(216,190,147,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_30px_rgba(212,175,55,0.25)] hover:brightness-[1.03] sm:w-auto sm:min-w-[12rem] sm:px-7 sm:text-sm"
                >
                  Book Inspection
                </Link>
                <Link
                  href="/listings"
                  className="inline-flex h-14 w-full items-center justify-center rounded-full border border-[var(--brand-glass-border)] bg-white/7 px-6 text-[17px] font-semibold text-[var(--brand-white)] backdrop-blur-md transition hover:bg-white/12 sm:w-auto sm:min-w-[11rem] sm:px-7 sm:text-sm"
                >
                  View Estates
                </Link>
              </div>
            </RevealOnScroll>

            <RevealOnScroll from="up" delayMs={260}>
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[0.69rem] font-medium text-white/72">
                <span>No hidden charges</span>
                <span className="text-white/42">•</span>
                <span>Verified titles</span>
                <span className="text-white/42">•</span>
                <span>Guided inspection</span>
              </div>
            </RevealOnScroll>

            <RevealOnScroll from="up" delayMs={280}>
              <p className="mt-4 text-[0.78rem] font-medium uppercase tracking-[0.2em] text-white/58">
                Trusted by 100+ clients nationwide
              </p>
            </RevealOnScroll>

            <RevealOnScroll from="up" delayMs={320}>
              <a
                href={`https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(
                  "Hello Marxvest, I want to speak with your team about available land.",
                )}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/82 transition hover:gap-3 hover:text-[var(--brand-white)]"
              >
                Speak with an advisor
                <span aria-hidden="true">→</span>
              </a>
            </RevealOnScroll>
          </div>

          <RevealOnScroll from="up" delayMs={340}>
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              {heroTrustMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="hero-proof-band rounded-[1.1rem] px-4 py-4 sm:px-5 sm:py-5 lg:px-7 lg:py-6"
                >
                  <div className="font-[family-name:var(--font-display)] text-[clamp(2.1rem,3vw,2.625rem)] font-[700] leading-none tracking-[-0.04em] text-white/95">
                    {metric.value}
                  </div>
                  <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/62">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="mx-auto mt-6 w-[var(--page-width)] py-8">
        <div className="grid gap-4 lg:grid-cols-2">
          {homepageBanners.map((banner, index) => (
            <RevealOnScroll
              key={banner.id}
              from={index === 0 ? "left" : "right"}
              delayMs={index * 90}
            >
              <article className="hover-shift hero-panel rounded-[2rem] p-6 sm:p-8">
                <div className="section-cap">{banner.eyebrow}</div>
                <h2 className="mt-5 max-w-xl font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--brand-text)] sm:text-3xl">
                  {banner.title}
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-[var(--brand-text-muted)]">
                  {banner.body}
                </p>
                <Link
                  href={banner.ctaHref}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-primary)] transition hover:gap-3"
                >
                  {banner.ctaLabel}
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 w-[var(--page-width)] py-10">
        <RevealOnScroll from="up">
          <div className="max-w-[54rem]">
            <div className="section-cap">Featured estates</div>
            <h2 className="mt-6 max-w-[52rem] font-[family-name:var(--font-display)] text-[clamp(2.2rem,3.5vw,3.9rem)] font-[360] leading-[0.95] tracking-[-0.055em] text-[var(--brand-text)]">
              Clearer land opportunities for disciplined buyers.
            </h2>
            <p className="mt-5 max-w-[42rem] text-[1.02rem] leading-8 text-[var(--brand-text-muted)] sm:text-lg">
              Location, plot structure, documentation, and acquisition terms are laid
              out for faster, higher-confidence decisions.
            </p>
          </div>
        </RevealOnScroll>
        <div className="mt-10">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.slug} listing={listing} />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 w-[var(--page-width)] py-10">
        <div className="lg:hidden">
          <RevealOnScroll from="left">
            <div className="section-cap">{homepageAbout.eyebrow}</div>
          </RevealOnScroll>
          <RevealOnScroll from="left" delayMs={50}>
            <h2 className="mt-5 max-w-2xl font-[family-name:var(--font-display)] text-[2.3rem] font-[350] leading-[0.98] tracking-[-0.045em] text-[var(--brand-text)] sm:text-[2.75rem]">
              {homepageAbout.title}
            </h2>
          </RevealOnScroll>

          <RevealOnScroll from="right" delayMs={90}>
            <div className="mt-8">
              <AboutVideoFrame mobile />
            </div>
          </RevealOnScroll>

          <RevealOnScroll from="up" delayMs={120}>
            <p className="mt-5 text-lg leading-8 text-[var(--brand-text-muted)]">
              {homepageAbout.paragraphs[0]}
            </p>
          </RevealOnScroll>

          <RevealOnScroll from="left" delayMs={160}>
            <div className="mt-6 relative aspect-[1.58/1] overflow-hidden rounded-[1.75rem] border border-[var(--brand-border)]">
              <Image
                src={homepageAbout.image.src}
                alt={homepageAbout.image.alt}
                fill
                sizes="100vw"
                className="object-cover object-[center_36%]"
              />
            </div>
          </RevealOnScroll>

          <RevealOnScroll from="up" delayMs={190}>
            <p className="mt-6 text-lg leading-8 text-[var(--brand-text-muted)]">
              {homepageAbout.paragraphs[1]}
            </p>
          </RevealOnScroll>
        </div>

        <div className="hidden lg:block">
          <RevealOnScroll from="left">
            <div className="section-cap">{homepageAbout.eyebrow}</div>
          </RevealOnScroll>

          <RevealOnScroll from="left" delayMs={50}>
            <h2 className="mt-5 max-w-[44rem] whitespace-nowrap font-[family-name:var(--font-display)] text-[clamp(2.05rem,2.45vw,2.7rem)] font-[350] leading-[0.94] tracking-[-0.055em] text-[var(--brand-text)]">
              {homepageAbout.title}
            </h2>
          </RevealOnScroll>

          <div className="mt-8 grid gap-4 xl:grid-cols-[1.7fr_1fr]">
            <RevealOnScroll from="left" delayMs={110}>
              <div>
                <div className="relative aspect-[1.88/1] overflow-hidden rounded-[1.75rem] border border-[var(--brand-border)]">
                  <Image
                    src={homepageAbout.image.src}
                    alt={homepageAbout.image.alt}
                    fill
                    sizes="(min-width: 1280px) 58vw, (min-width: 1024px) 60vw, 100vw"
                    className="object-cover object-[center_36%]"
                  />
                </div>

                <div className="mt-5 max-w-3xl space-y-4 text-lg leading-8 text-[var(--brand-text-muted)]">
                  {homepageAbout.paragraphs.map((paragraph, index) => (
                    <RevealOnScroll
                      key={paragraph}
                      from="up"
                      delayMs={150 + index * 50}
                    >
                      <p>{paragraph}</p>
                    </RevealOnScroll>
                  ))}
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll from="right" delayMs={140}>
              <AboutVideoFrame />
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 grid w-[var(--page-width)] gap-6 py-10 lg:grid-cols-[0.95fr_1.05fr]">
        <RevealOnScroll from="left">
          <div className="rounded-[2.25rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-8 sm:p-10">
            <div className="section-cap">Why Marxvest</div>
            <h2 className="mt-5 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--brand-text)] sm:text-4xl">
              Security and transaction control are part of the product, not a late add-on.
            </h2>
            <div className="mt-8 grid gap-6">
              {serviceHighlights.map((item, index) => (
                <RevealOnScroll key={item.title} from="up" delayMs={index * 70}>
                  <div className="border-t border-[var(--brand-border)] pt-6">
                    <h3 className="text-xl font-semibold text-[var(--brand-text)]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-[var(--brand-text-muted)]">
                      {item.body}
                    </p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll from="right" delayMs={90}>
          <div className="rounded-[2.25rem] bg-[var(--brand-primary-dark)] p-8 text-white sm:p-10">
            <div className="section-cap !text-white before:!bg-white/60">Process</div>
            <ol className="mt-8 grid gap-5">
              {processSteps.map((step, index) => (
                <RevealOnScroll key={step} as="li" from="right" delayMs={index * 70}>
                  <div className="grid gap-3 border-t border-white/12 pt-5 sm:grid-cols-[3rem_1fr] sm:items-start">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-white/8 font-[family-name:var(--font-display)] text-lg font-semibold">
                      0{index + 1}
                    </span>
                    <p className="max-w-xl text-base leading-7 text-white/84">{step}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </ol>
          </div>
        </RevealOnScroll>
      </section>

      <section className="mx-auto mt-12 w-[var(--page-width)] py-10">
        <RevealOnScroll from="up">
          <div className="grid gap-8 rounded-[2.5rem] border border-[var(--brand-border)] bg-white px-8 py-10 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="section-cap">Trust points</div>
              <h2 className="mt-5 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--brand-text)] sm:text-4xl">
                Trust is built through verification, document control, and clearer legal posture.
              </h2>
            </div>
            <ul className="grid gap-4 text-base leading-7 text-[var(--brand-text-muted)] sm:grid-cols-2">
              {trustPoints.map((point, index) => (
                <RevealOnScroll key={point} as="li" from="up" delayMs={index * 60}>
                  <div className="rounded-[1.5rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-5">
                    {point}
                  </div>
                </RevealOnScroll>
              ))}
            </ul>
          </div>
        </RevealOnScroll>
      </section>

      <section className="mx-auto mt-10 w-[var(--page-width)] py-10">
        <div className="grid gap-8 rounded-[2.5rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-8 py-10 sm:px-10 lg:grid-cols-[0.9fr_1.1fr]">
          <RevealOnScroll from="left">
            <div>
              <div className="section-cap">Vision & mission</div>
              <h2 className="mt-5 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--brand-text)] sm:text-4xl">
                Public trust should feel intentional, not implied.
              </h2>
            </div>
          </RevealOnScroll>
          <RevealOnScroll from="right" delayMs={80}>
            <div className="space-y-5 text-base leading-8 text-[var(--brand-text-muted)]">
              <p>{trustFramework.vision}</p>
              <p>{trustFramework.mission}</p>
              <Link
                href="/trust"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-primary)] transition hover:gap-3"
              >
                Review trust and legal posture
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="mx-auto mt-14 w-[var(--page-width)] py-10">
        <RevealOnScroll from="up">
          <div className="angled-panel overflow-hidden rounded-[2.6rem] px-8 py-10 text-white sm:px-10 sm:py-12">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="section-cap !text-white before:!bg-white/60">
                  Final CTA
                </div>
                <h2 className="mt-5 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight sm:text-5xl">
                  Book a site inspection, review the documents, then move into the agent-led flow with clarity.
                </h2>
              </div>
              <div className="justify-self-start lg:justify-self-end">
                <Link
                  href="/booking"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[var(--brand-primary-dark)] transition hover:bg-[var(--brand-surface)]"
                >
                  Book Site Inspection
                </Link>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>
    </main>
  );
}
