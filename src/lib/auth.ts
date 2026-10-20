import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { readDb, type ReadOptions } from "./db";
import { createSessionValue, SESSION_COOKIE, SESSION_DAYS, verifySessionValue } from "./session";
import type { Database } from "./types";

export { adminPassword, checkPassword } from "./session";

export async function createSession() {
  (await cookies()).set(SESSION_COOKIE, createSessionValue(Date.now()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function isAdmin() {
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  await connection();
  return verifySessionValue(value, Date.now());
}

const EMPTY_DB: Database = {
  categories: [],
  products: [],
  offers: [],
  orders: [],
  settings: { deliveryCharge: 0, freeDeliveryAbove: 0, announcement: "" },
};

/**
 * Data access for admin pages. Pages render independently of the layout's gate, so each one
 * checks the session itself (this also keeps them request-time only, never prerendered).
 */
export async function readDbAsAdmin(opts?: ReadOptions): Promise<Database> {
  if (!(await isAdmin())) return EMPTY_DB;
  return readDb(opts);
}

/** Guard for server actions. Pages are guarded by proxy.ts plus readDbAsAdmin(). */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
