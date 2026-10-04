import {
  ADMIN_COOKIE,
  checkPassword,
  makeAdminToken,
} from "@/lib/admin-auth";
import { NextResponse } from "next/server";

/* POST /api/admin/login — password → HMAC cookie (7 days). */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string };
    if (!body.password || !checkPassword(body.password)) {
      return NextResponse.json(
        { ok: false, error: "Senha incorreta." },
        { status: 401 },
      );
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, makeAdminToken(), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === "production",
    });
    return res;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Pedido inválido." },
      { status: 400 },
    );
  }
}
