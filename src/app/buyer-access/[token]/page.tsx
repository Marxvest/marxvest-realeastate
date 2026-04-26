import Link from "next/link";

import { verifyBuyerAccessAction } from "@/actions/buyer-access";
import { BuyerAccessUploadForm } from "@/components/buyer-access-upload-form";
import { getBuyerAccessLinkByToken, hasBuyerAccessConfig } from "@/lib/buyer-access";
import { hasVerifiedBuyerAccess } from "@/lib/buyer-access-session";
import { canStoreBuyerUploads, getBuyerUploadsForToken } from "@/lib/buyer-uploads";
import { buildNoIndexMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type BuyerAccessPageProps = {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ error?: string }>;
};

export const metadata = buildNoIndexMetadata(
  "Secure buyer access",
  "Private buyer verification screen for Marxvest document access.",
  "/buyer-access",
);

export default async function BuyerAccessPage({
  params,
  searchParams,
}: BuyerAccessPageProps) {
  const [{ token }, query] = await Promise.all([params, searchParams]);
  const link = hasBuyerAccessConfig() ? await getBuyerAccessLinkByToken(token) : null;
  const isVerified = link ? await hasVerifiedBuyerAccess(token) : false;
  const uploads =
    link && isVerified && canStoreBuyerUploads()
      ? await getBuyerUploadsForToken(token)
      : [];

  const denialMessage = !hasBuyerAccessConfig()
    ? "Buyer access is not configured right now. Please contact Marxvest."
    : !link
      ? "This buyer link is invalid. Please contact Marxvest for a new secure link."
      : link.status === "revoked"
        ? "This buyer link is no longer active. Please contact Marxvest."
        : link.status === "expired"
          ? "This buyer link has expired. Please contact Marxvest for a new secure link."
          : "";

  return (
    <main className="pb-24">
      <section className="mx-auto w-[min(720px,calc(100vw-2rem))] py-16">
        <div className="rounded-[2.3rem] border border-[var(--brand-border)] bg-white p-8 shadow-[0_20px_55px_rgba(8,24,84,0.06)] sm:p-10">
          <div className="section-cap">Secure access</div>
          <h1 className="mt-5 font-[family-name:var(--font-display)] text-4xl font-semibold text-[var(--brand-text)] sm:text-5xl">
            Confirm your details to open your document folder.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[var(--brand-text-muted)]">
            This secure link is for the intended Marxvest buyer only. Enter the
            same email and last 4 phone digits used during confirmation before
            we open the assigned Google Drive folder.
          </p>

          {denialMessage ? (
            <div className="mt-8 rounded-[1.8rem] border border-[rgba(181,39,79,0.16)] bg-[rgba(181,39,79,0.06)] px-5 py-5 text-base leading-7 text-[var(--brand-danger)]">
              {denialMessage}
            </div>
          ) : isVerified && link ? (
            <div className="mt-8 grid gap-8">
              <div className="rounded-[1.8rem] border border-[rgba(29,78,216,0.16)] bg-[rgba(29,78,216,0.06)] px-5 py-5 text-base leading-7 text-[var(--brand-text)]">
                Your secure access is confirmed. Open your shared folder or upload the requested files for Marxvest review.
              </div>

              <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
                <section className="rounded-[1.8rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-6">
                  <div className="text-xs uppercase tracking-[0.28em] text-[var(--brand-primary)]">
                    Shared documents
                  </div>
                  <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--brand-text)]">
                    Open your assigned folder
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--brand-text-muted)]">
                    This folder contains the documents Marxvest has released for
                    your confirmed record. Share this folder only with authorized
                    parties.
                  </p>
                  <a
                    href={`https://drive.google.com/drive/folders/${link.driveFolderId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-[var(--brand-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-primary-dark)]"
                  >
                    Open shared folder
                  </a>
                </section>

                <section className="rounded-[1.8rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_18px_44px_rgba(8,24,84,0.06)]">
                  <div className="text-xs uppercase tracking-[0.28em] text-[var(--brand-primary)]">
                    Upload requested files
                  </div>
                  <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--brand-text)]">
                    Send documents back through Marxvest
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--brand-text-muted)]">
                    Upload receipts, ID, signed forms, or other requested files
                    here. Marxvest stores them securely and mirrors them into
                    your assigned Google Drive folder for shared access.
                  </p>
                  <div className="mt-6">
                    <BuyerAccessUploadForm token={token} />
                  </div>
                </section>
              </div>

              <section className="rounded-[1.8rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_18px_44px_rgba(8,24,84,0.06)]">
                <div className="text-xs uppercase tracking-[0.28em] text-[var(--brand-primary)]">
                  Uploaded files
                </div>
                <div className="mt-5 grid gap-4">
                  {uploads.length ? (
                    uploads.map((upload) => (
                      <article
                        key={upload.id}
                        className="rounded-[1.4rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold text-[var(--brand-text)]">
                              {upload.fileName}
                            </div>
                            <div className="mt-1 text-sm text-[var(--brand-text-muted)]">
                              {upload.uploadCategory.replaceAll("_", " ")} ·{" "}
                              {(upload.fileSize / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs uppercase tracking-[0.2em] text-[var(--brand-primary)]">
                              {upload.reviewStatus}
                            </div>
                            <div className="mt-1 text-sm text-[var(--brand-text-muted)]">
                              {new Date(upload.createdAt).toLocaleString("en-NG")}
                            </div>
                          </div>
                        </div>
                        {upload.note ? (
                          <p className="mt-3 text-sm leading-7 text-[var(--brand-text-muted)]">
                            {upload.note}
                          </p>
                        ) : null}
                        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--brand-primary)]">
                          Drive mirror: {upload.mirrorStatus}
                        </p>
                        {upload.signedUrl ? (
                          <a
                            href={upload.signedUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-flex items-center text-sm font-semibold text-[var(--brand-primary)] transition hover:text-[var(--brand-primary-dark)]"
                          >
                            Open uploaded file
                          </a>
                        ) : null}
                        {upload.googleDriveFileUrl ? (
                          <a
                            href={upload.googleDriveFileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex items-center text-sm font-semibold text-[var(--brand-primary)] transition hover:text-[var(--brand-primary-dark)]"
                          >
                            Open Drive copy
                          </a>
                        ) : null}
                        {upload.mirrorError ? (
                          <p className="mt-3 text-sm text-[var(--brand-danger)]">
                            Marxvest received your file, but Drive mirroring is pending: {upload.mirrorError}
                          </p>
                        ) : null}
                      </article>
                    ))
                  ) : (
                    <div className="rounded-[1.4rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4 text-sm leading-7 text-[var(--brand-text-muted)]">
                      No files have been uploaded through this secure link yet.
                    </div>
                  )}
                </div>
              </section>
            </div>
          ) : (
            <form action={verifyBuyerAccessAction} className="mt-8 grid gap-5">
              <input type="hidden" name="token" value={token} />
              <div>
                <label
                  htmlFor="buyer-access-email"
                  className="block text-sm font-semibold text-[var(--brand-text)]"
                >
                  Email
                </label>
                <input
                  id="buyer-access-email"
                  type="email"
                  name="buyerEmail"
                  autoComplete="email"
                  required
                  className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
                />
              </div>
              <div>
                <label
                  htmlFor="buyer-access-phone-last4"
                  className="block text-sm font-semibold text-[var(--brand-text)]"
                >
                  Last 4 digits of phone number
                </label>
                <input
                  id="buyer-access-phone-last4"
                  type="text"
                  name="buyerPhoneLast4"
                  inputMode="numeric"
                  pattern="[0-9]{4}"
                  maxLength={4}
                  required
                  className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
                />
              </div>
              {query.error ? (
                <p role="alert" className="text-sm text-[var(--brand-danger)]">
                  {query.error}
                </p>
              ) : null}
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-[var(--brand-primary-dark)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-primary)]"
              >
                Open my folder
              </button>
            </form>
          )}

          <div className="mt-8 border-t border-[var(--brand-border)] pt-6">
            <Link
              href="/contact"
              className="text-sm font-semibold text-[var(--brand-primary)] transition hover:text-[var(--brand-primary-dark)]"
            >
              Need help? Contact Marxvest
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
