import { cacheLife, cacheTag } from "next/cache";
import { readDb } from "./db";
import { todayIST } from "./format";
import { isOfferLive } from "./pricing";
import type { Category, Gender, Product } from "./types";

/** Cache tag invalidated by every admin mutation. */
export const CATALOG_TAG = "catalog";

export async function getCatalog() {
  "use cache";
  // Short revalidation so every server instance picks up admin edits within minutes,
  // even ones that did not receive the updateTag() call.
  cacheLife({ stale: 60, revalidate: 120, expire: 86400 });
  cacheTag(CATALOG_TAG);
  const db = await readDb({ orders: false });
  return {
    categories: db.categories.filter((c) => c.active).sort((a, b) => a.order - b.order),
    products: db.products.filter((p) => p.active).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    settings: db.settings,
  };
}

export async function getLiveOffers() {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);
  const db = await readDb({ orders: false });
  const today = todayIST();
  return db.offers.filter((o) => isOfferLive(o, today));
}

export async function getSettings() {
  return (await getCatalog()).settings;
}

export async function getProducts(filter: (p: Product) => boolean = () => true) {
  return (await getCatalog()).products.filter(filter);
}

/** Categories for a gender that actually have products, with counts. Empty categories stay hidden. */
export async function getGenderCategories(gender: Gender) {
  const { categories, products } = await getCatalog();
  return categories
    .filter((c) => c.gender === gender)
    .map((c) => ({ ...c, count: products.filter((p) => p.categoryId === c.id).length }))
    .filter((c) => c.count > 0);
}

export async function getProductBySlug(slug: string) {
  const { products, categories } = await getCatalog();
  const product = products.find((p) => p.slug === slug);
  if (!product) return null;
  const category = categories.find((c) => c.id === product.categoryId) ?? null;
  return { product, category };
}

export async function getRelated(product: Product) {
  const { products } = await getCatalog();
  const others = products.filter((p) => p.id !== product.id);
  const youMayAlsoLike = [
    ...others.filter((p) => p.categoryId === product.categoryId),
    ...others.filter((p) => p.categoryId !== product.categoryId && p.gender === product.gender && p.isTrending),
  ].slice(0, 8);

  // Admin-picked pieces first, topped up with one piece from each other category.
  const picked = product.completeTheLook
    .map((id) => others.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
  const autoPicks = others
    .filter((p) => p.gender === product.gender && p.categoryId !== product.categoryId && !picked.includes(p))
    .filter((p, i, arr) => arr.findIndex((q) => q.categoryId === p.categoryId) === i);
  const completeTheLook = [...picked, ...autoPicks];
  return { youMayAlsoLike, completeTheLook: completeTheLook.slice(0, 4) };
}

export function categoryById(categories: Category[], id: string) {
  return categories.find((c) => c.id === id);
}
