import { CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CopyCode } from "@/components/shop/copy-code";
import { PageIntro } from "@/components/shop/page-intro";
import { Photo } from "@/components/ui/photo";
import { EmptyState, ProductGrid, SectionHeading } from "@/components/ui/section";
import { getLiveOffers, getProducts } from "@/lib/data";
import { formatDate, formatINR } from "@/lib/format";

export const metadata: Metadata = {
  title: "Offers & Coupons",
  description: "Current offers, coupon codes and limited-time prices at Fashion Hub, Binaki Mangalwari, Nagpur.",
};

export default async function OffersPage() {
  const [offers, onOffer] = await Promise.all([getLiveOffers(), getProducts((p) => p.isOnOffer)]);

  return (
    <>
      <PageIntro eyebrow="Limited time" title="Offers" subtitle="Current campaigns and coupon codes. Apply a code in your bag — or mention it when you order on WhatsApp." />

      <section className="container-x space-y-6 pb-20 md:space-y-10 md:pb-28">
        {offers.length === 0 && <EmptyState title="New offers coming soon" text="Follow us on Instagram to be the first to know about our next sale." />}
        {offers.map((o, i) => (
          <article key={o.id} id={o.slug} className="grid scroll-mt-28 overflow-hidden bg-white md:grid-cols-2">
            <div className={`relative aspect-[16/11] md:aspect-auto md:min-h-[460px] ${i % 2 ? "md:order-2" : ""}`}>
              <Photo src={o.banner} alt={o.title} fill sizes="(min-width: 768px) 50vw, 100vw" />
              <span className="absolute left-4 top-4 bg-sale px-3 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-white">
                {o.discountType === "percent" ? `${o.discountValue}% off` : `${formatINR(o.discountValue)} off`}
              </span>
            </div>
            <div className="flex flex-col justify-center p-6 md:p-12">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-stone">
                <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.5} /> Valid {formatDate(o.validFrom)} – {formatDate(o.validTo)}
              </p>
              <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">{o.title}</h2>
              <p className="mt-3 text-stone">{o.description}</p>
              <div className="mt-6">
                <CopyCode code={o.couponCode} />
              </div>
              {o.terms.length > 0 && (
                <details className="group mt-6 border-t border-line pt-4">
                  <summary className="cursor-pointer list-none text-xs uppercase tracking-[0.16em] text-stone marker:hidden">
                    Terms &amp; conditions <span className="inline-block transition group-open:rotate-45">+</span>
                  </summary>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-stone">
                    {o.terms.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </details>
              )}
              <Link href={o.ctaHref || "/"} className="btn btn-dark mt-8 w-fit">
                {o.ctaLabel || "Shop now"}
              </Link>
            </div>
          </article>
        ))}
      </section>

      {onOffer.length > 0 && (
        <section className="container-x pb-20 md:pb-28">
          <SectionHeading eyebrow="Special prices" title="Styles on offer" />
          <ProductGrid products={onOffer} />
        </section>
      )}
    </>
  );
}
