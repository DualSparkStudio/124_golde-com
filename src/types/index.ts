import type {
  ProductStatus,
  OrderStatus,
  LeadType,
  LeadStatus,
  GoldRateSource,
  JewelryCategory,
  UserRole,
} from "../generated/prisma/enums";

// Re-export enums for convenience
export type {
  ProductStatus,
  OrderStatus,
  LeadType,
  LeadStatus,
  GoldRateSource,
  JewelryCategory,
  UserRole,
};

// ─── Image / Media ────────────────────────────────────────────────────────────

export interface ProductImage {
  id: string;
  productId: string;
  publicId: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: Date;
}

// ─── Product ──────────────────────────────────────────────────────────────────

/** Full product including purchasePrice — admin use only */
export interface Product {
  id: string;
  name: string;
  slug: string;
  category: JewelryCategory;
  typeId: string;
  weight: number;
  purity: string;
  quantity: number;
  videoUrl: string | null;
  description: string | null;
  purchasePrice: number;
  salePrice: number | null;
  discountPrice: number | null;
  makingCharges: number;
  occasion: string[];
  isFeatured: boolean;
  status: ProductStatus;
  images: ProductImage[];
  createdAt: Date;
  updatedAt: Date;
}

/** Customer-facing product — purchasePrice is omitted */
export type CustomerProduct = Omit<Product, "purchasePrice"> & {
  primaryImage: { url: string } | null;
};

// ─── JewelryType ─────────────────────────────────────────────────────────────

export interface JewelryType {
  id: string;
  name: string;
  slug: string;
  category: JewelryCategory;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Order ────────────────────────────────────────────────────────────────────

export interface OrderItem {
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

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  gstAmount: number;
  gstRate: number;
  totalAmount: number;
  status: OrderStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── MerchantOrder ────────────────────────────────────────────────────────────

export interface MerchantOrderItem {
  id: string;
  merchantOrderId: string;
  description: string;
  weight: number;
  ratePerGram: number;
  makingCharges: number;
  amount: number;
}

export interface MerchantOrder {
  id: string;
  merchantName: string;
  invoiceNumber: string | null;
  items: MerchantOrderItem[];
  totalWeight: number;
  totalCost: number;
  purity: string;
  purchaseDate: Date;
  notes: string | null;
  createdAt: Date;
}

// ─── Lead ─────────────────────────────────────────────────────────────────────

export interface Lead {
  id: string;
  type: LeadType;
  productId: string | null;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  offerCode: string | null;
  status: LeadStatus;
  createdAt: Date;
}

// ─── GoldRate ─────────────────────────────────────────────────────────────────

export interface GoldRate {
  id: string;
  ratePerGram: number;
  ratePerTola: number;
  purity: string;
  source: GoldRateSource;
  updatedAt: Date;
}

// ─── OtherCharges ─────────────────────────────────────────────────────────────

export interface OtherCharges {
  id: string;
  shippingCost: number;
  gstRate: number;
  otherChargesLabel: string | null;
  otherChargesAmount: number;
  updatedAt: Date;
  updatedBy: string;
}

// ─── Testimonial ─────────────────────────────────────────────────────────────

export interface Testimonial {
  id: string;
  customerName: string;
  location: string | null;
  rating: number;
  content: string;
  productId: string | null;
  imageUrl: string | null;
  isPublished: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── AuditLog ─────────────────────────────────────────────────────────────────

export interface AuditLog {
  id: string;
  action: string;
  entityId: string;
  entityType: string;
  adminId: string;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

// ─── Filters & Pagination ─────────────────────────────────────────────────────

export type SortBy = "price-asc" | "price-desc" | "weight-asc" | "newest";

export interface ProductFilters {
  category?: JewelryCategory;
  typeId?: string;
  priceMin?: number;
  priceMax?: number;
  weightMin?: number;
  weightMax?: number;
  occasion?: string;
  query?: string;
  sortBy?: SortBy;
}

export interface Pagination {
  page: number;
  pageSize: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// ─── API Response Shapes ──────────────────────────────────────────────────────

export interface ProductListResult {
  items: CustomerProduct[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface WishlistResult {
  items: CustomerProduct[];
  count: number;
}

export interface LeadResult {
  success: boolean;
  leadId?: string;
  offerCode?: string;
  error?: string;
}

export interface GoldRateResponse {
  ratePerGram: number;
  ratePerTola: number;
  purity: string;
  source: GoldRateSource;
  updatedAt: Date;
}

export interface OrderStats {
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  total: number;
}

export interface ProfitReport {
  period: DateRange;
  revenue: number;
  purchaseCost: number;
  shippingExpenses: number;
  gstExpenses: number;
  makingChargesExpenses: number;
  totalExpenses: number;
  grossProfit: number;
  profitMargin: number;
  orderCount: number;
}

export interface RevenueSummary {
  revenue: number;
  purchaseCost: number;
  shippingExpenses: number;
  gstExpenses: number;
  makingChargesExpenses: number;
  totalExpenses: number;
  grossProfit: number;
  profitMargin: number;
  orderCount: number;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
  orderCount: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  orderCount: number;
}
