"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navLinks } from "@/lib/site-data";

type MainNavProps = {
  mobile?: boolean;
};

export function MainNav({ mobile = false }: MainNavProps) {
  const pathname = usePathname();

  return (
    <>
      {navLinks.map((link) => {
        const isActive =
          link.href === "/"
            ? pathname === link.href
            : pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={
              mobile
                ? `whitespace-nowrap text-sm font-medium transition ${
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
