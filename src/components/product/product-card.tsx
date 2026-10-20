"use client";

import { Eye, Heart, Plus } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/components/store/store-provider";
import { Photo } from "@/components/ui/photo";
import { discountPercent } from "@/lib/format";
import type { Product } from "@/lib/types";
import { Price } from "./price";
import { ColourDots } from "./selectors";

export function ProductCard({ product, priority = false, sizes = "(min-width: 1024px) 25vw, 50vw" }: { product: Product; priority?: boolean; sizes?: string }) {
  const { isWishlisted, toggleWishlist, openQuickView, addToCart } = useStore();
  const wished = isWishlisted(product.id);
  const off = discountPercent(product.price, product.mrp);
  const outOfStock = product.stock <= 0;
  const href = `/product/${product.slug}`;

  function quickAdd() {
    if (product.sizes.length === 1 && product.colours.length <= 1) {
      addToCart(product, { size: product.sizes[0], colour: product.colours[0]?.name ?? "", qty: 1 });
    } else {
      openQuickView(product);
    }
  }

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden bg-sand">
        <Link href={href} aria-label={product.name} className="absolute inset-0">
          <Photo
            src={product.images[0]}
            alt={product.name}
            fill
            sizes={sizes}
            priority={priority}
            className={`transition duration-[1.2s] ease-[var(--ease-luxe)] group-hover:scale-[1.04] ${product.images[1] ? "group-hover:opacity-0" : ""} ${outOfStock ? "opacity-70" : ""}`}
          />
          {product.images[1] && (
            <Photo src={product.images[1]} alt="" fill sizes={sizes} className="opacity-0 transition duration-700 group-hover:opacity-100" />
          )}
        </Link>

        <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {outOfStock ? (
            <span className="bg-ink px-2 py-1 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-cream">Sold out</span>
          ) : (
            <>
              {product.isNewArrival ? (
                <span className="bg-cream px-2 py-1 text-[0.6rem] font-medium uppercase tracking-[0.18em]">New</span>
              ) : product.isTrending ? (
                <span className="bg-ink px-2 py-1 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-cream">Trending</span>
              ) : product.isOnOffer && off > 0 ? (
                <span className="bg-sale px-2 py-1 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-white">-{off}%</span>
              ) : null}
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-cream/85 backdrop-blur transition hover:bg-cream"
        >
          <Heart className={`h-4 w-4 ${wished ? "fill-sale text-sale" : ""}`} strokeWidth={1.5} />
        </button>

        {/* Desktop hover actions */}
        <div className="absolute inset-x-2.5 bottom-2.5 hidden translate-y-3 gap-2 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:flex">
          <button type="button" onClick={() => openQuickView(product)} className="btn btn-light min-h-10 flex-1 !px-2 !text-[0.65rem]">
            <Eye className="h-3.5 w-3.5" strokeWidth={1.5} /> Quick view
          </button>
          {!outOfStock && (
            <button type="button" onClick={quickAdd} className="btn btn-dark min-h-10 flex-1 !px-2 !text-[0.65rem]">
              <Plus className="h-3.5 w-3.5" /> Add to cart
            </button>
          )}
        </div>

        {/* Mobile quick add */}
        <button
          type="button"
          onClick={() => (outOfStock ? openQuickView(product) : quickAdd())}
          aria-label={`Quick add ${product.name}`}
          className="absolute bottom-2 right-2 grid h-9 w-9 place-items-center rounded-full bg-cream/90 shadow-sm md:hidden"
        >
          {outOfStock ? <Eye className="h-4 w-4" strokeWidth={1.5} /> : <Plus className="h-4 w-4" strokeWidth={1.5} />}
        </button>
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-1.5">
        <p className="eyebrow !text-[0.6rem] text-stone">{product.brand}</p>
        <h3 className="text-sm leading-snug md:text-[0.95rem]">
          <Link href={href} className="hover:underline hover:underline-offset-4">
            {product.name}
          </Link>
        </h3>
        <Price price={product.price} mrp={product.mrp} />
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <p className="truncate text-[0.7rem] tracking-wide text-stone">{product.sizes.join(" · ")}</p>
          <ColourDots colours={product.colours} />
        </div>
      </div>
    </article>
  );
}
