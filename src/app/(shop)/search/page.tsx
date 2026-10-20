import type { Metadata } from "next";
import { Suspense } from "react";
import { EmptyState, ProductGrid } from "@/components/ui/section";
import { getCatalog } from "@/lib/data";

export const metadata: Metadata = { title: "Search", robots: { index: false } };

async function Results({ searchParams }: Pick<PageProps<"/search">, "searchParams">) {
  const raw = (await searchParams).q;
  const q = (Array.isArray(raw) ? raw[0] : raw)?.trim().slice(0, 80) ?? "";
  const { products, categories } = await getCatalog();
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean).map((t) => t.replace(/s$/, ""));
  const results = terms.length
    ? products.filter((p) => {
        const cat = categories.find((c) => c.id === p.categoryId);
        const hay = `${p.name} ${p.brand} ${p.gender} ${p.gender === "men" ? "man male" : "woman female ladies"} ${cat?.name ?? ""} ${p.fabric} ${p.colours.map((c) => c.name).join(" ")}`.toLowerCase();
        return terms.every((t) => hay.includes(t));
      })
    : [];

  return (
    <>
      <h1 className="font-display text-4xl md:text-6xl">{q ? <>Results for &ldquo;{q}&rdquo;</> : "Search"}</h1>
      <p className="mb-10 mt-3 text-stone">
        {q ? `${results.length} ${results.length === 1 ? "style" : "styles"} found` : "Use the search icon above to find styles."}
      </p>
      {q && results.length === 0 ? (
        <EmptyState title="No matches yet" text="Try another word like “kurti”, “jeans” or “saree” — or ask us on WhatsApp, we may have it in store." action={{ label: "See new arrivals", href: "/new-arrivals" }} />
      ) : (
        <ProductGrid products={results} />
      )}
    </>
  );
}

export default function SearchPage(props: PageProps<"/search">) {
  return (
    <div className="container-x py-10 md:py-16">
      <Suspense fallback={<p className="text-stone">Searching…</p>}>
        <Results searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
