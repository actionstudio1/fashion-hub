"use client";

import { useActionState } from "react";
import { saveSettings } from "@/app/admin/actions";
import type { Settings } from "@/lib/types";
import { Card } from "./ui";

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, action, pending] = useActionState(saveSettings, undefined);
  return (
    <form action={action} className="max-w-2xl space-y-5">
      <Card className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="deliveryCharge">Delivery charge (₹)</label>
          <input id="deliveryCharge" name="deliveryCharge" type="number" min={0} defaultValue={settings.deliveryCharge} className="field" />
        </div>
        <div>
          <label className="label" htmlFor="freeDeliveryAbove">Free delivery above (₹)</label>
          <input id="freeDeliveryAbove" name="freeDeliveryAbove" type="number" min={0} defaultValue={settings.freeDeliveryAbove} className="field" />
        </div>
        <div className="md:col-span-2">
          <label className="label" htmlFor="announcement">Announcement bar (use · to separate messages; leave empty to hide)</label>
          <input id="announcement" name="announcement" defaultValue={settings.announcement} className="field" />
        </div>
      </Card>
      {state?.error && <p className="text-sm text-red-700">{state.error}</p>}
      {state?.ok && <p className="text-sm text-emerald-700">{state.ok}</p>}
      <button type="submit" disabled={pending} className="btn btn-dark">
        {pending ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
