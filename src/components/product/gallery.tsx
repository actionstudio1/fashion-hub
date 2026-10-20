"use client";

import { useRef, useState } from "react";
import { Photo } from "@/components/ui/photo";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);

  function goTo(i: number) {
    setActive(i);
    const el = scroller.current;
    if (el) el.scrollTo({ left: el.clientWidth * i, behavior: "smooth" });
  }

  return (
    <div>
      {/* Mobile: swipe carousel */}
      <div className="relative md:hidden">
        <div
          ref={scroller}
          onScroll={(e) => setActive(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory overflow-x-auto"
        >
          {images.map((src, i) => (
            <div key={src} className="relative aspect-[4/5] w-full shrink-0 snap-center bg-sand">
              <Photo src={src} alt={`${alt} — image ${i + 1}`} fill priority={i === 0} sizes="100vw" />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {images.map((src, i) => (
              <button key={src} type="button" onClick={() => goTo(i)} aria-label={`Image ${i + 1}`} className={`h-1.5 rounded-full transition-all ${i === active ? "w-6 bg-ink" : "w-1.5 bg-ink/30"}`} />
            ))}
          </div>
        )}
      </div>

      {/* Desktop: thumbnails + main */}
      <div className="hidden gap-4 md:flex">
        {images.length > 1 && (
          <div className="flex w-20 shrink-0 flex-col gap-3">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1}`}
                className={`relative aspect-[3/4] overflow-hidden border transition ${i === active ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"}`}
              >
                <Photo src={src} alt="" fill sizes="80px" />
              </button>
            ))}
          </div>
        )}
        <div className="group relative aspect-[3/4] flex-1 overflow-hidden bg-sand">
          {images.map((src, i) => (
            <Photo
              key={src}
              src={src}
              alt={`${alt} — image ${i + 1}`}
              fill
              priority={i === 0}
              sizes="(min-width: 1280px) 45vw, 55vw"
              className={`transition duration-700 ${i === active ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
