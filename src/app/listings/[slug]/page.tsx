import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema, buildFAQSchema, buildListingSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { blogPosts, listings } from "@/lib/site-data";
import type { Listing } from "@/lib/types";

type ListingDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return listings.map((listing) => ({ slug: listing.slug }));
}

function getListingFaqs(listing: Listing) {
  return [
    {
      question: `Where is ${listing.estateName} located?`,
      answer: `${listing.estateName} is located in ${listing.location}, ${listing.state}. Marxvest recommends inspection before payment so buyers can review the corridor, access, and surrounding development pattern directly.`,
    },
    {
      question: `What is the starting price at ${listing.estateName}?`,
      answer: `Pricing for ${listing.estateName} is listed as ${listing.priceLabel}. The Marxvest team confirms the active price position, available plot options, and any payment conditions during inquiry and inspection review.`,
    },
    {
      question: `What documents are available for ${listing.estateName}?`,
      answer: `${listing.estateName} is currently presented with ${listing.documentation.join(", ")}. Buyers should review all documents carefully and seek independent legal advice where necessary before completing a transaction.`,
    },
    {
      question: `Can I inspect ${listing.estateName} before payment?`,
      answer: `Yes. Marxvest encourages buyers to schedule a physical or guided site inspection before payment so they can review the estate and clarify questions about location, pricing, and documentation.`,
    },
    {
      question: `Are installment payments available for ${listing.estateName}?`,
      answer: `${listing.paymentEligibility}. Final eligibility, deposit requirements, and timeline are confirmed with the Marxvest team before a buyer proceeds.`,
    },
    {
      question: `How does allocation work for ${listing.estateName}?`,
      answer:
        listing.status === "allocation-after-full-payment"
          ? `Allocation for ${listing.estateName} follows settlement confirmation and the agreed acquisition process. Marxvest explains the exact allocation timeline during payment and documentation review.`
          : `Allocation for ${listing.estateName} follows the agreed acquisition process, payment confirmation, and documentation review. Marxvest explains the next steps clearly before the buyer proceeds.`,
    },
  ];
}

function getBuyerFit(listing: Listing) {
  return [
    `buyers who want ${listing.location} exposure with clearer documentation guidance`,
    `first-time land buyers who need inspection support and visible next steps`,
    `long-term investors comparing plot sizes, payment terms, and corridor potential`,
  ];
}

function getRelatedPosts(listing: Listing) {
  const slugs = blogPosts.map((post) => post.slug);

  if (listing.status === "allocation-after-full-payment") {
    return slugs.filter((slug) => slug !== "how-installment-land-payments-should-work-for-buyers");
  }

  return slugs;
}

function buildListingDescription(listing: Listing) {
  const priceSummary = /^from\s+/i.test(listing.priceLabel)
    ? listing.priceLabel
    : `pricing on request (${listing.priceLabel})`;

  return `Buy land at ${listing.estateName} in ${listing.state}. View plot sizes, ${priceSummary}, payment terms, documentation, inspection details, and allocation support from Marxvest Real Estate.`;
}

export async function generateMetadata({
  params,
}: ListingDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = listings.find((item) => item.slug === slug);

  if (!listing) {
    return buildMetadata({
      title: "Listing not found",
      description: "The requested Marxvest listing could not be found.",
      path: "/listings",
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${listing.estateName} - Land for Sale in ${listing.state}`,
    description: buildListingDescription(listing),
    path: `/listings/${listing.slug}`,
    keywords: [
      `${listing.estateName}`,
      `land for sale in ${listing.state}`,
      `land for sale in ${listing.location}`,
      "buy land in Nigeria",
      "verified land in Nigeria",
    ],
    image: {
      src: listing.heroImage,
      alt: `${listing.estateName} land for sale in ${listing.location}, ${listing.state}`,
    },
  });
}

export default async function ListingDetailPage({
  params,
}: ListingDetailPageProps) {
  const { slug } = await params;
  const listing = listings.find((item) => item.slug === slug);

  if (!listing) {
    notFound();
  }

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Listings", href: "/listings" },
    { label: listing.estateName },
  ];
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Listings", path: "/listings" },
    { name: listing.estateName, path: `/listings/${listing.slug}` },
  ]);
  const faqItems = getListingFaqs(listing);
  const buyerFit = getBuyerFit(listing);
  const relatedListings = listings.filter((item) => item.slug !== listing.slug).slice(0, 2);
  const relatedPosts = getRelatedPosts(listing);

  return (
    <main className="pb-24">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={buildListingSchema(listing)} />
      <JsonLd data={buildFAQSchema(faqItems)} />
      <section className="mx-auto grid w-[var(--page-width)] gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="space-y-8">
          <div className="space-y-4">
            <Breadcrumbs items={breadcrumbs} />
            <div className="section-cap">{listing.landType}</div>
            <h1 className="font-[family-name:var(--font-display)] text-5xl font-semibold text-[var(--brand-text)] sm:text-6xl">
              {listing.estateName} - Land for Sale in {listing.state}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-[var(--brand-text-muted)]">
              {listing.description}
            </p>
            <p className="max-w-3xl text-base leading-7 text-[var(--brand-text-muted)]">
              Review plot sizes, current pricing cues, payment structure,
              documentation posture, inspection support, and allocation guidance
              before you decide how to proceed.
            </p>
          </div>

          <div className="relative aspect-[1.24/1] overflow-hidden rounded-[2.5rem]">
            <Image
              src={listing.heroImage}
              alt={`${listing.estateName} land for sale in ${listing.location}, ${listing.state}`}
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
                  alt={`${listing.estateName} gallery view ${String(listing.gallery.indexOf(image) + 1)} in ${listing.location}, ${listing.state}`}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <section className="grid gap-6 rounded-[2rem] border border-[var(--brand-border)] bg-white p-8">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--brand-text)]">
                Key estate details
              </h2>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--brand-text-muted)]">
                Use this summary to compare the estate’s location, price
                position, plot options, and acquisition path before you book an
                inspection or request documentation review.
              </p>
            </div>
            <dl className="grid gap-5 sm:grid-cols-2">
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
                  Price from
                </dt>
                <dd className="mt-2 text-base text-[var(--brand-text)]">
                  {listing.priceLabel}
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
                  Estate status
                </dt>
                <dd className="mt-2 text-base capitalize text-[var(--brand-text)]">
                  {listing.status.replaceAll("-", " ")}
                </dd>
              </div>
              <div>
                <dt className="text-[0.72rem] uppercase tracking-[0.28em] text-[var(--brand-text-soft)]">
                  Payment plan
                </dt>
                <dd className="mt-2 text-base text-[var(--brand-text)]">
                  {listing.paymentEligibility}
                </dd>
              </div>
              <div>
                <dt className="text-[0.72rem] uppercase tracking-[0.28em] text-[var(--brand-text-soft)]">
                  Inspection availability
                </dt>
                <dd className="mt-2 text-base text-[var(--brand-text)]">
                  Physical and guided inspections can be scheduled before payment.
                </dd>
              </div>
            </dl>
          </section>

          <section className="grid gap-6 rounded-[2rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-8 lg:grid-cols-2">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--brand-text)]">
                Documentation
              </h2>
              <p className="mt-3 text-base leading-7 text-[var(--brand-text-muted)]">
                Marxvest shares the current documentation posture for this estate
                so buyers can review the available papers before moving into
                payment and allocation conversations.
              </p>
              <ul className="mt-5 grid gap-3 text-sm text-[var(--brand-text-muted)]">
                {listing.documentation.map((item) => (
                  <li key={item} className="rounded-2xl bg-white px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--brand-text)]">
                Payment options
              </h2>
              <p className="mt-3 text-base leading-7 text-[var(--brand-text-muted)]">
                {listing.paymentEligibility}. Marxvest explains the active
                deposit threshold, settlement timeline, and when the estate
                moves into allocation support so buyers can proceed with fewer
                surprises.
              </p>
              <div className="mt-5 rounded-[1.6rem] border border-[var(--brand-border)] bg-white p-5 text-sm leading-7 text-[var(--brand-text-muted)]">
                Flexible payment conversations are matched to estate eligibility.
                Buyers are encouraged to confirm the approved structure, request
                receipts for verified payments, and review all documentation
                carefully before completing a transaction.
              </div>
            </div>
          </section>

          <section className="grid gap-6 rounded-[2rem] border border-[var(--brand-border)] bg-white p-8 lg:grid-cols-2">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--brand-text)]">
                Inspection guidance
              </h2>
              <p className="mt-3 text-base leading-7 text-[var(--brand-text-muted)]">
                Buyers should inspect before payment wherever possible.
                Inspections help confirm access, surrounding development, plot
                context, and the right next questions to ask about documents and
                payment terms.
              </p>
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--brand-text)]">
                Location advantage
              </h2>
              <p className="mt-3 text-base leading-7 text-[var(--brand-text-muted)]">
                {listing.coordinatesHint} This makes {listing.estateName} worth
                reviewing for buyers who want land in {listing.location} with a
                clearer view of long-term growth potential.
              </p>
            </div>
          </section>

          <section className="rounded-[2rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-8">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--brand-text)]">
              Who this estate is best for
            </h2>
            <ul className="mt-5 grid gap-3 text-base leading-7 text-[var(--brand-text-muted)] sm:grid-cols-2">
              {buyerFit.map((item) => (
                <li key={item} className="rounded-[1.4rem] bg-white px-5 py-4">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[2rem] border border-[var(--brand-border)] bg-white p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--brand-text)]">
                  Questions buyers ask about {listing.estateName}
                </h2>
                <p className="mt-3 text-base leading-7 text-[var(--brand-text-muted)]">
                  These answers reflect the visible listing details on this page
                  and help buyers prepare for inspection and documentation
                  review.
                </p>
              </div>
              <Link
                href={`/booking?property=${listing.slug}`}
                className="inline-flex items-center justify-center rounded-full border border-[var(--brand-border-strong)] px-5 py-3 text-sm font-semibold text-[var(--brand-text)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
              >
                Book inspection for {listing.estateName}
              </Link>
            </div>
            <div className="mt-6 grid gap-4">
              {faqItems.map((item) => (
                <div key={item.question} className="rounded-[1.6rem] border border-[var(--brand-border)] p-5">
                  <h3 className="text-lg font-semibold text-[var(--brand-text)]">
                    {item.question}
                  </h3>
                  <p className="mt-2 text-base leading-7 text-[var(--brand-text-muted)]">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6 rounded-[2rem] border border-[var(--brand-border)] bg-white p-8 lg:grid-cols-[1fr_1fr]">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--brand-text)]">
                Helpful next steps
              </h2>
              <div className="mt-5 grid gap-3 text-sm">
                <Link href="/trust" className="rounded-[1.4rem] border border-[var(--brand-border)] px-4 py-4 text-[var(--brand-text-muted)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]">
                  Review trust, documentation, and buyer protection guidance
                </Link>
                <Link href={`/contact?property=${listing.slug}`} className="rounded-[1.4rem] border border-[var(--brand-border)] px-4 py-4 text-[var(--brand-text-muted)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]">
                  Contact Marxvest about {listing.estateName}
                </Link>
                <Link href={`/booking?property=${listing.slug}`} className="rounded-[1.4rem] border border-[var(--brand-border)] px-4 py-4 text-[var(--brand-text-muted)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]">
                  Schedule a site inspection for {listing.estateName}
                </Link>
              </div>
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--brand-text)]">
                Related buyer guides
              </h2>
              <div className="mt-5 grid gap-3 text-sm">
                {relatedPosts.map((slug) => {
                  const post = [
                    {
                      slug: "why-verified-land-titles-matter-before-you-pay",
                      title: "Read our guide to verified land titles before payment",
                    },
                    {
                      slug: "how-installment-land-payments-should-work-for-buyers",
                      title: "Understand how installment land payments should work",
                    },
                    {
                      slug: "what-to-check-before-booking-a-site-inspection",
                      title: "Learn what to check before booking a site inspection",
                    },
                  ].find((item) => item.slug === slug);

                  if (!post) {
                    return null;
                  }

                  return (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="rounded-[1.4rem] border border-[var(--brand-border)] px-4 py-4 text-[var(--brand-text-muted)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
                    >
                      {post.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {relatedListings.length ? (
            <section className="rounded-[2rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-8">
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--brand-text)]">
                Related land opportunities
              </h2>
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {relatedListings.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/listings/${item.slug}`}
                    className="rounded-[1.6rem] border border-[var(--brand-border)] bg-white p-5 transition hover:-translate-y-1 hover:border-[var(--brand-primary)]"
                  >
                    <div className="text-sm uppercase tracking-[0.24em] text-[var(--brand-primary)]">
                      {item.location}
                    </div>
                    <h3 className="mt-3 text-2xl font-semibold text-[var(--brand-text)]">
                      {item.estateName}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-[var(--brand-text-muted)]">
                      {item.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
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
              Contact Marxvest about {listing.estateName}
            </Link>
            <Link
              href={`/booking?property=${listing.slug}`}
              className="inline-flex items-center justify-center rounded-full border border-[var(--brand-border-strong)] px-5 py-3 text-sm font-semibold text-[var(--brand-text)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
            >
              Book inspection for {listing.estateName}
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
