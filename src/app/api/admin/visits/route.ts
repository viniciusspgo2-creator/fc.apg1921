import { isAdminRequest } from "@/lib/admin-auth";
import { getVisitStats } from "@/lib/content";
import { NextResponse } from "next/server";

/* GET /api/admin/visits — daily stats for the dashboard. */
export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const stats = await getVisitStats();
  return NextResponse.json({ ok: true, ...stats });
}
