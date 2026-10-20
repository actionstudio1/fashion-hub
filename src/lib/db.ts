import { promises as fs } from "node:fs";
import path from "node:path";
import { createSeed } from "./seed";
import type { Database } from "./types";

/**
 * Data store with two backends behind one API:
 * - "file" (default): a JSON file in DATA_DIR — zero setup for local development or a single VPS.
 * - "firestore": Firestore + Firebase Storage — used on Firebase App Hosting (set DATA_STORE=firestore).
 */
export const USE_FIRESTORE = process.env.DATA_STORE === "firestore";

export type ReadOptions = {
  /** Load orders too (admin only). Storefront reads skip them. */
  orders?: boolean;
};

export async function readDb(opts: ReadOptions = {}): Promise<Database> {
  if (USE_FIRESTORE) return (await import("./db-firestore")).firestoreRead(opts.orders ?? true);
  return fileRead();
}

/**
 * Run `fn` against the latest data and persist whatever it changed.
 * Without `orders: true`, `db.orders` starts empty: new orders can be added, existing ones aren't visible.
 */
export function mutateDb<T>(fn: (db: Database) => T | Promise<T>, opts: ReadOptions = {}): Promise<T> {
  if (USE_FIRESTORE) return import("./db-firestore").then((m) => m.firestoreMutate(fn, opts.orders ?? false));
  return fileMutate(fn);
}

/** Store an uploaded image and return the URL to use in product/category/offer records. */
export async function saveImage(data: Buffer, ext: string, contentType: string, name: string): Promise<string> {
  if (USE_FIRESTORE) return (await import("./db-firestore")).storageSave(data, contentType, `uploads/${name}.${ext}`);
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, `${name}.${ext}`), data);
  return `/media/${name}.${ext}`;
}

/* ---------- file backend ---------- */

export const DATA_DIR = process.env.DATA_DIR ?? path.join(/*turbopackIgnore: true*/ process.cwd(), "data");
const DB_FILE = path.join(/*turbopackIgnore: true*/ DATA_DIR, "db.json");
export const UPLOAD_DIR = path.join(/*turbopackIgnore: true*/ DATA_DIR, "uploads");

let writeQueue: Promise<unknown> = Promise.resolve();

async function writeFileAtomic(file: string, data: string) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, data, "utf8");
  await fs.rename(tmp, file);
}

async function fileRead(): Promise<Database> {
  try {
    return JSON.parse(await fs.readFile(DB_FILE, "utf8")) as Database;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    const seed = createSeed();
    await writeFileAtomic(DB_FILE, JSON.stringify(seed, null, 2));
    return seed;
  }
}

function fileMutate<T>(fn: (db: Database) => T | Promise<T>): Promise<T> {
  const run = writeQueue.then(async () => {
    const db = await fileRead();
    const result = await fn(db);
    await writeFileAtomic(DB_FILE, JSON.stringify(db, null, 2));
    return result;
  });
  writeQueue = run.catch(() => undefined);
  return run;
}
