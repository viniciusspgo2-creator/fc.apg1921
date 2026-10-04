import { ADMIN_COOKIE } from "@/lib/admin-auth";
import { NextResponse } from "next/server";

/* POST /api/admin/logout — clears the session cookie. */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
