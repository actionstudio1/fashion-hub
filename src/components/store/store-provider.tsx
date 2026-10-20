"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { createPersistentStore } from "@/lib/persistent-store";
import { computeTotals, type Coupon } from "@/lib/pricing";
import type { Colour, Product, Settings } from "@/lib/types";

export type CartItem = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  mrp: number;
  size: string;
  colour: string;
  qty: number;
  sizes: string[];
  colours: Colour[];
  stock: number;
};

/** Minimal product snapshot kept for the wishlist and recently-viewed lists. */
export type ProductSnapshot = Pick<Product, "id" | "slug" | "name" | "brand" | "price" | "mrp"> & { image: string };

export const snapshot = (p: Product): ProductSnapshot => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  brand: p.brand,
  price: p.price,
  mrp: p.mrp,
  image: p.images[0],
});

const cartStore = createPersistentStore<CartItem[]>("fh_cart_v1", []);
const couponStore = createPersistentStore<Coupon | null>("fh_coupon_v1", null);
const wishlistStore = createPersistentStore<ProductSnapshot[]>("fh_wishlist_v1", []);
const recentStore = createPersistentStore<ProductSnapshot[]>("fh_recent_v1", []);

const lineKey = (productId: string, size: string, colour: string) => `${productId}|${size}|${colour}`;
const MAX_QTY = 10;

type Toast = { id: number; message: string; action?: { label: string; href: string } };

type StoreContext = {
  settings: Pick<Settings, "deliveryCharge" | "freeDeliveryAbove">;
  cart: CartItem[];
  cartCount: number;
  coupon: Coupon | null;
  totals: ReturnType<typeof computeTotals>;
  addToCart: (p: Product, opts: { size: string; colour: string; qty: number }) => void;
  updateItem: (key: string, patch: Partial<Pick<CartItem, "qty" | "size" | "colour">>) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  setCoupon: (c: Coupon | null) => void;
  wishlist: ProductSnapshot[];
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (p: Product | ProductSnapshot) => void;
  recent: ProductSnapshot[];
  pushRecent: (p: Product) => void;
  quickView: Product | null;
  openQuickView: (p: Product | null) => void;
  toasts: Toast[];
  notify: (message: string, action?: Toast["action"]) => void;
};

const Ctx = createContext<StoreContext | null>(null);

export function StoreProvider({
  settings,
  children,
}: {
  settings: Pick<Settings, "deliveryCharge" | "freeDeliveryAbove">;
  children: ReactNode;
}) {
  const cart = cartStore.useValue();
  const coupon = couponStore.useValue();
  const wishlist = wishlistStore.useValue();
  const recent = recentStore.useValue();
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  const notify = useCallback((message: string, action?: Toast["action"]) => {
    const id = ++toastId.current;
    setToasts((t) => [...t.slice(-2), { id, message, action }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const addToCart = useCallback<StoreContext["addToCart"]>(
    (p, { size, colour, qty }) => {
      const key = lineKey(p.id, size, colour);
      cartStore.set((items) => {
        const existing = items.find((i) => i.key === key);
        if (existing) {
          return items.map((i) => (i.key === key ? { ...i, qty: Math.min(i.qty + qty, MAX_QTY, p.stock) } : i));
        }
        return [
          ...items,
          {
            key,
            productId: p.id,
            slug: p.slug,
            name: p.name,
            brand: p.brand,
            image: p.images[0],
            price: p.price,
            mrp: p.mrp,
            size,
            colour,
            qty: Math.min(qty, MAX_QTY, p.stock),
            sizes: p.sizes,
            colours: p.colours,
            stock: p.stock,
          },
        ];
      });
      notify(`${p.name} added to your bag`, { label: "View bag", href: "/cart" });
    },
    [notify],
  );

  const updateItem = useCallback<StoreContext["updateItem"]>((key, patch) => {
    cartStore.set((items) => {
      const item = items.find((i) => i.key === key);
      if (!item) return items;
      const next = { ...item, ...patch };
      next.qty = Math.max(1, Math.min(next.qty, MAX_QTY, next.stock || MAX_QTY));
      next.key = lineKey(next.productId, next.size, next.colour);
      const others = items.filter((i) => i.key !== key);
      const clash = others.find((i) => i.key === next.key);
      if (clash) {
        // Changing size/colour onto an existing line merges the two.
        return others.map((i) => (i.key === next.key ? { ...i, qty: Math.min(i.qty + next.qty, MAX_QTY) } : i));
      }
      return items.map((i) => (i.key === key ? next : i));
    });
  }, []);

  const removeItem = useCallback((key: string) => cartStore.set((items) => items.filter((i) => i.key !== key)), []);
  const clearCart = useCallback(() => {
    cartStore.set([]);
    couponStore.set(null);
  }, []);
  const setCoupon = useCallback((c: Coupon | null) => couponStore.set(c), []);

  const isWishlisted = useCallback((id: string) => wishlist.some((w) => w.id === id), [wishlist]);
  const toggleWishlist = useCallback<StoreContext["toggleWishlist"]>(
    (p) => {
      const snap = "images" in p ? snapshot(p) : p;
      const exists = wishlistStore.get().some((w) => w.id === snap.id);
      wishlistStore.set((list) => (exists ? list.filter((w) => w.id !== snap.id) : [snap, ...list]));
      notify(exists ? "Removed from wishlist" : "Saved to wishlist", exists ? undefined : { label: "View", href: "/wishlist" });
    },
    [notify],
  );

  const pushRecent = useCallback((p: Product) => {
    recentStore.set((list) => [snapshot(p), ...list.filter((r) => r.id !== p.id)].slice(0, 12));
  }, []);

  const totals = useMemo(() => computeTotals(cart, coupon, settings), [cart, coupon, settings]);

  const value: StoreContext = {
    settings,
    cart,
    cartCount: cart.reduce((n, i) => n + i.qty, 0),
    coupon,
    totals,
    addToCart,
    updateItem,
    removeItem,
    clearCart,
    setCoupon,
    wishlist,
    isWishlisted,
    toggleWishlist,
    recent,
    pushRecent,
    quickView,
    openQuickView: setQuickView,
    toasts,
    notify,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
