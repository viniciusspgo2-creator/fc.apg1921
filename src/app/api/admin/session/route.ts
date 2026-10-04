import { isAdminRequest } from "@/lib/admin-auth";
import { NextResponse } from "next/server";

/* GET /api/admin/session — { authenticated: boolean } */
export async function GET() {
  return NextResponse.json({ authenticated: await isAdminRequest() });
}
