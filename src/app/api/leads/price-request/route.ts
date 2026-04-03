import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.phone) return NextResponse.json({ error: "Phone required" }, { status: 400 });
  console.log("[Lead] Price request:", body);
  return NextResponse.json({ success: true, message: "We'll contact you within 24 hours." });
}
