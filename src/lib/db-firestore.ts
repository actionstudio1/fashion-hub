import { randomUUID } from "node:crypto";
import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, type Firestore, type Transaction } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { createSeed } from "./seed";
import type { Database } from "./types";

/**
 * Firestore layout: one document per record in `categories`, `products`, `offers`, `orders`
 * (document id = record id) and the shop settings in `meta/settings`.
 * An empty project behaves like the sample catalogue; the first admin change or order saves it.
 */

const COLLECTIONS = ["categories", "products", "offers", "orders"] as const;
type Coll = (typeof COLLECTIONS)[number];

function app() {
  // On App Hosting, credentials and project come from the environment (FIREBASE_CONFIG / ADC).
  return getApps()[0] ?? initializeApp();
}

let firestore: Firestore | null = null;
function fs() {
  if (!firestore) {
    firestore = getFirestore(app());
    firestore.settings({ ignoreUndefinedProperties: true });
  }
  return firestore;
}

const settingsRef = () => fs().collection("meta").doc("settings");

async function load(tx: Transaction | null, withOrders: boolean): Promise<{ db: Database; empty: boolean }> {
  const get = <T>(q: FirebaseFirestore.Query) => (tx ? tx.get(q) : q.get()).then((s) => s.docs.map((d) => d.data() as T));
  const settingsSnap = await (tx ? tx.get(settingsRef()) : settingsRef().get());
  if (!settingsSnap.exists) return { db: { ...createSeed(), orders: [] }, empty: true };
  const [categories, products, offers, orders] = await Promise.all([
    get<Database["categories"][number]>(fs().collection("categories")),
    get<Database["products"][number]>(fs().collection("products")),
    get<Database["offers"][number]>(fs().collection("offers")),
    withOrders ? get<Database["orders"][number]>(fs().collection("orders").orderBy("createdAt", "desc")) : Promise.resolve([]),
  ]);
  return { db: { categories, products, offers, orders, settings: settingsSnap.data() as Database["settings"] }, empty: false };
}

export async function firestoreRead(withOrders: boolean): Promise<Database> {
  try {
    return (await load(null, withOrders)).db;
  } catch (err) {
    // Don't fail a deploy if the build machine can't reach Firestore: prerender with the
    // sample catalogue; pages revalidate from Firestore within minutes of going live.
    if (process.env.NEXT_PHASE === "phase-production-build") {
      console.warn("[db] Firestore unavailable during build, prerendering with sample data:", (err as Error).message);
      return { ...createSeed(), orders: [] };
    }
    throw err;
  }
}

export async function firestoreMutate<T>(fn: (db: Database) => T | Promise<T>, withOrders: boolean): Promise<T> {
  return fs().runTransaction(async (tx) => {
    const { db: before, empty } = await load(tx, withOrders);
    const db = structuredClone(before);
    const result = await fn(db);

    for (const coll of COLLECTIONS) {
      // When the store is still empty, everything (the sample catalogue) is new and gets written.
      const prev = new Map(empty ? [] : (before[coll] as { id: string }[]).map((r) => [r.id, JSON.stringify(r)]));
      const next = db[coll] as { id: string }[];
      for (const rec of next) {
        if (prev.get(rec.id) !== JSON.stringify(rec)) tx.set(fs().collection(coll).doc(rec.id), rec);
      }
      // Only delete from collections that were fully loaded.
      const loaded: Record<Coll, boolean> = { categories: true, products: true, offers: true, orders: withOrders };
      if (loaded[coll]) {
        const ids = new Set(next.map((r) => r.id));
        for (const id of prev.keys()) if (!ids.has(id)) tx.delete(fs().collection(coll).doc(id));
      }
    }
    if (empty || JSON.stringify(before.settings) !== JSON.stringify(db.settings)) tx.set(settingsRef(), db.settings);
    return result;
  });
}

/** Uploads to the default Firebase Storage bucket and returns a permanent download URL. */
export async function storageSave(data: Buffer, contentType: string, objectPath: string): Promise<string> {
  const bucket = getStorage(app()).bucket();
  const token = randomUUID();
  await bucket.file(objectPath).save(data, {
    resumable: false,
    metadata: {
      contentType,
      cacheControl: "public, max-age=31536000, immutable",
      metadata: { firebaseStorageDownloadTokens: token },
    },
  });
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(objectPath)}?alt=media&token=${token}`;
}
