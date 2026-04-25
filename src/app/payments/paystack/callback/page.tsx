import { buildNoIndexMetadata } from "@/lib/seo";

export const metadata = buildNoIndexMetadata(
  "Payment status update",
  "Review the current status of your Marxvest payment request and contact the team for guidance if further confirmation is required.",
  "/payments/paystack/callback",
);

export default function PaystackCallbackPage() {
  return (
    <main className="pb-24">
      <section className="mx-auto w-[var(--page-width)] py-20">
        <div className="max-w-3xl rounded-[2.2rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-8">
          <div className="section-cap">Paystack callback</div>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-4xl font-semibold text-[var(--brand-text)] sm:text-5xl">
            Payment confirmation is currently handled with direct team support.
          </h1>
          <p className="mt-5 text-lg leading-8 text-[var(--brand-text-muted)]">
            If you were expecting a payment update, please contact Marxvest
            directly so the team can confirm your current acquisition stage,
            payment record, and next steps.
          </p>
        </div>
      </section>
    </main>
  );
}
