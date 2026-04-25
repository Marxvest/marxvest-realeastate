"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { signOutAction } from "@/actions/auth";
import { MainNav } from "@/components/main-nav";
import type { Role } from "@/lib/types";

type MobileNavMenuProps = {
  sessionRole?: Role;
};

export function MobileNavMenu({ sessionRole }: MobileNavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dialogId = useId();

  useEffect(() => {
    if (!isOpen) {
      buttonRef.current?.focus();
      return;
    }

    panelRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-controls={dialogId}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--brand-border-strong)] bg-white/88 text-[var(--brand-text)] shadow-[0_10px_28px_rgba(7,18,45,0.08)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
      >
        {isOpen ? (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current">
            <path d="M6 6l12 12M18 6L6 18" strokeWidth="1.9" strokeLinecap="round" />
          </svg>
        ) : (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 stroke-current">
            <path d="M4 7h16M4 12h16M4 17h16" strokeWidth="1.9" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[60] bg-[rgba(7,18,45,0.34)] backdrop-blur-[2px]"
          onClick={() => setIsOpen(false)}
          role="presentation"
        >
          <div
            id={dialogId}
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            tabIndex={-1}
            className="absolute right-0 top-0 flex h-[100svh] w-[78%] max-w-[21rem] flex-col border-l border-black/5 bg-white px-6 pb-8 pt-[5.75rem] shadow-[-20px_0_60px_rgba(0,0,0,0.12)]"
            onClick={(event) => event.stopPropagation()}
          >
            <nav className="grid gap-6 text-[20px] font-medium text-[var(--brand-text)]">
              <MainNav
                mobile
                excludeHrefs={["/contact"]}
                onNavigate={() => setIsOpen(false)}
              />
            </nav>

            {sessionRole ? (
              <div className="mt-8 grid gap-3 border-t border-[var(--brand-border)] pt-5">
                {sessionRole === "admin" ? (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--brand-border-strong)] px-4 text-sm font-semibold text-[var(--brand-text)]"
                  >
                    Admin
                  </Link>
                ) : null}
                <form action={signOutAction}>
                  <button
                    type="submit"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[var(--brand-primary)] px-4 text-sm font-semibold text-white"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
