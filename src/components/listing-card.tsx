import Image from "next/image";
import Link from "next/link";

import { RevealOnScroll } from "@/components/reveal-on-scroll";
import type { Listing } from "@/lib/types";

const statusLabel: Record<Listing["status"], string> = {
  available: "Available now",
  "selling-fast": "Selling fast",
  "allocation-after-full-payment": "Allocation after full payment",
};

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <article className="group grid gap-6 border-t border-[var(--brand-border)] py-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)] lg:items-center">
      <RevealOnScroll from="left">
        <Link
          href={`/listings/${listing.slug}`}
          className="relative block aspect-[1.28/1] overflow-hidden rounded-[2rem] bg-[var(--brand-surface)]"
        >
          <Image
            src={listing.heroImage}
            alt={listing.title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(2,11,38,0.5)] to-transparent" />
          <div className="absolute left-5 top-5 rounded-full border border-white/40 bg-white/12 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white backdrop-blur-sm">
            {listing.landType}
          </div>
        </Link>
      </RevealOnScroll>

      <RevealOnScroll from="right" delayMs={80}>
        <div className="max-w-xl space-y-5">
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-[0.3em] text-[var(--brand-primary)]">
              {statusLabel[listing.status]}
            </div>
            <h3 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--brand-text)] sm:text-4xl">
              {listing.title}
            </h3>
            <p className="max-w-2xl text-base leading-7 text-[var(--brand-text-muted)]">
              {listing.summary}
            </p>
          </div>

          <dl className="grid gap-3 text-sm text-[var(--brand-text-muted)] sm:grid-cols-2">
            <div>
              <dt className="text-[0.72rem] uppercase tracking-[0.28em] text-[var(--brand-text-soft)]">
                Location
              </dt>
              <dd className="mt-2 text-base text-[var(--brand-text)]">
                {listing.location}, {listing.state}
              </dd>
            </div>
            <div>
              <dt className="text-[0.72rem] uppercase tracking-[0.28em] text-[var(--brand-text-soft)]">
                Plot sizes
              </dt>
              <dd className="mt-2 text-base text-[var(--brand-text)]">
                {listing.plotSizes.join(" · ")}
              </dd>
            </div>
            <div>
              <dt className="text-[0.72rem] uppercase tracking-[0.28em] text-[var(--brand-text-soft)]">
                Terms
              </dt>
              <dd className="mt-2 text-base text-[var(--brand-text)]">
                {listing.paymentEligibility}
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap items-center gap-4">
            <span className="text-lg font-semibold text-[var(--brand-text)]">
              {listing.priceLabel}
            </span>
            <Link
              href={`/listings/${listing.slug}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-primary)] transition hover:gap-3"
            >
              Review listing
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </RevealOnScroll>
    </article>
  );
}
