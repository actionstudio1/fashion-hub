import Link from "next/link";

export function Logo({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
    <Link href="/" aria-label="Fashion Hub — home" className={`group inline-flex flex-col leading-none ${light ? "text-cream" : "text-ink"}`}>
      <span
        className={`whitespace-nowrap font-display font-semibold tracking-[0.2em] transition-all duration-500 md:tracking-[0.32em] ${compact ? "text-lg md:text-[1.4rem]" : "text-[1.2rem] md:text-[1.7rem]"}`}
      >
        FASHION<span className="text-gold">·</span>HUB
      </span>
      <span
        className={`eyebrow mt-1 whitespace-nowrap !text-[0.5rem] !tracking-[0.36em] md:!text-[0.55rem] md:!tracking-[0.5em] text-stone transition-all duration-500 ${compact ? "h-0 opacity-0 md:h-auto md:opacity-100" : ""}`}
      >
        Mangalwari · Nagpur
      </span>
    </Link>
  );
}
