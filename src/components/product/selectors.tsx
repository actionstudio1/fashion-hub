"use client";

import { Minus, Plus } from "lucide-react";
import type { Colour } from "@/lib/types";

export function SizePicker({
  sizes,
  value,
  onChange,
  error,
}: {
  sizes: string[];
  value: string;
  onChange: (s: string) => void;
  error?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label="Size" className="flex flex-wrap gap-2">
      {sizes.map((s) => (
        <button
          key={s}
          type="button"
          role="radio"
          aria-checked={value === s}
          onClick={() => onChange(s)}
          className={`h-11 min-w-12 border px-3 text-sm transition ${
            value === s ? "border-ink bg-ink text-cream" : `${error ? "border-sale/60" : "border-line"} bg-white hover:border-ink`
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

export function ColourPicker({ colours, value, onChange }: { colours: Colour[]; value: string; onChange: (c: string) => void }) {
  return (
    <div role="radiogroup" aria-label="Colour" className="flex flex-wrap gap-3">
      {colours.map((c) => (
        <button
          key={c.name}
          type="button"
          role="radio"
          aria-checked={value === c.name}
          aria-label={c.name}
          title={c.name}
          onClick={() => onChange(c.name)}
          className={`grid h-10 w-10 place-items-center rounded-full border transition ${value === c.name ? "border-ink" : "border-transparent hover:border-line"}`}
        >
          <span className="h-7 w-7 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
        </button>
      ))}
    </div>
  );
}

export function QtyStepper({ value, onChange, max = 10, small = false }: { value: number; onChange: (n: number) => void; max?: number; small?: boolean }) {
  const h = small ? "h-9" : "h-12";
  return (
    <div className={`inline-flex ${h} items-center border border-line bg-white`}>
      <button type="button" aria-label="Decrease quantity" disabled={value <= 1} onClick={() => onChange(value - 1)} className={`grid ${h} w-10 place-items-center disabled:opacity-30`}>
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
        {value}
      </span>
      <button type="button" aria-label="Increase quantity" disabled={value >= max} onClick={() => onChange(value + 1)} className={`grid ${h} w-10 place-items-center disabled:opacity-30`}>
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function ColourDots({ colours, max = 4 }: { colours: Colour[]; max?: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Colours: ${colours.map((c) => c.name).join(", ")}`}>
      {colours.slice(0, max).map((c) => (
        <span key={c.name} title={c.name} className="h-3 w-3 rounded-full border border-black/15" style={{ backgroundColor: c.hex }} />
      ))}
      {colours.length > max && <span className="text-[0.65rem] text-stone">+{colours.length - max}</span>}
    </div>
  );
}
