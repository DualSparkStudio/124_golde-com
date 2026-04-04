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

export interface MockLead {
  id: string;
  type: "price_request" | "appointment" | "popup_offer";
  productId: string | null;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  offerCode: string | null;
  status: "new" | "contacted" | "converted" | "closed";
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

// Unique images per product type
const IMG_PENDANT   = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80";
const IMG_NECKLACE  = "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=800&q=80";
const IMG_RING      = "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80";
const IMG_EARRINGS  = "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80";
const IMG_BRACELET  = "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80";
const IMG_CHAIN     = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80";
const IMG_BANGLE    = "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80";
const IMG_ANKLET    = "https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=800&q=80";
const IMG_RING2     = "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&q=80";
const IMG_EARRINGS2 = "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80";
const IMG_NECKLACE2 = "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80";
const IMG_PENDANT2  = "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80";


function makeImg(productId: string, url: string) {
  return [{ id: uuidv4(), productId, publicId: url, url, isPrimary: true, sortOrder: 0 }];
}

const SEED_PRODUCTS: MockProduct[] = [
  { id: "prod-1", name: "22K Gold Lotus Pendant", slug: "22k-gold-lotus-pendant", category: "gold", typeId: "type-1", weight: 2.1, purity: "22K", quantity: 5, images: makeImg("prod-1", IMG_PENDANT), videoUrl: null, description: "Delicate lotus pendant crafted in 22K gold. Perfect for daily wear and gifting.", purchasePrice: 12000, salePrice: 15500, discountPrice: 14800, makingCharges: 1200, occasion: ["daily-wear", "festival"], isFeatured: true, status: "active", createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: "prod-2", name: "22K Gold Bridal Necklace Set", slug: "22k-gold-bridal-necklace-set", category: "gold", typeId: "type-2", weight: 18.5, purity: "22K", quantity: 2, images: makeImg("prod-2", IMG_NECKLACE), videoUrl: null, description: "Stunning bridal necklace set with intricate temple work. A timeless heirloom piece.", purchasePrice: 105000, salePrice: 138000, discountPrice: null, makingCharges: 8500, occasion: ["wedding"], isFeatured: true, status: "active", createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: "prod-3", name: "22K Gold Floral Ring", slug: "22k-gold-floral-ring", category: "gold", typeId: "type-3", weight: 3.2, purity: "22K", quantity: 8, images: makeImg("prod-3", IMG_RING), videoUrl: null, description: "Classic gold ring with floral motif. Elegant design suitable for all occasions.", purchasePrice: 18000, salePrice: 23500, discountPrice: 22000, makingCharges: 1800, occasion: ["daily-wear", "wedding"], isFeatured: false, status: "active", createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: "prod-4", name: "925 Silver Jhumka Earrings", slug: "925-silver-jhumka-earrings", category: "silver", typeId: "type-4", weight: 8.0, purity: "925", quantity: 12, images: makeImg("prod-4", IMG_EARRINGS), videoUrl: null, description: "Traditional jhumka earrings in 925 sterling silver with oxidised finish. Festival favourite.", purchasePrice: 2200, salePrice: 3200, discountPrice: 2900, makingCharges: 400, occasion: ["festival", "daily-wear"], isFeatured: true, status: "active", createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: "prod-5", name: "22K Gold Mangalsutra Chain", slug: "22k-gold-mangalsutra-chain", category: "gold", typeId: "type-6", weight: 5.5, purity: "22K", quantity: 4, images: makeImg("prod-5", IMG_CHAIN), videoUrl: null, description: "Traditional mangalsutra chain in 22K gold. Lightweight and elegant for daily wear.", purchasePrice: 31000, salePrice: 40500, discountPrice: null, makingCharges: 2800, occasion: ["wedding", "daily-wear"], isFeatured: true, status: "active", createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: "prod-6", name: "925 Silver Kada Bracelet", slug: "925-silver-kada-bracelet", category: "silver", typeId: "type-5", weight: 22.0, purity: "925", quantity: 6, images: makeImg("prod-6", IMG_BRACELET), videoUrl: null, description: "Bold silver kada with traditional engravings. Unisex design, perfect for all wrists.", purchasePrice: 5500, salePrice: 7800, discountPrice: 7200, makingCharges: 900, occasion: ["festival", "daily-wear"], isFeatured: false, status: "active", createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: "prod-7", name: "22K Gold Plain Bangle Pair", slug: "22k-gold-plain-bangle-pair", category: "gold", typeId: "type-7", weight: 12.0, purity: "22K", quantity: 3, images: makeImg("prod-7", IMG_BANGLE), videoUrl: null, description: "Pair of plain gold bangles. Classic and versatile — a must-have in every jewellery collection.", purchasePrice: 68000, salePrice: null, discountPrice: null, makingCharges: 4200, occasion: ["wedding", "festival"], isFeatured: false, status: "active", createdAt: new Date(Date.now() - 6 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: "prod-9", name: "22K Gold Solitaire Ring", slug: "22k-gold-solitaire-ring", category: "gold", typeId: "type-3", weight: 4.5, purity: "22K", quantity: 5, images: makeImg("prod-9", IMG_RING2), videoUrl: null, description: "Elegant solitaire ring in 22K gold. Perfect engagement or anniversary gift.", purchasePrice: 25000, salePrice: 33000, discountPrice: 31500, makingCharges: 2200, occasion: ["wedding", "daily-wear"], isFeatured: true, status: "active", createdAt: new Date(Date.now() - 8 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: "prod-10", name: "925 Silver Drop Earrings", slug: "925-silver-drop-earrings", category: "silver", typeId: "type-4", weight: 5.5, purity: "925", quantity: 15, images: makeImg("prod-10", IMG_EARRINGS2), videoUrl: null, description: "Elegant drop earrings in 925 sterling silver. Minimalist design for modern women.", purchasePrice: 1800, salePrice: 2600, discountPrice: null, makingCharges: 350, occasion: ["daily-wear", "party"], isFeatured: false, status: "active", createdAt: new Date(Date.now() - 9 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: "prod-11", name: "22K Gold Temple Necklace", slug: "22k-gold-temple-necklace", category: "gold", typeId: "type-2", weight: 22.0, purity: "22K", quantity: 2, images: makeImg("prod-11", IMG_NECKLACE2), videoUrl: null, description: "Intricate temple-work gold necklace. Inspired by South Indian jewellery traditions.", purchasePrice: 125000, salePrice: 162000, discountPrice: null, makingCharges: 12000, occasion: ["wedding", "festival"], isFeatured: true, status: "active", createdAt: new Date(Date.now() - 12 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  { id: "prod-12", name: "22K Gold Om Pendant", slug: "22k-gold-om-pendant", category: "gold", typeId: "type-1", weight: 1.8, purity: "22K", quantity: 8, images: makeImg("prod-12", IMG_PENDANT2), videoUrl: null, description: "Sacred Om symbol pendant in 22K gold. A meaningful gift for loved ones.", purchasePrice: 10000, salePrice: 13500, discountPrice: 12800, makingCharges: 1000, occasion: ["daily-wear", "festival"], isFeatured: false, status: "active", createdAt: new Date(Date.now() - 14 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
];

// Helper: date N months ago as ISO string
function monthsAgo(n: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d.toISOString();
}
function weeksAgo(n: number): string {
  return new Date(Date.now() - n * 7 * 86400000).toISOString();
}

const SEED_ORDERS: MockOrder[] = [
  // TODAY
  { id: "order-1", orderNumber: "ORD-2026-0001", customerName: "Priya Sharma", customerPhone: "9876543210", customerEmail: "priya@example.com", items: [{ id: "oi-1", orderId: "order-1", productId: "prod-1", productName: "22K Gold Lotus Pendant", weight: 2.1, quantity: 1, unitPrice: 14800, makingCharges: 1200, purchasePrice: 12000 }], subtotal: 14800, shippingCost: 99, gstAmount: 444, gstRate: 0.03, totalAmount: 15343, status: "delivered", notes: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  // THIS WEEK (2 days ago)
  { id: "order-2", orderNumber: "ORD-2026-0002", customerName: "Anita Patel", customerPhone: "9123456789", customerEmail: "anita@example.com", items: [{ id: "oi-2", orderId: "order-2", productId: "prod-4", productName: "925 Silver Jhumka Earrings", weight: 8.0, quantity: 1, unitPrice: 2900, makingCharges: 400, purchasePrice: 2200 }], subtotal: 2900, shippingCost: 99, gstAmount: 87, gstRate: 0.03, totalAmount: 3086, status: "delivered", notes: null, createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  // THIS WEEK (3 days ago)
  { id: "order-9", orderNumber: "ORD-2026-0009", customerName: "Lakshmi Iyer", customerPhone: "9900112233", customerEmail: "lakshmi@example.com", items: [{ id: "oi-9", orderId: "order-9", productId: "prod-9", productName: "22K Gold Solitaire Ring", weight: 4.5, quantity: 1, unitPrice: 31500, makingCharges: 2200, purchasePrice: 25000 }], subtotal: 31500, shippingCost: 0, gstAmount: 945, gstRate: 0.03, totalAmount: 32445, status: "delivered", notes: null, createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  // THIS MONTH (8 days ago)
  { id: "order-3", orderNumber: "ORD-2026-0003", customerName: "Meera Reddy", customerPhone: "9988776655", customerEmail: "meera@example.com", items: [{ id: "oi-3", orderId: "order-3", productId: "prod-3", productName: "22K Gold Floral Ring", weight: 3.2, quantity: 1, unitPrice: 22000, makingCharges: 1800, purchasePrice: 18000 }], subtotal: 22000, shippingCost: 99, gstAmount: 660, gstRate: 0.03, totalAmount: 22759, status: "delivered", notes: null, createdAt: new Date(Date.now() - 8 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  // THIS MONTH (12 days ago)
  { id: "order-10", orderNumber: "ORD-2026-0010", customerName: "Nandini Rao", customerPhone: "9811223344", customerEmail: null, items: [{ id: "oi-10", orderId: "order-10", productId: "prod-12", productName: "22K Gold Om Pendant", weight: 1.8, quantity: 1, unitPrice: 12800, makingCharges: 1000, purchasePrice: 10000 }], subtotal: 12800, shippingCost: 99, gstAmount: 384, gstRate: 0.03, totalAmount: 13283, status: "delivered", notes: null, createdAt: new Date(Date.now() - 12 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  // PENDING (not in revenue)
  { id: "order-4", orderNumber: "ORD-2026-0004", customerName: "Sunita Joshi", customerPhone: "9765432109", customerEmail: null, items: [{ id: "oi-4", orderId: "order-4", productId: "prod-5", productName: "22K Gold Mangalsutra Chain", weight: 5.5, quantity: 1, unitPrice: 40500, makingCharges: 2800, purchasePrice: 31000 }], subtotal: 40500, shippingCost: 99, gstAmount: 1215, gstRate: 0.03, totalAmount: 41814, status: "pending", notes: null, createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), updatedAt: new Date().toISOString() },
  // THIS YEAR - 1 month ago
  { id: "order-5", orderNumber: "ORD-2026-0005", customerName: "Kavitha Nair", customerPhone: "9845123456", customerEmail: "kavitha@example.com", items: [{ id: "oi-5", orderId: "order-5", productId: "prod-9", productName: "22K Gold Solitaire Ring", weight: 4.5, quantity: 1, unitPrice: 31500, makingCharges: 2200, purchasePrice: 25000 }], subtotal: 31500, shippingCost: 0, gstAmount: 945, gstRate: 0.03, totalAmount: 32445, status: "delivered", notes: "Gift wrap requested", createdAt: monthsAgo(1), updatedAt: new Date().toISOString() },
  // THIS YEAR - 2 months ago
  { id: "order-6", orderNumber: "ORD-2026-0006", customerName: "Deepa Menon", customerPhone: "9567890123", customerEmail: "deepa@example.com", items: [{ id: "oi-6", orderId: "order-6", productId: "prod-11", productName: "22K Gold Temple Necklace", weight: 22.0, quantity: 1, unitPrice: 162000, makingCharges: 12000, purchasePrice: 125000 }], subtotal: 162000, shippingCost: 0, gstAmount: 4860, gstRate: 0.03, totalAmount: 166860, status: "delivered", notes: null, createdAt: monthsAgo(2), updatedAt: new Date().toISOString() },
  // THIS YEAR - 3 months ago
  { id: "order-7", orderNumber: "ORD-2026-0007", customerName: "Rekha Singh", customerPhone: "9312456789", customerEmail: null, items: [{ id: "oi-7", orderId: "order-7", productId: "prod-6", productName: "925 Silver Kada Bracelet", weight: 22.0, quantity: 2, unitPrice: 7200, makingCharges: 900, purchasePrice: 5500 }], subtotal: 14400, shippingCost: 99, gstAmount: 432, gstRate: 0.03, totalAmount: 14931, status: "delivered", notes: null, createdAt: monthsAgo(3), updatedAt: new Date().toISOString() },
  // CANCELLED - not in revenue
  { id: "order-8", orderNumber: "ORD-2026-0008", customerName: "Pooja Iyer", customerPhone: "9876012345", customerEmail: "pooja@example.com", items: [{ id: "oi-8", orderId: "order-8", productId: "prod-12", productName: "22K Gold Om Pendant", weight: 1.8, quantity: 1, unitPrice: 12800, makingCharges: 1000, purchasePrice: 10000 }], subtotal: 12800, shippingCost: 99, gstAmount: 384, gstRate: 0.03, totalAmount: 13283, status: "cancelled", notes: "Customer requested cancellation", createdAt: monthsAgo(4), updatedAt: new Date().toISOString() },
];

const SEED_MERCHANT_ORDERS: MockMerchantOrder[] = [
  { id: "mo-1", merchantName: "Rajesh Gold Traders", invoiceNumber: "RGT-2024-0089", items: [{ id: "moi-1", merchantOrderId: "mo-1", description: "22K Gold Bars (raw)", weight: 50, ratePerGram: 6200, makingCharges: 0, amount: 310000 }, { id: "moi-2", merchantOrderId: "mo-1", description: "22K Gold Wire", weight: 10, ratePerGram: 6200, makingCharges: 500, amount: 62500 }], totalWeight: 60, totalCost: 372500, purity: "22K", purchaseDate: new Date(Date.now() - 25 * 86400000).toISOString().slice(0, 10), notes: "Monthly bulk purchase", createdAt: new Date(Date.now() - 25 * 86400000).toISOString() },
  { id: "mo-2", merchantName: "Silver Palace Wholesale", invoiceNumber: "SPW-2024-0234", items: [{ id: "moi-3", merchantOrderId: "mo-2", description: "925 Sterling Silver Sheets", weight: 200, ratePerGram: 85, makingCharges: 2000, amount: 19000 }], totalWeight: 200, totalCost: 19000, purity: "925", purchaseDate: new Date(Date.now() - 18 * 86400000).toISOString().slice(0, 10), notes: null, createdAt: new Date(Date.now() - 18 * 86400000).toISOString() },
  { id: "mo-3", merchantName: "Rajesh Gold Traders", invoiceNumber: "RGT-2024-0102", items: [{ id: "moi-4", merchantOrderId: "mo-3", description: "22K Gold Chains (pre-made)", weight: 30, ratePerGram: 6350, makingCharges: 3000, amount: 193500 }], totalWeight: 30, totalCost: 193500, purity: "22K", purchaseDate: new Date(Date.now() - 5 * 86400000).toISOString().slice(0, 10), notes: "Urgent order for bridal season", createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
];

const SEED_TESTIMONIALS: MockTestimonial[] = [
  { id: "test-1", customerName: "Priya Sharma", location: "Mumbai", rating: 5, content: "Absolutely stunning quality! The gold pendant I ordered exceeded my expectations. The craftsmanship is exquisite.", productId: "prod-1", imageUrl: null, isPublished: true, sortOrder: 1 },
  { id: "test-2", customerName: "Anita Patel", location: "Ahmedabad", rating: 5, content: "The silver jhumkas are gorgeous. Got so many compliments at the festival. Will definitely order again!", productId: "prod-4", imageUrl: null, isPublished: true, sortOrder: 2 },
  { id: "test-3", customerName: "Meera Reddy", location: "Hyderabad", rating: 4, content: "Beautiful bridal set. The packaging was luxurious and delivery was on time. Highly recommend.", productId: "prod-2", imageUrl: null, isPublished: true, sortOrder: 3 },
  { id: "test-4", customerName: "Kavitha Nair", location: "Kochi", rating: 5, content: "Authentic hallmarked gold. The weight and purity are exactly as described. Trustworthy shop!", productId: null, imageUrl: null, isPublished: true, sortOrder: 4 },
  { id: "test-5", customerName: "Deepa Menon", location: "Bangalore", rating: 5, content: "The temple necklace is breathtaking. Worth every rupee. My family was amazed at the quality.", productId: "prod-11", imageUrl: null, isPublished: true, sortOrder: 5 },
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

const SEED_LEADS: MockLead[] = [
  { id: "lead-1", type: "appointment", productId: null, name: "Sunita Kapoor", phone: "9876543210", email: "sunita@example.com", message: "Would like to visit on Saturday afternoon for bridal jewellery consultation.", offerCode: null, status: "new", createdAt: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "lead-2", type: "price_request", productId: "prod-2", name: "Ravi Mehta", phone: "9123456789", email: null, message: "Please share the latest price for the bridal necklace set.", offerCode: null, status: "contacted", createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "lead-3", type: "appointment", productId: null, name: "Lakshmi Iyer", phone: "9988776655", email: "lakshmi@example.com", message: "Looking for anniversary gift ideas. Prefer weekday morning.", offerCode: null, status: "converted", createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: "lead-4", type: "price_request", productId: "prod-11", name: "Arjun Nair", phone: "9765432109", email: "arjun@example.com", message: "Interested in the temple necklace. What is the current price?", offerCode: null, status: "new", createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: "lead-5", type: "popup_offer", productId: null, name: "Preethi Sharma", phone: "9845123456", email: "preethi@example.com", message: null, offerCode: "WELCOME10", status: "closed", createdAt: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: "lead-6", type: "appointment", productId: null, name: "Deepak Reddy", phone: "9567890123", email: null, message: "Want to see the gold bangle collection. Available on Sunday.", offerCode: null, status: "new", createdAt: new Date(Date.now() - 4 * 86400000).toISOString() },
];

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

// Version bump this whenever seed data changes — forces localStorage reset
const DB_VERSION = "v6";

function initDb(): void {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem("mockdb_version");
  if (stored !== DB_VERSION) {
    // Clear all mockdb keys
    const keys = Object.keys(localStorage).filter(k => k.startsWith("mockdb_"));
    keys.forEach(k => localStorage.removeItem(k));
    localStorage.setItem("mockdb_version", DB_VERSION);
  }
}

// Run on module load (client only)
if (typeof window !== "undefined") { initDb(); }

export function resetAllData(): void {
  if (typeof window === "undefined") return;
  const keys = Object.keys(localStorage).filter(k => k.startsWith("mockdb_"));
  keys.forEach(k => localStorage.removeItem(k));
  localStorage.removeItem("mockdb_version");
  initDb();
  window.location.reload();
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
    getAll: (): MockMerchantOrder[] => getOrSeed("merchantOrders", SEED_MERCHANT_ORDERS),
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

  leads: {
    getAll: (): MockLead[] => getOrSeed("leads", SEED_LEADS),
    save: (items: MockLead[]) => storageSet("leads", items),
    create: (data: Omit<MockLead, "id" | "createdAt">): MockLead => {
      const lead: MockLead = { ...data, id: uuidv4(), createdAt: new Date().toISOString() };
      db.leads.save([...db.leads.getAll(), lead]);
      return lead;
    },
    update: (id: string, data: Partial<MockLead>): MockLead | null => {
      const all = db.leads.getAll();
      const idx = all.findIndex((l) => l.id === id);
      if (idx === -1) return null;
      all[idx] = { ...all[idx], ...data };
      db.leads.save(all);
      return all[idx];
    },
  },
};
