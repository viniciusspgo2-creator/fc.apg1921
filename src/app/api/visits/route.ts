import { db } from "@/lib/db";
import { zurichDay } from "@/lib/content";
import { NextResponse } from "next/server";

/* ============================================================
 * POST /api/visits — anonymous daily visit counter.
 * No cookies, no fingerprint: one row per Zurich day, +1 per
 * session (the client fires it once per browser session).
 * ============================================================ */

export async function POST() {
  try {
    const day = zurichDay();
    const row = await db.visit.upsert({
      where: { day },
      create: { day, count: 1 },
      update: { count: { increment: 1 } },
    });
    return NextResponse.json({ ok: true, count: row.count });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
