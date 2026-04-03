import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mockDb";
import { v4 as uuidv4 } from "uuid";

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status") ?? undefined;
  const query = searchParams.get("query") ?? undefined;
  const page = parseInt(searchParams.get("page") ?? "1");
  const pageSize = parseInt(searchParams.get("pageSize") ?? "20");

  let products = db.products.getAll();
  if (status) products = products.filter((p) => p.status === status);
  if (query) {
    const q = query.toLowerCase();
    products = products.filter((p) => p.name.toLowerCase().includes(q));
  }
  const total = products.length;
  const items = products.slice((page - 1) * pageSize, page * pageSize);
  return NextResponse.json({ products: items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  if (!body.weight || body.weight <= 0) return NextResponse.json({ error: "Weight must be > 0" }, { status: 400 });
  if (!body.imageIds?.length) return NextResponse.json({ error: "At least one image required" }, { status: 400 });

  let slug = generateSlug(body.name);
  if (db.products.findBySlug(slug)) slug = `${slug}-${uuidv4().slice(0, 6)}`;

  const product = db.products.create({
    name: body.name,
    slug,
    category: body.category ?? "gold",
    typeId: body.typeId ?? "",
    weight: body.weight,
    purity: body.purity ?? "",
    quantity: body.quantity ?? 0,
    images: (body.imageIds as string[]).map((url, i) => ({ id: uuidv4(), productId: "", publicId: url, url, isPrimary: i === 0, sortOrder: i })),
    videoUrl: body.videoUrl ?? null,
    description: body.description ?? null,
    purchasePrice: body.purchasePrice ?? 0,
    salePrice: body.salePrice ?? null,
    discountPrice: body.discountPrice ?? null,
    makingCharges: body.makingCharges ?? 0,
    occasion: body.occasion ?? [],
    isFeatured: body.isFeatured ?? false,
    status: "active",
  });
  return NextResponse.json({ product }, { status: 201 });
}
