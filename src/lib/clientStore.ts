/**
 * Client-side store for cart and wishlist using localStorage directly.
 * This avoids the server/client mismatch with the mockDb.
 */

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  weight: number;
  purity: string;
  quantity: number;
  slug: string;
  category: string;
}

function get<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function set<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ── Wishlist ──────────────────────────────────────────────────────────────────

export const wishlistStore = {
  get: (): string[] => get<string[]>("wishlist_ids", []),
  add: (productId: string): string[] => {
    const ids = wishlistStore.get();
    if (ids.includes(productId)) return ids;
    const updated = [...ids, productId];
    set("wishlist_ids", updated);
    return updated;
  },
  remove: (productId: string): string[] => {
    const updated = wishlistStore.get().filter((id) => id !== productId);
    set("wishlist_ids", updated);
    return updated;
  },
  has: (productId: string): boolean => wishlistStore.get().includes(productId),
  count: (): number => wishlistStore.get().length,
};

// ── Cart ──────────────────────────────────────────────────────────────────────

export const cartStore = {
  get: (): CartItem[] => get<CartItem[]>("cart_items", []),
  add: (item: CartItem): CartItem[] => {
    const items = cartStore.get();
    const existing = items.findIndex((i) => i.productId === item.productId);
    let updated: CartItem[];
    if (existing >= 0) {
      updated = items.map((i, idx) => idx === existing ? { ...i, quantity: i.quantity + item.quantity } : i);
    } else {
      updated = [...items, item];
    }
    set("cart_items", updated);
    return updated;
  },
  remove: (productId: string): CartItem[] => {
    const updated = cartStore.get().filter((i) => i.productId !== productId);
    set("cart_items", updated);
    return updated;
  },
  updateQty: (productId: string, quantity: number): CartItem[] => {
    const updated = quantity <= 0
      ? cartStore.get().filter((i) => i.productId !== productId)
      : cartStore.get().map((i) => i.productId === productId ? { ...i, quantity } : i);
    set("cart_items", updated);
    return updated;
  },
  clear: (): void => set("cart_items", []),
  count: (): number => cartStore.get().reduce((sum, i) => sum + i.quantity, 0),
  total: (): number => cartStore.get().reduce((sum, i) => sum + i.price * i.quantity, 0),
};
