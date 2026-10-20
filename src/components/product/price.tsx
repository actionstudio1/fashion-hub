import { discountPercent, formatINR } from "@/lib/format";

export function Price({ price, mrp, size = "sm" }: { price: number; mrp: number; size?: "sm" | "lg" }) {
  const off = discountPercent(price, mrp);
  return (
    <div className={`flex flex-wrap items-baseline gap-x-2.5 gap-y-1 ${size === "lg" ? "text-2xl" : "text-[0.95rem]"}`}>
      <span className="font-medium">{formatINR(price)}</span>
      {off > 0 && (
        <>
          <span className={`text-stone line-through ${size === "lg" ? "text-base" : "text-xs"}`}>
            <span className="sr-only">MRP </span>
            {formatINR(mrp)}
          </span>
          <span className={`font-medium text-sale ${size === "lg" ? "text-base" : "text-xs"}`}>{off}% OFF</span>
        </>
      )}
    </div>
  );
}
