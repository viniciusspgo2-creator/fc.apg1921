import { isAdminRequest } from "@/lib/admin-auth";
import { getAllSettings } from "@/lib/content";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

/* ============================================================
 * GET /api/admin/settings — all settings
 * PUT /api/admin/settings — upsert { key, value }
 * ============================================================ */

async function guard() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  const rows = await getAllSettings();
  return NextResponse.json({ ok: true, rows });
}

export async function PUT(request: Request) {
  const denied = await guard();
  if (denied) return denied;
  try {
    const { key, value } = (await request.json()) as {
      key?: string;
      value?: string;
    };
    if (!key || typeof value !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    await db.setting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
