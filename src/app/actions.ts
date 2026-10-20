"use server";

import { randomBytes } from "node:crypto";
import { updateTag } from "next/cache";
import { CATALOG_TAG } from "@/lib/data";
import { mutateDb, readDb } from "@/lib/db";
import { todayIST } from "@/lib/format";
import { computeTotals, isOfferLive, toCoupon, type Coupon } from "@/lib/pricing";
import type { Order, OrderItem } from "@/lib/types";

export async function applyCoupon(code: string, subtotal: number): Promise<{ ok: true; coupon: Coupon } | { ok: false; error: string }> {
  const normalized = String(code ?? "").trim().toUpperCase();
  if (!normalized) return { ok: false, error: "Enter a coupon code." };
  const db = await readDb({ orders: false });
  const offer = db.offers.find((o) => o.couponCode.toUpperCase() === normalized);
  if (!offer || !isOfferLive(offer, todayIST())) return { ok: false, error: "This coupon is invalid or has expired." };
  if (subtotal < offer.minOrder) {
    return { ok: false, error: `${offer.couponCode} needs a minimum order of ₹${offer.minOrder.toLocaleString("en-IN")}.` };
  }
  return { ok: true, coupon: toCoupon(offer) };
}

export type CheckoutInput = {
  customer: Order["customer"];
  paymentMethod: Order["paymentMethod"];
  couponCode: string;
  items: { productId: string; size: string; colour: string; qty: number }[];
};

export type CheckoutResult = { ok: true; order: Order } | { ok: false; error: string; field?: string };

const clean = (v: unknown, max = 200) => String(v ?? "").trim().slice(0, max);

export async function placeOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const c = input?.customer ?? ({} as Order["customer"]);
  const customer: Order["customer"] = {
    name: clean(c.name, 80),
    phone: clean(c.phone, 20).replace(/[^\d+]/g, ""),
    email: clean(c.email, 120),
    address: clean(c.address, 400),
    city: clean(c.city, 60),
    pincode: clean(c.pincode, 10),
    notes: clean(c.notes, 500),
  };
  if (customer.name.length < 2) return { ok: false, error: "Please enter your full name.", field: "name" };
  if (!/^(\+?91)?[6-9]\d{9}$/.test(customer.phone)) return { ok: false, error: "Please enter a valid 10-digit mobile number.", field: "phone" };
  if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) return { ok: false, error: "Please enter a valid email.", field: "email" };
  if (customer.address.length < 8) return { ok: false, error: "Please enter your full delivery address.", field: "address" };
  if (customer.city.length < 2) return { ok: false, error: "Please enter your city.", field: "city" };
  if (!/^\d{6}$/.test(customer.pincode)) return { ok: false, error: "Please enter a valid 6-digit PIN code.", field: "pincode" };
  const paymentMethod = input.paymentMethod === "whatsapp" ? "whatsapp" : "cod";
  if (!Array.isArray(input.items) || input.items.length === 0 || input.items.length > 50) return { ok: false, error: "Your bag is empty." };

  try {
    const order = await mutateDb((db) => {
      const items: OrderItem[] = [];
      for (const line of input.items) {
        const product = db.products.find((p) => p.id === line.productId && p.active);
        if (!product) throw new Error("One of the items in your bag is no longer available.");
        const qty = Math.floor(Number(line.qty));
        if (!(qty >= 1 && qty <= 10)) throw new Error(`Invalid quantity for ${product.name}.`);
        if (!product.sizes.includes(line.size)) throw new Error(`Please choose a valid size for ${product.name}.`);
        if (product.colours.length && !product.colours.some((col) => col.name === line.colour)) {
          throw new Error(`Please choose a valid colour for ${product.name}.`);
        }
        const alreadyOrdered = items.filter((i) => i.productId === product.id).reduce((n, i) => n + i.qty, 0);
        if (product.stock < alreadyOrdered + qty) {
          throw new Error(product.stock > 0 ? `Only ${product.stock} left of ${product.name}.` : `${product.name} just sold out.`);
        }
        items.push({ productId: product.id, slug: product.slug, name: product.name, image: product.images[0], price: product.price, size: line.size, colour: line.colour, qty });
      }

      let coupon: Coupon | null = null;
      const code = clean(input.couponCode, 40).toUpperCase();
      if (code) {
        const offer = db.offers.find((o) => o.couponCode.toUpperCase() === code);
        if (offer && isOfferLive(offer, todayIST())) coupon = toCoupon(offer);
      }
      const totals = computeTotals(items, coupon, db.settings);

      for (const it of items) {
        const product = db.products.find((p) => p.id === it.productId)!;
        product.stock -= it.qty;
      }

      const order: Order = {
        id: `FH${todayIST().slice(2).replace(/-/g, "")}-${randomBytes(3).toString("hex").toUpperCase()}`,
        createdAt: new Date().toISOString(),
        status: "new",
        customer,
        paymentMethod,
        items,
        couponCode: totals.couponError ? "" : (coupon?.code ?? ""),
        subtotal: totals.subtotal,
        discount: totals.discount,
        delivery: totals.delivery,
        total: totals.total,
      };
      db.orders.unshift(order);
      return order;
    });
    updateTag(CATALOG_TAG); // stock changed
    return { ok: true, order };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Something went wrong. Please try again." };
  }
}
