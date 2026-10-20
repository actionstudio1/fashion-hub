"use client";

import { Ruler, X } from "lucide-react";
import { useState } from "react";
import type { Gender } from "@/lib/types";

const GUIDES: Record<Gender, { head: string[]; rows: string[][]; note: string }> = {
  men: {
    head: ["Size", "Chest (in)", "Waist (in)", "Shoulder (in)"],
    rows: [
      ["S", "36–38", "28–30", "16.5"],
      ["M", "38–40", "30–32", "17"],
      ["L", "40–42", "32–34", "18"],
      ["XL", "42–44", "34–36", "18.5"],
      ["XXL", "44–46", "36–38", "19.5"],
    ],
    note: "Jeans & trousers are sized by waist in inches (28–36).",
  },
  women: {
    head: ["Size", "Bust (in)", "Waist (in)", "Hip (in)"],
    rows: [
      ["XS", "30–32", "24–26", "34–36"],
      ["S", "32–34", "26–28", "36–38"],
      ["M", "34–36", "28–30", "38–40"],
      ["L", "36–38", "30–32", "40–42"],
      ["XL", "38–40", "32–34", "42–44"],
    ],
    note: "Sarees are free size with a 0.8 m unstitched blouse piece.",
  },
};

export function SizeGuide({ gender }: { gender: Gender }) {
  const [open, setOpen] = useState(false);
  const g = GUIDES[gender];
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-stone underline underline-offset-4 hover:text-ink">
        <Ruler className="h-3.5 w-3.5" strokeWidth={1.5} /> Size guide
      </button>
      {open && (
        <div className="fixed inset-0 z-[70] grid place-items-end md:place-items-center" role="dialog" aria-modal="true" aria-label="Size guide">
          <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="absolute inset-0 bg-ink/50 animate-fade-in" />
          <div className="relative w-full max-w-lg bg-cream p-6 animate-fade-up md:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-3xl">Size guide · {gender === "men" ? "Men" : "Women"}</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="grid h-10 w-10 place-items-center">
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <table className="mt-6 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink">
                  {g.head.map((h) => (
                    <th key={h} className="py-2.5 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {g.rows.map((r) => (
                  <tr key={r[0]} className="border-b border-line">
                    {r.map((c, i) => (
                      <td key={i} className={`py-2.5 ${i === 0 ? "font-medium" : "text-stone"}`}>
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-xs text-stone">{g.note} Between sizes? Message us on WhatsApp and we&apos;ll help you pick.</p>
          </div>
        </div>
      )}
    </>
  );
}
