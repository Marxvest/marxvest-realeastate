import Link from "next/link";

import { buildNoIndexMetadata } from "@/lib/seo";

export const metadata = buildNoIndexMetadata(
  "Page not found",
  "The page you are looking for could not be found. Explore listings, contact Marxvest Real Estate, or return to the homepage.",
);

export default function NotFound() {
  return (
    <main className="pb-24">
      <section className="mx-auto w-[var(--page-width)] py-20">
        <div className="rounded-[2.5rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-8 py-12 sm:px-12">
          <div className="section-cap">404</div>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-4xl font-semibold text-[var(--brand-text)] sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--brand-text-muted)]">
            The page you requested is unavailable. You can return to the homepage,
            explore current land listings, contact the Marxvest team, or review
            the latest buyer education articles.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-[var(--brand-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-primary-dark)]"
            >
              Go to homepage
            </Link>
            <Link
              href="/listings"
              className="inline-flex items-center justify-center rounded-full border border-[var(--brand-border-strong)] px-5 py-3 text-sm font-semibold text-[var(--brand-text)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
            >
              View listings
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-[var(--brand-border-strong)] px-5 py-3 text-sm font-semibold text-[var(--brand-text)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
            >
              Contact Marxvest
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-full border border-[var(--brand-border-strong)] px-5 py-3 text-sm font-semibold text-[var(--brand-text)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
            >
              Read blog guides
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
