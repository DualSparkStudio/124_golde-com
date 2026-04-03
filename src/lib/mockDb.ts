/**
 * Mock database using localStorage (client) / in-memory (server).
 * Drop-in replacement for Prisma while running without a real DB.
 */

import { v4 as uuidv4 } from "uuid";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MockProduct {
  id: string;
  name: string;
  slug: string;
  category: "gold" | "silver";
  typeId: string;
  weight: number;
  purity: string;
  quantity: number;
  images: { id: string; productId: string; publicId: string; url: string; isPrimary: boolean; sortOrder: number }[];
  videoUrl: string | null;
  description: string | null;
  purchasePrice: number;
  salePrice: number | null;
  discountPrice: number | null;
  makingCharges: number;
  occasion: string[];
  isFeatured: boolean;
  status: "active" | "inactive" | "draft";
  createdAt: string;
  updatedAt: string;
}

export interface MockJewelryType {
  id: string;
  name: string;
  slug: string;
  category: "gold" | "silver" | "both";
  isActive: boolean;
  sortOrder: number;
}

export interface MockOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  items: MockOrderItem[];
  subtotal: number;
  shippingCost: number;
  gstAmount: number;
  gstRate: number;
  totalAmount: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MockOrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  weight: number;
  quantity: number;
  unitPrice: number;
  makingCharges: number;
  purchasePrice: number;
}

export interface MockMerchantOrder {
  id: string;
  merchantName: string;
  invoiceNumber: string | null;
  items: MockMerchantOrderItem[];
  totalWeight: number;
  totalCost: number;
  purity: string;
  purchaseDate: string;
  notes: string | null;
  createdAt: string;
}

export interface MockMerchantOrderItem {
  id: string;
  merchantOrderId: string;
  description: string;
  weight: number;
  ratePerGram: number;
  makingCharges: number;
  amount: number;
}

export interface MockOtherCharges {
  id: string;
  shippingCost: number;
  gstRate: number;
  otherChargesLabel: string | null;
  otherChargesAmount: number;
  updatedAt: string;
}

export interface MockGoldRate {
  id: string;
  ratePerGram: number;
  ratePerTola: number;
  purity: string;
  source: "api" | "manual";
  updatedAt: string;
}

export interface MockTestimonial {
  id: string;
  customerName: string;
  location: string | null;
  rating: number;
  content: string;
  productId: string | null;
  imageUrl: string | null;
  isPublished: boolean;
  sortOrder: number;
}

export interface MockWishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const SEED_TYPES: MockJewelryType[] = [
  { id: "type-1", name: "Pendant", slug: "pendant", category: "both", isActive: true, sortOrder: 1 },
  { id: "type-2", name: "Necklace", slug: "necklace", category: "both", isActive: true, sortOrder: 2 },
  { id: "type-3", name: "Ring", slug: "ring", category: "both", isActive: true, sortOrder: 3 },
  { id: "type-4", name: "Earrings", slug: "earrings", category: "both", isActive: true, sortOrder: 4 },
  { id: "type-5", name: "Bracelet", slug: "bracelet", category: "both", isActive: true, sortOrder: 5 },
  { id: "type-6", name: "Chain", slug: "chain", category: "gold", isActive: true, sortOrder: 6 },
  { id: "type-7", name: "Bangle", slug: "bangle", category: "gold", isActive: true, sortOrder: 7 },
  { id: "type-8", name: "Anklet", slug: "anklet", category: "silver", isActive: true, sortOrder: 8 },
];

const PLACEHOLDER = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80";
const PLACEHOLDER2 = "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=600&q=80";
const PLACEHOLDER3 = "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80";
const PLACEHOLDER4 = "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80";
const PLACEHOLDER5 = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80";
const PLACEHOLDER6 = "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80";

function makeImg(productId: string, url: string) {
  return [{ id: uuidv4(), productId, publicId: url, url, isPrimary: true, sortOrder: 0 }];
}

const SEED_PRODUCTS: MockProduct[] = [
  { id: "prod-1", name: "22K Gold Lotus Pendant", slug: "22k-gold-lotus-pendant", category: "gold", typeId: "type-1", weight: 2.1, purity: "22K", quantity: 5, images: makeImg("prod-1", PLACEHOLDER), videoUrl: null, description: "Delicate lotus pendant crafted in 22K gold. Perfect for daily wear.", purchasePrice: 12000, salePrice: 15500, discountPrice: 14800, makingCharges: 1200, occasion: ["daily-wear", "festival"], isFeatured: true, status: "active", createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: "prod-2", name: "22K Gold Bridal Necklace Set", slug: "22k-gold-bridal-necklace-set", category: "gold", typeId: "type-2", weight: 18.5, purity: "22K", quantity: 2, images: makeImg("prod-2", PLACEHOLDER2), videoUrl: null, description: "Stunning bridal necklace set with intricate temple work. A timeless heirloom.", purchasePrice: 105000, salePrice: 138000, discountPrice: null, makingCharges: 8500, occasion: ["wedding"], isFeatured: true, status: "active", createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: "prod-3", name: "22K Gold Finger Ring", slug: "22k-gold-finger-ring", category: "gold", typeId: "type-3", weight: 3.2, purity: "22K", quantity: 8, images: makeImg("prod-3", PLACEHOLDER3), videoUrl: null, description: "Classic gold ring with floral motif. Available in multiple sizes.", purchasePrice: 18000, salePrice: 23500, discountPrice: 22000, makingCharges: 1800, occasion: ["daily-wear", "wedding"], isFeatured: false, status: "active", createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: "prod-4", name: "925 Silver Jhumka Earrings", slug: "925-silver-jhumka-earrings", category: "silver", typeId: "type-4", weight: 8.0, purity: "925", quantity: 12, images: makeImg("prod-4", PLACEHOLDER4), videoUrl: null, description: "Traditional jhumka earrings in 925 sterling silver with oxidised finish.", purchasePrice: 2200, salePrice: 3200, discountPrice: 2900, makingCharges: 400, occasion: ["festival", "daily-wear"], isFeatured: true, status: "active", createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: "prod-5", name: "22K Gold Mangalsutra Chain", slug: "22k-gold-mangalsutra-chain", category: "gold", typeId: "type-6", weight: 5.5, purity: "22K", quantity: 4, images: makeImg("prod-5", PLACEHOLDER5), videoUrl: null, description: "Traditional mangalsutra chain in 22K gold. Lightweight and elegant.", purchasePrice: 31000, salePrice: 40500, discountPrice: null, makingCharges: 2800, occasion: ["wedding", "daily-wear"], isFeatured: true, status: "active", createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: "prod-6", name: "925 Silver Kada Bracelet", slug: "925-silver-kada-bracelet", category: "silver", typeId: "type-5", weight: 22.0, purity: "925", quantity: 6, images: makeImg("prod-6", PLACEHOLDER6), videoUrl: null, description: "Bold silver kada with traditional engravings. Unisex design.", purchasePrice: 5500, salePrice: 7800, discountPrice: 7200, makingCharges: 900, occasion: ["festival", "daily-wear"], isFeatured: false, status: "active", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "prod-7", name: "22K Gold Bangle Pair", slug: "22k-gold-bangle-pair", category: "gold", typeId: "type-7", weight: 12.0, purity: "22K", quantity: 3, images: makeImg("prod-7", PLACEHOLDER), videoUrl: null, description: "Pair of plain gold bangles. Classic and versatile.", purchasePrice: 68000, salePrice: null, discountPrice: null, makingCharges: 4200, occasion: ["wedding", "festival"], isFeatured: false, status: "active", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "prod-8", name: "925 Silver Anklet Pair", slug: "925-silver-anklet-pair", category: "silver", typeId: "type-8", weight: 15.0, purity: "925", quantity: 10, images: makeImg("prod-8", PLACEHOLDER2), videoUrl: null, description: "Delicate silver anklets with tiny bells. Traditional design.", purchasePrice: 3800, salePrice: 5500, discountPrice: 5000, makingCharges: 600, occasion: ["daily-wear", "festival"], isFeatured: false, status: "active", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const SEED_ORDERS: MockOrder[] = [
  { id: "order-1", orderNumber: "ORD-2024-0001", customerName: "Priya Sharma", customerPhone: "9876543210", customerEmail: "priya@example.com", items: [{ id: "oi-1", orderId: "order-1", productId: "prod-1", productName: "22K Gold Lotus Pendant", weight: 2.1, quantity: 1, unitPrice: 14800, makingCharges: 1200, purchasePrice: 12000 }], subtotal: 14800, shippingCost: 99, gstAmount: 444, gstRate: 0.03, totalAmount: 15343, status: "delivered", notes: null, createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: "order-2", orderNumber: "ORD-2024-0002", customerName: "Anita Patel", customerPhone: "9123456789", customerEmail: null, items: [{ id: "oi-2", orderId: "order-2", productId: "prod-4", productName: "925 Silver Jhumka Earrings", weight: 8.0, quantity: 1, unitPrice: 2900, makingCharges: 400, purchasePrice: 2200 }], subtotal: 2900, shippingCost: 99, gstAmount: 87, gstRate: 0.03, totalAmount: 3086, status: "shipped", notes: null, createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: "order-3", orderNumber: "ORD-2024-0003", customerName: "Meera Reddy", customerPhone: "9988776655", customerEmail: "meera@example.com", items: [{ id: "oi-3", orderId: "order-3", productId: "prod-3", productName: "22K Gold Finger Ring", weight: 3.2, quantity: 1, unitPrice: 22000, makingCharges: 1800, purchasePrice: 18000 }], subtotal: 22000, shippingCost: 99, gstAmount: 660, gstRate: 0.03, totalAmount: 22759, status: "pending", notes: null, createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: "order-4", orderNumber: "ORD-2024-0004", customerName: "Sunita Joshi", customerPhone: "9765432109", customerEmail: null, items: [{ id: "oi-4", orderId: "order-4", productId: "prod-5", productName: "22K Gold Mangalsutra Chain", weight: 5.5, quantity: 1, unitPrice: 40500, makingCharges: 2800, purchasePrice: 31000 }], subtotal: 40500, shippingCost: 99, gstAmount: 1215, gstRate: 0.03, totalAmount: 41814, status: "confirmed", notes: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const SEED_TESTIMONIALS: MockTestimonial[] = [
  { id: "test-1", customerName: "Priya Sharma", location: "Mumbai", rating: 5, content: "Absolutely stunning quality! The gold pendant I ordered exceeded my expectations. The craftsmanship is exquisite.", productId: "prod-1", imageUrl: null, isPublished: true, sortOrder: 1 },
  { id: "test-2", customerName: "Anita Patel", location: "Ahmedabad", rating: 5, content: "The silver jhumkas are gorgeous. Got so many compliments at the festival. Will definitely order again!", productId: "prod-4", imageUrl: null, isPublished: true, sortOrder: 2 },
  { id: "test-3", customerName: "Meera Reddy", location: "Hyderabad", rating: 4, content: "Beautiful bridal set. The packaging was luxurious and delivery was on time. Highly recommend.", productId: "prod-2", imageUrl: null, isPublished: true, sortOrder: 3 },
  { id: "test-4", customerName: "Kavitha Nair", location: "Kochi", rating: 5, content: "Authentic hallmarked gold. The weight and purity are exactly as described. Trustworthy shop!", productId: null, imageUrl: null, isPublished: true, sortOrder: 4 },
];

const SEED_OTHER_CHARGES: MockOtherCharges = {
  id: "charges-1",
  shippingCost: 99,
  gstRate: 0.03,
  otherChargesLabel: null,
  otherChargesAmount: 0,
  updatedAt: new Date().toISOString(),
};

const SEED_GOLD_RATE: MockGoldRate = {
  id: "rate-1",
  ratePerGram: 6450,
  ratePerTola: 75200,
  purity: "22K",
  source: "manual",
  updatedAt: new Date().toISOString(),
};

// ─── Storage Engine ───────────────────────────────────────────────────────────

const memStore: Record<string, unknown> = {};

function storageGet<T>(key: string): T | null {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(`mockdb_${key}`);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch { return null; }
  }
  return (memStore[key] as T) ?? null;
}

function storageSet<T>(key: string, value: T): void {
  if (typeof window !== "undefined") {
    try { localStorage.setItem(`mockdb_${key}`, JSON.stringify(value)); } catch {}
  } else {
    memStore[key] = value;
  }
}

function getOrSeed<T>(key: string, seed: T): T {
  const existing = storageGet<T>(key);
  if (existing !== null) return existing;
  storageSet(key, seed);
  return seed;
}

// ─── Collections ─────────────────────────────────────────────────────────────

export const db = {
  products: {
    getAll: (): MockProduct[] => getOrSeed("products", SEED_PRODUCTS),
    save: (items: MockProduct[]) => storageSet("products", items),
    findById: (id: string) => db.products.getAll().find((p) => p.id === id) ?? null,
    findBySlug: (slug: string) => db.products.getAll().find((p) => p.slug === slug) ?? null,
    create: (data: Omit<MockProduct, "id" | "createdAt" | "updatedAt">): MockProduct => {
      const product: MockProduct = { ...data, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      const all = db.products.getAll();
      db.products.save([...all, product]);
      return product;
    },
    update: (id: string, data: Partial<MockProduct>): MockProduct | null => {
      const all = db.products.getAll();
      const idx = all.findIndex((p) => p.id === id);
      if (idx === -1) return null;
      const updated = { ...all[idx], ...data, updatedAt: new Date().toISOString() };
      all[idx] = updated;
      db.products.save(all);
      return updated;
    },
    delete: (id: string): boolean => {
      const all = db.products.getAll();
      const filtered = all.filter((p) => p.id !== id);
      if (filtered.length === all.length) return false;
      db.products.save(filtered);
      return true;
    },
  },

  types: {
    getAll: (): MockJewelryType[] => getOrSeed("types", SEED_TYPES),
    save: (items: MockJewelryType[]) => storageSet("types", items),
    findById: (id: string) => db.types.getAll().find((t) => t.id === id) ?? null,
    create: (data: Omit<MockJewelryType, "id">): MockJewelryType => {
      const type: MockJewelryType = { ...data, id: uuidv4() };
      db.types.save([...db.types.getAll(), type]);
      return type;
    },
    update: (id: string, data: Partial<MockJewelryType>): MockJewelryType | null => {
      const all = db.types.getAll();
      const idx = all.findIndex((t) => t.id === id);
      if (idx === -1) return null;
      all[idx] = { ...all[idx], ...data };
      db.types.save(all);
      return all[idx];
    },
    delete: (id: string): boolean => {
      const all = db.types.getAll();
      const filtered = all.filter((t) => t.id !== id);
      if (filtered.length === all.length) return false;
      db.types.save(filtered);
      return true;
    },
  },

  orders: {
    getAll: (): MockOrder[] => getOrSeed("orders", SEED_ORDERS),
    save: (items: MockOrder[]) => storageSet("orders", items),
    findById: (id: string) => db.orders.getAll().find((o) => o.id === id) ?? null,
    create: (data: Omit<MockOrder, "id" | "createdAt" | "updatedAt">): MockOrder => {
      const order: MockOrder = { ...data, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      db.orders.save([...db.orders.getAll(), order]);
      return order;
    },
    update: (id: string, data: Partial<MockOrder>): MockOrder | null => {
      const all = db.orders.getAll();
      const idx = all.findIndex((o) => o.id === id);
      if (idx === -1) return null;
      all[idx] = { ...all[idx], ...data, updatedAt: new Date().toISOString() };
      db.orders.save(all);
      return all[idx];
    },
  },

  merchantOrders: {
    getAll: (): MockMerchantOrder[] => getOrSeed("merchantOrders", []),
    save: (items: MockMerchantOrder[]) => storageSet("merchantOrders", items),
    create: (data: Omit<MockMerchantOrder, "id" | "createdAt">): MockMerchantOrder => {
      const order: MockMerchantOrder = { ...data, id: uuidv4(), createdAt: new Date().toISOString() };
      db.merchantOrders.save([...db.merchantOrders.getAll(), order]);
      return order;
    },
    update: (id: string, data: Partial<MockMerchantOrder>): MockMerchantOrder | null => {
      const all = db.merchantOrders.getAll();
      const idx = all.findIndex((o) => o.id === id);
      if (idx === -1) return null;
      all[idx] = { ...all[idx], ...data };
      db.merchantOrders.save(all);
      return all[idx];
    },
  },

  otherCharges: {
    get: (): MockOtherCharges => getOrSeed("otherCharges", SEED_OTHER_CHARGES),
    set: (data: Partial<MockOtherCharges>) => {
      const current = db.otherCharges.get();
      storageSet("otherCharges", { ...current, ...data, updatedAt: new Date().toISOString() });
    },
  },

  goldRate: {
    get: (): MockGoldRate => getOrSeed("goldRate", SEED_GOLD_RATE),
    set: (data: Partial<MockGoldRate>) => {
      const current = db.goldRate.get();
      storageSet("goldRate", { ...current, ...data, updatedAt: new Date().toISOString() });
    },
  },

  testimonials: {
    getAll: (): MockTestimonial[] => getOrSeed("testimonials", SEED_TESTIMONIALS),
    save: (items: MockTestimonial[]) => storageSet("testimonials", items),
    create: (data: Omit<MockTestimonial, "id">): MockTestimonial => {
      const t: MockTestimonial = { ...data, id: uuidv4() };
      db.testimonials.save([...db.testimonials.getAll(), t]);
      return t;
    },
    update: (id: string, data: Partial<MockTestimonial>): MockTestimonial | null => {
      const all = db.testimonials.getAll();
      const idx = all.findIndex((t) => t.id === id);
      if (idx === -1) return null;
      all[idx] = { ...all[idx], ...data };
      db.testimonials.save(all);
      return all[idx];
    },
    delete: (id: string): boolean => {
      const all = db.testimonials.getAll();
      const filtered = all.filter((t) => t.id !== id);
      if (filtered.length === all.length) return false;
      db.testimonials.save(filtered);
      return true;
    },
  },

  wishlist: {
    getForUser: (userId: string): MockWishlistItem[] =>
      getOrSeed<MockWishlistItem[]>("wishlist", []).filter((w) => w.userId === userId),
    add: (userId: string, productId: string): MockWishlistItem => {
      const all = getOrSeed<MockWishlistItem[]>("wishlist", []);
      const existing = all.find((w) => w.userId === userId && w.productId === productId);
      if (existing) return existing;
      const item: MockWishlistItem = { id: uuidv4(), userId, productId, createdAt: new Date().toISOString() };
      storageSet("wishlist", [...all, item]);
      return item;
    },
    remove: (userId: string, productId: string): boolean => {
      const all = getOrSeed<MockWishlistItem[]>("wishlist", []);
      const filtered = all.filter((w) => !(w.userId === userId && w.productId === productId));
      storageSet("wishlist", filtered);
      return filtered.length < all.length;
    },
  },
};
