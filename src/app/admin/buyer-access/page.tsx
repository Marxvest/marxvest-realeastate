import { redirect } from "next/navigation";

import { revokeBuyerAccessLinkAction } from "@/actions/buyer-access";
import { BuyerAccessLinkActions } from "@/components/admin/buyer-access-link-actions";
import { BuyerAccessIssueForm } from "@/components/admin/buyer-access-issue-form";
import {
  getBuyerAccessAttempts,
  getBuyerAccessLinks,
  hasBuyerAccessConfig,
} from "@/lib/buyer-access";
import { getSession } from "@/lib/auth";
import { buildNoIndexMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type AdminBuyerAccessPageProps = {
  searchParams: Promise<{ notice?: string; error?: string }>;
};

export const metadata = buildNoIndexMetadata(
  "Buyer access links",
  "Private admin page for secure buyer access links.",
  "/admin/buyer-access",
);

function formatDateTime(value?: string) {
  if (!value) {
    return "Not yet used";
  }

  return new Date(value).toLocaleString("en-NG");
}

export default async function AdminBuyerAccessPage({
  searchParams,
}: AdminBuyerAccessPageProps) {
  const [session, params] = await Promise.all([getSession(), searchParams]);

  if (!session || session.role !== "admin") {
    redirect("/account");
  }

  let links = [] as Awaited<ReturnType<typeof getBuyerAccessLinks>>;
  let attempts = [] as Awaited<ReturnType<typeof getBuyerAccessAttempts>>;
  let loadError = "";

  if (hasBuyerAccessConfig()) {
    try {
      [links, attempts] = await Promise.all([
        getBuyerAccessLinks(),
        getBuyerAccessAttempts(30),
      ]);
    } catch (error) {
      loadError =
        error instanceof Error
          ? error.message
          : "Unable to load secure buyer access data.";
    }
  }

  const activeLinks = links.filter((link) => link.status === "active");
  const historicalLinks = links.filter((link) => link.status !== "active");

  return (
    <main className="pb-24">
      <section className="mx-auto w-[var(--page-width)] py-14">
        <div className="space-y-4">
          <div className="section-cap">Admin</div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-[var(--brand-text)] sm:text-5xl">
            Secure buyer access links
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-[var(--brand-text-muted)]">
            Issue expiring links for confirmed buyers, send them manually, and
            keep Google Drive access under Marxvest control.
          </p>
        </div>

        {params.notice ? (
          <div className="mt-8 rounded-[1.8rem] border border-[rgba(29,78,216,0.16)] bg-[rgba(29,78,216,0.06)] px-5 py-4 text-sm text-[var(--brand-text)]">
            {params.notice}
          </div>
        ) : null}
        {params.error ? (
          <div className="mt-8 rounded-[1.8rem] border border-[rgba(181,39,79,0.16)] bg-[rgba(181,39,79,0.06)] px-5 py-4 text-sm text-[var(--brand-danger)]">
            {params.error}
          </div>
        ) : null}

        {!hasBuyerAccessConfig() ? (
          <div className="mt-10 rounded-[2rem] border border-[var(--brand-border)] bg-white p-8 text-base leading-7 text-[var(--brand-text-muted)]">
            Supabase admin storage is not configured. Add `SUPABASE_URL` and
            `SUPABASE_SERVICE_ROLE_KEY` before issuing secure buyer links.
          </div>
        ) : loadError ? (
          <div className="mt-10 rounded-[2rem] border border-[var(--brand-border)] bg-white p-8 text-base leading-7 text-[var(--brand-danger)]">
            {loadError}
          </div>
        ) : (
          <div className="mt-10 grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
            <section className="rounded-[2.2rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-8">
              <div className="text-xs uppercase tracking-[0.28em] text-[var(--brand-primary)]">
                Issue secure link
              </div>
              <div className="mt-5">
                <BuyerAccessIssueForm />
              </div>
            </section>

            <div className="space-y-8">
              <section className="rounded-[2.2rem] border border-[var(--brand-border)] bg-white p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.28em] text-[var(--brand-primary)]">
                      Active links
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[var(--brand-text-muted)]">
                      Active links can still be opened until they expire or are revoked.
                    </p>
                  </div>
                  <div className="text-3xl font-semibold text-[var(--brand-text)]">
                    {activeLinks.length}
                  </div>
                </div>

                <div className="mt-6 grid gap-5">
                  {activeLinks.length ? (
                    activeLinks.map((link) => (
                      <article
                        key={link.id}
                        className="rounded-[1.6rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <h2 className="text-lg font-semibold text-[var(--brand-text)]">
                              {link.buyerName}
                            </h2>
                            <p className="mt-2 text-sm text-[var(--brand-text-muted)]">
                              {link.buyerEmail} · {link.buyerPhoneFull}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-xs uppercase tracking-[0.2em] text-[var(--brand-primary)]">
                              {link.status}
                            </div>
                            <div className="mt-2 text-sm text-[var(--brand-text-muted)]">
                              Expires {formatDateTime(link.expiresAt)}
                            </div>
                          </div>
                        </div>

                        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                          <div>
                            <dt className="font-semibold text-[var(--brand-text)]">Estate</dt>
                            <dd className="mt-1 text-[var(--brand-text-muted)]">
                              {link.estateName}
                            </dd>
                          </div>
                          <div>
                            <dt className="font-semibold text-[var(--brand-text)]">Delivery</dt>
                            <dd className="mt-1 text-[var(--brand-text-muted)]">
                              {link.deliveryChannel}
                            </dd>
                          </div>
                          <div>
                            <dt className="font-semibold text-[var(--brand-text)]">Created by</dt>
                            <dd className="mt-1 text-[var(--brand-text-muted)]">
                              {link.createdBy}
                            </dd>
                          </div>
                          <div>
                            <dt className="font-semibold text-[var(--brand-text)]">Access count</dt>
                            <dd className="mt-1 text-[var(--brand-text-muted)]">
                              {link.accessCount}
                            </dd>
                          </div>
                          <div className="sm:col-span-2">
                            <dt className="font-semibold text-[var(--brand-text)]">Last accessed</dt>
                            <dd className="mt-1 text-[var(--brand-text-muted)]">
                              {formatDateTime(link.lastAccessedAt)}
                            </dd>
                          </div>
                          {link.paymentNote ? (
                            <div className="sm:col-span-2">
                              <dt className="font-semibold text-[var(--brand-text)]">Payment note</dt>
                              <dd className="mt-1 text-[var(--brand-text-muted)]">
                                {link.paymentNote}
                              </dd>
                            </div>
                          ) : null}
                          {link.deliveryNote ? (
                            <div className="sm:col-span-2">
                              <dt className="font-semibold text-[var(--brand-text)]">Delivery note</dt>
                              <dd className="mt-1 text-[var(--brand-text-muted)]">
                                {link.deliveryNote}
                              </dd>
                            </div>
                          ) : null}
                        </dl>

                        <div className="mt-5 flex flex-wrap items-start gap-3">
                          <form action={revokeBuyerAccessLinkAction}>
                            <input type="hidden" name="linkId" value={link.id} />
                            <button
                              type="submit"
                              className="inline-flex items-center justify-center rounded-full border border-[rgba(181,39,79,0.18)] px-3 py-2 text-xs font-semibold text-[var(--brand-danger)] transition hover:bg-[rgba(181,39,79,0.06)]"
                            >
                              Revoke
                            </button>
                          </form>
                          <BuyerAccessLinkActions linkId={link.id} />
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-[1.6rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-5 text-sm leading-7 text-[var(--brand-text-muted)]">
                      No active secure buyer links yet.
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-[2.2rem] border border-[var(--brand-border)] bg-white p-8">
                <div className="text-xs uppercase tracking-[0.28em] text-[var(--brand-primary)]">
                  Issuance history
                </div>
                <div className="mt-6 grid gap-4">
                  {historicalLinks.length ? (
                    historicalLinks.map((link) => (
                      <article
                        key={link.id}
                        className="rounded-[1.4rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <div className="font-semibold text-[var(--brand-text)]">
                              {link.buyerName}
                            </div>
                            <div className="mt-1 text-sm text-[var(--brand-text-muted)]">
                              {link.estateName}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs uppercase tracking-[0.2em] text-[var(--brand-primary)]">
                              {link.status}
                            </div>
                            <div className="mt-1 text-sm text-[var(--brand-text-muted)]">
                              {formatDateTime(link.updatedAt)}
                            </div>
                          </div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-[1.6rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-5 text-sm leading-7 text-[var(--brand-text-muted)]">
                      No revoked or expired secure links yet.
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-[2.2rem] border border-[var(--brand-border)] bg-white p-8">
                <div className="text-xs uppercase tracking-[0.28em] text-[var(--brand-primary)]">
                  Recent access attempts
                </div>
                <div className="mt-6 grid gap-4">
                  {attempts.length ? (
                    attempts.map((attempt) => (
                      <article
                        key={attempt.id}
                        className="rounded-[1.4rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-4 text-sm"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="font-semibold text-[var(--brand-text)]">
                            {attempt.attemptStatus.replaceAll("_", " ")}
                          </div>
                          <div className="text-[var(--brand-text-muted)]">
                            {formatDateTime(attempt.createdAt)}
                          </div>
                        </div>
                        <div className="mt-2 space-y-1 text-[var(--brand-text-muted)]">
                          <div>Link ID: {attempt.buyerAccessLinkId ?? "unknown token"}</div>
                          <div>IP: {attempt.ipAddress ?? "not captured"}</div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-[1.6rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-5 text-sm leading-7 text-[var(--brand-text-muted)]">
                      No buyer access attempts recorded yet.
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
