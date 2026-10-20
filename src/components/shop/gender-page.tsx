import Link from "next/link";
import { CatalogBrowser } from "@/components/product/catalog-browser";
import { Photo } from "@/components/ui/photo";
import { ProductRail, SectionHeading } from "@/components/ui/section";
import { getGenderCategories, getLiveOffers, getProducts } from "@/lib/data";
import type { Gender } from "@/lib/types";

const COPY: Record<Gender, { title: string; tagline: string; image: string; position: string }> = {
  men: {
    title: "Men",
    tagline: "Everyday essentials to statement styles — shirts, denim, blazers and festive kurtas.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=2000&q=80",
    position: "center 25%",
  },
  women: {
    title: "Women",
    tagline: "Discover your next favourite look — kurtis, sarees, dresses and party wear.",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=2000&q=80",
    position: "center 20%",
  },
};

export async function GenderPage({ gender }: { gender: Gender }) {
  const [products, categories, offers] = await Promise.all([
    getProducts((p) => p.gender === gender),
    getGenderCategories(gender),
    getLiveOffers(),
  ]);
  const copy = COPY[gender];
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 8);
  const trending = products.filter((p) => p.isTrending).slice(0, 8);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);
  const onOffer = products.filter((p) => p.isOnOffer).slice(0, 8);

  return (
    <>
      <section className="relative h-[62svh] min-h-[420px] overflow-hidden bg-ink text-white md:h-[72svh]">
        <Photo src={copy.image} alt={`${copy.title}'s collection at Fashion Hub`} fill priority sizes="100vw" className="animate-kenburns" style={{ objectPosition: copy.position }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="container-x relative flex h-full flex-col justify-end pb-12 md:pb-16">
          <nav aria-label="Breadcrumb" className="eyebrow text-white/70">
            <Link href="/" className="hover:text-white">
              Home
            </Link>{" "}
            / {copy.title}
          </nav>
          <h1 className="mt-3 font-display text-7xl leading-none animate-fade-up md:text-[9rem]">{copy.title}</h1>
          <p className="mt-4 max-w-lg text-white/85 animate-fade-up [animation-delay:150ms]">{copy.tagline}</p>
          <div className="mt-6 flex gap-3 animate-fade-up [animation-delay:250ms]">
            <a href="#shop" className="btn btn-light">
              Shop all
            </a>
            <Link href="/offers" className="btn btn-outline-light">
              Offers
            </Link>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="container-x py-14 md:py-20">
          <SectionHeading eyebrow="Explore" title="Categories" />
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:px-0 lg:grid-cols-5">
            {categories.map((c) => (
              <a key={c.id} href={`?category=${c.slug}#shop`} className="group w-[38%] shrink-0 md:w-auto">
                <div className="relative aspect-[3/4] overflow-hidden bg-sand">
                  <Photo src={c.image} alt={c.name} fill sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, 38vw" className="transition duration-1000 group-hover:scale-105" />
                </div>
                <p className="mt-3 font-display text-xl md:text-2xl">{c.name}</p>
                <p className="text-xs text-stone">
                  {c.count} {c.count === 1 ? "style" : "styles"}
                </p>
              </a>
            ))}
          </div>
        </section>
      )}

      {newArrivals.length > 0 && (
        <section className="container-x pb-16 md:pb-24">
          <SectionHeading eyebrow="Just in" title="New Arrivals" href="/new-arrivals" />
          <ProductRail products={newArrivals} />
        </section>
      )}

      {trending.length > 0 && (
        <section className="container-x pb-16 md:pb-24">
          <SectionHeading eyebrow="Hot right now" title="Trending" href="/trending" />
          <ProductRail products={trending} />
        </section>
      )}

      {bestSellers.length > 0 && (
        <section className="container-x pb-16 md:pb-24">
          <SectionHeading eyebrow="Most loved" title="Best Sellers" />
          <ProductRail products={bestSellers} />
        </section>
      )}

      {(onOffer.length > 0 || offers.length > 0) && (
        <section className="bg-sand/60 py-16 md:py-24">
          <div className="container-x">
            <SectionHeading eyebrow="Special prices" title="Offers" href="/offers" linkLabel="All offers" />
            {offers.length > 0 && (
              <div className="no-scrollbar -mx-4 mb-10 flex gap-3 overflow-x-auto px-4 md:mx-0 md:px-0">
                {offers.map((o) => (
                  <Link key={o.id} href="/offers" className="flex min-w-[260px] flex-1 items-center justify-between gap-4 border border-dashed border-gold bg-cream px-5 py-4">
                    <div>
                      <p className="font-display text-xl">{o.title}</p>
                      <p className="text-xs text-stone">{o.discountType === "percent" ? `${o.discountValue}% off` : `₹${o.discountValue} off`} · min ₹{o.minOrder.toLocaleString("en-IN")}</p>
                    </div>
                    <span className="shrink-0 font-medium tracking-[0.12em] text-gold">{o.couponCode}</span>
                  </Link>
                ))}
              </div>
            )}
            {onOffer.length > 0 && <ProductRail products={onOffer} />}
          </div>
        </section>
      )}

      <section id="shop" className="container-x scroll-mt-28 py-16 md:py-24">
        <SectionHeading eyebrow={`${copy.title}'s collection`} title={`Shop all ${copy.title.toLowerCase()}`} />
        <CatalogBrowser products={products} categories={categories} />
      </section>
    </>
  );
}
