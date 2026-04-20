import { submitLeadAction } from "@/actions/forms";

type PartnershipPageProps = {
  searchParams: Promise<{ success?: string; error?: string }>;
};

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
              <label className="block text-sm font-semibold text-[var(--brand-text)]">
                Full name
              </label>
              <input
                type="text"
                name="name"
                className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--brand-text)]">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-[var(--brand-text)]">
                Why do you want to partner with Marxvest?
              </label>
              <textarea
                name="message"
                rows={4}
                className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
              />
            </div>
            {params.success ? (
              <p className="sm:col-span-2 text-sm text-[var(--brand-primary)]">
                Partnership request submitted. Our team will review it and respond.
              </p>
            ) : null}
            {params.error ? (
              <p className="sm:col-span-2 text-sm text-[var(--brand-danger)]">
                {params.error}
              </p>
            ) : null}
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-[var(--brand-primary)] px-5 py-3 text-sm font-semibold text-white"
              >
                Submit partnership form
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
