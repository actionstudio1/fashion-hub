import { createHmac, timingSafeEqual } from "node:crypto";

/** Pure session helpers (no Next.js request APIs) — shared by proxy.ts and server code. */

export const SESSION_COOKIE = "fh_admin";
export const SESSION_DAYS = 7;

export function adminPassword(): string | null {
  return process.env.ADMIN_PASSWORD?.trim() || null;
}

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET || adminPassword();
  if (!s) throw new Error("ADMIN_PASSWORD is not configured");
  return s;
}

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function checkPassword(input: string) {
  if (!adminPassword()) return false;
  // Compare HMACs so length differences don't leak timing.
  return safeEqual(sign(`pw:${input}`), sign(`pw:${adminPassword()}`));
}

export function createSessionValue(now: number) {
  const payload = `admin.${now + SESSION_DAYS * 864e5}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionValue(value: string | undefined, now: number) {
  if (!value || !adminPassword()) return false;
  const [role, exp, sig] = value.split(".");
  if (role !== "admin" || !exp || !sig) return false;
  if (!(Number(exp) > now)) return false;
  return safeEqual(sig, sign(`${role}.${exp}`));
}
