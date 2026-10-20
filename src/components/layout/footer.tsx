import { Clock, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";
import { SITE } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "Men", href: "/men" },
      { label: "Women", href: "/women" },
      { label: "New Arrivals", href: "/new-arrivals" },
      { label: "Trending", href: "/trending" },
      { label: "Offers", href: "/offers" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact us", href: "/contact" },
      { label: "Your bag", href: "/cart" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Order on WhatsApp", href: whatsappLink("Hello Fashion Hub, I need help with an order.") },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-cream">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:py-20">
        <div>
          <p className="font-display text-3xl tracking-[0.3em]">
            FASHION<span className="text-gold">·</span>HUB
          </p>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/65">
            Binaki Mangalwari&apos;s destination for men&apos;s and women&apos;s fashion — from everyday essentials to statement
            festive looks.
          </p>
          <div className="mt-6 flex gap-3">
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-cream/25 transition hover:bg-cream hover:text-ink">
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid h-10 w-10 place-items-center rounded-full border border-cream/25 transition hover:bg-whatsapp hover:border-whatsapp">
              <WhatsAppIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="eyebrow text-gold-soft">{col.title}</p>
            <ul className="mt-5 space-y-3 text-sm text-cream/75">
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.href.startsWith("http") ? (
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-cream">
                      {l.label}
                    </a>
                  ) : (
                    <Link href={l.href} className="link-underline hover:text-cream">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="eyebrow text-gold-soft">Visit the store</p>
          <ul className="mt-5 space-y-4 text-sm text-cream/75">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" strokeWidth={1.5} />
              <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-cream">
                Fashion Hub, {SITE.address.full}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" strokeWidth={1.5} />
              <a href={`tel:+${SITE.whatsapp}`} className="hover:text-cream">
                {SITE.whatsappDisplay}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" strokeWidth={1.5} />
              {SITE.hours}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-cream/45 md:flex-row md:items-center md:justify-between">
          <p>© Fashion Hub, Nagpur. All rights reserved.</p>
          <p>Prices inclusive of all taxes · Secure ordering via WhatsApp & Cash on Delivery</p>
        </div>
      </div>
    </footer>
  );
}
