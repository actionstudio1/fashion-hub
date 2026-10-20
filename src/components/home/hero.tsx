"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Photo } from "@/components/ui/photo";

export type HeroSlide = { image: string; position?: string; caption: string };

export function Hero({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="New collection"
      className="relative h-[calc(100svh-6.25rem)] min-h-[560px] overflow-hidden bg-ink text-white md:h-[calc(100svh-7.25rem)] md:min-h-[640px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        <div
          key={s.image}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-[1600ms] ease-in-out ${i === index ? "opacity-100" : "opacity-0"}`}
        >
          <div key={i === index ? `on-${index}` : "off"} className={`absolute inset-0 ${i === index ? "animate-kenburns" : ""}`}>
            <Photo src={s.image} alt={s.caption} fill priority={i === 0} sizes="100vw" style={{ objectPosition: s.position ?? "center" }} />
          </div>
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

      <div className="container-x relative flex h-full flex-col justify-end pb-16 md:pb-24">
        <div className="max-w-3xl">
          <p className="eyebrow inline-flex items-center gap-3 text-white/90 animate-fade-up">
            <span className="h-px w-10 bg-gold-soft" /> New Collection<span className="hidden sm:inline"> · Festive 2026</span>
          </p>
          <h1 className="mt-5 font-display text-[3.4rem] font-medium leading-[0.92] tracking-tight animate-fade-up [animation-delay:120ms] sm:text-7xl md:text-8xl lg:text-[7.5rem]">
            Your Style.
            <br />
            <em className="font-normal text-gold-soft">Your Statement.</em>
          </h1>
          <p className="mt-6 max-w-md text-base text-white/85 animate-fade-up [animation-delay:240ms] md:text-lg">
            Discover the latest fashion for Men &amp; Women at Fashion Hub.
          </p>
          <div className="mt-8 flex flex-col gap-3 animate-fade-up [animation-delay:360ms] sm:flex-row">
            <Link href="/men" className="btn btn-light min-w-48">
              Shop Men
            </Link>
            <Link href="/women" className="btn btn-outline-light min-w-48">
              Shop Women
            </Link>
          </div>
        </div>

        <div className="absolute bottom-6 right-4 flex items-center gap-4 md:bottom-10 md:right-12">
          <span className="hidden text-xs tabular-nums text-white/70 md:inline">
            0{index + 1} / 0{slides.length}
          </span>
          <div className="flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s.image}
                type="button"
                aria-label={`Show slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className="group relative h-6 w-8 md:w-12"
              >
                <span className="absolute inset-x-0 top-1/2 h-px bg-white/35" />
                <span className={`absolute left-0 top-1/2 h-px bg-white transition-all duration-700 ${i === index ? "w-full" : "w-0"}`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
