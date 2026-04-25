import Link from "next/link";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";

import { signOutAction } from "@/actions/auth";
import { BackToTopButton } from "@/components/back-to-top-button";
import { BrandLogo } from "@/components/brand-logo";
import ChatWidget from "@/components/ai-assistant/ChatWidget";
import { JsonLd } from "@/components/seo/JsonLd";
import { MainNav } from "@/components/main-nav";
import { MobileNavMenu } from "@/components/mobile-nav-menu";
import { WhatsAppWidget } from "@/components/whatsapp-widget";
import { getSession } from "@/lib/auth";
import { company, navLinks } from "@/lib/site-data";
import { buildRealEstateAgentSchema, buildWebsiteSchema } from "@/lib/schema";

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const displayFont = Sora({
  subsets: ["latin"],
  variable: "--font-display",
});

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-[var(--brand-background)] text-[var(--brand-text)] antialiased [--sticky-shell-height:4.8rem] lg:[--sticky-shell-height:4.35rem]">
        <JsonLd data={buildRealEstateAgentSchema()} />
        <JsonLd data={buildWebsiteSchema()} />
        <div className="fixed inset-x-0 top-0 z-50 border-b border-white/12 bg-[rgba(255,255,255,0.72)] backdrop-blur-md">
          <header>
            <div className="mx-auto flex h-[4.8rem] w-[min(1200px,calc(100vw-2rem))] items-center justify-between gap-3 sm:gap-4 lg:h-[4.35rem] lg:justify-start lg:gap-5">
              <BrandLogo compact className="min-w-0 shrink-0" />
              <nav className="hidden flex-1 items-center justify-center gap-7 lg:flex">
                <MainNav />
              </nav>
              <div className="flex items-center gap-2 sm:gap-3 lg:ml-auto">
                {session ? (
                  <>
                    <div className="hidden items-center gap-3 lg:flex">
                      {session.role === "admin" ? (
                        <Link
                          href="/admin"
                          className="rounded-full border border-[var(--brand-border-strong)] px-3.5 py-1.5 text-[0.88rem] font-semibold text-[var(--brand-text)]"
                        >
                          Admin
                        </Link>
                      ) : null}
                      <form action={signOutAction}>
                        <button
                          type="submit"
                          className="rounded-full bg-[var(--brand-primary)] px-3.5 py-1.5 text-[0.88rem] font-semibold text-white transition hover:bg-[var(--brand-primary-dark)]"
                        >
                          Sign out
                        </button>
                      </form>
                    </div>
                    <MobileNavMenu sessionRole={session.role} />
                  </>
                ) : (
                  <>
                    <Link
                      href="/contact"
                      className="hidden h-11 items-center gap-2 rounded-full border border-[rgba(255,255,255,0.42)] bg-[linear-gradient(135deg,rgba(9,23,68,0.96),rgba(16,39,101,0.92))] px-4.5 text-[0.74rem] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_12px_26px_rgba(7,18,45,0.16),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md transition duration-300 hover:-translate-y-px hover:border-[rgba(233,217,189,0.52)] hover:shadow-[0_16px_34px_rgba(7,18,45,0.22),inset_0_1px_0_rgba(255,255,255,0.16)] lg:inline-flex"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-sand)]" />
                      Contact Marxvest
                    </Link>
                    <MobileNavMenu />
                  </>
                )}
              </div>
            </div>
          </header>
        </div>

        <div className="relative min-h-screen pt-[var(--sticky-shell-height)]">
          <div className="hero-grid pointer-events-none absolute inset-x-0 top-0 h-[44rem]" />
          <div>
            {children}

            <footer className="mt-20 border-t border-[var(--brand-border)] bg-[var(--brand-surface)]">
              <div className="mx-auto grid w-[min(1200px,calc(100vw-2rem))] gap-10 py-14 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
                <div className="space-y-4">
                  <BrandLogo />
                  <p className="max-w-xl text-sm leading-7 text-[var(--brand-text-muted)]">
                    Marxvest Real Estate helps buyers review verified land,
                    understand documentation, schedule inspections, and move
                    through payment and allocation support with greater clarity.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="text-xs uppercase tracking-[0.3em] text-[var(--brand-primary)]">
                    Contact
                  </div>
                  <p className="text-sm text-[var(--brand-text-muted)]">{company.phone}</p>
                  <p className="text-sm text-[var(--brand-text-muted)]">{company.email}</p>
                  <p className="text-sm text-[var(--brand-text-muted)]">{company.address}</p>
                </div>
                <div className="space-y-3">
                  <div className="text-xs uppercase tracking-[0.3em] text-[var(--brand-primary)]">
                    Explore
                  </div>
                  <div className="grid gap-2 text-sm text-[var(--brand-text-muted)]">
                    {navLinks.map((link) => (
                      <Link key={link.href} href={link.href} className="transition hover:text-[var(--brand-primary)]">
                        {link.label}
                      </Link>
                    ))}
                    <Link href="/trust" className="transition hover:text-[var(--brand-primary)]">
                      Trust & Legal
                    </Link>
                    <Link href="/booking" className="transition hover:text-[var(--brand-primary)]">
                      Book inspection
                    </Link>
                    <Link href="/partnership" className="transition hover:text-[var(--brand-primary)]">
                      Partnership
                    </Link>
                  </div>
                </div>
              </div>
            </footer>
          </div>

          <ChatWidget />
          <WhatsAppWidget />
          <BackToTopButton />
        </div>
      </body>
    </html>
  );
}
