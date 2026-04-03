import { NextRequest, NextResponse } from "next/server";

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: "Invalid file type" }, { status: 422 });
    if (file.size > MAX_SIZE) return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 422 });

    // Convert to base64 data URL for localStorage storage
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;
    const publicId = `upload_${Date.now()}_${file.name.replace(/[^a-z0-9.]/gi, "_")}`;

    return NextResponse.json({ publicId, url: dataUrl });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 422 });
  }
}
