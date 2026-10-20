"use server";

import { randomBytes } from "node:crypto";
import { refresh, updateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkPassword, createSession, destroySession, requireAdmin } from "@/lib/auth";
import { CATALOG_TAG } from "@/lib/data";
import { mutateDb, saveImage } from "@/lib/db";
import { slugify } from "@/lib/seed";
import type { Category, Colour, Gender, Offer, OrderStatus, Product } from "@/lib/types";

export type FormState = { error?: string; ok?: string } | undefined;

/* ---------- helpers ---------- */

const str = (fd: FormData, key: string, max = 2000) => String(fd.get(key) ?? "").trim().slice(0, max);
const num = (fd: FormData, key: string) => {
  const n = Number(str(fd, key));
  return Number.isFinite(n) ? n : NaN;
};
const bool = (fd: FormData, key: string) => fd.get(key) === "on" || fd.get(key) === "true";
const lines = (v: string) => v.split(/\r?\n|,/).map((s) => s.trim()).filter(Boolean);
const newId = (prefix: string) => `${prefix}${randomBytes(5).toString("hex")}`;
const isGender = (g: string): g is Gender => g === "men" || g === "women";

function invalidate() {
  updateTag(CATALOG_TAG);
}

const IMAGE_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };
const MAX_UPLOAD = 6 * 1024 * 1024;

async function saveUploads(files: FormDataEntryValue[]): Promise<string[]> {
  const urls: string[] = [];
  for (const f of files) {
    if (!(f instanceof File) || f.size === 0) continue;
    const ext = IMAGE_TYPES[f.type];
    if (!ext) throw new Error(`"${f.name}" is not a JPG, PNG, WebP or AVIF image.`);
    if (f.size > MAX_UPLOAD) throw new Error(`"${f.name}" is larger than 6 MB.`);
    urls.push(await saveImage(Buffer.from(await f.arrayBuffer()), ext, f.type, randomBytes(12).toString("hex")));
  }
  return urls;
}

function validImageUrl(u: string) {
  return /^\/media\/[a-f0-9]+\.(jpg|png|webp|avif)$/.test(u) || /^https:\/\/[^\s"'<>]+$/.test(u);
}

function parseColours(raw: string): Colour[] {
  return lines(raw.replace(/,/g, "\n")).map((line) => {
    const m = line.match(/^(.*?)[\s:]*(#[0-9a-fA-F]{3,8})$/);
    return m ? { name: m[1].trim() || m[2], hex: m[2] } : { name: line, hex: "#cccccc" };
  });
}

/* ---------- auth ---------- */

const attempts = new Map<string, { count: number; until: number }>();

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const rec = attempts.get(ip);
  if (rec && rec.count >= 5 && rec.until > Date.now()) {
    return { error: "Too many attempts. Please wait 10 minutes and try again." };
  }
  if (!checkPassword(str(fd, "password", 200))) {
    const count = rec && rec.until > Date.now() ? rec.count + 1 : 1;
    attempts.set(ip, { count, until: Date.now() + 10 * 60_000 });
    await new Promise((r) => setTimeout(r, 600));
    return { error: "Incorrect password." };
  }
  attempts.delete(ip);
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

/* ---------- products ---------- */

export async function saveProduct(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id", 40);
  const name = str(fd, "name", 120);
  const gender = str(fd, "gender");
  const categoryId = str(fd, "categoryId", 60);
  const price = num(fd, "price");
  const mrp = num(fd, "mrp") || price;
  const stock = Math.floor(num(fd, "stock"));
  const sizes = lines(str(fd, "sizes"));
  const colours = parseColours(str(fd, "colours"));

  if (name.length < 2) return { error: "Please enter a product name." };
  if (!isGender(gender)) return { error: "Choose Men or Women." };
  if (!(price > 0)) return { error: "Price must be greater than 0." };
  if (mrp < price) return { error: "MRP cannot be lower than the selling price." };
  if (!(stock >= 0)) return { error: "Stock must be 0 or more." };
  if (sizes.length === 0) return { error: "Add at least one size (e.g. S, M, L or Free Size)." };

  let uploaded: string[];
  try {
    uploaded = await saveUploads(fd.getAll("uploads"));
  } catch (e) {
    return { error: (e as Error).message };
  }
  const images = [...lines(str(fd, "images", 10000)).filter(validImageUrl), ...uploaded];
  if (images.length === 0) return { error: "Add at least one product image." };

  try {
    await mutateDb((db) => {
      const category = db.categories.find((c) => c.id === categoryId);
      if (!category || category.gender !== gender) throw new Error("Choose a category that matches the selected gender.");
      let slug = slugify(str(fd, "slug", 120) || name);
      if (!slug) slug = newId("item-");
      if (db.products.some((p) => p.slug === slug && p.id !== id)) slug = `${slug}-${randomBytes(2).toString("hex")}`;

      const data: Omit<Product, "id" | "createdAt"> = {
        slug,
        name,
        brand: str(fd, "brand", 80) || "Fashion Hub",
        gender,
        categoryId,
        price,
        mrp,
        images,
        sizes,
        colours,
        stock,
        description: str(fd, "description", 3000),
        fabric: str(fd, "fabric", 300),
        care: str(fd, "care", 600),
        isNewArrival: bool(fd, "isNewArrival"),
        isTrending: bool(fd, "isTrending"),
        isBestSeller: bool(fd, "isBestSeller"),
        isOnOffer: bool(fd, "isOnOffer"),
        completeTheLook: fd.getAll("completeTheLook").map(String).filter((x) => x !== id).slice(0, 8),
        active: bool(fd, "active"),
      };
      if (id) {
        const existing = db.products.find((p) => p.id === id);
        if (!existing) throw new Error("Product not found.");
        Object.assign(existing, data);
      } else {
        db.products.unshift({ ...data, id: newId("p"), createdAt: new Date().toISOString() });
      }
    });
  } catch (e) {
    return { error: (e as Error).message };
  }
  invalidate();
  redirect("/admin/products?saved=1");
}

const FLAGS = ["isNewArrival", "isTrending", "isBestSeller", "isOnOffer", "active"] as const;

export async function toggleProductFlag(id: string, flag: (typeof FLAGS)[number]) {
  await requireAdmin();
  if (!FLAGS.includes(flag)) return;
  await mutateDb((db) => {
    const p = db.products.find((x) => x.id === id);
    if (p) p[flag] = !p[flag];
  });
  invalidate();
  refresh();
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await mutateDb((db) => {
    db.products = db.products.filter((p) => p.id !== id);
    for (const p of db.products) p.completeTheLook = p.completeTheLook.filter((x) => x !== id);
  });
  invalidate();
  redirect("/admin/products");
}

/* ---------- categories ---------- */

export async function saveCategory(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id", 60);
  const name = str(fd, "name", 60);
  const gender = str(fd, "gender");
  if (name.length < 2) return { error: "Please enter a category name." };
  if (!isGender(gender)) return { error: "Choose Men or Women." };

  let uploaded: string[];
  try {
    uploaded = await saveUploads(fd.getAll("upload"));
  } catch (e) {
    return { error: (e as Error).message };
  }
  const imageUrl = str(fd, "image", 500);
  const image = uploaded[0] ?? (validImageUrl(imageUrl) ? imageUrl : "");

  try {
    await mutateDb((db) => {
      const slug = slugify(name);
      const clash = db.categories.find((c) => c.gender === gender && c.slug === slug && c.id !== id);
      if (clash) throw new Error(`A ${gender === "men" ? "Men" : "Women"} category called "${clash.name}" already exists.`);
      if (id) {
        const cat = db.categories.find((c) => c.id === id);
        if (!cat) throw new Error("Category not found.");
        if (cat.gender !== gender && db.products.some((p) => p.categoryId === id)) {
          throw new Error("This category has products — you can't move it to the other gender.");
        }
        Object.assign(cat, { name, slug, gender, description: str(fd, "description", 200), image: image || cat.image, active: bool(fd, "active") });
      } else {
        const order = Math.max(-1, ...db.categories.filter((c) => c.gender === gender).map((c) => c.order)) + 1;
        const cat: Category = { id: newId("c"), slug, name, gender, description: str(fd, "description", 200), image, active: true, order };
        db.categories.push(cat);
      }
    });
  } catch (e) {
    return { error: (e as Error).message };
  }
  invalidate();
  refresh();
  return { ok: id ? "Category updated." : "Category added." };
}

export async function deleteCategory(id: string): Promise<FormState> {
  await requireAdmin();
  try {
    await mutateDb((db) => {
      const count = db.products.filter((p) => p.categoryId === id).length;
      if (count) throw new Error(`This category still has ${count} product${count > 1 ? "s" : ""}. Move or delete them first, or hide the category instead.`);
      db.categories = db.categories.filter((c) => c.id !== id);
    });
  } catch (e) {
    return { error: (e as Error).message };
  }
  invalidate();
  refresh();
  return { ok: "Category deleted." };
}

export async function toggleCategory(id: string) {
  await requireAdmin();
  await mutateDb((db) => {
    const c = db.categories.find((x) => x.id === id);
    if (c) c.active = !c.active;
  });
  invalidate();
  refresh();
}

export async function moveCategory(id: string, dir: -1 | 1) {
  await requireAdmin();
  await mutateDb((db) => {
    const cat = db.categories.find((c) => c.id === id);
    if (!cat) return;
    const siblings = db.categories.filter((c) => c.gender === cat.gender).sort((a, b) => a.order - b.order);
    const i = siblings.indexOf(cat);
    const j = i + dir;
    if (j < 0 || j >= siblings.length) return;
    [siblings[i], siblings[j]] = [siblings[j], siblings[i]];
    siblings.forEach((c, k) => (c.order = k));
  });
  invalidate();
  refresh();
}

/* ---------- offers ---------- */

export async function saveOffer(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id", 40);
  const title = str(fd, "title", 100);
  const couponCode = str(fd, "couponCode", 30).toUpperCase().replace(/[^A-Z0-9]/g, "");
  const discountType = str(fd, "discountType") === "flat" ? "flat" : "percent";
  const discountValue = num(fd, "discountValue");
  const validFrom = str(fd, "validFrom", 10);
  const validTo = str(fd, "validTo", 10);
  const isDate = (d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d);

  if (title.length < 2) return { error: "Please enter an offer title." };
  if (couponCode.length < 3) return { error: "Coupon code must be at least 3 letters/numbers." };
  if (!(discountValue > 0) || (discountType === "percent" && discountValue > 90)) return { error: "Enter a valid discount (1–90% or a flat ₹ amount)." };
  if (!isDate(validFrom) || !isDate(validTo) || validTo < validFrom) return { error: "Check the validity dates." };

  let uploaded: string[];
  try {
    uploaded = await saveUploads(fd.getAll("upload"));
  } catch (e) {
    return { error: (e as Error).message };
  }
  const bannerUrl = str(fd, "banner", 500);
  const banner = uploaded[0] ?? (validImageUrl(bannerUrl) ? bannerUrl : "");
  if (!banner) return { error: "Add a banner image." };

  const ctaHref = str(fd, "ctaHref", 200);
  const data: Omit<Offer, "id"> = {
    slug: slugify(title),
    title,
    description: str(fd, "description", 400),
    banner,
    validFrom,
    validTo,
    couponCode,
    discountType,
    discountValue,
    minOrder: Math.max(0, num(fd, "minOrder") || 0),
    maxDiscount: Math.max(0, num(fd, "maxDiscount") || 0),
    terms: str(fd, "terms", 3000).split(/\r?\n/).map((t) => t.trim()).filter(Boolean),
    ctaLabel: str(fd, "ctaLabel", 40) || "Shop now",
    ctaHref: ctaHref.startsWith("/") ? ctaHref : "/",
    active: bool(fd, "active"),
  };

  try {
    await mutateDb((db) => {
      if (db.offers.some((o) => o.couponCode === couponCode && o.id !== id)) throw new Error(`Coupon code ${couponCode} is already used by another offer.`);
      if (id) {
        const o = db.offers.find((x) => x.id === id);
        if (!o) throw new Error("Offer not found.");
        Object.assign(o, data);
      } else db.offers.unshift({ ...data, id: newId("o") });
    });
  } catch (e) {
    return { error: (e as Error).message };
  }
  invalidate();
  redirect("/admin/offers");
}

export async function toggleOffer(id: string) {
  await requireAdmin();
  await mutateDb((db) => {
    const o = db.offers.find((x) => x.id === id);
    if (o) o.active = !o.active;
  });
  invalidate();
  refresh();
}

export async function deleteOffer(id: string) {
  await requireAdmin();
  await mutateDb((db) => {
    db.offers = db.offers.filter((o) => o.id !== id);
  });
  invalidate();
  redirect("/admin/offers");
}

/* ---------- orders ---------- */

const STATUSES: OrderStatus[] = ["new", "confirmed", "shipped", "delivered", "cancelled"];

export async function setOrderStatus(id: string, status: OrderStatus) {
  await requireAdmin();
  if (!STATUSES.includes(status)) return;
  await mutateDb((db) => {
    const order = db.orders.find((o) => o.id === id);
    if (!order || order.status === status) return;
    // Return stock when an order is cancelled; take it again if un-cancelled.
    const delta = status === "cancelled" ? 1 : order.status === "cancelled" ? -1 : 0;
    if (delta) {
      for (const it of order.items) {
        const p = db.products.find((x) => x.id === it.productId);
        if (p) p.stock = Math.max(0, p.stock + delta * it.qty);
      }
    }
    order.status = status;
  }, { orders: true });
  invalidate();
  refresh();
}

/* ---------- settings ---------- */

export async function saveSettings(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const deliveryCharge = num(fd, "deliveryCharge");
  const freeDeliveryAbove = num(fd, "freeDeliveryAbove");
  if (!(deliveryCharge >= 0) || !(freeDeliveryAbove >= 0)) return { error: "Enter valid amounts." };
  await mutateDb((db) => {
    db.settings = { deliveryCharge, freeDeliveryAbove, announcement: str(fd, "announcement", 160) };
  });
  invalidate();
  refresh();
  return { ok: "Settings saved." };
}
