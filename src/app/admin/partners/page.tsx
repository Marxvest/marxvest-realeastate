import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import {
  canStoreFormSubmissions,
  getRecentPartnerRegistrations,
} from "@/lib/form-submissions";
import { buildNoIndexMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildNoIndexMetadata(
  "Partner registrations",
  "Private admin page for Marxvest partner registration submissions.",
  "/admin/partners",
);

export default async function AdminPartnersPage() {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    redirect("/account");
  }

  let submissions = [] as Awaited<
    ReturnType<typeof getRecentPartnerRegistrations>
  >;
  let loadError = "";

  if (canStoreFormSubmissions()) {
    try {
      submissions = await getRecentPartnerRegistrations();
    } catch (error) {
      loadError =
        error instanceof Error
          ? error.message
          : "Unable to load partner registrations.";
    }
  }

  return (
    <main className="pb-24">
      <section className="mx-auto w-[var(--page-width)] py-14">
        <div className="space-y-4">
          <div className="section-cap">Admin</div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-[var(--brand-text)] sm:text-5xl">
            Partner registrations
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-[var(--brand-text-muted)]">
            Admin-only realtor and marketer onboarding submissions captured from the website.
          </p>
        </div>

        {!canStoreFormSubmissions() ? (
          <div className="mt-10 rounded-[2rem] border border-[var(--brand-border)] bg-white p-8 text-base leading-7 text-[var(--brand-text-muted)]">
            Supabase form storage is not configured yet. Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` before accepting or reviewing partner registrations.
          </div>
        ) : loadError ? (
          <div className="mt-10 rounded-[2rem] border border-[var(--brand-border)] bg-white p-8 text-base leading-7 text-[var(--brand-danger)]">
            {loadError}
          </div>
        ) : (
          <div className="mt-10 grid gap-5">
            {submissions.length ? (
              submissions.map((submission) => (
                <article
                  key={submission.id}
                  className="rounded-[2rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_20px_55px_rgba(8,24,84,0.05)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-[var(--brand-text)]">
                        {submission.surname} {submission.otherNames}
                      </h2>
                      <p className="mt-2 text-sm text-[var(--brand-text-muted)]">
                        {submission.phone} · {submission.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs uppercase tracking-[0.2em] text-[var(--brand-primary)]">
                        {submission.status}
                      </div>
                      <div className="mt-2 text-sm text-[var(--brand-text-muted)]">
                        {new Date(submission.createdAt).toLocaleString("en-NG")}
                      </div>
                    </div>
                  </div>

                  <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="font-semibold text-[var(--brand-text)]">Marital status</dt>
                      <dd className="mt-1 text-[var(--brand-text-muted)]">
                        {submission.maritalStatus}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-[var(--brand-text)]">Date of birth</dt>
                      <dd className="mt-1 text-[var(--brand-text-muted)]">
                        {submission.dateOfBirth}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-[var(--brand-text)]">Occupation</dt>
                      <dd className="mt-1 text-[var(--brand-text-muted)]">
                        {submission.occupation}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-[var(--brand-text)]">Introducer</dt>
                      <dd className="mt-1 text-[var(--brand-text-muted)]">
                        {submission.uplineName}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="font-semibold text-[var(--brand-text)]">Residential address</dt>
                      <dd className="mt-1 text-[var(--brand-text-muted)]">
                        {submission.residentialAddress}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="font-semibold text-[var(--brand-text)]">Account details</dt>
                      <dd className="mt-1 whitespace-pre-line text-[var(--brand-text-muted)]">
                        {submission.accountDetails}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="font-semibold text-[var(--brand-text)]">Affirmation</dt>
                      <dd className="mt-1 text-[var(--brand-text-muted)]">
                        {submission.affirmation}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))
            ) : (
              <div className="rounded-[2rem] border border-[var(--brand-border)] bg-white p-8 text-base leading-7 text-[var(--brand-text-muted)]">
                No partner registrations have been submitted yet.
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
