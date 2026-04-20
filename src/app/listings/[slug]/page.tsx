import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { listings } from "@/lib/site-data";

type ListingDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return listings.map((listing) => ({ slug: listing.slug }));
}

export default async function ListingDetailPage({
  params,
}: ListingDetailPageProps) {
  const { slug } = await params;
  const listing = listings.find((item) => item.slug === slug);

  if (!listing) {
    notFound();
  }

  return (
    <main className="pb-24">
      <section className="mx-auto grid w-[var(--page-width)] gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="section-cap">{listing.landType}</div>
            <h1 className="font-[family-name:var(--font-display)] text-5xl font-semibold text-[var(--brand-text)] sm:text-6xl">
              {listing.title}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-[var(--brand-text-muted)]">
              {listing.description}
            </p>
          </div>

          <div className="relative aspect-[1.24/1] overflow-hidden rounded-[2.5rem]">
            <Image
              src={listing.heroImage}
              alt={listing.title}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
              preload
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(4,18,67,0.6)] to-transparent" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {listing.gallery.slice(0, 3).map((image) => (
              <div
                key={image}
                className="relative aspect-[1/0.92] overflow-hidden rounded-[1.8rem]"
              >
                <Image
                  src={image}
                  alt={listing.title}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6 rounded-[2.2rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-8">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-[var(--brand-primary)]">
              Listing summary
            </div>
            <p className="mt-4 text-base leading-7 text-[var(--brand-text-muted)]">
              {listing.summary}
            </p>
          </div>

          <dl className="grid gap-5 border-t border-[var(--brand-border)] pt-6 text-sm">
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
                Price
              </dt>
              <dd className="mt-2 text-base text-[var(--brand-text)]">
                {listing.priceLabel}
              </dd>
            </div>
            <div>
              <dt className="text-[0.72rem] uppercase tracking-[0.28em] text-[var(--brand-text-soft)]">
                Payment path
              </dt>
              <dd className="mt-2 text-base text-[var(--brand-text)]">
                {listing.paymentEligibility}
              </dd>
            </div>
            <div>
              <dt className="text-[0.72rem] uppercase tracking-[0.28em] text-[var(--brand-text-soft)]">
                Market cue
              </dt>
              <dd className="mt-2 text-base text-[var(--brand-text)]">
                {listing.coordinatesHint}
              </dd>
            </div>
          </dl>

          <div className="border-t border-[var(--brand-border)] pt-6">
            <div className="text-[0.72rem] uppercase tracking-[0.28em] text-[var(--brand-text-soft)]">
              Documentation
            </div>
            <ul className="mt-4 grid gap-3 text-sm text-[var(--brand-text-muted)]">
              {listing.documentation.map((item) => (
                <li key={item} className="rounded-2xl bg-white px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-[var(--brand-border)] pt-6">
            <Link
              href={`/contact?property=${listing.slug}`}
              className="inline-flex items-center justify-center rounded-full bg-[var(--brand-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-primary-dark)]"
            >
              Contact Agent
            </Link>
            <Link
              href={`/booking?property=${listing.slug}`}
              className="inline-flex items-center justify-center rounded-full border border-[var(--brand-border-strong)] px-5 py-3 text-sm font-semibold text-[var(--brand-text)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
            >
              Book Site Inspection
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
