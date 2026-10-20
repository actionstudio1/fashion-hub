"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          /* clipboard unavailable */
        }
      }}
      className="inline-flex items-center gap-3 border border-dashed border-gold px-4 py-2.5 transition hover:bg-gold/10"
      aria-label={`Copy coupon code ${code}`}
    >
      <span className="font-display text-xl tracking-[0.15em]">{code}</span>
      {copied ? <Check className="h-4 w-4 text-whatsapp" /> : <Copy className="h-4 w-4 text-stone" strokeWidth={1.5} />}
      <span className="text-[0.65rem] uppercase tracking-[0.18em] text-stone">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
