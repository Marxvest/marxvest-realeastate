import { submitLeadAction } from "@/actions/forms";
import { listings } from "@/lib/site-data";

type BookingFormProps = {
  property?: string;
  returnTo?: string;
  success?: string;
  error?: string;
};

export function BookingForm({
  property,
  returnTo = "/booking",
  success,
  error,
}: BookingFormProps) {
  return (
    <form action={submitLeadAction} className="grid gap-5 sm:grid-cols-2">
      <input type="hidden" name="returnTo" value={returnTo} />
      <div>
        <label className="block text-sm font-semibold text-[var(--brand-text)]">
          Full name
        </label>
        <input
          type="text"
          name="name"
          className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-[var(--brand-text)]">
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-[var(--brand-text)]">
          Email
        </label>
        <input
          type="email"
          name="email"
          className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-[var(--brand-text)]">
          Preferred date
        </label>
        <input
          type="date"
          name="preferredDate"
          className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-semibold text-[var(--brand-text)]">
          Preferred property
        </label>
        <select
          name="listingSlug"
          defaultValue={property ?? ""}
          className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
        >
          <option value="" disabled>
            Select an estate
          </option>
          {listings.map((listing) => (
            <option key={listing.slug} value={listing.slug}>
              {listing.title} · {listing.location}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-semibold text-[var(--brand-text)]">
          Notes
        </label>
        <textarea
          name="message"
          rows={4}
          className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
          defaultValue="I would like to schedule a site inspection and discuss pricing, documentation, and next steps."
        />
      </div>
      {success ? (
        <p className="sm:col-span-2 text-sm text-[var(--brand-primary)]">
          Inspection request submitted. Our team will confirm the next step shortly.
        </p>
      ) : null}
      {error ? (
        <p className="sm:col-span-2 text-sm text-[var(--brand-danger)]">{error}</p>
      ) : null}
      <div className="sm:col-span-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-[var(--brand-primary)] px-5 py-3 text-sm font-semibold text-white"
        >
          Book Site Inspection
        </button>
      </div>
    </form>
  );
}
