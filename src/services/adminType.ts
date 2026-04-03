import { db } from "@/lib/mockDb";

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function createType(name: string, category: "gold" | "silver" | "both") {
  const all = db.types.getAll();
  return db.types.create({ name, slug: toSlug(name), category, isActive: true, sortOrder: all.length + 1 });
}

export async function updateType(id: string, name: string) {
  return db.types.update(id, { name, slug: toSlug(name) });
}

export async function deleteType(id: string) {
  return db.types.delete(id);
}
