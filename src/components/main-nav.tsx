"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navLinks } from "@/lib/site-data";

type MainNavProps = {
  mobile?: boolean;
  onNavigate?: () => void;
  excludeHrefs?: string[];
};

export function MainNav({
  mobile = false,
  onNavigate,
  excludeHrefs = [],
}: MainNavProps) {
  const pathname = usePathname();

  return (
    <>
      {navLinks
        .filter((link) => !excludeHrefs.includes(link.href))
        .map((link) => {
        const isActive =
          link.href === "/"
            ? pathname === link.href
            : pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={
              mobile
                ? `whitespace-nowrap text-[20px] font-medium transition ${
                    isActive
                      ? "text-[var(--brand-primary)]"
                      : "text-[rgba(11,31,94,0.82)] transition-all duration-[250ms] hover:-translate-y-px hover:text-[var(--brand-primary)]"
                  }`
                : `text-[0.92rem] font-medium transition ${
                    isActive
                      ? "text-[var(--brand-primary)]"
                      : "text-[rgba(11,31,94,0.82)] transition-all duration-[250ms] hover:-translate-y-px hover:text-[var(--brand-primary)]"
                  }`
            }
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}
