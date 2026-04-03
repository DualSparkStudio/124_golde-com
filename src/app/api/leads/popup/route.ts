import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.phone) return NextResponse.json({ error: "Phone required" }, { status: 400 });
  console.log("[Lead] Popup offer:", body);
  return NextResponse.json({ success: true, offerCode: "FIRST5" });
}
