import type { Metadata } from "next";
import Link from "next/link";
import { toggleOffer } from "@/app/admin/actions";
import { AdminHeader, Card, StatusPill } from "@/components/admin/ui";
import { Photo } from "@/components/ui/photo";
import { readDbAsAdmin } from "@/lib/auth";
import { formatDate, formatINR, todayIST } from "@/lib/format";

export const metadata: Metadata = { title: "Offers" };

export default async function AdminOffers() {
  const db = await readDbAsAdmin({ orders: false });
  const today = todayIST();
  return (
    <>
      <AdminHeader title="Offers" subtitle="Create campaigns with coupon codes. Disabled or expired offers are hidden from the website." action={{ label: "+ Create offer", href: "/admin/offers/new" }} />
      <div className="grid gap-4 lg:grid-cols-2">
        {db.offers.map((o) => {
          const [tone, label] = !o.active
            ? (["grey", "Disabled"] as const)
            : today < o.validFrom
              ? (["blue", "Scheduled"] as const)
              : today > o.validTo
                ? (["red", "Expired"] as const)
                : (["green", "Live"] as const);
          return (
            <Card key={o.id} className="flex gap-4">
              <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-sand">{o.banner && <Photo src={o.banner} alt="" fill sizes="96px" />}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/admin/offers/${o.id}`} className="font-display text-2xl leading-tight hover:underline">
                    {o.title}
                  </Link>
                  <StatusPill tone={tone}>{label}</StatusPill>
                </div>
                <p className="mt-1 text-sm">
                  <span className="font-medium tracking-wider">{o.couponCode}</span> · {o.discountType === "percent" ? `${o.discountValue}%` : formatINR(o.discountValue)} off
                  {o.minOrder > 0 && ` · min ${formatINR(o.minOrder)}`}
                </p>
                <p className="text-xs text-stone">
                  {formatDate(o.validFrom)} – {formatDate(o.validTo)}
                </p>
                <div className="mt-3 flex gap-2">
                  <form action={toggleOffer.bind(null, o.id)}>
                    <button className="rounded-full border border-line px-3 py-1 text-xs hover:border-ink">{o.active ? "Disable" : "Enable"}</button>
                  </form>
                  <Link href={`/admin/offers/${o.id}`} className="rounded-full border border-line px-3 py-1 text-xs hover:border-ink">
                    Edit
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
        {db.offers.length === 0 && <p className="text-sm text-stone">No offers yet.</p>}
      </div>
    </>
  );
}
