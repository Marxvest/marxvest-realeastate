import { submitLeadAction } from "@/actions/forms";
import { buildNoIndexMetadata } from "@/lib/seo";

type PartnershipPageProps = {
  searchParams: Promise<{ success?: string; error?: string }>;
};

export const metadata = buildNoIndexMetadata(
  "Partner registration",
  "Private partner registration page for Marxvest realtors and marketer onboarding.",
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
            Register as a Marxvest partner and submit your onboarding details.
          </h1>
          <p className="text-lg leading-8 text-[var(--brand-text-muted)]">
            This form is for realtor and marketer onboarding. Submit your profile,
            introducer details, payout information, and required affirmation so the
            Marxvest team can review your registration correctly.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <aside className="rounded-[2.2rem] border border-[var(--brand-border)] bg-white p-8 shadow-[0_20px_55px_rgba(8,24,84,0.06)]">
            <div className="text-xs uppercase tracking-[0.28em] text-[var(--brand-primary)]">
              Partner terms
            </div>
            <div className="mt-5 space-y-5 text-base leading-7 text-[var(--brand-text-muted)]">
              <p>After this form is reviewed, approved partners can market Marxvest products through the proper channel.</p>
              <ol className="space-y-3">
                <li>1. No money should be paid into third-party accounts. Payments must go only to the company account.</li>
                <li>2. Cash transactions are prohibited. Cheques, bank drafts, or transfers are the accepted payment channels.</li>
                <li>3. General site inspection is part of partner responsibility, including helping clients get listed for inspection and allocation.</li>
                <li>4. Commissions are processed after payment confirmation and office form confirmation.</li>
                <li>5. Realtor monthly target expectation starts from NGN 3 million and above.</li>
              </ol>
            </div>
          </aside>

          <div className="rounded-[2.2rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-8">
          <form action={submitLeadAction} className="grid gap-5 sm:grid-cols-2">
            <input type="hidden" name="returnTo" value="/partnership" />
            <div>
              <label htmlFor="partnership-surname" className="block text-sm font-semibold text-[var(--brand-text)]">
                Surname <span aria-hidden="true">*</span>
              </label>
              <input
                id="partnership-surname"
                type="text"
                name="surname"
                autoComplete="family-name"
                required
                className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
              />
            </div>
            <div>
              <label htmlFor="partnership-other-names" className="block text-sm font-semibold text-[var(--brand-text)]">
                Other names <span aria-hidden="true">*</span>
              </label>
              <input
                id="partnership-other-names"
                type="text"
                name="otherNames"
                autoComplete="given-name"
                required
                className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
              />
            </div>
            <div>
              <label htmlFor="partnership-marital-status" className="block text-sm font-semibold text-[var(--brand-text)]">
                Marital status <span aria-hidden="true">*</span>
              </label>
              <select
                id="partnership-marital-status"
                name="maritalStatus"
                defaultValue=""
                required
                className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
              >
                <option value="" disabled>
                  Select marital status
                </option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="partnership-phone" className="block text-sm font-semibold text-[var(--brand-text)]">
                Phone (WhatsApp) <span aria-hidden="true">*</span>
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
            <div>
              <label htmlFor="partnership-dob" className="block text-sm font-semibold text-[var(--brand-text)]">
                Date of birth <span aria-hidden="true">*</span>
              </label>
              <input
                id="partnership-dob"
                type="date"
                name="dateOfBirth"
                required
                className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
              />
            </div>
            <div>
              <label htmlFor="partnership-occupation" className="block text-sm font-semibold text-[var(--brand-text)]">
                Occupation <span aria-hidden="true">*</span>
              </label>
              <input
                id="partnership-occupation"
                type="text"
                name="occupation"
                required
                className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
              />
            </div>
            <div>
              <label htmlFor="partnership-email" className="block text-sm font-semibold text-[var(--brand-text)]">
                Email address <span aria-hidden="true">*</span>
              </label>
              <input
                id="partnership-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="partnership-address" className="block text-sm font-semibold text-[var(--brand-text)]">
                Residential address <span aria-hidden="true">*</span>
              </label>
              <textarea
                id="partnership-address"
                name="residentialAddress"
                rows={3}
                required
                className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
              />
            </div>
            <div>
              <label htmlFor="partnership-upline" className="block text-sm font-semibold text-[var(--brand-text)]">
                Name of upline / introducer <span aria-hidden="true">*</span>
              </label>
              <input
                id="partnership-upline"
                type="text"
                name="uplineName"
                required
                className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="partnership-account" className="block text-sm font-semibold text-[var(--brand-text)]">
                Account details <span aria-hidden="true">*</span>
              </label>
              <textarea
                id="partnership-account"
                name="accountDetails"
                rows={4}
                required
                placeholder="Bank name, account name, and account number"
                className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
              />
            </div>
            <div className="sm:col-span-2 rounded-[1.6rem] border border-[var(--brand-border)] bg-white p-5">
              <label htmlFor="partnership-affirmation" className="block text-sm font-semibold text-[var(--brand-text)]">
                Affirmation <span aria-hidden="true">*</span>
              </label>
              <p className="mt-2 text-sm leading-7 text-[var(--brand-text-muted)]">
                Type “I affirmed this above statement” to confirm that you have read and accepted the partner terms.
              </p>
              <input
                id="partnership-affirmation"
                type="text"
                name="affirmation"
                required
                className="mt-3 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
              />
            </div>
            {params.success ? (
              <p role="status" aria-live="polite" className="sm:col-span-2 text-sm text-[var(--brand-primary)]">
                Partner registration submitted. The Marxvest team will review your onboarding details and respond.
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
                Submit partner registration
              </button>
            </div>
          </form>
        </div>
        </div>
      </section>
    </main>
  );
}
