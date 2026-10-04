import { isAdminRequest } from "@/lib/admin-auth";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { db } from "@/lib/db";

/* ============================================================
 * POST /api/admin/upload — multipart image upload.
 * Converts to WebP (max 1920w) and stores the bytes IN THE
 * DATABASE (Media table, base64) — serverless-safe: Vercel has
 * no writable filesystem, so nothing touches public/.
 * Returns the serving URL /api/media/<id> to paste anywhere
 * (gallery, cover, hero, player photo…).
 * ============================================================ */

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Ficheiro ausente." },
        { status: 400 },
      );
    }
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { ok: false, error: "Imagem acima de 4 MB (limite da Vercel). Reduza a imagem e tente novamente." },
        { status: 400 },
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const webp = await sharp(buffer)
      .rotate()
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const row = await db.media.create({
      data: {
        filename: file.name.slice(0, 180),
        mime: "image/webp",
        size: webp.byteLength,
        data: webp.toString("base64"),
      },
    });

    return NextResponse.json({
      ok: true,
      url: `/api/media/${row.id}`,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Falha no upload." },
      { status: 500 },
    );
  }
}
