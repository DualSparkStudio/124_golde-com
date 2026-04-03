import { NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

export async function GET() {
  const rate = db.goldRate.get();
  return NextResponse.json({ rate });
}
