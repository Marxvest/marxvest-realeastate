"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type HeroSlide = {
  src: string;
  alt: string;
  objectPosition?: string;
};

type HeroImageSliderProps = {
  slides: readonly HeroSlide[];
  intervalMs?: number;
};

export function HeroImageSlider({
  slides,
  intervalMs = 5600,
}: HeroImageSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (prefersReducedMotion.matches) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slides.length);
    }, intervalMs);

    return () => window.clearInterval(intervalId);
  }, [intervalMs, slides.length]);

  return (
    <div className="hero-stage-slider absolute inset-0" aria-hidden="true">
      {slides.map((slide, index) => (
        <div
          key={slide.src}
          className={`hero-stage-slide absolute inset-0 ${
            index === activeIndex ? "is-active" : ""
          }`}
        >
          <Image
            src={slide.src}
            alt=""
            fill
            sizes="100vw"
            preload={index === 0}
            loading="eager"
            className="hero-stage-image object-cover"
            style={{ objectPosition: slide.objectPosition ?? "58% center" }}
          />
        </div>
      ))}
    </div>
  );
}
