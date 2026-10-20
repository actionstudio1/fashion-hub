"use client";

import { Trash2 } from "lucide-react";
import Link from "next/link";
import { QtyStepper } from "@/components/product/selectors";
import { useStore } from "@/components/store/store-provider";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Photo } from "@/components/ui/photo";
import { EmptyState } from "@/components/ui/section";
import { formatINR } from "@/lib/format";
import { cartOrderMessage, whatsappLink } from "@/lib/whatsapp";
import { CouponBox } from "./coupon-box";
import { OrderSummary } from "./order-summary";

export function CartView() {
  const { cart, cartCount, updateItem, removeItem, totals, coupon } = useStore();

  if (cart.length === 0) {
    return <EmptyState title="Your bag is empty" text="Looks like you haven't added anything yet. Let's find your next statement look." action={{ label: "Start shopping", href: "/new-arrivals" }} />;
  }

  const waMessage = cartOrderMessage(cart, totals, totals.couponError ? undefined : coupon?.code);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-16">
      <div>
        <p className="mb-4 text-sm text-stone">
          {cartCount} {cartCount === 1 ? "item" : "items"}
        </p>
        <ul className="divide-y divide-line border-y border-line">
          {cart.map((item) => (
            <li key={item.key} className="flex gap-4 py-5 md:gap-6">
              <Link href={`/product/${item.slug}`} className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden bg-sand md:w-32">
                <Photo src={item.image} alt={item.name} fill sizes="128px" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <div className="min-w-0">
                    <p className="eyebrow !text-[0.6rem] text-stone">{item.brand}</p>
                    <Link href={`/product/${item.slug}`} className="mt-1 block text-sm hover:underline md:text-base">
                      {item.name}
                    </Link>
                  </div>
                  <p className="shrink-0 text-sm font-medium md:text-base">{formatINR(item.price * item.qty)}</p>
                </div>
                <p className="mt-1 text-xs text-stone">
                  {formatINR(item.price)} each
                  {item.mrp > item.price && <span className="ml-2 line-through">{formatINR(item.mrp)}</span>}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <label className="sr-only" htmlFor={`size-${item.key}`}>Size</label>
                  <select
                    id={`size-${item.key}`}
                    value={item.size}
                    onChange={(e) => updateItem(item.key, { size: e.target.value })}
                    className="h-9 border border-line bg-white px-2 text-xs"
                  >
                    {item.sizes.map((s) => (
                      <option key={s} value={s}>Size: {s}</option>
                    ))}
                  </select>
                  {item.colours.length > 0 && (
                    <>
                      <label className="sr-only" htmlFor={`colour-${item.key}`}>Colour</label>
                      <select
                        id={`colour-${item.key}`}
                        value={item.colour}
                        onChange={(e) => updateItem(item.key, { colour: e.target.value })}
                        className="h-9 border border-line bg-white px-2 text-xs"
                      >
                        {item.colours.map((c) => (
                          <option key={c.name} value={c.name}>Colour: {c.name}</option>
                        ))}
                      </select>
                    </>
                  )}
                </div>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <QtyStepper small value={item.qty} onChange={(qty) => updateItem(item.key, { qty })} max={Math.min(10, item.stock || 10)} />
                  <button type="button" onClick={() => removeItem(item.key)} className="flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-stone hover:text-sale">
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <Link href="/new-arrivals" className="link-underline mt-6 inline-block text-xs uppercase tracking-[0.18em]">
          ← Continue shopping
        </Link>
      </div>

      <aside className="h-fit space-y-6 bg-white p-5 md:p-8 lg:sticky lg:top-24">
        <h2 className="font-display text-3xl">Order summary</h2>
        <CouponBox />
        <OrderSummary />
        <div className="space-y-3">
          <Link href="/checkout" className="btn btn-dark w-full">
            Checkout
          </Link>
          <a href={whatsappLink(waMessage)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full">
            <WhatsAppIcon className="h-4 w-4" /> Order on WhatsApp
          </a>
        </div>
        <p className="text-center text-xs text-stone">Cash on Delivery available · Easy size exchange</p>
      </aside>
    </div>
  );
}
