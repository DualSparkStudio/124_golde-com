import { db } from "@/lib/mockDb";

const GUEST = "guest";

export async function getWishlist(userId?: string) {
  const uid = userId ?? GUEST;
  const items = db.wishlist.getForUser(uid);
  return items.map((w) => {
    const p = db.products.findById(w.productId);
    if (!p) return null;
    const { purchasePrice: _pp, ...safe } = p;
    return { ...w, product: safe };
  }).filter(Boolean);
}

export async function addToWishlist(userId: string | undefined, productId: string) {
  const uid = userId ?? GUEST;
  const item = db.wishlist.add(uid, productId);
  return { item, count: db.wishlist.getForUser(uid).length };
}

export async function removeFromWishlist(userId: string | undefined, productId: string) {
  const uid = userId ?? GUEST;
  db.wishlist.remove(uid, productId);
  return { count: db.wishlist.getForUser(uid).length };
}

export async function mergeGuestWishlist(guestItems: string[], userId: string) {
  for (const productId of guestItems) {
    db.wishlist.add(userId, productId);
  }
  return db.wishlist.getForUser(userId);
}
