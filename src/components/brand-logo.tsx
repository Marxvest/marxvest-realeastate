import Image from "next/image";
import Link from "next/link";

import { company } from "@/lib/site-data";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  compact?: boolean;
  className?: string;
};

export function BrandLogo({ compact = false, className }: BrandLogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        compact
          ? "group inline-flex items-center gap-2.5 text-[var(--brand-text)]"
          : "group inline-flex items-center gap-3 text-[var(--brand-text)]",
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden border border-[var(--brand-border)] bg-white/95 shadow-[0_14px_40px_rgba(5,21,70,0.14)]",
          compact ? "rounded-[1.05rem] p-1.5" : "rounded-[1.35rem] p-2",
        )}
      >
        <Image
          src={company.logoUrl}
          alt={`${company.name} logo`}
          width={compact ? 44 : 72}
          height={compact ? 44 : 72}
          className={cn(
            "h-auto w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]",
            compact ? "max-w-[44px]" : "max-w-[56px] sm:max-w-[72px]",
          )}
          priority
        />
      </div>
      <div className="min-w-0">
        <div
          className={cn(
            "font-[family-name:var(--font-display)] uppercase tracking-[0.34em] text-[var(--brand-primary)]",
            compact ? "text-[0.62rem]" : "text-[0.72rem]",
          )}
        >
          Marxvest
        </div>
        <div
          className={cn(
            "font-[family-name:var(--font-display)] text-balance font-semibold leading-none text-[var(--brand-text)]",
            compact ? "text-[0.96rem] sm:text-[1.02rem]" : "text-lg sm:text-xl",
          )}
        >
          Spec Limited
        </div>
      </div>
    </Link>
  );
}
