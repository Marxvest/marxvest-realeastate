import Image from "next/image";
import Link from "next/link";

import { JsonLd } from "@/components/seo/JsonLd";
import { HeroImageSlider } from "@/components/hero-image-slider";
import { ListingCard } from "@/components/listing-card";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { buildMetadata } from "@/lib/seo";
import { buildFAQSchema } from "@/lib/schema";
import {
  blogPosts,
  company,
  featuredListings,
  homepageAbout,
  homepageBanners,
  homepageFaqs,
  homepageProofMoments,
  processSteps,
  serviceHighlights,
  trustPoints,
  trustFramework,
} from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "Verified Land for Sale in Nigeria",
  description:
    "Buy verified land in Nigeria with confidence. Explore inspected estates, flexible payment options, transparent documentation, and guided real estate support from Marxvest.",
  path: "/",
  keywords: [
    "verified land in Nigeria",
    "land for sale in Nigeria",
    "buy land in Nigeria",
    "real estate investment Nigeria",
    "Marxvest Real Estate",
  ],
});

const heroTrustBadges = [
  {
    label: "CAC Registered",
    mobileLabel: "CAC Registered",
    icon: "shield",
  },
  {
    label: "Verified Titles",
    mobileLabel: "Verified Titles",
    icon: "document",
  },
  {
    label: "100+ Buyers",
    mobileLabel: "100+ Buyers",
    icon: "users",
  },
  {
    label: "Transparent Pricing",
    mobileLabel: "Clear Pricing",
    icon: "tag",
  },
] as const;

function HeroTrustIcon({ type }: { type: (typeof heroTrustBadges)[number]["icon"] }) {
  const commonProps = {
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (type === "shield") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 sm:h-7 sm:w-7">
        <path
          {...commonProps}
          d="M12 3 5.5 5.4v5.7c0 4.1 2.6 7.8 6.5 9.2 3.9-1.4 6.5-5.1 6.5-9.2V5.4L12 3Z"
          fill="none"
        />
        <path {...commonProps} d="m8.9 11.9 2.1 2.1 4.2-4.4" fill="none" />
      </svg>
    );
  }

  if (type === "document") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 sm:h-7 sm:w-7">
        <path
          {...commonProps}
          d="M7 3.8h7l3 3v13.4H7V3.8Z"
          fill="none"
        />
        <path {...commonProps} d="M14 3.8v3h3M9.5 11h5M9.5 14.5h3.5" fill="none" />
        <path {...commonProps} d="m14.4 17.1 1.3 1.3 2.7-3" fill="none" />
      </svg>
    );
  }

  if (type === "users") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 sm:h-7 sm:w-7">
        <path {...commonProps} d="M8.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM15.5 11a3 3 0 1 0 0-6" fill="none" />
        <path {...commonProps} d="M3.5 19.2c.5-3.1 2.3-5 5-5s4.5 1.9 5 5M13 14.4c2.5.2 4.2 1.9 4.7 4.8" fill="none" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 sm:h-7 sm:w-7">
      <path
        {...commonProps}
        d="M4.5 12.5 12.8 4H20v7.2l-8.5 8.3-7-7Z"
        fill="none"
      />
      <path {...commonProps} d="M16.8 7.4h.1M9.5 13.3l2 2" fill="none" />
    </svg>
  );
}

function HeroTrustIconFrame({
  type,
}: {
  type: (typeof heroTrustBadges)[number]["icon"];
}) {
  return (
    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(229,208,166,0.48)] bg-[rgba(229,208,166,0.22)] text-[#F4D892] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_20px_rgba(0,0,0,0.12)]">
      <HeroTrustIcon type={type} />
    </span>
  );
}

const heroSlides = [
  {
    src: "/images/gate-house-2.webp",
    alt: "Marxvest premium estate entrance view",
    objectPosition: "50% center",
  },
  {
    src: "/images/gate-house-1.webp",
    alt: "Marxvest gated estate entrance",
    objectPosition: "50% center",
  },
  {
    src: "/images/gate-house-3.webp",
    alt: "Marxvest clean estate architecture entrance",
    objectPosition: "50% center",
  },
  {
    src: "/images/hero-image.jpeg",
    alt: "Marxvest luxury estate exterior",
    objectPosition: "52% center",
  },
] as const;

const locationHighlights = [
  {
    title: "FUNAAB Alabata Road, Ogun State",
    copy:
      "Kings Court Estate gives buyers exposure to the FUNAAB and Alabata axis with residential plots, visible title cues, and flexible payment conversations.",
  },
  {
    title: "Ikorodu Ogijo-Sagamu growth corridor",
    copy:
      "Billionaires Court Estate sits within a Lagos and Ogun growth corridor where buyers can review premium plots, inspection support, and long-term land positioning.",
  },
  {
    title: "Ntoji, Ogunmakin",
    copy:
      "EverRich Farmland opens a lower-entry agricultural land option for buyers interested in Ogun State growth belts and patient land investment.",
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
  const buyerEducationPosts = blogPosts.slice(0, 3);

  return (
    <main className="pb-24">
      <JsonLd data={buildFAQSchema(homepageFaqs)} />
      <section className="hero-stage relative isolate -mt-[var(--sticky-shell-height)] overflow-hidden pt-[var(--sticky-shell-height)] text-white">
        <HeroImageSlider slides={heroSlides} />
        <div className="hero-stage-overlay absolute inset-0" />
        <div className="hero-stage-glow absolute inset-0" />

        <div className="relative z-10 mx-auto flex min-h-[80svh] w-[var(--page-width)] flex-col justify-start gap-[14px] pt-10 pb-5 sm:min-h-[calc(90svh-var(--sticky-shell-height))] sm:justify-between sm:gap-5 sm:pt-7 sm:pb-8 lg:min-h-[calc(100svh-var(--sticky-shell-height))] lg:pt-10 lg:pb-10">
          <div className="max-w-[35rem] pt-0 sm:block sm:min-h-0 sm:pt-2">
            <RevealOnScroll from="left" className="-mt-1 mb-6 sm:-mt-1 sm:mb-7">
              <div className="section-cap max-w-[92%] !text-[var(--brand-white)] before:!bg-white/48">
                Documentation-first land acquisition
              </div>
            </RevealOnScroll>

            <RevealOnScroll from="left" delayMs={110}>
              <h1 className="mt-0 max-w-full font-[family-name:var(--font-body)] text-[clamp(1.72rem,6.7vw,2.45rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-[var(--brand-white)] sm:max-w-[560px] sm:font-[family-name:var(--font-display)] sm:text-[clamp(2.8rem,4.1vw,4.2rem)] sm:font-[380] sm:leading-[0.94] sm:tracking-[-0.065em]">
                <span className="block whitespace-nowrap">Buy Verified Land</span>
                <span className="block whitespace-nowrap">in Nigeria With</span>
                <span className="block whitespace-nowrap text-[var(--brand-sand)]">
                  Confidence
                </span>
              </h1>
            </RevealOnScroll>

            <RevealOnScroll from="up" delayMs={170}>
              <p className="mt-8 max-w-[94%] text-[17px] font-normal leading-[1.58] text-white/90 sm:mt-8 sm:max-w-[26rem] sm:text-[0.95rem] sm:leading-7 sm:text-white/82">
                Compare trusted estates, check the documents, and buy with
                guided support.
              </p>
            </RevealOnScroll>

            <RevealOnScroll from="up" delayMs={220}>
              <div className="mt-12 sm:mt-8">
                <div className="grid gap-3 sm:hidden">
                  <Link
                    href="/listings"
                    className="inline-flex h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#E5D0A6,#D8BE93)] px-4 text-[14px] font-bold text-[var(--brand-text)] shadow-[0_10px_30px_rgba(6,17,44,0.2)]"
                  >
                    View Available Land
                  </Link>
                  <Link
                    href="/booking"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[rgba(255,255,255,0.18)] bg-[rgba(8,27,75,0.2)] px-4 text-[14px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[16px]"
                  >
                    Book an Inspection
                  </Link>
                </div>

                <div className="hidden sm:flex sm:flex-row sm:flex-wrap sm:items-center sm:gap-[14px]">
                  <Link
                    href="/listings"
                    className="inline-flex h-14 w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,#E9D9BD,#D8BE93)] px-6 text-[17px] font-bold text-[var(--brand-text)] shadow-[0_10px_30px_rgba(216,190,147,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_30px_rgba(212,175,55,0.25)] hover:brightness-[1.03] sm:w-auto sm:min-w-[12rem] sm:px-7 sm:text-sm"
                  >
                    View Available Land
                  </Link>
                  <Link
                    href="/booking"
                    className="inline-flex h-14 w-full items-center justify-center rounded-full border border-white/28 bg-transparent px-6 text-[17px] font-medium text-[var(--brand-white)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition hover:bg-white/8 sm:w-auto sm:min-w-[11rem] sm:px-7 sm:text-sm"
                  >
                    Book an Inspection
                  </Link>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll from="up" delayMs={260}>
              <div className="hero-proof-band mt-10 grid grid-cols-4 overflow-hidden rounded-[0.9rem] border border-white/10 sm:hidden">
                {heroTrustBadges.map((badge, index) => (
                  <div
                    key={badge.label}
                    className={`flex min-h-[3.7rem] items-center justify-center gap-1.5 px-1.5 py-2 text-[var(--brand-sand)] ${
                      index > 0 ? "border-l border-white/8" : ""
                    }`}
                  >
                    <HeroTrustIcon type={badge.icon} />
                    <span className="text-center text-[9.5px] font-semibold leading-[1.05] tracking-[-0.01em] text-white/88">
                      {badge.mobileLabel.split(" ").map((word) => (
                        <span key={word} className="block">
                          {word}
                        </span>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </RevealOnScroll>

            <RevealOnScroll from="up" delayMs={320}>
              <a
                href={`https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(
                  "Hello Marxvest, I want to speak with your team about available land.",
                )}`}
                target="_blank"
                rel="noreferrer"
                className="mt-7 hidden w-fit items-center gap-2 text-sm font-semibold text-white/82 transition hover:gap-3 hover:text-[var(--brand-white)] sm:mt-6 sm:inline-flex"
              >
                Speak with an advisor
                <span aria-hidden="true">→</span>
              </a>
            </RevealOnScroll>
          </div>

          <RevealOnScroll from="up" delayMs={340}>
            <div className="hero-proof-band hidden overflow-hidden rounded-[1.1rem] border border-white/14 sm:grid sm:grid-cols-4">
              {heroTrustBadges.map((badge, index) => (
                <div
                  key={badge.label}
                  className={`flex items-center gap-4 px-5 py-5 lg:px-6 ${
                    index > 0 ? "border-l border-white/10" : ""
                  }`}
                >
                  <HeroTrustIconFrame type={badge.icon} />
                  <div className="text-sm font-semibold leading-tight text-white/88">
                    {badge.label}
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
              Explore available land opportunities in Nigeria.
            </h2>
            <p className="mt-5 max-w-[42rem] text-[1.02rem] leading-8 text-[var(--brand-text-muted)] sm:text-lg">
              Compare verified land listings with location details, plot sizes,
              documentation guidance, inspection support, and flexible payment
              options before you move into the next step.
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

      <section className="mx-auto mt-12 w-[var(--page-width)] py-10">
        <RevealOnScroll from="up">
          <div className="max-w-[48rem]">
            <div className="section-cap">Buyer proof</div>
            <h2 className="mt-5 font-[family-name:var(--font-display)] text-[2.35rem] font-[360] leading-[0.96] tracking-[-0.045em] text-[var(--brand-text)] sm:text-[3.1rem]">
              Real moments around guided land decisions.
            </h2>
            <p className="mt-5 max-w-[38rem] text-base leading-8 text-[var(--brand-text-muted)] sm:text-lg">
              Field activity, buyer appreciation, and document-led review moments
              help show the kind of process Marxvest is building around land
              acquisition.
            </p>
          </div>
        </RevealOnScroll>

        <div
          className="scrollbar-hidden -mx-4 mt-8 flex snap-x gap-4 overflow-x-auto px-4 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0"
          aria-label="Buyer proof moments"
        >
          {homepageProofMoments.map((moment, index) => (
            <RevealOnScroll
              key={moment.title}
              from={index === 0 ? "left" : "right"}
              delayMs={index * 80}
              className="min-w-[84vw] snap-start sm:min-w-0"
            >
              <article className="h-full overflow-hidden rounded-[1.75rem] border border-[var(--brand-border)] bg-white shadow-[0_20px_60px_rgba(8,27,75,0.08)]">
                <div className="relative aspect-[1.18/1] overflow-hidden bg-[var(--brand-surface)] sm:aspect-[1.42/1]">
                  <Image
                    src={moment.image.src}
                    alt={moment.image.alt}
                    fill
                    sizes="(min-width: 640px) 46vw, 84vw"
                    className="object-cover transition duration-500 hover:scale-[1.02]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(6,18,49,0.78)] via-[rgba(6,18,49,0.22)] to-transparent p-5">
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/62">
                      Proof moment
                    </div>
                    <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold leading-tight text-white">
                      {moment.title}
                    </h3>
                  </div>
                </div>
                <p className="p-5 text-sm leading-7 text-[var(--brand-text-muted)] sm:text-base">
                  {moment.caption}
                </p>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 grid w-[var(--page-width)] gap-6 py-10 lg:grid-cols-[0.95fr_1.05fr]">
        <RevealOnScroll from="left">
          <div className="rounded-[2.25rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-8 sm:p-10">
            <div className="section-cap">Why Marxvest</div>
            <h2 className="mt-5 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--brand-text)] sm:text-4xl">
              Verified estates, clear documentation, and guided inspections sit at the center of the experience.
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
                Trust is built through verification, documentation review, and transparent next steps.
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

      <section className="mx-auto mt-12 w-[var(--page-width)] py-10">
        <div className="grid gap-8 rounded-[2.5rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-8 py-10 sm:px-10 lg:grid-cols-[0.95fr_1.05fr]">
          <RevealOnScroll from="left">
            <div>
              <div className="section-cap">Where Marxvest helps buyers find land</div>
              <h2 className="mt-5 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--brand-text)] sm:text-4xl">
                Opportunities across Lagos, Ogun State, Ikorodu, Sagamu, Alabata, and nearby growth corridors.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-[var(--brand-text-muted)]">
                Marxvest focuses on verified land opportunities across developing
                real estate corridors in Nigeria where buyers can inspect
                estates, review documentation, and compare acquisition options
                before making a commitment.
              </p>
            </div>
          </RevealOnScroll>
          <div className="grid gap-4">
            {locationHighlights.map((item, index) => (
              <RevealOnScroll key={item.title} from="up" delayMs={index * 70}>
                <article className="rounded-[1.7rem] border border-[var(--brand-border)] bg-white p-5">
                  <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--brand-text)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-[var(--brand-text-muted)]">
                    {item.copy}
                  </p>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
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

      <section className="mx-auto mt-12 w-[var(--page-width)] py-10">
        <RevealOnScroll from="up">
          <div className="mb-8 max-w-[48rem]">
            <div className="section-cap">Buyer education</div>
            <h2 className="mt-5 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--brand-text)] sm:text-4xl">
              Read land buying guides before you commit to a property decision.
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--brand-text-muted)]">
              Learn about land titles, site inspections, installment payments,
              and the checks serious buyers should make before purchasing land in
              Nigeria.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid gap-6 lg:grid-cols-3">
          {buyerEducationPosts.map((post, index) => (
            <RevealOnScroll key={post.slug} from="up" delayMs={index * 70}>
              <article className="rounded-[2rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_18px_50px_rgba(8,24,84,0.05)]">
                <div className="text-xs uppercase tracking-[0.28em] text-[var(--brand-primary)]">
                  {post.category}
                </div>
                <h3 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--brand-text)]">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="mt-4 text-base leading-7 text-[var(--brand-text-muted)]">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-primary)] transition hover:gap-3"
                >
                  Read guide
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 w-[var(--page-width)] py-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <RevealOnScroll from="left">
            <div>
              <div className="section-cap">FAQ</div>
              <h2 className="mt-5 max-w-xl font-[family-name:var(--font-display)] text-3xl font-semibold leading-tight text-[var(--brand-text)] sm:text-4xl">
                Questions serious buyers ask before committing.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-8 text-[var(--brand-text-muted)]">
                A clearer buying decision starts with inspection, documents,
                payment structure, and allocation timing.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid gap-3">
            {homepageFaqs.map((faq, index) => (
              <RevealOnScroll key={faq.question} from="up" delayMs={index * 60}>
                <details className="group rounded-[1.35rem] border border-[var(--brand-border)] bg-white px-5 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold text-[var(--brand-text)] [&::-webkit-details-marker]:hidden">
                    <span>{faq.question}</span>
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-surface)] text-[var(--brand-primary)] transition group-open:rotate-45">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-4 w-4 stroke-current"
                      >
                        <path
                          d="M12 5v14M5 12h14"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--brand-text-muted)] sm:text-base">
                    {faq.answer}
                  </p>
                </details>
              </RevealOnScroll>
            ))}
          </div>
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
