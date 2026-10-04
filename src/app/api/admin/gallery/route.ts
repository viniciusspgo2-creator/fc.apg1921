import { isAdminRequest } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

/* ============================================================
 * GET    /api/admin/gallery — all rows
 * POST   /api/admin/gallery — create { url, title, category }
 * PATCH  /api/admin/gallery — update { id, ...fields }
 * DELETE /api/admin/gallery?id=…
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
  const rows = await db.galleryImage.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ ok: true, rows });
}

export async function POST(request: Request) {
  const denied = await guard();
  if (denied) return denied;
  try {
    const { url, title, category } = (await request.json()) as {
      url?: string;
      title?: string;
      category?: string;
    };
    if (!url) return NextResponse.json({ ok: false }, { status: 400 });
    const last = await db.galleryImage.findFirst({
      orderBy: { sortOrder: "desc" },
    });
    const row = await db.galleryImage.create({
      data: {
        url,
        title: title ?? "",
        category: category ?? "clube",
        sortOrder: (last?.sortOrder ?? -1) + 1,
      },
    });
    return NextResponse.json({ ok: true, row });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const denied = await guard();
  if (denied) return denied;
  try {
    const body = (await request.json()) as {
      id?: string;
      title?: string;
      category?: string;
      active?: boolean;
      sortOrder?: number;
      url?: string;
    };
    if (!body.id) return NextResponse.json({ ok: false }, { status: 400 });
    const { id, ...data } = body;
    const row = await db.galleryImage.update({ where: { id }, data });
    return NextResponse.json({ ok: true, row });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const denied = await guard();
  if (denied) return denied;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  await db.galleryImage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
