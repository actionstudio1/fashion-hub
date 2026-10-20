"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { deleteOffer, saveOffer } from "@/app/admin/actions";
import { todayIST } from "@/lib/format";
import type { Offer } from "@/lib/types";
import { Card } from "./ui";

export function OfferForm({ offer }: { offer?: Offer }) {
  const [state, action, pending] = useActionState(saveOffer, undefined);
  const today = todayIST();
  return (
    <div className="max-w-3xl">
      <Link href="/admin/offers" className="mb-4 inline-flex items-center gap-2 text-sm text-stone hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Offers
      </Link>
      <h1 className="mb-6 font-display text-4xl">{offer ? `Edit: ${offer.title}` : "Create offer"}</h1>
      <form action={action} className="space-y-5">
        <input type="hidden" name="id" value={offer?.id ?? ""} />
        <Card className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="label" htmlFor="title">Title *</label>
            <input id="title" name="title" required defaultValue={offer?.title} placeholder="Fashion Week Special" className="field" />
          </div>
          <div className="md:col-span-2">
            <label className="label" htmlFor="description">Description</label>
            <textarea id="description" name="description" rows={2} defaultValue={offer?.description} placeholder="Limited-time styles at special prices." className="field" />
          </div>
          <div>
            <label className="label" htmlFor="banner">Banner image URL</label>
            <input id="banner" name="banner" defaultValue={offer?.banner} placeholder="https://…" className="field" />
          </div>
          <div>
            <label className="label" htmlFor="upload">…or upload banner</label>
            <input id="upload" name="upload" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="block w-full text-sm" />
          </div>
          <div>
            <label className="label" htmlFor="validFrom">Valid from *</label>
            <input id="validFrom" name="validFrom" type="date" required defaultValue={offer?.validFrom ?? today} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="validTo">Valid until *</label>
            <input id="validTo" name="validTo" type="date" required defaultValue={offer?.validTo} className="field" />
          </div>
        </Card>

        <Card className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="col-span-2 md:col-span-1">
            <label className="label" htmlFor="couponCode">Coupon code *</label>
            <input id="couponCode" name="couponCode" required defaultValue={offer?.couponCode} placeholder="FHWEEK20" className="field uppercase" />
          </div>
          <div>
            <label className="label" htmlFor="discountType">Discount type</label>
            <select id="discountType" name="discountType" defaultValue={offer?.discountType ?? "percent"} className="field">
              <option value="percent">% off</option>
              <option value="flat">Flat ₹ off</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="discountValue">Discount *</label>
            <input id="discountValue" name="discountValue" type="number" min={1} required defaultValue={offer?.discountValue} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="minOrder">Min. order (₹)</label>
            <input id="minOrder" name="minOrder" type="number" min={0} defaultValue={offer?.minOrder ?? 0} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="maxDiscount">Max. discount (₹, 0 = none)</label>
            <input id="maxDiscount" name="maxDiscount" type="number" min={0} defaultValue={offer?.maxDiscount ?? 0} className="field" />
          </div>
        </Card>

        <Card className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="label" htmlFor="terms">Terms &amp; conditions (one per line)</label>
            <textarea id="terms" name="terms" rows={4} defaultValue={offer?.terms.join("\n")} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="ctaLabel">Button text</label>
            <input id="ctaLabel" name="ctaLabel" defaultValue={offer?.ctaLabel ?? "Shop now"} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="ctaHref">Button link</label>
            <select id="ctaHref" name="ctaHref" defaultValue={offer?.ctaHref ?? "/new-arrivals"} className="field">
              {["/men", "/women", "/new-arrivals", "/trending", "/offers", "/"].map((h) => (
                <option key={h} value={h}>{h === "/" ? "Home" : h}</option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="active" defaultChecked={offer?.active ?? true} className="h-4 w-4 accent-ink" /> Offer enabled
          </label>
        </Card>

        {state?.error && <p role="alert" className="rounded-sm bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}
        <button type="submit" disabled={pending} className="btn btn-dark">
          {pending ? "Saving…" : offer ? "Save offer" : "Create offer"}
        </button>
      </form>
      {offer && (
        <form action={deleteOffer.bind(null, offer.id)} onSubmit={(e) => !confirm("Delete this offer?") && e.preventDefault()} className="mt-10 border-t border-line pt-6">
          <button type="submit" className="text-sm text-red-700 underline">Delete this offer</button>
        </form>
      )}
    </div>
  );
}
