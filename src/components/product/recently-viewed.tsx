"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useStore, type ProductSnapshot } from "@/components/store/store-provider";
import { Photo } from "@/components/ui/photo";
import type { Product } from "@/lib/types";
import { Price } from "./price";

export function SnapshotCard({ item }: { item: ProductSnapshot }) {
  return (
    <Link href={`/product/${item.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-sand">
        <Photo src={item.image} alt={item.name} fill sizes="(min-width: 768px) 20vw, 40vw" className="transition duration-700 group-hover:scale-105" />
      </div>
      <p className="eyebrow mt-3 !text-[0.6rem] text-stone">{item.brand}</p>
      <p className="mt-1 text-sm">{item.name}</p>
      <div className="mt-1">
        <Price price={item.price} mrp={item.mrp} />
      </div>
    </Link>
  );
}

/** Records the current product and lists the shopper's other recently viewed styles. */
export function RecentlyViewed({ current }: { current: Product }) {
  const { recent, pushRecent } = useStore();
  useEffect(() => {
    pushRecent(current);
  }, [current, pushRecent]);

  const items = recent.filter((r) => r.id !== current.id).slice(0, 6);
  if (items.length === 0) return null;

  return (
    <section className="container-x pb-20 md:pb-28">
      <div className="mb-8 flex items-center gap-6">
        <h2 className="font-display text-3xl md:text-4xl">Recently Viewed</h2>
        <span className="h-px flex-1 bg-line" />
      </div>
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-6 md:gap-5 md:px-0">
        {items.map((it) => (
          <div key={it.id} className="w-[38%] shrink-0 md:w-auto">
            <SnapshotCard item={it} />
          </div>
        ))}
      </div>
    </section>
  );
}
