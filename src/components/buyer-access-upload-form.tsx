"use client";

import { useActionState } from "react";

import { uploadBuyerDocumentAction } from "@/actions/buyer-uploads";
import {
  initialBuyerUploadActionState,
  type BuyerUploadActionState,
} from "@/lib/buyer-upload-action-state";

const uploadCategories = [
  { value: "payment_receipt", label: "Payment receipt" },
  { value: "passport_photo", label: "Passport photo" },
  { value: "government_id", label: "Government ID" },
  { value: "signed_document", label: "Signed document" },
  { value: "other", label: "Other file" },
] as const;

function UploadMessage({ state }: { state: BuyerUploadActionState }) {
  if (state.status === "idle" || !state.message) {
    return null;
  }

  return (
    <div
      className={`rounded-[1.5rem] border px-4 py-4 text-sm leading-7 ${
        state.status === "success"
          ? "border-[rgba(29,78,216,0.16)] bg-[rgba(29,78,216,0.06)] text-[var(--brand-text)]"
          : "border-[rgba(181,39,79,0.16)] bg-[rgba(181,39,79,0.06)] text-[var(--brand-danger)]"
      }`}
    >
      {state.message}
    </div>
  );
}

export function BuyerAccessUploadForm({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState(
    uploadBuyerDocumentAction,
    initialBuyerUploadActionState,
  );

  return (
    <form action={formAction} className="grid gap-5">
      <input type="hidden" name="token" value={token} />
      <UploadMessage state={state} />

      <div>
        <label
          htmlFor="buyer-upload-category"
          className="block text-sm font-semibold text-[var(--brand-text)]"
        >
          Upload category
        </label>
        <select
          id="buyer-upload-category"
          name="uploadCategory"
          defaultValue="payment_receipt"
          className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
        >
          {uploadCategories.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="buyer-upload-document"
          className="block text-sm font-semibold text-[var(--brand-text)]"
        >
          File
        </label>
        <input
          id="buyer-upload-document"
          name="document"
          type="file"
          accept=".pdf,image/jpeg,image/jpg,image/png,image/webp"
          required
          className="mt-2 block w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3 text-sm"
        />
        <p className="mt-2 text-xs leading-6 text-[var(--brand-text-muted)]">
          PDF, JPG, PNG, or WebP. Maximum 10MB.
        </p>
      </div>

      <div>
        <label
          htmlFor="buyer-upload-note"
          className="block text-sm font-semibold text-[var(--brand-text)]"
        >
          Note
        </label>
        <textarea
          id="buyer-upload-note"
          name="note"
          rows={3}
          placeholder="Optional note for the Marxvest team"
          className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center rounded-full bg-[var(--brand-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Uploading..." : "Upload file"}
      </button>
    </form>
  );
}
