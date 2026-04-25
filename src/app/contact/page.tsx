import { contactAgentWhatsAppAction } from "@/actions/forms";
import { buildMetadata } from "@/lib/seo";
import { company, listings } from "@/lib/site-data";

type ContactPageProps = {
  searchParams: Promise<{ success?: string; error?: string; property?: string }>;
};

export const metadata = buildMetadata({
  title: "Contact Marxvest Real Estate",
  description:
    "Contact Marxvest Real Estate for land inquiries, site inspections, estate details, payment guidance, and verified property investment support in Nigeria.",
  path: "/contact",
});

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const selectedListing = listings.find((listing) => listing.slug === params.property);
  const defaultMessage = selectedListing
    ? `I would like to speak with an agent about ${selectedListing.title} and understand the next steps.`
    : "I would like to discuss available land options and the next steps.";

  return (
    <main className="pb-24">
      <section className="mx-auto grid w-[var(--page-width)] gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="section-cap">Contact</div>
          <h1 className="font-[family-name:var(--font-display)] text-5xl font-semibold text-[var(--brand-text)] sm:text-6xl">
            Contact Marxvest Real Estate for verified land guidance.
          </h1>
          <p className="text-lg leading-8 text-[var(--brand-text-muted)]">
            Reach out for available estates, inspection scheduling, documentation
            clarification, payment guidance, and next-step support before you
            commit to a property purchase.
          </p>
          <div className="space-y-3 text-base text-[var(--brand-text-muted)]">
            <p>{company.phone}</p>
            <p>{company.email}</p>
            <p>{company.address}</p>
          </div>
        </div>

        <div className="rounded-[2.2rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-8">
          <form action={contactAgentWhatsAppAction} className="grid gap-5">
            <input
              type="hidden"
              name="returnTo"
              value={selectedListing ? `/contact?property=${selectedListing.slug}` : "/contact"}
            />
            {selectedListing ? (
              <input type="hidden" name="listingSlug" value={selectedListing.slug} />
            ) : null}
            <div>
              <label htmlFor="contact-name" className="block text-sm font-semibold text-[var(--brand-text)]">
                Full name <span aria-hidden="true">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                autoComplete="name"
                required
                className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--brand-primary)]"
              />
            </div>
            <div>
              <label htmlFor="contact-phone" className="block text-sm font-semibold text-[var(--brand-text)]">
                Phone <span aria-hidden="true">*</span>
              </label>
              <input
                id="contact-phone"
                type="tel"
                name="phone"
                autoComplete="tel"
                required
                className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--brand-primary)]"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-sm font-semibold text-[var(--brand-text)]">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                autoComplete="email"
                className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--brand-primary)]"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-sm font-semibold text-[var(--brand-text)]">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--brand-primary)]"
                defaultValue={defaultMessage}
              />
            </div>
            {params.success ? (
              <p role="status" aria-live="polite" className="text-sm text-[var(--brand-primary)]">
                Inquiry submitted. A member of the Marxvest team will reach out shortly.
              </p>
            ) : null}
            {params.error ? (
              <p role="alert" className="text-sm text-[var(--brand-danger)]">{params.error}</p>
            ) : null}
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-[var(--brand-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-primary-dark)]"
            >
              Send property inquiry
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
