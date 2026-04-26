import Link from "next/link";
import { redirect } from "next/navigation";

import { signInAction } from "@/actions/auth";
import { getSession } from "@/lib/auth";
import { buildNoIndexMetadata } from "@/lib/seo";

type AccountPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export const metadata = buildNoIndexMetadata(
  "Buyer account support",
  "Buyer support page for ongoing Marxvest Real Estate transactions and guided next steps.",
  "/account",
);

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const [session, params] = await Promise.all([getSession(), searchParams]);

  if (session?.role === "admin") {
    redirect("/admin");
  }

  return (
    <main className="pb-24">
      <section className="mx-auto grid w-[var(--page-width)] gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="section-cap">Buyer account</div>
          <h1 className="font-[family-name:var(--font-display)] text-5xl font-semibold text-[var(--brand-text)] sm:text-6xl">
            Buyer support continues through guided next steps.
          </h1>
          <p className="text-lg leading-8 text-[var(--brand-text-muted)]">
            Marxvest currently supports active buyers through direct advisor
            contact, guided site inspections, and document review conversations.
            Use the links below when you need clarification on an estate or want
            to schedule the next step in your purchase journey.
          </p>
        </div>

        <div className="rounded-[2.2rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-8">
          <div className="grid gap-8 lg:grid-cols-[0.94fr_1.06fr]">
            <div className="space-y-5">
              <div className="text-xs uppercase tracking-[0.28em] text-[var(--brand-primary)]">
                Current next steps
              </div>
              <p className="text-base leading-7 text-[var(--brand-text-muted)]">
                Speak with an advisor for estate questions, pricing guidance,
                documentation support, and inspection planning before payment or
                allocation discussions continue.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--brand-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-primary-dark)]"
                >
                  Contact Marxvest Real Estate
                </Link>
                <Link
                  href="/booking"
                  className="inline-flex items-center justify-center rounded-full border border-[var(--brand-border-strong)] px-5 py-3 text-sm font-semibold text-[var(--brand-text)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
                >
                  Book a site inspection
                </Link>
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_18px_44px_rgba(8,24,84,0.06)]">
              <div className="text-xs uppercase tracking-[0.28em] text-[var(--brand-primary)]">
                Admin sign in
              </div>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--brand-text)]">
                Access the private admin workspace.
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--brand-text-muted)]">
                Sign in with the configured admin demo credentials to review booking requests, partner registrations, and other restricted operational pages.
              </p>

              <form action={signInAction} className="mt-6 grid gap-4">
                <input type="hidden" name="next" value="/admin" />
                <div>
                  <label htmlFor="account-email" className="block text-sm font-semibold text-[var(--brand-text)]">
                    Email
                  </label>
                  <input
                    id="account-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
                  />
                </div>
                <div>
                  <label htmlFor="account-password" className="block text-sm font-semibold text-[var(--brand-text)]">
                    Password
                  </label>
                  <input
                    id="account-password"
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
                  />
                </div>
                {params.error ? (
                  <p role="alert" className="text-sm text-[var(--brand-danger)]">
                    {params.error}
                  </p>
                ) : null}
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--brand-primary-dark)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-primary)]"
                >
                  Sign in to admin
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
