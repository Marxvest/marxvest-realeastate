import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import { canStoreFormSubmissions, getRecentBookingRequests } from "@/lib/form-submissions";
import { buildNoIndexMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildNoIndexMetadata(
  "Booking submissions",
  "Private admin page for Marxvest booking form submissions.",
  "/admin/bookings",
);

export default async function AdminBookingsPage() {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    redirect("/account");
  }

  let submissions = [] as Awaited<ReturnType<typeof getRecentBookingRequests>>;
  let loadError = "";

  if (canStoreFormSubmissions()) {
    try {
      submissions = await getRecentBookingRequests();
    } catch (error) {
      loadError =
        error instanceof Error
          ? error.message
          : "Unable to load booking requests.";
    }
  }

  return (
    <main className="pb-24">
      <section className="mx-auto w-[var(--page-width)] py-14">
        <div className="space-y-4">
          <div className="section-cap">Admin</div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-[var(--brand-text)] sm:text-5xl">
            Booking requests
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-[var(--brand-text-muted)]">
            Admin-only inspection submissions captured from the Marxvest website.
          </p>
        </div>

        {!canStoreFormSubmissions() ? (
          <div className="mt-10 rounded-[2rem] border border-[var(--brand-border)] bg-white p-8 text-base leading-7 text-[var(--brand-text-muted)]">
            Supabase form storage is not configured yet. Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` before accepting or reviewing booking submissions.
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
                        {submission.name}
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
                      <dt className="font-semibold text-[var(--brand-text)]">Estate</dt>
                      <dd className="mt-1 text-[var(--brand-text-muted)]">
                        {submission.listingTitle ?? submission.listingSlug}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-[var(--brand-text)]">Preferred date</dt>
                      <dd className="mt-1 text-[var(--brand-text-muted)]">
                        {submission.preferredDate}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-[var(--brand-text)]">Coming from</dt>
                      <dd className="mt-1 text-[var(--brand-text-muted)]">
                        {submission.comingFrom}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-[var(--brand-text)]">Reminder channel</dt>
                      <dd className="mt-1 text-[var(--brand-text-muted)]">
                        {submission.reminderChannel}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-[var(--brand-text)]">Referral source</dt>
                      <dd className="mt-1 text-[var(--brand-text-muted)]">
                        {submission.referralSource}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-[var(--brand-text)]">Preparation acknowledged</dt>
                      <dd className="mt-1 text-[var(--brand-text-muted)]">
                        {submission.preparationAcknowledged ? "Yes" : "No"}
                      </dd>
                    </div>
                  </dl>

                  {submission.message ? (
                    <div className="mt-5 rounded-[1.4rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-4 text-sm leading-7 text-[var(--brand-text-muted)]">
                      {submission.message}
                    </div>
                  ) : null}
                </article>
              ))
            ) : (
              <div className="rounded-[2rem] border border-[var(--brand-border)] bg-white p-8 text-base leading-7 text-[var(--brand-text-muted)]">
                No booking requests have been submitted yet.
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
