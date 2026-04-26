import Link from "next/link";

import { buildNoIndexMetadata } from "@/lib/seo";
import { company } from "@/lib/site-data";

export const metadata = buildNoIndexMetadata(
  "Confirmed buyer access",
  "Website-native document access guidance for confirmed Marxvest buyers.",
  "/buyer-access",
);

const whatsappHref = `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(
  "Hello Marxvest, I am a confirmed buyer and I need help with my secure document access link.",
)}`;

export default function BuyerAccessLandingPage() {
  return (
    <main className="pb-24">
      <section className="mx-auto grid w-[var(--page-width)] gap-10 py-16 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-6">
          <div className="section-cap">Confirmed buyers</div>
          <h1 className="font-[family-name:var(--font-display)] text-5xl font-semibold text-[var(--brand-text)] sm:text-6xl">
            Secure document access now happens through private Marxvest links.
          </h1>
          <p className="text-lg leading-8 text-[var(--brand-text-muted)]">
            Confirmed buyers no longer need a generic external form to receive
            document folders. Marxvest now releases private, expiring buyer
            links directly after manual confirmation.
          </p>
          <div className="rounded-[2rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_18px_44px_rgba(8,24,84,0.06)]">
            <div className="text-xs uppercase tracking-[0.28em] text-[var(--brand-primary)]">
              What to expect
            </div>
            <ol className="mt-4 grid gap-3 text-sm leading-7 text-[var(--brand-text-muted)]">
              <li>1. Marxvest confirms your payment and buyer details offline.</li>
              <li>2. An advisor issues a secure buyer link tied to your record.</li>
              <li>3. You open the link and confirm your email and last 4 phone digits.</li>
              <li>4. The system opens your assigned Google Drive folder.</li>
            </ol>
          </div>
        </div>

        <div className="rounded-[2.2rem] border border-[var(--brand-border)] bg-[var(--brand-surface)] p-8">
          <div className="grid gap-8">
            <div className="rounded-[1.8rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_18px_44px_rgba(8,24,84,0.06)]">
              <div className="text-xs uppercase tracking-[0.28em] text-[var(--brand-primary)]">
                If you already received your secure link
              </div>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--brand-text)]">
                Open the private link sent to you by Marxvest.
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--brand-text-muted)]">
                Use the exact link sent by your advisor. The verification screen
                will ask for your email and the last 4 digits of the phone
                number used during confirmation.
              </p>
            </div>

            <div className="rounded-[1.8rem] border border-[var(--brand-border)] bg-white p-6 shadow-[0_18px_44px_rgba(8,24,84,0.06)]">
              <div className="text-xs uppercase tracking-[0.28em] text-[var(--brand-primary)]">
                If you have not received a secure link yet
              </div>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--brand-text)]">
                Contact Marxvest for release confirmation.
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--brand-text-muted)]">
                Once your confirmation is complete, Marxvest will send your
                private buyer link manually by WhatsApp or email. Do not rely on
                an old shared form or public document link.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--brand-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-primary-dark)]"
                >
                  Contact Marxvest
                </Link>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-[var(--brand-border-strong)] px-5 py-3 text-sm font-semibold text-[var(--brand-text)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
                >
                  Message on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
