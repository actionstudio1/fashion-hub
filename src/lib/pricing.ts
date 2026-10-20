import type { DiscountType, Offer, Settings } from "./types";

/** The parts of an offer the cart needs to price a coupon. Safe to send to the browser. */
export type Coupon = {
  code: string;
  title: string;
  discountType: DiscountType;
  discountValue: number;
  minOrder: number;
  maxDiscount: number;
};

export function toCoupon(offer: Offer): Coupon {
  return {
    code: offer.couponCode,
    title: offer.title,
    discountType: offer.discountType,
    discountValue: offer.discountValue,
    minOrder: offer.minOrder,
    maxDiscount: offer.maxDiscount,
  };
}

export function isOfferLive(offer: Offer, today: string) {
  return offer.active && offer.validFrom <= today && today <= offer.validTo;
}

export function couponDiscount(coupon: Coupon | null, subtotal: number): { discount: number; error?: string } {
  if (!coupon) return { discount: 0 };
  if (subtotal < coupon.minOrder) {
    return { discount: 0, error: `Add items worth ₹${(coupon.minOrder - subtotal).toLocaleString("en-IN")} more to use ${coupon.code}.` };
  }
  let discount =
    coupon.discountType === "percent" ? Math.round((subtotal * coupon.discountValue) / 100) : coupon.discountValue;
  if (coupon.maxDiscount > 0) discount = Math.min(discount, coupon.maxDiscount);
  return { discount: Math.min(discount, subtotal) };
}

export function computeTotals(
  lines: { price: number; qty: number }[],
  coupon: Coupon | null,
  settings: Pick<Settings, "deliveryCharge" | "freeDeliveryAbove">,
) {
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const { discount, error } = couponDiscount(coupon, subtotal);
  const afterDiscount = subtotal - discount;
  const delivery = subtotal === 0 || afterDiscount >= settings.freeDeliveryAbove ? 0 : settings.deliveryCharge;
  return { subtotal, discount, delivery, total: afterDiscount + delivery, couponError: error };
}
