import { db } from "@/lib/db";

/* ============================================================
 * GET /api/media/[id] — serves a WebP image stored in the
 * database (Media table) by /api/admin/upload. Immutable cache:
 * rows are write-once, so the URL can be cached forever.
 * ============================================================ */

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const row = await db.media.findUnique({ where: { id } });
    if (!row) {
      return new Response("Not found", { status: 404 });
    }
    const bytes = Buffer.from(row.data, "base64");
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": row.mime || "image/webp",
        "Content-Length": String(bytes.byteLength),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
