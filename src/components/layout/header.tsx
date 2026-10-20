"use client";

import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/components/store/store-provider";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";
import { NAV, SITE } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";
import { Logo } from "./logo";

function CountBadge({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span className="absolute -right-1.5 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[0.6rem] font-medium leading-none text-white">
      {n > 99 ? "99+" : n}
    </span>
  );
}

export function Header() {
  const pathname = usePathname();
  const { cartCount, wishlist } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close overlays on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
  }, [menuOpen, searchOpen]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b transition-all duration-500 ${
          scrolled ? "border-line bg-cream/90 shadow-[0_1px_20px_rgba(0,0,0,0.04)] backdrop-blur-md" : "border-transparent bg-cream"
        }`}
      >
        <div className={`container-x flex items-center justify-between gap-4 transition-all duration-500 ${scrolled ? "h-14 md:h-16" : "h-16 md:h-20"}`}>
          <Logo compact={scrolled} />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-7 xl:gap-9">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`link-underline py-1 text-[0.72rem] font-medium uppercase tracking-[0.2em] ${
                      item.href === "/offers" ? "text-sale" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search" className="grid h-10 w-10 place-items-center">
              <Search className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} />
            </button>
            <Link href="/wishlist" aria-label="Wishlist" className="relative hidden h-10 w-10 place-items-center md:grid">
              <span className="relative">
                <Heart className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} />
                <CountBadge n={wishlist.length} />
              </span>
            </Link>
            <Link href="/cart" aria-label={`Cart, ${cartCount} items`} className="relative grid h-10 w-10 place-items-center">
              <span className="relative">
                <ShoppingBag className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} />
                <CountBadge n={cartCount} />
              </span>
            </Link>
            <a
              href={whatsappLink("Hello Fashion Hub, I would like to know more about your latest collection.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="ml-1 hidden h-9 items-center gap-2 rounded-full bg-whatsapp px-4 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-white transition hover:bg-[#178a45] md:inline-flex"
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span className="hidden xl:inline">WhatsApp</span>
            </a>
            <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" className="grid h-10 w-10 place-items-center lg:hidden">
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} isActive={isActive} wishlistCount={wishlist.length} />}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}

function MobileMenu({ onClose, isActive, wishlistCount }: { onClose: () => void; isActive: (h: string) => boolean; wishlistCount: number }) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <button type="button" aria-label="Close menu" onClick={onClose} className="absolute inset-0 bg-ink/40 animate-fade-in" />
      <div className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-cream animate-slide-in-right">
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <span className="eyebrow text-stone">Menu</span>
          <button type="button" onClick={onClose} aria-label="Close menu" className="grid h-10 w-10 place-items-center">
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-6">
          <ul className="space-y-1">
            {NAV.map((item, i) => (
              <li key={item.href} className="animate-fade-up" style={{ animationDelay: `${80 + i * 45}ms` }}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between border-b border-line/70 py-3.5 font-display text-[1.7rem] leading-none ${
                    isActive(item.href) ? "italic" : ""
                  } ${item.href === "/offers" ? "text-sale" : ""}`}
                >
                  {item.label}
                  <span className="text-xs text-stone">→</span>
                </Link>
              </li>
            ))}
            <li>
              <Link href="/wishlist" onClick={onClose} className="flex items-center gap-3 py-4 text-sm uppercase tracking-[0.18em]">
                <Heart className="h-4 w-4" strokeWidth={1.5} /> Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="space-y-3 border-t border-line p-5">
          <a href={whatsappLink("Hello Fashion Hub!")} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full">
            <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
          </a>
          <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-outline w-full">
            <InstagramIcon className="h-4 w-4" /> {SITE.instagramHandle}
          </a>
        </div>
      </div>
    </div>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const suggestions = ["Kurtis", "Sarees", "Jeans", "Shirts", "Party Wear", "Blazers", "Dresses"];

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Search">
      <button type="button" aria-label="Close search" onClick={onClose} className="absolute inset-0 bg-ink/40 animate-fade-in" />
      <div className="relative bg-cream pb-8 pt-4 animate-fade-in md:pt-8">
        <div className="container-x">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const q = inputRef.current?.value.trim();
              if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
            }}
            className="flex items-center gap-3 border-b border-ink pb-3"
          >
            <Search className="h-5 w-5 shrink-0" strokeWidth={1.5} />
            <input
              ref={inputRef}
              type="search"
              name="q"
              placeholder="Search kurtis, jeans, sarees…"
              className="w-full bg-transparent font-display text-2xl outline-none placeholder:text-stone/60 md:text-4xl"
              enterKeyHint="search"
            />
            <button type="button" onClick={onClose} aria-label="Close search" className="grid h-10 w-10 shrink-0 place-items-center">
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </form>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="eyebrow mr-2 text-stone">Popular</span>
            {suggestions.map((s) => (
              <Link key={s} href={`/search?q=${encodeURIComponent(s)}`} onClick={onClose} className="rounded-full border border-line px-4 py-1.5 text-sm transition hover:border-ink">
                {s}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
