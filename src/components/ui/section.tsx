import Link from "next/link";
import type { ReactNode } from "react";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/lib/types";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  href,
  linkLabel = "View all",
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
}) {
  if (align === "center") {
    return (
      <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
        {eyebrow && <p className="eyebrow text-gold">{eyebrow}</p>}
        <h2 className="mt-3 font-display text-4xl leading-[1.05] md:text-6xl">{title}</h2>
        {subtitle && <p className="mt-4 text-stone">{subtitle}</p>}
        {href && (
          <Link href={href} className="link-underline mt-5 inline-block text-xs uppercase tracking-[0.2em]">
            {linkLabel}
          </Link>
        )}
      </div>
    );
  }
  return (
    <div className="mb-8 flex items-end justify-between gap-6 md:mb-12">
      <div>
        {eyebrow && <p className="eyebrow text-gold">{eyebrow}</p>}
        <h2 className="mt-2 font-display text-[2.1rem] leading-[1.05] md:text-5xl">{title}</h2>
        {subtitle && <p className="mt-3 max-w-xl text-sm text-stone md:text-base">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="link-underline shrink-0 pb-1 text-[0.7rem] uppercase tracking-[0.2em]">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}

/** 2 columns on mobile, 4 on desktop. */
export function ProductGrid({ products, priorityCount = 0 }: { products: Product[]; priorityCount?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-9 md:gap-x-6 md:gap-y-12 lg:grid-cols-4">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < priorityCount} />
      ))}
    </div>
  );
}

/** Horizontally scrollable on mobile, grid on desktop. */
export function ProductRail({ products }: { products: Product[] }) {
  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0">
      {products.map((p) => (
        <div key={p.id} className="w-[46%] shrink-0 snap-start md:w-auto">
          <ProductCard product={p} sizes="(min-width: 768px) 25vw, 46vw" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: { label: string; href: string } }) {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <p className="font-display text-3xl">{title}</p>
      <p className="mt-3 text-stone">{text}</p>
      {action && (
        <Link href={action.href} className="btn btn-dark mt-8">
          {action.label}
        </Link>
      )}
    </div>
  );
}
