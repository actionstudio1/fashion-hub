import type { Metadata } from "next";
import Link from "next/link";
import { Price } from "@/components/product/price";
import { Photo } from "@/components/ui/photo";
import { EmptyState, ProductGrid } from "@/components/ui/section";
import { getProducts } from "@/lib/data";
import type { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "Trending Now",
  description: "Styles everyone's talking about — the most-loved looks at Fashion Hub, Nagpur.",
};

function Feature({ product, index, reverse }: { product: Product; index: number; reverse: boolean }) {
  return (
    <article className={`grid items-center gap-8 md:grid-cols-12 md:gap-12 ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
      <Link href={`/product/${product.slug}`} className="group relative block aspect-[4/5] overflow-hidden bg-sand md:col-span-7">
        <Photo src={product.images[0]} alt={product.name} fill sizes="(min-width: 768px) 58vw, 100vw" className="transition duration-[1.4s] group-hover:scale-105" />
        <span className="absolute left-4 top-4 bg-cream px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.2em]">Trending #{index + 1}</span>
      </Link>
      <div className={`md:col-span-5 ${reverse ? "md:pr-6" : "md:pl-6"}`}>
        <p className="font-display text-[5rem] leading-none text-gold/30 md:text-[8rem]">{String(index + 1).padStart(2, "0")}</p>
        <p className="eyebrow -mt-2 text-stone">{product.brand}</p>
        <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">{product.name}</h2>
        <p className="mt-4 max-w-md text-stone">{product.description}</p>
        <div className="mt-5">
          <Price price={product.price} mrp={product.mrp} size="lg" />
        </div>
        <Link href={`/product/${product.slug}`} className="btn btn-dark mt-8">
          Shop the look
        </Link>
      </div>
    </article>
  );
}

export default async function TrendingPage() {
  const trending = await getProducts((p) => p.isTrending);
  const features = trending.slice(0, 3);
  const rest = trending.slice(3);

  return (
    <>
      <section className="relative overflow-hidden bg-ink py-20 text-center text-cream md:py-32">
        <p className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-[9rem] italic leading-none text-cream/[0.04] md:text-[20rem]" aria-hidden>
          Trending
        </p>
        <div className="container-x relative">
          <nav aria-label="Breadcrumb" className="eyebrow text-cream/60">
            <Link href="/" className="hover:text-cream">
              Home
            </Link>{" "}
            / Trending
          </nav>
          <h1 className="mt-8 font-display text-6xl leading-[0.9] animate-fade-up md:text-9xl">
            Trending <em className="text-gold-soft">Now</em>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-cream/75 animate-fade-up [animation-delay:150ms]">Styles everyone&apos;s talking about.</p>
        </div>
      </section>

      {trending.length === 0 ? (
        <EmptyState title="Fresh trends loading" text="Our team is picking this week's trending styles. Check back soon!" action={{ label: "See new arrivals", href: "/new-arrivals" }} />
      ) : (
        <div className="container-x space-y-20 py-16 md:space-y-32 md:py-28">
          {features.map((p, i) => (
            <Feature key={p.id} product={p} index={i} reverse={i % 2 === 1} />
          ))}
          {rest.length > 0 && (
            <section>
              <div className="mb-10 flex items-center gap-6">
                <h2 className="font-display text-4xl md:text-5xl">More trending styles</h2>
                <span className="h-px flex-1 bg-line" />
              </div>
              <ProductGrid products={rest} />
            </section>
          )}
        </div>
      )}
    </>
  );
}
