import Link from "next/link";

import { BookingForm } from "@/components/booking-form";
import { buildNoIndexMetadata } from "@/lib/seo";
import { company, listings } from "@/lib/site-data";

type BookingPageProps = {
  searchParams: Promise<{ success?: string; error?: string; property?: string }>;
};

export const metadata = buildNoIndexMetadata(
  "Book a site inspection",
  "Book a site inspection with Marxvest Real Estate to review estate details, documentation, and next-step guidance before you buy.",
  "/booking",
);

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const params = await searchParams;

  return (
    <main className="pb-24">
      <section className="mx-auto grid w-[var(--page-width)] gap-10 py-16 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="space-y-6">
          <div className="section-cap">Booking</div>
          <h1 className="font-[family-name:var(--font-display)] text-5xl font-semibold text-[var(--brand-text)] sm:text-6xl">
            Book a guided site inspection before you buy.
          </h1>
          <p className="text-lg leading-8 text-[var(--brand-text-muted)]">
            Choose an estate, request a preferred inspection date, and let the
            Marxvest team confirm the next step for location review,
            documentation guidance, and payment discussions.
          </p>
          <div className="space-y-3 text-base text-[var(--brand-text-muted)]">
            <p>{company.phone}</p>
            <p>{company.email}</p>
            <p>{company.address}</p>
          </div>
          <div className="rounded-[2rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_20px_55px_rgba(8,24,84,0.06)]">
            <div className="text-xs uppercase tracking-[0.28em] text-[var(--brand-primary)]">
              Available estates
            </div>
            <div className="mt-4 grid gap-4">
              {listings.map((listing) => (
                <div
                  key={listing.slug}
                  className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--brand-border)] pt-4 first:border-t-0 first:pt-0"
                >
                  <div>
                    <div className="font-semibold text-[var(--brand-text)]">
                      {listing.title}
                    </div>
                    <div className="text-sm text-[var(--brand-text-muted)]">
                      {listing.location} · {listing.priceLabel}
                    </div>
                  </div>
                  <Link
                    href={`/booking?property=${listing.slug}`}
                    className="text-sm font-semibold text-[var(--brand-primary)] transition hover:text-[var(--brand-primary-dark)]"
                  >
                    Book inspection for {listing.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[2.2rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-8">
          <BookingForm
            property={params.property}
            returnTo="/booking"
            success={params.success}
            error={params.error}
          />
        </div>
      </section>
    </main>
  );
}
