import { isAdminRequest } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

/* ============================================================
 * GET    /api/admin/news — all posts
 * POST   /api/admin/news — create { title, slug?, excerpt, content, cover, tag, published }
 * PATCH  /api/admin/news — update { id, ...fields }
 * DELETE /api/admin/news?id=…
 * ============================================================ */

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function guard() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  const rows = await db.newsPost.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ ok: true, rows });
}

export async function POST(request: Request) {
  const denied = await guard();
  if (denied) return denied;
  try {
    const body = (await request.json()) as {
      title?: string;
      slug?: string;
      excerpt?: string;
      content?: string;
      cover?: string;
      tag?: string;
      sourceUrl?: string;
      published?: boolean;
    };
    if (!body.title || !body.content) {
      return NextResponse.json(
        { ok: false, error: "Título e conteúdo são obrigatórios." },
        { status: 400 },
      );
    }
    let slug = body.slug ? slugify(body.slug) : slugify(body.title);
    if (!slug) slug = `post-${Date.now()}`;
    const exists = await db.newsPost.findUnique({ where: { slug } });
    if (exists) slug = `${slug}-${Date.now().toString(36)}`;
    const row = await db.newsPost.create({
      data: {
        slug,
        title: body.title,
        excerpt: body.excerpt ?? body.content.slice(0, 180),
        content: body.content,
        cover: body.cover ?? "",
        tag: body.tag ?? "club",
        sourceUrl: body.sourceUrl ?? "",
        published: body.published ?? true,
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
      excerpt?: string;
      content?: string;
      cover?: string;
      tag?: string;
      sourceUrl?: string;
      published?: boolean;
    };
    if (!body.id) return NextResponse.json({ ok: false }, { status: 400 });
    const { id, ...data } = body;
    const row = await db.newsPost.update({ where: { id }, data });
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
  await db.newsPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
