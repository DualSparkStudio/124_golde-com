import { db } from "@/lib/mockDb";
import { v4 as uuidv4 } from "uuid";

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function createProduct(input: {
  name: string; category: "gold" | "silver"; typeId: string; weight: number; purity: string;
  quantity: number; imageIds: string[]; imageUrls?: string[]; description?: string | null;
  purchasePrice: number; salePrice?: number | null; discountPrice?: number | null;
  makingCharges: number; occasion?: string[]; videoUrl?: string | null; isFeatured?: boolean;
}) {
  let slug = generateSlug(input.name);
  if (db.products.findBySlug(slug)) slug = `${slug}-${uuidv4().slice(0, 6)}`;

  return db.products.create({
    name: input.name, slug, category: input.category, typeId: input.typeId,
    weight: input.weight, purity: input.purity, quantity: input.quantity,
    images: input.imageIds.map((url, i) => ({ id: uuidv4(), productId: "", publicId: url, url: input.imageUrls?.[i] ?? url, isPrimary: i === 0, sortOrder: i })),
    videoUrl: input.videoUrl ?? null, description: input.description ?? null,
    purchasePrice: input.purchasePrice, salePrice: input.salePrice ?? null,
    discountPrice: input.discountPrice ?? null, makingCharges: input.makingCharges,
    occasion: input.occasion ?? [], isFeatured: input.isFeatured ?? false, status: "active",
  });
}

export async function updateProduct(id: string, input: Record<string, unknown>) {
  if (input.imageIds) {
    const ids = input.imageIds as string[];
    const urls = (input.imageUrls as string[] | undefined) ?? ids;
    input.images = ids.map((url, i) => ({ id: uuidv4(), productId: id, publicId: url, url: urls[i] ?? url, isPrimary: i === 0, sortOrder: i }));
    delete input.imageIds;
    delete input.imageUrls;
  }
  return db.products.update(id, input as never);
}

export async function deleteProduct(id: string) {
  return db.products.delete(id);
}

export async function bulkUpdateStatus(ids: string[], status: "active" | "inactive" | "draft") {
  let count = 0;
  for (const id of ids) { if (db.products.update(id, { status })) count++; }
  return count;
}
