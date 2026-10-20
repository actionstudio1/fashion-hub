import { Clock, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { PageIntro } from "@/components/shop/page-intro";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";
import { SITE } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact & Store Location",
  description: "Visit Fashion Hub at Jai Bhole Nagar, Mehandi Bag Road, Binaki Mangalwari, Nagpur, or order on WhatsApp at +91 84596 36574.",
};

const storeJsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: "Fashion Hub",
  telephone: "+918459636574",
  url: SITE.url,
  sameAs: [SITE.instagram],
  openingHours: "Mo-Su 10:00-22:00",
  address: { "@type": "PostalAddress", streetAddress: "Jai Bhole Nagar, Mehandi Bag Road, Binaki Mangalwari", addressLocality: "Nagpur", addressRegion: "Maharashtra", addressCountry: "IN" },
};

export default function ContactPage() {
  const cards = [
    { icon: WhatsAppIcon, title: "WhatsApp", text: SITE.whatsappDisplay, sub: "Fastest way to order & ask about stock", href: whatsappLink("Hello Fashion Hub!"), cta: "Chat now" },
    { icon: Phone, title: "Call us", text: SITE.whatsappDisplay, sub: SITE.hours, href: `tel:+${SITE.whatsapp}`, cta: "Call" },
    { icon: InstagramIcon, title: "Instagram", text: SITE.instagramHandle, sub: "7,500+ followers · New looks daily", href: SITE.instagram, cta: "Follow" },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }} />
      <PageIntro eyebrow="We'd love to see you" title="Contact" subtitle="Drop by the store at Mehandi Bag Road, Binaki Mangalwari, or message us — we usually reply within minutes." />
      <section className="container-x grid gap-3 pb-16 md:grid-cols-3 md:gap-5">
        {cards.map(({ icon: Icon, title, text, sub, href, cta }) => (
          <a key={title} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="group flex flex-col bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg md:p-8">
            <Icon className="h-6 w-6 text-gold" strokeWidth={1.4} />
            <p className="eyebrow mt-6 text-stone">{title}</p>
            <p className="mt-2 font-display text-3xl">{text}</p>
            <p className="mt-1 text-sm text-stone">{sub}</p>
            <span className="mt-6 text-xs uppercase tracking-[0.2em] underline-offset-4 group-hover:underline">{cta} →</span>
          </a>
        ))}
      </section>
      <section className="container-x grid gap-0 pb-20 md:grid-cols-[1fr_1.4fr] md:pb-28">
        <div className="bg-ink p-8 text-cream md:p-12">
          <p className="eyebrow text-gold-soft">Visit the store</p>
          <h2 className="mt-4 font-display text-4xl">Fashion Hub</h2>
          <ul className="mt-6 space-y-4 text-cream/80">
            <li className="flex gap-3">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold-soft" strokeWidth={1.5} /> {SITE.address.full}
            </li>
            <li className="flex gap-3">
              <Clock className="mt-1 h-4 w-4 shrink-0 text-gold-soft" strokeWidth={1.5} /> {SITE.hours}
            </li>
          </ul>
          <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-light mt-8">
            Get directions
          </a>
        </div>
        <iframe title="Fashion Hub location map — Binaki Mangalwari, Nagpur" src={SITE.mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-[360px] w-full border-0 grayscale-[30%] md:h-full md:min-h-[420px]" />
      </section>
    </>
  );
}
