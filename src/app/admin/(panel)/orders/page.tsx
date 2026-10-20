import type { Metadata } from "next";
import { setOrderStatus } from "@/app/admin/actions";
import { AdminHeader, Card, StatusPill } from "@/components/admin/ui";
import { WhatsAppIcon } from "@/components/ui/icons";
import { readDbAsAdmin } from "@/lib/auth";
import { formatDate, formatINR } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Orders" };

const STATUSES: OrderStatus[] = ["new", "confirmed", "shipped", "delivered", "cancelled"];
const TONE = { new: "gold", confirmed: "blue", shipped: "blue", delivered: "green", cancelled: "red" } as const;

export default async function AdminOrders() {
  const { orders } = await readDbAsAdmin();
  return (
    <>
      <AdminHeader title="Orders" subtitle="Orders placed through website checkout. Cancelling an order returns its items to stock." />
      {orders.length === 0 && (
        <Card>
          <p className="text-sm text-stone">No orders yet.</p>
        </Card>
      )}
      <div className="space-y-4">
        {orders.map((o) => {
          const phone = o.customer.phone.replace(/\D/g, "").slice(-10);
          const wa = `https://wa.me/91${phone}?text=${encodeURIComponent(`Hello ${o.customer.name}, thank you for your order #${o.id} at Fashion Hub!`)}`;
          return (
            <Card key={o.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    #{o.id} <StatusPill tone={TONE[o.status]}>{o.status}</StatusPill>
                  </p>
                  <p className="text-xs text-stone">
                    {formatDate(o.createdAt)} · {o.paymentMethod === "cod" ? "Cash on Delivery" : "UPI via WhatsApp"}
                  </p>
                </div>
                <p className="font-display text-2xl">{formatINR(o.total)}</p>
              </div>
              <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
                <div>
                  <p className="font-medium">{o.customer.name}</p>
                  <p className="text-stone">
                    {o.customer.phone}
                    {o.customer.email && ` · ${o.customer.email}`}
                  </p>
                  <p className="text-stone">
                    {o.customer.address}, {o.customer.city} – {o.customer.pincode}
                  </p>
                  {o.customer.notes && <p className="mt-1 italic text-stone">&ldquo;{o.customer.notes}&rdquo;</p>}
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-whatsapp hover:underline">
                    <WhatsAppIcon className="h-4 w-4" /> Message customer
                  </a>
                </div>
                <ul className="space-y-1">
                  {o.items.map((it, i) => (
                    <li key={i} className="flex justify-between gap-3">
                      <span>
                        {it.name}{" "}
                        <span className="text-stone">
                          · {it.size} · {it.colour} × {it.qty}
                        </span>
                      </span>
                      <span>{formatINR(it.price * it.qty)}</span>
                    </li>
                  ))}
                  <li className="flex justify-between border-t border-line pt-1 text-stone">
                    <span>
                      {o.discount > 0 ? `Discount ${o.couponCode} −${formatINR(o.discount)} · ` : ""}Delivery
                    </span>
                    <span>{o.delivery ? formatINR(o.delivery) : "Free"}</span>
                  </li>
                </ul>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-4">
                {STATUSES.map((s) => (
                  <form key={s} action={setOrderStatus.bind(null, o.id, s)}>
                    <button
                      disabled={o.status === s}
                      className={`rounded-full border px-3 py-1 text-xs capitalize ${o.status === s ? "border-ink bg-ink text-cream" : "border-line hover:border-ink"}`}
                    >
                      {s}
                    </button>
                  </form>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
