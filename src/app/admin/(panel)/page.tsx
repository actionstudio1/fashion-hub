import Link from "next/link";
import { AdminHeader, Card, StatusPill } from "@/components/admin/ui";
import { readDbAsAdmin } from "@/lib/auth";
import { formatDate, formatINR, todayIST } from "@/lib/format";
import { isOfferLive } from "@/lib/pricing";

export default async function AdminDashboard() {
  const db = await readDbAsAdmin();
  const today = todayIST();
  const active = db.products.filter((p) => p.active);
  const stats = [
    { label: "Active products", value: active.length, href: "/admin/products" },
    { label: "Out of stock", value: active.filter((p) => p.stock <= 0).length, href: "/admin/products?filter=out" },
    { label: "New orders", value: db.orders.filter((o) => o.status === "new").length, href: "/admin/orders" },
    { label: "Live offers", value: db.offers.filter((o) => isOfferLive(o, today)).length, href: "/admin/offers" },
  ];
  const revenue = db.orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const lowStock = active.filter((p) => p.stock > 0 && p.stock <= 5);

  return (
    <>
      <AdminHeader title="Dashboard" subtitle={`Order value to date: ${formatINR(revenue)}`} action={{ label: "+ Add product", href: "/admin/products/new" }} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="transition hover:shadow-md">
              <p className="text-xs uppercase tracking-[0.14em] text-stone">{s.label}</p>
              <p className="mt-2 font-display text-4xl">{s.value}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl">Recent orders</h2>
            <Link href="/admin/orders" className="text-xs uppercase tracking-[0.14em] underline">All orders</Link>
          </div>
          {db.orders.length === 0 ? (
            <p className="text-sm text-stone">No website orders yet. Orders placed through checkout appear here; WhatsApp orders arrive in your WhatsApp chat.</p>
          ) : (
            <ul className="divide-y divide-line text-sm">
              {db.orders.slice(0, 6).map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-medium">#{o.id} · {o.customer.name}</p>
                    <p className="text-xs text-stone">{formatDate(o.createdAt)} · {o.items.length} items</p>
                  </div>
                  <div className="text-right">
                    <p>{formatINR(o.total)}</p>
                    <StatusPill tone={o.status === "new" ? "gold" : o.status === "cancelled" ? "red" : o.status === "delivered" ? "green" : "blue"}>{o.status}</StatusPill>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <h2 className="mb-4 font-display text-2xl">Low stock</h2>
          {lowStock.length === 0 ? (
            <p className="text-sm text-stone">All good — nothing running low.</p>
          ) : (
            <ul className="divide-y divide-line text-sm">
              {lowStock.map((p) => (
                <li key={p.id} className="flex justify-between py-2.5">
                  <Link href={`/admin/products/${p.id}`} className="hover:underline">{p.name}</Link>
                  <span className="text-amber-700">{p.stock} left</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
