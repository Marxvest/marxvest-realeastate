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
          Phone (WhatsApp) <span aria-hidden="true">*</span>
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
        <label htmlFor="booking-coming-from" className="block text-sm font-semibold text-[var(--brand-text)]">
          Where are you coming from? <span aria-hidden="true">*</span>
        </label>
        <input
          id="booking-coming-from"
          type="text"
          name="comingFrom"
          required
          className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
          placeholder="e.g. Lagos, Abeokuta, Ikorodu"
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
      <div>
        <label htmlFor="booking-reminder-channel" className="block text-sm font-semibold text-[var(--brand-text)]">
          Best reminder channel <span aria-hidden="true">*</span>
        </label>
        <select
          id="booking-reminder-channel"
          name="reminderChannel"
          required
          defaultValue=""
          className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
        >
          <option value="" disabled>
            Select reminder option
          </option>
          <option value="Email">Email</option>
          <option value="Phone call">Phone call</option>
          <option value="WhatsApp">WhatsApp</option>
        </select>
      </div>
      <div>
        <label htmlFor="booking-referral-source" className="block text-sm font-semibold text-[var(--brand-text)]">
          How did you hear about Marxvest? <span aria-hidden="true">*</span>
        </label>
        <select
          id="booking-referral-source"
          name="referralSource"
          required
          defaultValue=""
          className="mt-2 w-full rounded-2xl border border-[var(--brand-border)] bg-white px-4 py-3"
        >
          <option value="" disabled>
            Select source
          </option>
          <option value="Marxvest Realtor">Marxvest Realtor</option>
          <option value="Social media Platforms">Social media Platforms</option>
          <option value="Radio/Tv">Radio/Tv</option>
          <option value="Church/Mosque">Church/Mosque</option>
          <option value="Other">Other</option>
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
      <div className="sm:col-span-2 rounded-[1.4rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4">
        <label htmlFor="booking-preparation" className="flex items-start gap-3 text-sm text-[var(--brand-text-muted)]">
          <input
            id="booking-preparation"
            type="checkbox"
            name="preparationAcknowledged"
            value="yes"
            required
            className="mt-1 h-4 w-4 rounded border border-[var(--brand-border-strong)]"
          />
          <span>
            I understand the Marxvest team prepares ahead once this inspection request is submitted.
          </span>
        </label>
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
