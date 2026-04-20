"use client";

import type { CSSProperties, ReactNode, RefObject } from "react";
import { useEffect, useRef, useState } from "react";

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  from?: "left" | "right" | "up";
  as?: "div" | "li";
};

export function RevealOnScroll({
  children,
  className,
  delayMs = 0,
  from = "up",
  as = "div",
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement | HTMLLIElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (media.matches) {
      return;
    }

    let hasResolvedInitialState = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const intersects = Boolean(entry?.isIntersecting);

        if (!hasResolvedInitialState) {
          hasResolvedInitialState = true;
          setIsReady(true);
          setIsVisible(intersects);

          if (intersects) {
            observer.disconnect();
          }
          return;
        }

        if (intersects) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.18,
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const style = {
    transitionDelay: `${delayMs}ms`,
  } satisfies CSSProperties;

  const classes = [
    "scroll-reveal",
    `scroll-reveal--${from}`,
    isReady ? "is-ready" : "",
    isVisible ? "is-visible" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  if (as === "li") {
    return (
      <li ref={ref as RefObject<HTMLLIElement>} style={style} className={classes}>
        {children}
      </li>
    );
  }

  return (
    <div ref={ref as RefObject<HTMLDivElement>} style={style} className={classes}>
      {children}
    </div>
  );
}
