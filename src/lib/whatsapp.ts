import { formatINR } from "./format";
import { SITE } from "./site";

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${SITE.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function productOrderMessage(p: {
  name: string;
  price: number;
  size?: string;
  colour?: string;
  qty: number;
  url?: string;
}) {
  return [
    "Hello Fashion Hub,",
    "",
    "I am interested in this product:",
    "",
    `Product: ${p.name}`,
    `Price: ${formatINR(p.price)}`,
    `Size: ${p.size || "Not selected"}`,
    `Colour: ${p.colour || "Not selected"}`,
    `Quantity: ${p.qty}`,
    ...(p.url ? ["", `Link: ${p.url}`] : []),
    "",
    "Please confirm availability and ordering details.",
  ].join("\n");
}

export function cartOrderMessage(
  items: { name: string; price: number; size: string; colour: string; qty: number }[],
  totals: { subtotal: number; discount: number; delivery: number; total: number },
  couponCode?: string,
  orderId?: string,
) {
  const lines = items.map(
    (it, i) =>
      `${i + 1}. ${it.name}\n   Size: ${it.size} | Colour: ${it.colour} | Qty: ${it.qty} | ${formatINR(it.price * it.qty)}`,
  );
  return [
    "Hello Fashion Hub,",
    "",
    orderId ? `I have placed order #${orderId}:` : "I would like to order these products:",
    "",
    ...lines,
    "",
    `Subtotal: ${formatINR(totals.subtotal)}`,
    ...(totals.discount ? [`Discount${couponCode ? ` (${couponCode})` : ""}: -${formatINR(totals.discount)}`] : []),
    `Delivery: ${totals.delivery ? formatINR(totals.delivery) : "FREE"}`,
    `Total: ${formatINR(totals.total)}`,
    "",
    "Please confirm availability and ordering details.",
  ].join("\n");
}
