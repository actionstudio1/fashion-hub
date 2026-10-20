import { MapPin, MessageCircle, RefreshCw, Sparkles } from "lucide-react";
import Link from "next/link";
import { CategoryCards } from "@/components/home/category-cards";
import { Hero } from "@/components/home/hero";
import { InstagramSection } from "@/components/home/instagram";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Photo } from "@/components/ui/photo";
import { ProductRail, SectionHeading } from "@/components/ui/section";
import { getLiveOffers, getProducts } from "@/lib/data";
import { PHOTOS } from "@/lib/seed";
import { SITE } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

const MARQUEE = ["New Collection", "Men", "Women", "Festive Edit", "Party Wear", "Order on WhatsApp", "Binaki Mangalwari · Nagpur"];

export default async function HomePage() {
  const [newArrivals, trending, bestSellers, offers] = await Promise.all([
    getProducts((p) => p.isNewArrival),
    getProducts((p) => p.isTrending),
    getProducts((p) => p.isBestSeller),
    getLiveOffers(),
  ]);
  const featuredOffer = offers[0];

  return (
    <>
      <Hero
        slides={[
          { image: PHOTOS.sareeBridal, position: "center 25%", caption: "Festive saree look" },
          { image: PHOTOS.manSuit, position: "center 20%", caption: "Tailored menswear" },
          { image: PHOTOS.womanYellow, position: "center 30%", caption: "Bold co-ord set" },
        ]}
      />

      <div className="overflow-hidden border-b border-line bg-cream py-4" aria-hidden>
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i} className="flex items-center gap-10 font-display text-xl italic text-ink/80 md:text-2xl">
              {t} <span className="text-gold not-italic">✦</span>
            </span>
          ))}
        </div>
      </div>

      <section className="container-x py-20 md:py-28">
        <SectionHeading align="center" eyebrow="Curated for you" title="Shop by Category" subtitle="From everyday essentials to festive statements — find your next look." />
        <CategoryCards
          cards={[
            { title: "Men", description: "Everyday essentials to statement styles.", href: "/men", image: PHOTOS.manSuitBlue, position: "center 20%" },
            { title: "Women", description: "Discover your next favourite look.", href: "/women", image: PHOTOS.redDress, position: "center 20%" },
            { title: "New Arrivals", description: "Fresh drops, straight off the rack.", href: "/new-arrivals", image: PHOTOS.womanTeal },
            { title: "Trending", description: "Styles everyone's talking about.", href: "/trending", image: PHOTOS.manJacket },
            { title: "Offers", description: "Limited-time prices on favourites.", href: "/offers", image: PHOTOS.rack2 },
          ]}
        />
      </section>

      {newArrivals.length > 0 && (
        <section className="container-x pb-20 md:pb-28">
          <SectionHeading eyebrow="Just landed" title="New Arrivals" href="/new-arrivals" />
          <ProductRail products={newArrivals.slice(0, 8)} />
        </section>
      )}

      {featuredOffer && (
        <section className="bg-ink text-cream">
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[640px]">
              <Photo src={featuredOffer.banner} alt={featuredOffer.title} fill sizes="(min-width: 768px) 50vw, 100vw" />
            </div>
            <div className="flex flex-col justify-center px-6 py-16 md:px-16 lg:px-24">
              <p className="eyebrow text-gold-soft">Limited time offer</p>
              <h2 className="mt-4 font-display text-5xl leading-[0.95] md:text-7xl">{featuredOffer.title}</h2>
              <p className="mt-6 max-w-md text-cream/75">{featuredOffer.description}</p>
              <div className="mt-8 inline-flex w-fit items-center gap-4 border border-dashed border-gold-soft/60 px-5 py-3">
                <span className="eyebrow text-cream/60">Use code</span>
                <span className="font-display text-2xl tracking-[0.15em] text-gold-soft">{featuredOffer.couponCode}</span>
              </div>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href={featuredOffer.ctaHref} className="btn btn-light">
                  {featuredOffer.ctaLabel}
                </Link>
                <Link href="/offers" className="btn btn-outline-light">
                  All offers
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {trending.length > 0 && (
        <section className="container-x py-20 md:py-28">
          <SectionHeading eyebrow="Trending now" title={<>Styles everyone&apos;s <em>talking about</em></>} href="/trending" />
          <ProductRail products={trending.slice(0, 8)} />
        </section>
      )}

      <section className="container-x grid gap-3 md:grid-cols-2 md:gap-5">
        {[
          { title: "The Men's Edit", text: "Shirts, denim, blazers & kurtas", href: "/men", image: PHOTOS.manBlazer },
          { title: "The Women's Edit", text: "Kurtis, sarees, dresses & party wear", href: "/women", image: PHOTOS.anarkali },
        ].map((b) => (
          <Link key={b.href} href={b.href} className="group relative block aspect-[16/11] overflow-hidden text-white">
            <Photo src={b.image} alt={b.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="transition duration-[1.4s] group-hover:scale-105" style={{ objectPosition: "center 25%" }} />
            <div className="absolute inset-0 bg-black/30 transition group-hover:bg-black/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <h3 className="font-display text-4xl md:text-6xl">{b.title}</h3>
              <p className="mt-2 text-sm text-white/85">{b.text}</p>
              <span className="btn btn-outline-light mt-6 min-h-10">Explore</span>
            </div>
          </Link>
        ))}
      </section>

      {bestSellers.length > 0 && (
        <section className="container-x py-20 md:py-28">
          <SectionHeading eyebrow="Customer favourites" title="Best Sellers" href="/new-arrivals" linkLabel="Shop all" />
          <ProductRail products={bestSellers.slice(0, 8)} />
        </section>
      )}

      <section className="border-y border-line bg-sand/60">
        <div className="container-x grid grid-cols-2 gap-y-10 py-14 md:grid-cols-4 md:py-16">
          {[
            { icon: Sparkles, title: "Latest trends", text: "New styles every week" },
            { icon: WhatsAppIcon, title: "WhatsApp ordering", text: "Order in one message" },
            { icon: RefreshCw, title: "Easy exchange", text: "Hassle-free size swaps" },
            { icon: MapPin, title: "Visit in store", text: "Mehandi Bag Road, Nagpur" },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex flex-col items-center px-2 text-center">
              <Icon className="h-6 w-6 text-gold" strokeWidth={1.4} />
              <p className="mt-4 text-sm font-medium uppercase tracking-[0.14em]">{title}</p>
              <p className="mt-1 text-sm text-stone">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <InstagramSection images={[PHOTOS.womanSunglass, PHOTOS.manCasual2, PHOTOS.sareeRed, PHOTOS.manBlazerPink, PHOTOS.greenDress, PHOTOS.manCasual]} />

      <section className="container-x pb-20 md:pb-28">
        <div className="relative overflow-hidden bg-ink px-6 py-16 text-center text-cream md:py-24">
          <Photo src={PHOTOS.store} alt="" fill sizes="100vw" className="opacity-25" />
          <div className="relative mx-auto max-w-2xl">
            <MessageCircle className="mx-auto h-8 w-8 text-gold-soft" strokeWidth={1.2} />
            <h2 className="mt-5 font-display text-4xl leading-tight md:text-6xl">Saw it on Instagram? Order it on WhatsApp.</h2>
            <p className="mt-4 text-cream/75">Send us a screenshot or product link — we&apos;ll confirm size, colour and delivery in minutes.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a href={whatsappLink("Hello Fashion Hub, I saw a product on Instagram and want to order it.")} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                <WhatsAppIcon className="h-4 w-4" /> {SITE.whatsappDisplay}
              </a>
              <Link href="/contact" className="btn btn-outline-light">
                Visit the store
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
