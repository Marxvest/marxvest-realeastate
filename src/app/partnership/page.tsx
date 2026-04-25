import { submitLeadAction } from "@/actions/forms";
import { buildNoIndexMetadata } from "@/lib/seo";

type PartnershipPageProps = {
  searchParams: Promise<{ success?: string; error?: string }>;
};

export const metadata = buildNoIndexMetadata(
  "Partnership inquiries",
  "Private partnership inquiry page for organizations seeking to work with Marxvest Real Estate.",
  "/partnership",
);

export default async function PartnershipPage({
  searchParams,
}: PartnershipPageProps) {
  const params = await searchParams;

  return (
    <main className="pb-24">
      <section className="mx-auto w-[var(--page-width)] py-16">
        <div className="max-w-3xl space-y-6">
          <div className="section-cap">Partnership</div>
          <h1 className="font-[family-name:var(--font-display)] text-5xl font-semibold text-[var(--brand-text)] sm:text-6xl">
            Start a partnership conversation with the Marxvest team.
          </h1>
          <p className="text-lg leading-8 text-[var(--brand-text-muted)]">
            Use this page to introduce your partnership interest, operating model,
            and where you believe there is strategic fit.
          </p>
        </div>

        <div className="mt-10 rounded-[2.2rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-8">
          <form action={submitLeadAction} className="grid gap-5 sm:grid-cols-2">
            <input type="hidden" name="returnTo" value="/partnership" />
            <div>
              <label htmlFor="partnership-name" className="block text-sm font-semibold text-[var(--brand-text)]">
                Full name <span aria-hidden="true">*</span>
              </label>
              <input
                id="partnership-name"
                type="text"
                name="name"
                autoComplete="name"
                required
                className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
              />
            </div>
            <div>
              <label htmlFor="partnership-phone" className="block text-sm font-semibold text-[var(--brand-text)]">
                Phone <span aria-hidden="true">*</span>
              </label>
              <input
                id="partnership-phone"
                type="tel"
                name="phone"
                autoComplete="tel"
                required
                className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="partnership-message" className="block text-sm font-semibold text-[var(--brand-text)]">
                Why do you want to partner with Marxvest?
              </label>
              <textarea
                id="partnership-message"
                name="message"
                rows={4}
                className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
              />
            </div>
            {params.success ? (
              <p role="status" aria-live="polite" className="sm:col-span-2 text-sm text-[var(--brand-primary)]">
                Partnership request submitted. Our team will review it and respond.
              </p>
            ) : null}
            {params.error ? (
              <p role="alert" className="sm:col-span-2 text-sm text-[var(--brand-danger)]">
                {params.error}
              </p>
            ) : null}
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-[var(--brand-primary)] px-5 py-3 text-sm font-semibold text-white"
              >
                Submit partnership inquiry
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
