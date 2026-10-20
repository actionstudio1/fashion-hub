import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Gallery } from "@/components/product/gallery";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { RecentlyViewed } from "@/components/product/recently-viewed";
import { ProductRail, SectionHeading } from "@/components/ui/section";
import { getProductBySlug, getProducts, getRelated } from "@/lib/data";
import { SITE } from "@/lib/site";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const found = await getProductBySlug(slug);
  if (!found) return { title: "Product not found" };
  const { product } = found;
  return {
    title: product.name,
    description: `${product.name} by ${product.brand} — ₹${product.price}. ${product.description}`.slice(0, 160),
    openGraph: { images: [{ url: product.images[0] }], title: `${product.name} | Fashion Hub`, description: product.description },
  };
}

export default function ProductPage(props: PageProps<"/product/[slug]">) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductDetails params={props.params} />
    </Suspense>
  );
}

function ProductSkeleton() {
  return (
    <div className="container-x grid gap-10 py-8 md:grid-cols-[1.15fr_1fr] md:py-12">
      <div className="aspect-[3/4] animate-pulse bg-sand" />
      <div className="space-y-4">
        <div className="h-4 w-24 animate-pulse bg-sand" />
        <div className="h-10 w-3/4 animate-pulse bg-sand" />
        <div className="h-6 w-40 animate-pulse bg-sand" />
      </div>
    </div>
  );
}

async function ProductDetails({ params }: Pick<PageProps<"/product/[slug]">, "params">) {
  const { slug } = await params;
  const found = await getProductBySlug(slug);
  if (!found) notFound();
  const { product, category } = found;
  const { youMayAlsoLike, completeTheLook } = await getRelated(product);
  const genderLabel = product.gender === "men" ? "Men" : "Women";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${SITE.url}/product/${product.slug}`,
    },
  };

  const details = [
    { title: "Description", body: product.description },
    { title: "Fabric & material", body: product.fabric },
    { title: "Care instructions", body: product.care },
    { title: "Delivery & exchange", body: "Delivery across Nagpur in 1–3 days and across India in 4–7 days. Size exchanges are easy — message us on WhatsApp within 7 days with your order number." },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="container-x pt-4 md:pt-8">
        <nav aria-label="Breadcrumb" className="eyebrow mb-4 hidden text-stone md:block">
          <Link href="/" className="hover:text-ink">Home</Link> / <Link href={`/${product.gender}`} className="hover:text-ink">{genderLabel}</Link>
          {category && (
            <>
              {" "}/ <a href={`/${product.gender}?category=${category.slug}#shop`} className="hover:text-ink">{category.name}</a>
            </>
          )}{" "}
          / <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-8 pb-20 md:grid-cols-[1.15fr_1fr] md:gap-12 lg:gap-20 md:pb-28">
          <Gallery images={product.images} alt={product.name} />

          <div className="md:sticky md:top-24 md:self-start">
            <div className="flex flex-wrap gap-2">
              {product.isNewArrival && <span className="border border-ink px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.2em]">New</span>}
              {product.isTrending && <span className="bg-ink px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.2em] text-cream">Trending</span>}
              {product.isBestSeller && <span className="bg-gold px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.2em] text-white">Best seller</span>}
            </div>
            <p className="eyebrow mt-4 text-stone">{product.brand}</p>
            <h1 className="mt-2 font-display text-4xl leading-[1.05] md:text-5xl">{product.name}</h1>
            {category && <p className="mt-2 text-sm text-stone">{genderLabel} · {category.name}</p>}

            <div className="mt-6">
              <PurchasePanel product={product} />
            </div>

            <div className="mt-6 divide-y divide-line border-b border-line">
              {details.map((d, i) => (
                <details key={d.title} open={i === 0} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-medium uppercase tracking-[0.18em]">
                    {d.title}
                    <span className="text-lg font-light transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-stone">{d.body}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>

      {completeTheLook.length > 0 && (
        <section className="bg-sand/60 py-16 md:py-24">
          <div className="container-x">
            <SectionHeading eyebrow="Styled by Fashion Hub" title="Complete the Look" />
            <ProductRail products={completeTheLook} />
          </div>
        </section>
      )}

      {youMayAlsoLike.length > 0 && (
        <section className="container-x py-16 md:py-24">
          <SectionHeading eyebrow="More to love" title="You May Also Like" href={`/${product.gender}`} />
          <ProductRail products={youMayAlsoLike.slice(0, 4)} />
        </section>
      )}

      <RecentlyViewed current={product} />
      {/* Room for the sticky mobile buy bar */}
      <div className="h-20 md:hidden" />
    </>
  );
}
