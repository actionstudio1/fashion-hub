"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore } from "@/components/store/store-provider";
import { Photo } from "@/components/ui/photo";
import { PurchasePanel } from "./purchase-panel";

export function QuickViewModal() {
  const { quickView: product, openQuickView } = useStore();
  const [active, setActive] = useState(0);
  const [shownId, setShownId] = useState<string | null>(null);
  if ((product?.id ?? null) !== shownId) {
    setShownId(product?.id ?? null);
    setActive(0);
  }

  useEffect(() => {
    if (!product) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && openQuickView(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [product, openQuickView]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[55] flex items-end justify-center md:items-center md:p-6" role="dialog" aria-modal="true" aria-label={`Quick view: ${product.name}`}>
      <button type="button" aria-label="Close quick view" onClick={() => openQuickView(null)} className="absolute inset-0 bg-ink/50 animate-fade-in" />
      <div className="relative grid max-h-[92dvh] w-full max-w-5xl overflow-y-auto bg-cream animate-fade-up md:grid-cols-2">
        <button type="button" onClick={() => openQuickView(null)} aria-label="Close" className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-cream/90">
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <div className="bg-sand">
          <div className="relative aspect-[4/5] md:aspect-[3/4]">
            <Photo src={product.images[active]} alt={product.name} fill sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 p-3">
              {product.images.map((src, i) => (
                <button key={src} type="button" onClick={() => setActive(i)} aria-label={`Image ${i + 1}`} className={`relative h-16 w-12 overflow-hidden border ${i === active ? "border-ink" : "border-transparent"}`}>
                  <Photo src={src} alt="" fill sizes="48px" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="p-5 md:p-8">
          <p className="eyebrow text-stone">{product.brand}</p>
          <h2 className="mt-2 font-display text-3xl leading-tight md:text-4xl">{product.name}</h2>
          <div className="mt-6">
            <PurchasePanel key={product.id} product={product} variant="quick" />
          </div>
          <Link href={`/product/${product.slug}`} onClick={() => openQuickView(null)} className="mt-6 inline-block text-xs uppercase tracking-[0.18em] underline underline-offset-4">
            View full details
          </Link>
        </div>
      </div>
    </div>
  );
}
