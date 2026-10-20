import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/product/catalog-browser";
import { PageIntro } from "@/components/shop/page-intro";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "The latest styles for men and women, just landed at Fashion Hub, Nagpur.",
};

export default async function NewArrivalsPage() {
  const fresh = await getProducts((p) => p.isNewArrival);
  // Group filter chips by gender so "Jeans" for men and women stay distinct.
  const chips = [
    { id: "g-men", slug: "men", name: "Men", count: fresh.filter((p) => p.gender === "men").length },
    { id: "g-women", slug: "women", name: "Women", count: fresh.filter((p) => p.gender === "women").length },
  ].filter((c) => c.count > 0);
  const byGender = fresh.map((p) => ({ ...p, categoryId: `g-${p.gender}` }));

  return (
    <>
      <PageIntro eyebrow="Just landed" title="New Arrivals" subtitle="Fresh drops for men and women — updated every week. Be the first to wear them." />
      <section className="container-x pb-20 md:pb-28">
        <CatalogBrowser products={byGender} categories={chips} />
      </section>
    </>
  );
}
