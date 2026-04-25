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
        <label htmlFor="booking-name" className="block text-sm font-semibold text-[var(--brand-text)]">
          Full name <span aria-hidden="true">*</span>
        </label>
        <input
          id="booking-name"
          type="text"
          name="name"
          autoComplete="name"
          required
          className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
        />
      </div>
      <div>
        <label htmlFor="booking-phone" className="block text-sm font-semibold text-[var(--brand-text)]">
          Phone <span aria-hidden="true">*</span>
        </label>
        <input
          id="booking-phone"
          type="tel"
          name="phone"
          autoComplete="tel"
          required
          className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
        />
      </div>
      <div>
        <label htmlFor="booking-email" className="block text-sm font-semibold text-[var(--brand-text)]">
          Email <span aria-hidden="true">*</span>
        </label>
        <input
          id="booking-email"
          type="email"
          name="email"
          autoComplete="email"
          required
          className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
        />
      </div>
      <div>
        <label htmlFor="booking-date" className="block text-sm font-semibold text-[var(--brand-text)]">
          Preferred date <span aria-hidden="true">*</span>
        </label>
        <input
          id="booking-date"
          type="date"
          name="preferredDate"
          required
          className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="booking-listing" className="block text-sm font-semibold text-[var(--brand-text)]">
          Preferred property <span aria-hidden="true">*</span>
        </label>
        <select
          id="booking-listing"
          name="listingSlug"
          defaultValue={property ?? ""}
          required
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
        <label htmlFor="booking-message" className="block text-sm font-semibold text-[var(--brand-text)]">
          Notes
        </label>
        <textarea
          id="booking-message"
          name="message"
          rows={4}
          className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
          defaultValue="I would like to schedule a site inspection and discuss pricing, documentation, and next steps."
        />
      </div>
      {success ? (
        <p role="status" aria-live="polite" className="sm:col-span-2 text-sm text-[var(--brand-primary)]">
          Inspection request submitted. Our team will confirm the next step shortly.
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="sm:col-span-2 text-sm text-[var(--brand-danger)]">{error}</p>
      ) : null}
      <div className="sm:col-span-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-[var(--brand-primary)] px-5 py-3 text-sm font-semibold text-white"
        >
          Submit inspection request
        </button>
      </div>
    </form>
  );
}
