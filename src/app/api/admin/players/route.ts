import { isPlayerPosition } from "@/lib/content-schema";
import { isAdminRequest } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

/* ============================================================
 * GET    /api/admin/players — all rows (admin sees hidden ones too)
 * POST   /api/admin/players — create { name, position, number?, photoUrl, sortOrder, visible }
 * PUT    /api/admin/players — update by id { id, ...fields }
 * DELETE /api/admin/players?id=…
 * ============================================================ */

async function guard() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return null;
}

/** Shape accepted by POST/PUT (validated before touching the DB). */
type PlayerInput = {
  name: string;
  position: string;
  number: number | null;
  photoUrl: string;
  sortOrder: number;
  visible: boolean;
};

/**
 * Validates the raw JSON body into a PlayerInput.
 * Returns the error message or the parsed data when the payload is valid.
 */
function parsePlayerInput(body: unknown): { data: PlayerInput } | { error: string } {
  const b = (body ?? {}) as Record<string, unknown>;

  const name = typeof b.name === "string" ? b.name.trim() : "";
  if (!name) return { error: "O nome é obrigatório." };

  if (!isPlayerPosition(b.position)) {
    return { error: "Posição inválida." };
  }

  // number: optional shirt number 1-99 (null when absent/empty)
  let number: number | null = null;
  if (b.number !== undefined && b.number !== null && b.number !== "") {
    const n = typeof b.number === "number" ? b.number : Number(b.number);
    if (!Number.isInteger(n) || n < 1 || n > 99) {
      return { error: "O número deve ser um inteiro entre 1 e 99." };
    }
    number = n;
  }

  const photoUrl = typeof b.photoUrl === "string" ? b.photoUrl.trim() : "";

  let sortOrder = 0;
  if (b.sortOrder !== undefined && b.sortOrder !== null && b.sortOrder !== "") {
    const s = typeof b.sortOrder === "number" ? b.sortOrder : Number(b.sortOrder);
    if (!Number.isInteger(s)) return { error: "A ordem deve ser um inteiro." };
    sortOrder = s;
  }

  const visible = b.visible === undefined ? true : Boolean(b.visible);

  return {
    data: { name, position: b.position, number, photoUrl, sortOrder, visible },
  };
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  const rows = await db.player.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json({ ok: true, rows });
}

export async function POST(request: Request) {
  const denied = await guard();
  if (denied) return denied;
  try {
    const parsed = parsePlayerInput(await request.json());
    if ("error" in parsed) {
      return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
    }
    const row = await db.player.create({ data: parsed.data });
    return NextResponse.json({ ok: true, row });
  } catch {
    return NextResponse.json({ ok: false, error: "Pedido inválido." }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const denied = await guard();
  if (denied) return denied;
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const id = typeof body.id === "string" ? body.id : "";
    if (!id) {
      return NextResponse.json(
        { ok: false, error: "ID ausente." },
        { status: 400 },
      );
    }
    // Support partial updates (e.g. a visibility toggle): when the full
    // shape is not present, merge the stored row with the incoming fields
    // so the same strict validation can run on both paths.
    const hasFullShape = body.name !== undefined && body.position !== undefined;
    const payload = hasFullShape
      ? body
      : { ...(await db.player.findUnique({ where: { id } })), ...body };

    const parsed = parsePlayerInput(payload);
    if ("error" in parsed) {
      return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
    }

    // Only apply fields actually present in the request (partial PUT).
    const patch: Partial<PlayerInput> = {};
    if (body.name !== undefined) patch.name = parsed.data.name;
    if (body.position !== undefined) patch.position = parsed.data.position;
    if (body.number !== undefined) patch.number = parsed.data.number;
    if (body.photoUrl !== undefined) patch.photoUrl = parsed.data.photoUrl;
    if (body.sortOrder !== undefined) patch.sortOrder = parsed.data.sortOrder;
    if (body.visible !== undefined) patch.visible = parsed.data.visible;
    if (Object.keys(patch).length === 0) {
      return NextResponse.json(
        { ok: false, error: "Nenhum campo para atualizar." },
        { status: 400 },
      );
    }
    const row = await db.player.update({ where: { id }, data: patch });
    return NextResponse.json({ ok: true, row });
  } catch {
    return NextResponse.json({ ok: false, error: "Pedido inválido." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const denied = await guard();
  if (denied) return denied;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { ok: false, error: "ID ausente." },
      { status: 400 },
    );
  }
  try {
    await db.player.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Jogador não encontrado." },
      { status: 400 },
    );
  }
}
