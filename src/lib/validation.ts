import { z } from "zod";

const PHONE_REGEX = /^[+]?[0-9]{10,15}$/;

// ─── Enums ────────────────────────────────────────────────────────────────────

const JewelryCategoryEnum = z.enum(["gold", "silver", "both"]);
const LeadTypeEnum = z.enum(["price_request", "appointment", "popup_offer"]);
const GoldRateUnitEnum = z.enum([
  "per_gram_22k",
  "per_gram_24k",
  "per_tola_22k",
  "per_tola_24k",
]);
const SortByEnum = z.enum(["price-asc", "price-desc", "weight-asc", "newest"]);

// ─── Pagination ───────────────────────────────────────────────────────────────

export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof PaginationSchema>;

// ─── Product Filters ──────────────────────────────────────────────────────────

export const ProductFiltersSchema = z.object({
  category: JewelryCategoryEnum.optional(),
  typeId: z.string().optional(),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
  weightMin: z.number().optional(),
  weightMax: z.number().optional(),
  occasion: z.string().optional(),
  query: z.string().optional(),
  sortBy: SortByEnum.default("newest"),
});

export type ProductFiltersInput = z.infer<typeof ProductFiltersSchema>;

// ─── Product Input ────────────────────────────────────────────────────────────

export const ProductInputSchema = z
  .object({
    name: z.string().min(1).max(200),
    category: JewelryCategoryEnum,
    typeId: z.string().min(1),
    weight: z.number().positive(),
    purity: z.string().min(1),
    quantity: z.number().int().min(0),
    imageIds: z.array(z.string()).min(1),
    description: z.string().optional(),
    purchasePrice: z.number().positive(),
    salePrice: z.number().positive().optional(),
    discountPrice: z.number().positive().optional(),
    makingCharges: z.number().positive(),
    occasion: z.array(z.string()),
    videoUrl: z.string().url().optional(),
    isFeatured: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.discountPrice !== undefined && data.salePrice !== undefined) {
        return data.discountPrice < data.salePrice;
      }
      return true;
    },
    {
      message: "discountPrice must be less than salePrice",
      path: ["discountPrice"],
    },
  );

export type ProductInput = z.infer<typeof ProductInputSchema>;

// ─── Order Input ──────────────────────────────────────────────────────────────

const OrderItemInputSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
});

export const OrderInputSchema = z.object({
  customerName: z.string().min(1),
  customerPhone: z.string().regex(PHONE_REGEX, "Invalid phone number format"),
  customerEmail: z.string().email().optional(),
  items: z.array(OrderItemInputSchema).min(1),
  notes: z.string().optional(),
});

export type OrderInput = z.infer<typeof OrderInputSchema>;

// ─── Lead Input ───────────────────────────────────────────────────────────────

export const LeadInputSchema = z.object({
  type: LeadTypeEnum,
  productId: z.string().optional(),
  name: z.string().min(1),
  phone: z.string().regex(PHONE_REGEX, "Invalid phone number format"),
  email: z.string().email().optional(),
  message: z.string().optional(),
  offerCode: z.string().optional(),
});

export type LeadInput = z.infer<typeof LeadInputSchema>;

// ─── Merchant Order Input ─────────────────────────────────────────────────────

const MerchantOrderItemInputSchema = z.object({
  description: z.string().min(1),
  weight: z.number().positive(),
  ratePerGram: z.number().positive(),
  makingCharges: z.number().min(0),
});

export const MerchantOrderInputSchema = z.object({
  merchantName: z.string().min(1),
  invoiceNumber: z.string().optional(),
  items: z.array(MerchantOrderItemInputSchema).min(1),
  purity: z.string().min(1),
  purchaseDate: z.coerce.date(),
  notes: z.string().optional(),
});

export type MerchantOrderInput = z.infer<typeof MerchantOrderInputSchema>;

// ─── Gold Rate Input ──────────────────────────────────────────────────────────

export const GoldRateInputSchema = z.object({
  rate: z.number().positive(),
  unit: GoldRateUnitEnum,
});

export type GoldRateInput = z.infer<typeof GoldRateInputSchema>;

// ─── Other Charges Input ──────────────────────────────────────────────────────

export const OtherChargesInputSchema = z.object({
  shippingCost: z.number().min(0),
  gstRate: z.number().min(0).max(1),
  otherChargesLabel: z.string().optional(),
  otherChargesAmount: z.number().min(0),
});

export type OtherChargesInput = z.infer<typeof OtherChargesInputSchema>;
