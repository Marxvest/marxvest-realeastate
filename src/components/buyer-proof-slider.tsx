"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { RevealOnScroll } from "@/components/reveal-on-scroll";

type ProofMoment = {
  title: string;
  caption: string;
  image: {
    src: string;
    alt: string;
  };
};

type BuyerProofSliderProps = {
  moments: ReadonlyArray<ProofMoment>;
};

export function BuyerProofSlider({ moments }: BuyerProofSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const syncActiveIndex = useCallback(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const containerLeft = container.getBoundingClientRect().left;
    const scrollLeft = container.scrollLeft;

    let closestIndex = 0;
    let smallestDistance = Number.POSITIVE_INFINITY;

    cardRefs.current.forEach((card, index) => {
      if (!card) {
        return;
      }

      const cardLeft = card.getBoundingClientRect().left - containerLeft + scrollLeft;
      const distance = Math.abs(cardLeft - scrollLeft);

      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const initialFrame = window.requestAnimationFrame(syncActiveIndex);

    const handleScroll = () => {
      window.requestAnimationFrame(syncActiveIndex);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.cancelAnimationFrame(initialFrame);
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [syncActiveIndex]);

  const scrollToIndex = (index: number) => {
    const container = containerRef.current;
    const card = cardRefs.current[index];

    if (!container || !card) {
      return;
    }

    const containerLeft = container.getBoundingClientRect().left;
    const scrollTarget =
      card.getBoundingClientRect().left - containerLeft + container.scrollLeft;

    container.scrollTo({
      left: scrollTarget,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div
        ref={containerRef}
        className="scrollbar-hidden -mx-4 mt-8 flex snap-x gap-4 overflow-x-auto px-4 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0 sm:mx-0 sm:gap-5 sm:px-0 sm:pb-2"
        aria-label="Buyer proof moments"
      >
        {moments.map((moment, index) => (
          <RevealOnScroll
            key={moment.title}
            from={index === 0 ? "left" : "right"}
            delayMs={index * 80}
            className="min-w-[84vw] snap-start sm:min-w-[32rem] lg:min-w-[36rem]"
          >
            <div ref={(node) => { cardRefs.current[index] = node; }}>
              <article className="h-full overflow-hidden rounded-[1.75rem] border border-[var(--brand-border)] bg-white shadow-[0_20px_60px_rgba(8,27,75,0.08)]">
                <div className="relative aspect-[1.18/1] overflow-hidden bg-[var(--brand-surface)] sm:aspect-[1.42/1]">
                  <Image
                    src={moment.image.src}
                    alt={moment.image.alt}
                    fill
                    sizes="(min-width: 1024px) 36rem, (min-width: 640px) 32rem, 84vw"
                    className="object-cover transition duration-500 hover:scale-[1.02]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(6,18,49,0.78)] via-[rgba(6,18,49,0.22)] to-transparent p-5">
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/62">
                      Proof moment
                    </div>
                    <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold leading-tight text-white">
                      {moment.title}
                    </h3>
                  </div>
                </div>
                <p className="p-5 text-sm leading-7 text-[var(--brand-text-muted)] sm:text-base">
                  {moment.caption}
                </p>
              </article>
            </div>
          </RevealOnScroll>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2.5" aria-label="Buyer proof slider controls">
        {moments.map((moment, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={moment.title}
              type="button"
              onClick={() => scrollToIndex(index)}
              aria-label={`Go to ${moment.title}`}
              aria-pressed={isActive}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                isActive
                  ? "w-8 bg-[var(--brand-primary)]"
                  : "w-2.5 bg-[rgba(9,20,51,0.18)] hover:bg-[rgba(9,20,51,0.34)]"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
