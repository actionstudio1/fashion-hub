"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/components/store/store-provider";
import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappLink } from "@/lib/whatsapp";

export function WhatsAppFloat() {
  const pathname = usePathname();
  // Product pages have their own sticky WhatsApp bar on mobile.
  const hideOnMobile = pathname.startsWith("/product/") || pathname === "/cart" || pathname === "/checkout";
  return (
    <a
      href={whatsappLink("Hello Fashion Hub, I would like to know more about your collection.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Fashion Hub on WhatsApp"
      className={`fixed bottom-5 right-5 z-30 h-14 w-14 place-items-center rounded-full bg-whatsapp text-white shadow-[0_10px_30px_rgba(31,168,85,0.4)] transition hover:scale-105 ${
        hideOnMobile ? "hidden md:grid" : "grid"
      }`}
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-whatsapp/40 [animation-duration:2.5s]" />
      <WhatsAppIcon className="relative h-7 w-7" />
    </a>
  );
}

export function Toasts() {
  const { toasts } = useStore();
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-20 z-[60] flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto flex w-full max-w-md items-center justify-between gap-4 bg-ink px-5 py-3.5 text-sm text-cream shadow-xl animate-fade-up">
          <span>{t.message}</span>
          {t.action && (
            <Link href={t.action.href} className="shrink-0 text-xs uppercase tracking-[0.18em] text-gold-soft underline-offset-4 hover:underline">
              {t.action.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
