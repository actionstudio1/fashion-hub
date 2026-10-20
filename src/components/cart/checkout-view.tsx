"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { placeOrder } from "@/app/actions";
import { useStore } from "@/components/store/store-provider";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Photo } from "@/components/ui/photo";
import { EmptyState } from "@/components/ui/section";
import { formatINR } from "@/lib/format";
import type { Order } from "@/lib/types";
import { cartOrderMessage, whatsappLink } from "@/lib/whatsapp";
import { CouponBox } from "./coupon-box";
import { OrderSummary } from "./order-summary";

const FIELDS: { name: keyof Order["customer"]; label: string; type?: string; autoComplete: string; inputMode?: "numeric" | "tel" | "email"; full?: boolean; optional?: boolean; textarea?: boolean }[] = [
  { name: "name", label: "Full name", autoComplete: "name" },
  { name: "phone", label: "Mobile number", type: "tel", autoComplete: "tel", inputMode: "tel" },
  { name: "email", label: "Email", type: "email", autoComplete: "email", inputMode: "email", optional: true, full: true },
  { name: "address", label: "Address (house no., street, area)", autoComplete: "street-address", full: true, textarea: true },
  { name: "city", label: "City", autoComplete: "address-level2" },
  { name: "pincode", label: "PIN code", autoComplete: "postal-code", inputMode: "numeric" },
  { name: "notes", label: "Order notes", autoComplete: "off", full: true, optional: true, textarea: true },
];

export function CheckoutView() {
  const { cart, coupon, totals, clearCart } = useStore();
  const [payment, setPayment] = useState<Order["paymentMethod"]>("cod");
  const [error, setError] = useState<{ message: string; field?: string } | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [pending, startTransition] = useTransition();

  if (order) return <OrderPlaced order={order} />;
  if (cart.length === 0) {
    return <EmptyState title="Nothing to check out" text="Your bag is empty. Add a few favourites first." action={{ label: "Shop new arrivals", href: "/new-arrivals" }} />;
  }

  function submit(form: FormData) {
    setError(null);
    const customer = Object.fromEntries(FIELDS.map((f) => [f.name, String(form.get(f.name) ?? "")])) as Order["customer"];
    startTransition(async () => {
      const res = await placeOrder({
        customer,
        paymentMethod: payment,
        couponCode: coupon && !totals.couponError ? coupon.code : "",
        items: cart.map((i) => ({ productId: i.productId, size: i.size, colour: i.colour, qty: i.qty })),
      });
      if (res.ok) {
        setOrder(res.order);
        clearCart();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError({ message: res.error, field: res.field });
        if (res.field) document.getElementsByName(res.field)[0]?.focus();
      }
    });
  }

  return (
    <form action={submit} className="grid gap-10 lg:grid-cols-[1fr_420px] lg:gap-16" noValidate>
      <div className="space-y-10">
        <fieldset>
          <legend className="font-display text-3xl">Delivery details</legend>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <div key={f.name} className={f.full ? "sm:col-span-2" : ""}>
                <label htmlFor={f.name} className="label">
                  {f.label} {f.optional && <span className="normal-case tracking-normal">(optional)</span>}
                </label>
                {f.textarea ? (
                  <textarea id={f.name} name={f.name} rows={f.name === "notes" ? 2 : 3} autoComplete={f.autoComplete} required={!f.optional} aria-invalid={error?.field === f.name} className={`field resize-none ${error?.field === f.name ? "!border-sale" : ""}`} />
                ) : (
                  <input
                    id={f.name}
                    name={f.name}
                    type={f.type ?? "text"}
                    inputMode={f.inputMode}
                    autoComplete={f.autoComplete}
                    required={!f.optional}
                    defaultValue={f.name === "city" ? "Nagpur" : undefined}
                    aria-invalid={error?.field === f.name}
                    className={`field ${error?.field === f.name ? "!border-sale" : ""}`}
                  />
                )}
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-display text-3xl">Payment</legend>
          <div className="mt-6 grid gap-3">
            {[
              { value: "cod" as const, title: "Cash on Delivery", text: "Pay in cash or UPI when your order arrives." },
              { value: "whatsapp" as const, title: "Pay via UPI on WhatsApp", text: "We'll confirm your order and share UPI payment details on WhatsApp." },
            ].map((opt) => (
              <label key={opt.value} className={`flex cursor-pointer gap-4 border p-4 transition ${payment === opt.value ? "border-ink bg-white" : "border-line"}`}>
                <input type="radio" name="payment" value={opt.value} checked={payment === opt.value} onChange={() => setPayment(opt.value)} className="mt-1 accent-ink" />
                <span>
                  <span className="block text-sm font-medium">{opt.title}</span>
                  <span className="block text-sm text-stone">{opt.text}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <aside className="h-fit space-y-6 bg-white p-5 md:p-8 lg:sticky lg:top-24">
        <h2 className="font-display text-3xl">Your order</h2>
        <ul className="space-y-4">
          {cart.map((i) => (
            <li key={i.key} className="flex gap-3">
              <div className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden bg-sand">
                <Photo src={i.image} alt={i.name} fill sizes="64px" />
                <span className="absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[0.6rem] text-cream">{i.qty}</span>
              </div>
              <div className="flex-1 text-sm">
                <p>{i.name}</p>
                <p className="text-xs text-stone">
                  {i.size} · {i.colour}
                </p>
              </div>
              <p className="text-sm">{formatINR(i.price * i.qty)}</p>
            </li>
          ))}
        </ul>
        <CouponBox />
        <OrderSummary />
        {error && (
          <p role="alert" className="border border-sale/40 bg-sale/5 px-4 py-3 text-sm text-sale">
            {error.message}
          </p>
        )}
        <button type="submit" disabled={pending} className="btn btn-dark w-full">
          {pending ? "Placing order…" : `Place order · ${formatINR(totals.total)}`}
        </button>
        <a href={whatsappLink(cartOrderMessage(cart, totals, coupon?.code))} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full">
          <WhatsAppIcon className="h-4 w-4" /> Order on WhatsApp instead
        </a>
      </aside>
    </form>
  );
}

function OrderPlaced({ order }: { order: Order }) {
  const message = cartOrderMessage(order.items, order, order.couponCode, order.id);
  return (
    <div className="mx-auto max-w-xl py-6 text-center">
      <CheckCircle2 className="mx-auto h-12 w-12 text-whatsapp" strokeWidth={1.2} />
      <h2 className="mt-5 font-display text-4xl md:text-5xl">Thank you, {order.customer.name.split(" ")[0]}!</h2>
      <p className="mt-3 text-stone">
        Your order <span className="font-medium text-ink">#{order.id}</span> has been placed. Tap below to send it to us on WhatsApp for the fastest confirmation.
      </p>
      <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp mt-8 w-full sm:w-auto">
        <WhatsAppIcon className="h-4 w-4" /> Confirm on WhatsApp
      </a>
      <div className="mt-10 bg-white p-6 text-left">
        <ul className="space-y-2 text-sm">
          {order.items.map((i, idx) => (
            <li key={idx} className="flex justify-between gap-4">
              <span>
                {i.name} <span className="text-stone">· {i.size} · {i.colour} × {i.qty}</span>
              </span>
              <span>{formatINR(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1 border-t border-line pt-4 text-sm">
          {order.discount > 0 && (
            <div className="flex justify-between text-whatsapp">
              <dt>Discount ({order.couponCode})</dt>
              <dd>− {formatINR(order.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-stone">Delivery</dt>
            <dd>{order.delivery ? formatINR(order.delivery) : "FREE"}</dd>
          </div>
          <div className="flex justify-between font-medium">
            <dt>Total ({order.paymentMethod === "cod" ? "Cash on Delivery" : "UPI via WhatsApp"})</dt>
            <dd>{formatINR(order.total)}</dd>
          </div>
        </dl>
      </div>
      <Link href="/" className="link-underline mt-8 inline-block text-xs uppercase tracking-[0.18em]">
        Continue shopping
      </Link>
    </div>
  );
}
