"use client";

import { Tag, X } from "lucide-react";
import { useState, useTransition } from "react";
import { applyCoupon } from "@/app/actions";
import { useStore } from "@/components/store/store-provider";

export function CouponBox() {
  const { coupon, setCoupon, totals } = useStore();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  if (coupon) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between border border-dashed border-gold bg-gold/5 px-4 py-3">
          <span className="flex items-center gap-2 text-sm">
            <Tag className="h-4 w-4 text-gold" strokeWidth={1.5} />
            <span className="font-medium tracking-[0.1em]">{coupon.code}</span>
            <span className="text-stone">· {coupon.title}</span>
          </span>
          <button type="button" onClick={() => setCoupon(null)} aria-label="Remove coupon" className="grid h-8 w-8 place-items-center">
            <X className="h-4 w-4" />
          </button>
        </div>
        {totals.couponError && <p className="text-sm text-sale">{totals.couponError}</p>}
      </div>
    );
  }

  function apply() {
    if (!code.trim() || pending) return;
    setError("");
    startTransition(async () => {
      const res = await applyCoupon(code, totals.subtotal);
      if (res.ok) {
        setCoupon(res.coupon);
        setCode("");
      } else setError(res.error);
    });
  }

  // Not a <form>: on the checkout page this sits inside the checkout form.
  return (
    <div className="space-y-2">
      <label htmlFor="coupon" className="label">
        Coupon code
      </label>
      <div className="flex">
        <input
          id="coupon"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // don't submit the surrounding checkout form
              apply();
            }
          }}
          placeholder="e.g. FHWEEK20"
          className="field !border-r-0 uppercase"
          autoComplete="off"
          enterKeyHint="go"
        />
        <button type="button" onClick={apply} disabled={pending || !code.trim()} className="btn btn-dark !min-h-0 shrink-0 !px-5">
          {pending ? "…" : "Apply"}
        </button>
      </div>
      {error && <p className="text-sm text-sale">{error}</p>}
    </div>
  );
}
