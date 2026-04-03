import type { PrismaClient } from "@prisma/client";

/**
 * Converts a product name into a URL-safe slug.
 * Lowercases, replaces spaces and special characters with hyphens,
 * collapses consecutive hyphens, and trims leading/trailing hyphens.
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric (keep spaces and hyphens)
    .replace(/[\s-]+/g, "-")       // collapse spaces/hyphens into a single hyphen
    .replace(/^-+|-+$/g, "");      // trim leading/trailing hyphens
}

/**
 * Generates a short random alphanumeric suffix (6 chars).
 */
function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 8);
}

/**
 * Ensures the slug is unique in the database.
 * If a collision is found, appends a random suffix and retries.
 */
export async function ensureUniqueSlug(
  baseSlug: string,
  prisma: PrismaClient,
): Promise<string> {
  let slug = baseSlug;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing) {
      return slug;
    }
    slug = `${baseSlug}-${randomSuffix()}`;
  }
}
