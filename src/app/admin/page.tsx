import { redirect } from "next/navigation";
import Link from "next/link";

import { buildNoIndexMetadata } from "@/lib/seo";
import { getSession } from "@/lib/auth";
import { getFormSubmissionSummary } from "@/lib/form-submissions";
import { auditEvents, homepageBanners, openInquiries } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export const metadata = buildNoIndexMetadata(
  "Admin",
  "Private Marxvest Real Estate administration interface.",
  "/admin",
);

export default async function AdminPage() {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    redirect("/account");
  }

  let submissionSummary = {
    bookingRequests: 0,
    partnerRegistrations: 0,
    configured: false,
  };
  let submissionError = "";

  try {
    submissionSummary = await getFormSubmissionSummary();
  } catch (error) {
    submissionError =
      error instanceof Error
        ? error.message
        : "Unable to load form submission summary.";
  }

  return (
    <main className="pb-24">
      <section className="mx-auto w-[var(--page-width)] py-14">
        <div className="space-y-4">
          <div className="section-cap">Admin</div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-[var(--brand-text)] sm:text-5xl">
            Operational overview
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-[var(--brand-text-muted)]">
            Narrow, role-restricted admin surface for approvals, inquiry oversight,
            homepage banners, and audit visibility.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <section className="rounded-[2.2rem] border border-[var(--brand-border)] bg-white p-8">
            <div className="text-xs uppercase tracking-[0.28em] text-[var(--brand-primary)]">
              Form submissions
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Link
                href="/admin/bookings"
                className="rounded-[1.4rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-5 py-5 transition hover:border-[var(--brand-primary)]"
              >
                <div className="text-sm uppercase tracking-[0.18em] text-[var(--brand-primary)]">
                  Booking requests
                </div>
                <div className="mt-3 text-3xl font-semibold text-[var(--brand-text)]">
                  {submissionSummary.bookingRequests}
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--brand-text-muted)]">
                  View inspection submissions from the website booking page.
                </p>
              </Link>
              <Link
                href="/admin/partners"
                className="rounded-[1.4rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-5 py-5 transition hover:border-[var(--brand-primary)]"
              >
                <div className="text-sm uppercase tracking-[0.18em] text-[var(--brand-primary)]">
                  Partner registrations
                </div>
                <div className="mt-3 text-3xl font-semibold text-[var(--brand-text)]">
                  {submissionSummary.partnerRegistrations}
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--brand-text-muted)]">
                  Review realtor and marketer onboarding entries.
                </p>
              </Link>
            </div>
            {!submissionSummary.configured ? (
              <p className="mt-5 text-sm leading-6 text-[var(--brand-danger)]">
                Supabase form storage is not configured. Website forms will not be accepted until the service role connection is available.
              </p>
            ) : null}
            {submissionError ? (
              <p className="mt-5 text-sm leading-6 text-[var(--brand-danger)]">
                {submissionError}
              </p>
            ) : null}
          </section>

          <section className="rounded-[2.2rem] border border-[var(--brand-border)] bg-white p-8">
            <div className="text-xs uppercase tracking-[0.28em] text-[var(--brand-primary)]">
              Inquiries
            </div>
            <div className="mt-6 grid gap-4">
              {openInquiries.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[1.3rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold text-[var(--brand-text)]">
                        {item.fullName}
                      </div>
                      <div className="mt-1 text-sm text-[var(--brand-text-muted)]">
                        {item.phone} · {item.email}
                      </div>
                    </div>
                    <div className="text-xs uppercase tracking-[0.2em] text-[var(--brand-primary)]">
                      {item.reviewStatus}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[var(--brand-text-muted)]">
                    {item.message}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2.2rem] border border-[var(--brand-border)] bg-white p-8">
            <div className="text-xs uppercase tracking-[0.28em] text-[var(--brand-primary)]">
              Archived payments
            </div>
            <p className="mt-6 text-base leading-7 text-[var(--brand-text-muted)]">
              Buyer dashboard payments and Paystack checkout are paused. Current
              buyer follow-up should be handled through direct agent contact and
              site inspection requests.
            </p>
          </section>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[2.2rem] border border-[var(--brand-border)] bg-white p-8">
            <div className="text-xs uppercase tracking-[0.28em] text-[var(--brand-primary)]">
              Homepage banners
            </div>
            <div className="mt-6 grid gap-4">
              {homepageBanners.map((banner) => (
                <div
                  key={banner.id}
                  className="rounded-[1.3rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-4"
                >
                  <div className="font-semibold text-[var(--brand-text)]">
                    {banner.title}
                  </div>
                  <div className="mt-2 text-sm text-[var(--brand-text-muted)]">
                    {banner.body}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2.2rem] border border-[var(--brand-border)] bg-white p-8">
            <div className="text-xs uppercase tracking-[0.28em] text-[var(--brand-primary)]">
              Audit trail
            </div>
            <div className="mt-6 grid gap-4">
              {auditEvents.map((event) => (
                <div key={event.id} className="border-t border-[var(--brand-border)] pt-4 first:border-t-0 first:pt-0">
                  <div className="font-semibold text-[var(--brand-text)]">
                    {event.action}
                  </div>
                  <div className="mt-1 text-sm text-[var(--brand-text-muted)]">
                    {event.actor} · {event.subject}
                  </div>
                  <div className="mt-2 text-sm text-[var(--brand-text-muted)]">
                    {typeof event.metadata === "string"
                      ? event.metadata
                      : "note" in event.metadata &&
                          typeof event.metadata.note === "string"
                        ? event.metadata.note
                        : JSON.stringify(event.metadata)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
