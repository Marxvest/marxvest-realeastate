import { contactAgentWhatsAppAction } from "@/actions/forms";
import { company, listings } from "@/lib/site-data";

type ContactPageProps = {
  searchParams: Promise<{ success?: string; error?: string; property?: string }>;
};

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
            Start with a clean inquiry.
          </h1>
          <p className="text-lg leading-8 text-[var(--brand-text-muted)]">
            Public users do not pay from listing pages. The first step is a
            structured inquiry so the Marxvest team can review buyer fit and
            acquisition goals.
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
              <label className="block text-sm font-semibold text-[var(--brand-text)]">
                Full name
              </label>
              <input
                type="text"
                name="name"
                className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--brand-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--brand-text)]">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--brand-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--brand-text)]">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--brand-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--brand-text)]">
                Message
              </label>
              <textarea
                name="message"
                rows={5}
                className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--brand-primary)]"
                defaultValue={defaultMessage}
              />
            </div>
            {params.success ? (
              <p className="text-sm text-[var(--brand-primary)]">
                Inquiry submitted. A member of the Marxvest team will reach out shortly.
              </p>
            ) : null}
            {params.error ? (
              <p className="text-sm text-[var(--brand-danger)]">{params.error}</p>
            ) : null}
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-[var(--brand-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-primary-dark)]"
            >
              Contact Agent
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
