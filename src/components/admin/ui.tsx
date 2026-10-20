import Link from "next/link";
import type { ReactNode } from "react";

export function AdminHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: { label: string; href: string } }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-8">
      <div>
        <h1 className="font-display text-4xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-stone">{subtitle}</p>}
      </div>
      {action && (
        <Link href={action.href} className="btn btn-dark !min-h-10">
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-sm bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:p-6 ${className}`}>{children}</div>;
}

export function StatusPill({ tone, children }: { tone: "green" | "grey" | "gold" | "red" | "blue"; children: ReactNode }) {
  const tones = {
    green: "bg-emerald-50 text-emerald-700",
    grey: "bg-stone-100 text-stone-600",
    gold: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
    blue: "bg-sky-50 text-sky-700",
  };
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}
