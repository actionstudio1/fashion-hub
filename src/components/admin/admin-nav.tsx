"use client";

import { ExternalLink, LayoutDashboard, LogOut, Package, Settings, ShoppingCart, Tags, TicketPercent } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions";

const ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/offers", label: "Offers", icon: TicketPercent },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNav() {
  return <AdminNavView pathname={usePathname()} />;
}

/** Rendered directly (without a pathname) as the Suspense fallback. */
export function AdminNavView({ pathname }: { pathname: string }) {
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  return (
    <aside className="sticky top-0 z-20 bg-ink text-cream md:h-dvh md:w-60 md:shrink-0">
      <div className="flex items-center justify-between px-4 py-3 md:block md:px-6 md:py-8">
        <Link href="/admin" className="font-display text-lg tracking-[0.28em]">
          FASHION<span className="text-gold">·</span>HUB
        </Link>
        <p className="eyebrow hidden text-cream/50 md:mt-1 md:block">Admin</p>
        <div className="flex items-center gap-1 md:hidden">
          <Link href="/" target="_blank" aria-label="View store" className="grid h-9 w-9 place-items-center">
            <ExternalLink className="h-4 w-4" />
          </Link>
          <form action={logout}>
            <button type="submit" aria-label="Log out" className="grid h-9 w-9 place-items-center">
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
      <nav className="no-scrollbar flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:px-3 md:pb-0">
        {ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex shrink-0 items-center gap-3 rounded px-3 py-2 text-sm transition ${active(href) ? "bg-cream text-ink" : "text-cream/75 hover:bg-white/10 hover:text-cream"}`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.6} /> {label}
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-6 left-3 right-3 hidden space-y-1 md:block">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded px-3 py-2 text-sm text-cream/75 hover:bg-white/10">
          <ExternalLink className="h-4 w-4" strokeWidth={1.6} /> View store
        </Link>
        <form action={logout}>
          <button type="submit" className="flex w-full items-center gap-3 rounded px-3 py-2 text-sm text-cream/75 hover:bg-white/10">
            <LogOut className="h-4 w-4" strokeWidth={1.6} /> Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
