"use client";

import { SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProductGrid } from "@/components/ui/section";
import { discountPercent } from "@/lib/format";
import type { Product } from "@/lib/types";

type Sort = "new" | "price-asc" | "price-desc" | "discount";
const SORTS: { value: Sort; label: string }[] = [
  { value: "new", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "discount", label: "Biggest discount" },
];

export function CatalogBrowser({
  products,
  categories,
  anchorId = "shop",
}: {
  products: Product[];
  categories: { id: string; slug: string; name: string; count: number }[];
  anchorId?: string;
}) {
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<Sort>("new");
  const [inStockOnly, setInStockOnly] = useState(false);

  // Deep links like /men?category=shirts#shop
  useEffect(() => {
    const onChange = () => {
      const slug = new URLSearchParams(window.location.search).get("category");
      setCategory(slug && categories.some((c) => c.slug === slug) ? slug : "all");
    };
    onChange();
    window.addEventListener("popstate", onChange);
    return () => window.removeEventListener("popstate", onChange);
  }, [categories]);

  function choose(slug: string) {
    setCategory(slug);
    const url = new URL(window.location.href);
    if (slug === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", slug);
    url.hash = anchorId;
    window.history.replaceState(null, "", url);
  }

  const visible = useMemo(() => {
    const cat = categories.find((c) => c.slug === category);
    let list = cat ? products.filter((p) => p.categoryId === cat.id) : products;
    if (inStockOnly) list = list.filter((p) => p.stock > 0);
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "discount") sorted.sort((a, b) => discountPercent(b.price, b.mrp) - discountPercent(a.price, a.mrp));
    return sorted;
  }, [products, categories, category, sort, inStockOnly]);

  return (
    <div>
      <div className="sticky top-14 z-20 -mx-4 mb-8 border-b border-line bg-cream/95 px-4 py-3 backdrop-blur md:top-16 md:mx-0 md:px-0">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {[{ slug: "all", name: "All", count: products.length }, ...categories].map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => choose(c.slug)}
              aria-pressed={category === c.slug}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.14em] transition ${
                category === c.slug ? "border-ink bg-ink text-cream" : "border-line bg-white hover:border-ink"
              }`}
            >
              {c.name} <span className="opacity-60">({c.count})</span>
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 text-sm">
          <p className="text-stone">
            {visible.length} {visible.length === 1 ? "style" : "styles"}
          </p>
          <div className="flex items-center gap-4">
            <label className="hidden cursor-pointer items-center gap-2 text-xs uppercase tracking-[0.14em] sm:flex">
              <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="accent-ink" />
              In stock
            </label>
            <label className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
              <span className="sr-only">Sort by</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="bg-transparent text-xs uppercase tracking-[0.14em] outline-none">
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>
      {visible.length ? <ProductGrid products={visible} priorityCount={0} /> : <p className="py-16 text-center text-stone">No styles match these filters right now.</p>}
    </div>
  );
}
