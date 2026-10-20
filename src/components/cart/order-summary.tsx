"use client";

import { useStore } from "@/components/store/store-provider";
import { formatINR } from "@/lib/format";

export function OrderSummary() {
  const { totals, coupon, settings } = useStore();
  const remaining = settings.freeDeliveryAbove - (totals.subtotal - totals.discount);
  return (
    <div className="space-y-4">
      {totals.subtotal > 0 && remaining > 0 && (
        <div>
          <p className="text-sm">
            Add <span className="font-medium">{formatINR(remaining)}</span> more for <span className="font-medium">FREE delivery</span>
          </p>
          <div className="mt-2 h-1 bg-line">
            <div className="h-full bg-gold transition-all" style={{ width: `${Math.min(100, ((totals.subtotal - totals.discount) / settings.freeDeliveryAbove) * 100)}%` }} />
          </div>
        </div>
      )}
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-stone">Subtotal</dt>
          <dd>{formatINR(totals.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-stone">Discount{coupon && !totals.couponError ? ` (${coupon.code})` : ""}</dt>
          <dd className={totals.discount ? "text-whatsapp" : ""}>{totals.discount ? `− ${formatINR(totals.discount)}` : formatINR(0)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-stone">Delivery charges</dt>
          <dd>{totals.delivery ? formatINR(totals.delivery) : <span className="text-whatsapp">FREE</span>}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-4 text-base font-medium">
          <dt>Total</dt>
          <dd>{formatINR(totals.total)}</dd>
        </div>
      </dl>
      <p className="text-xs text-stone">Inclusive of all taxes</p>
    </div>
  );
}
