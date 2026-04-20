import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import { auditEvents, homepageBanners, openInquiries } from "@/lib/site-data";

export default async function AdminPage() {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    redirect("/account");
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
