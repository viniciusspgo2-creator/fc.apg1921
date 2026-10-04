import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/* ============================================================
 * Minimal admin auth — password from env, HMAC session cookie.
 * No user table: single-operator club admin by design.
 * Set ADMIN_PASSWORD in .env (documented in .env.example).
 * ============================================================ */

export const ADMIN_COOKIE = "apg_admin";

export function getAdminPassword(): string {
  // Fail closed in production: with no ADMIN_PASSWORD configured, nobody can log in
  // (no hard-coded default password exposed on the public internet).
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  return process.env.NODE_ENV === "production" ? "" : "apg1921";
}

export function makeAdminToken(): string {
  return createHash("sha256")
    .update(`fc-apg-1921::${getAdminPassword()}`)
    .digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(input: string): boolean {
  if (!getAdminPassword()) return false;
  return safeEqual(input, getAdminPassword());
}

export function checkToken(token?: string | null): boolean {
  if (!token || !getAdminPassword()) return false;
  return safeEqual(token, makeAdminToken());
}

/** Server-side guard for admin API routes. */
export async function isAdminRequest(): Promise<boolean> {
  const jar = await cookies();
  return checkToken(jar.get(ADMIN_COOKIE)?.value);
}
