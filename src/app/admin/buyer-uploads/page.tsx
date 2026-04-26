import { redirect } from "next/navigation";

import {
  markBuyerUploadReviewedAction,
  retryBuyerUploadMirrorAction,
} from "@/actions/buyer-uploads";
import { getSession } from "@/lib/auth";
import {
  canStoreBuyerUploads,
  getRecentBuyerUploads,
} from "@/lib/buyer-uploads";
import { buildNoIndexMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type AdminBuyerUploadsPageProps = {
  searchParams: Promise<{ notice?: string; error?: string }>;
};

export const metadata = buildNoIndexMetadata(
  "Buyer uploads",
  "Private admin page for Marxvest buyer document uploads.",
  "/admin/buyer-uploads",
);

export default async function AdminBuyerUploadsPage({
  searchParams,
}: AdminBuyerUploadsPageProps) {
  const [session, params] = await Promise.all([getSession(), searchParams]);

  if (!session || session.role !== "admin") {
    redirect("/account");
  }

  let uploads = [] as Awaited<ReturnType<typeof getRecentBuyerUploads>>;
  let loadError = "";

  if (canStoreBuyerUploads()) {
    try {
      uploads = await getRecentBuyerUploads();
    } catch (error) {
      loadError =
        error instanceof Error
          ? error.message
          : "Unable to load buyer uploads.";
    }
  }

  return (
    <main className="pb-24">
      <section className="mx-auto w-[var(--page-width)] py-14">
        <div className="space-y-4">
          <div className="section-cap">Admin</div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-[var(--brand-text)] sm:text-5xl">
            Buyer uploads
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-[var(--brand-text-muted)]">
            Private review surface for files uploaded by confirmed buyers
            through their secure Marxvest access links.
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

        {!canStoreBuyerUploads() ? (
          <div className="mt-10 rounded-[2rem] border border-[var(--brand-border)] bg-white p-8 text-base leading-7 text-[var(--brand-text-muted)]">
            Buyer uploads are not configured yet. Confirm `SUPABASE_URL`,
            `SUPABASE_SERVICE_ROLE_KEY`, and the buyer upload migration before
            accepting files.
          </div>
        ) : loadError ? (
          <div className="mt-10 rounded-[2rem] border border-[var(--brand-border)] bg-white p-8 text-base leading-7 text-[var(--brand-danger)]">
            {loadError}
          </div>
        ) : (
          <div className="mt-10 grid gap-5">
            {uploads.length ? (
              uploads.map((upload) => (
                <article
                  key={upload.id}
                  className="rounded-[2rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_20px_55px_rgba(8,24,84,0.05)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-[var(--brand-text)]">
                        {upload.buyerName}
                      </h2>
                      <p className="mt-2 text-sm text-[var(--brand-text-muted)]">
                        {upload.buyerEmail}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs uppercase tracking-[0.2em] text-[var(--brand-primary)]">
                        {upload.reviewStatus}
                      </div>
                      <div className="mt-2 text-sm text-[var(--brand-text-muted)]">
                        {new Date(upload.createdAt).toLocaleString("en-NG")}
                      </div>
                    </div>
                  </div>

                  <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="font-semibold text-[var(--brand-text)]">File</dt>
                      <dd className="mt-1 text-[var(--brand-text-muted)]">
                        {upload.fileName}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-[var(--brand-text)]">Category</dt>
                      <dd className="mt-1 text-[var(--brand-text-muted)]">
                        {upload.uploadCategory.replaceAll("_", " ")}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-[var(--brand-text)]">Size</dt>
                      <dd className="mt-1 text-[var(--brand-text-muted)]">
                        {(upload.fileSize / 1024 / 1024).toFixed(2)} MB
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-[var(--brand-text)]">File type</dt>
                      <dd className="mt-1 text-[var(--brand-text-muted)]">
                        {upload.fileType}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-[var(--brand-text)]">Drive mirror</dt>
                      <dd className="mt-1 text-[var(--brand-text-muted)]">
                        {upload.mirrorStatus}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-[var(--brand-text)]">Mirrored at</dt>
                      <dd className="mt-1 text-[var(--brand-text-muted)]">
                        {upload.mirroredAt
                          ? new Date(upload.mirroredAt).toLocaleString("en-NG")
                          : "Not mirrored yet"}
                      </dd>
                    </div>
                    {upload.note ? (
                      <div className="sm:col-span-2">
                        <dt className="font-semibold text-[var(--brand-text)]">Note</dt>
                        <dd className="mt-1 text-[var(--brand-text-muted)]">
                          {upload.note}
                        </dd>
                      </div>
                    ) : null}
                    {upload.mirrorError ? (
                      <div className="sm:col-span-2">
                        <dt className="font-semibold text-[var(--brand-text)]">Mirror error</dt>
                        <dd className="mt-1 text-[var(--brand-danger)]">
                          {upload.mirrorError}
                        </dd>
                      </div>
                    ) : null}
                  </dl>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    {upload.signedUrl ? (
                      <a
                        href={upload.signedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-full bg-[var(--brand-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-primary-dark)]"
                      >
                        Open file
                      </a>
                    ) : null}
                    {upload.googleDriveFileUrl ? (
                      <a
                        href={upload.googleDriveFileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-full border border-[var(--brand-border-strong)] px-4 py-2 text-sm font-semibold text-[var(--brand-text)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
                      >
                        Open Drive copy
                      </a>
                    ) : null}
                    {upload.reviewStatus !== "reviewed" ? (
                      <form action={markBuyerUploadReviewedAction}>
                        <input type="hidden" name="uploadId" value={upload.id} />
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center rounded-full border border-[var(--brand-border-strong)] px-4 py-2 text-sm font-semibold text-[var(--brand-text)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
                        >
                          Mark reviewed
                        </button>
                      </form>
                    ) : null}
                    {upload.mirrorStatus !== "mirrored" ? (
                      <form action={retryBuyerUploadMirrorAction}>
                        <input type="hidden" name="uploadId" value={upload.id} />
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center rounded-full border border-[rgba(29,78,216,0.22)] px-4 py-2 text-sm font-semibold text-[var(--brand-primary)] transition hover:bg-[rgba(29,78,216,0.06)]"
                        >
                          Retry Drive mirror
                        </button>
                      </form>
                    ) : null}
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[2rem] border border-[var(--brand-border)] bg-white p-8 text-base leading-7 text-[var(--brand-text-muted)]">
                No buyer uploads have been submitted yet.
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
