"use client";

import { useEffect, useState } from "react";

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const updateVisibility = () => {
      frame = 0;

      const hero = document.querySelector<HTMLElement>(".hero-stage");
      const threshold = hero
        ? hero.offsetTop + hero.offsetHeight * 0.88
        : window.innerHeight * 0.88;

      setIsVisible(window.scrollY > threshold);
    };

    const onScroll = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(updateVisibility);
    };

    updateVisibility();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <button
      type="button"
      aria-label="Return to top"
      onClick={scrollToTop}
      className={`fixed bottom-[18px] left-[18px] z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[rgba(9,23,68,0.9)] text-white shadow-[0_18px_46px_rgba(7,18,45,0.24)] backdrop-blur-md transition duration-300 sm:bottom-6 sm:left-6 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5 stroke-current"
      >
        <path
          d="M12 19V5M6.5 10.5 12 5l5.5 5.5"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </button>
  );
}
