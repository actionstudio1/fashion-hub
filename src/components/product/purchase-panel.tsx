"use client";

import { Heart, ShoppingBag, Truck, RotateCcw, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type MouseEvent } from "react";
import { useStore } from "@/components/store/store-provider";
import { WhatsAppIcon } from "@/components/ui/icons";
import { formatINR } from "@/lib/format";
import { SITE } from "@/lib/site";
import type { Product } from "@/lib/types";
import { productOrderMessage, whatsappLink } from "@/lib/whatsapp";
import { Price } from "./price";
import { ColourPicker, QtyStepper, SizePicker } from "./selectors";
import { SizeGuide } from "./size-guide";

export function PurchasePanel({ product, variant = "page" }: { product: Product; variant?: "page" | "quick" }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isWishlisted, settings, openQuickView } = useStore();
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : "");
  const [colour, setColour] = useState(product.colours[0]?.name ?? "");
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  const outOfStock = product.stock <= 0;
  const maxQty = Math.max(1, Math.min(10, product.stock));
  const wished = isWishlisted(product.id);

  function requireSize() {
    if (size) return true;
    setSizeError(true);
    document.getElementById(`size-${product.id}-${variant}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    return false;
  }

  function handleAdd() {
    if (!requireSize()) return;
    addToCart(product, { size, colour, qty });
    if (variant === "quick") openQuickView(null);
  }

  function handleBuyNow() {
    if (!requireSize()) return;
    addToCart(product, { size, colour, qty });
    openQuickView(null);
    router.push("/checkout");
  }

  const waHref = whatsappLink(
    productOrderMessage({
      name: product.name,
      price: product.price,
      size,
      colour,
      qty,
      url: `${SITE.url}/product/${product.slug}`,
    }),
  );

  function handleWhatsApp(e: MouseEvent<HTMLAnchorElement>) {
    if (!outOfStock && !requireSize()) e.preventDefault();
  }

  const whatsAppButton = (className: string) => (
    <a href={waHref} onClick={handleWhatsApp} target="_blank" rel="noopener noreferrer" className={`btn btn-whatsapp ${className}`}>
      <WhatsAppIcon className="h-4 w-4" /> {outOfStock ? "Ask on WhatsApp" : "Order on WhatsApp"}
    </a>
  );

  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <Price price={product.price} mrp={product.mrp} size="lg" />
        <p className="text-xs text-stone">Inclusive of all taxes</p>
        <p className={`text-sm ${outOfStock ? "text-sale" : product.stock <= 5 ? "text-gold" : "text-whatsapp"}`}>
          {outOfStock ? "Currently out of stock" : product.stock <= 5 ? `Hurry — only ${product.stock} left in stock` : "In stock · Ready to ship"}
        </p>
      </div>

      <div id={`size-${product.id}-${variant}`} className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="label !mb-0">
            Size {size && <span className="normal-case tracking-normal text-ink">: {size}</span>}
          </p>
          <SizeGuide gender={product.gender} />
        </div>
        <SizePicker sizes={product.sizes} value={size} onChange={(s) => (setSize(s), setSizeError(false))} error={sizeError} />
        {sizeError && <p className="text-sm text-sale">Please select a size.</p>}
      </div>

      {product.colours.length > 0 && (
        <div className="space-y-3">
          <p className="label !mb-0">
            Colour <span className="normal-case tracking-normal text-ink">: {colour}</span>
          </p>
          <ColourPicker colours={product.colours} value={colour} onChange={setColour} />
        </div>
      )}

      <div className="space-y-3">
        <p className="label !mb-0">Quantity</p>
        <QtyStepper value={qty} onChange={setQty} max={maxQty} />
      </div>

      <div className="space-y-3">
        <div className="flex gap-3">
          <button type="button" onClick={handleAdd} disabled={outOfStock} className="btn btn-dark flex-1">
            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} /> Add to cart
          </button>
          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            aria-pressed={wished}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            className="grid h-12 w-12 shrink-0 place-items-center border border-line bg-white transition hover:border-ink"
          >
            <Heart className={`h-5 w-5 ${wished ? "fill-sale text-sale" : ""}`} strokeWidth={1.5} />
          </button>
        </div>
        <button type="button" onClick={handleBuyNow} disabled={outOfStock} className="btn btn-outline w-full">
          Buy now
        </button>
        {whatsAppButton("w-full")}
      </div>

      {variant === "page" && (
        <ul className="grid gap-3 border-y border-line py-5 text-sm text-stone">
          <li className="flex items-center gap-3">
            <Truck className="h-4 w-4 text-ink" strokeWidth={1.5} /> Free delivery on orders above {formatINR(settings.freeDeliveryAbove)}
          </li>
          <li className="flex items-center gap-3">
            <Store className="h-4 w-4 text-ink" strokeWidth={1.5} /> Try it in-store at Mehandi Bag Road, Binaki Mangalwari
          </li>
          <li className="flex items-center gap-3">
            <RotateCcw className="h-4 w-4 text-ink" strokeWidth={1.5} /> Easy size exchange — just message us on WhatsApp
          </li>
        </ul>
      )}

      {variant === "page" && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-line bg-cream/95 p-3 backdrop-blur md:hidden">
          <button type="button" onClick={handleAdd} disabled={outOfStock} className="btn btn-dark flex-1 !px-3">
            Add to cart
          </button>
          {whatsAppButton("flex-1 !px-3 !tracking-[0.12em]")}
        </div>
      )}
    </div>
  );
}
