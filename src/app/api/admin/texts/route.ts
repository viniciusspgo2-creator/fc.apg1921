import { isAdminRequest } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

/* ============================================================
 * GET  /api/admin/texts?locale=fr — all overrides for a locale
 * PUT  /api/admin/texts           — upsert { key, locale, value }
 * DELETE /api/admin/texts         — revert { key, locale }
 * ============================================================ */

async function guard() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return null;
}

export async function GET(request: Request) {
  const denied = await guard();
  if (denied) return denied;
  const locale = new URL(request.url).searchParams.get("locale") ?? "fr";
  const rows = await db.siteText.findMany({
    where: { locale },
    orderBy: { key: "asc" },
  });
  return NextResponse.json({ ok: true, rows });
}

export async function PUT(request: Request) {
  const denied = await guard();
  if (denied) return denied;
  try {
    const { key, locale, value } = (await request.json()) as {
      key?: string;
      locale?: string;
      value?: string;
    };
    if (!key || !locale || typeof value !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    if (value.trim() === "") {
      await db.siteText.deleteMany({ where: { key, locale } });
    } else {
      await db.siteText.upsert({
        where: { key_locale: { key, locale } },
        create: { key, locale, value },
        update: { value },
      });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const denied = await guard();
  if (denied) return denied;
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  const locale = url.searchParams.get("locale");
  if (!key || !locale) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  await db.siteText.deleteMany({ where: { key, locale } });
  return NextResponse.json({ ok: true });
}
