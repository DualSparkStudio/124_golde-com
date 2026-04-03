# Implementation Plan: Jewelry Shop Ecommerce

## Overview

Incremental implementation of a full luxury jewelry ecommerce platform using Next.js 14 (App Router), TypeScript, Prisma + PostgreSQL, Redis, Cloudinary, Tailwind CSS, Framer Motion, NextAuth.js, React Query, Zod, fast-check, Recharts, react-image-magnify, and Papa Parse. Tasks are ordered so each step builds on the previous, ending with full integration.

## Tasks

- [x] 1. Project setup and configuration
  - Initialise Next.js 14 App Router project with TypeScript
  - Install all dependencies: prisma, @prisma/client, next-auth, @tanstack/react-query, zod, ioredis, cloudinary, framer-motion, recharts, react-image-magnify, papaparse, fast-check, tailwindcss
  - Configure Tailwind CSS with luxury theme tokens (gold/cream/black palette, custom font scale)
  - Create `.env.example` with all required variables: DATABASE_URL, REDIS_URL, CLOUDINARY_*, NEXTAUTH_*, GOLD_RATE_API_KEY
  - Set up `src/lib/prisma.ts` singleton client, `src/lib/redis.ts` ioredis client, `src/lib/cloudinary.ts` config
  - _Requirements: 18.1, 18.2, 18.4_

- [x] 2. Prisma schema and database migrations
  - [x] 2.1 Define all Prisma models: Product, ProductImage, JewelryType, Order, OrderItem, MerchantOrder, MerchantOrderItem, Lead, Testimonial, OtherCharges, AuditLog, GoldRate, User, WishlistItem
    - Include all fields, enums (ProductStatus, OrderStatus, LeadType, LeadStatus, GoldRateSource, JewelryCategory), and relations as specified in the data models
    - Add composite indexes: `products(status, category, typeId)`, `products(slug)`, `orders(status, createdAt)`, `leads(phone, type)`
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 18.4_
  - [x] 2.2 Run initial migration and generate Prisma client
    - Create `prisma/seed.ts` with seed data for OtherCharges defaults and one admin user
    - _Requirements: 13.1_
  - [ ]* 2.3 Write property test for slug uniqueness constraint
    - **Property 25: Slug URL-Safety and Uniqueness**
    - **Validates: Requirements 10.2, 17.3**

- [x] 3. Core utilities and shared types
  - [x] 3.1 Create `src/types/index.ts` with all TypeScript interfaces mirroring Prisma models plus API response shapes (ProductListResult, ProfitReport, OrderStats, WishlistResult, GoldRate, LeadResult)
    - Ensure `purchasePrice` is omitted from all customer-facing product types
    - _Requirements: 2.8, 11.1_
  - [x] 3.2 Implement `src/lib/slug.ts`: `generateSlug(name)` and `ensureUniqueSlug(slug, db)` functions
    - _Requirements: 10.2, 10.3, 17.3_
  - [ ]* 3.3 Write property test for slug generation
    - **Property 25: Slug URL-Safety and Uniqueness** — verify generated slugs contain only `[a-z0-9-]`
    - **Validates: Requirements 10.2, 17.3**
  - [x] 3.4 Implement `src/lib/validation.ts`: Zod schemas for all API inputs (ProductInput, OrderInput, LeadInput, MerchantOrderInput, GoldRateInput, OtherChargesInput, PaginationInput, ProductFiltersInput)
    - Include phone format validation regex
    - _Requirements: 6.5, 9.4, 10.4, 17.1, 17.2, 17.5_
  - [x] 3.5 Implement `src/lib/audit.ts`: `createAuditLog(action, entityId, adminId)` helper
    - _Requirements: 10.7, 12.5_
  - [x] 3.6 Implement `src/lib/orderTotal.ts`: `computeOrderTotal(subtotal, shippingCost, gstRate)` returning `{ gstAmount, totalAmount }`
    - _Requirements: 13.2, 13.3, 17.7_
  - [ ]* 3.7 Write property test for order total calculation
    - **Property 35: Order Total Calculation** — totalAmount = subtotal + shippingCost + gstAmount, gstAmount = subtotal × gstRate
    - **Validates: Requirements 13.2, 13.3, 17.7**

- [x] 4. Checkpoint — Ensure schema, types, and utilities compile cleanly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Gold Rate Service
  - [x] 5.1 Implement `src/services/goldRate.ts`: `getCurrentRate()`, `refreshRate()`, `setManualRate(rate, unit, adminId)` with Redis caching (1h TTL) and external API fallback logic
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_
  - [ ]* 5.2 Write property test for gold rate cache freshness
    - **Property 17: Gold Rate Cache Freshness** — cached rate < 1h old must be returned without calling external API
    - **Validates: Requirements 5.2, 18.3**
  - [ ]* 5.3 Write property test for manual gold rate validation
    - **Property 18: Manual Gold Rate Validation** — reject rate ≤ 0 and invalid unit strings
    - **Validates: Requirements 5.7, 17.5**
  - [x] 5.4 Implement `src/app/api/gold-rate/route.ts` GET endpoint returning current rate
    - _Requirements: 5.1, 5.2_
  - [x] 5.5 Implement `src/app/api/admin/gold-rate/route.ts` POST endpoint for manual rate setting (admin-only)
    - _Requirements: 5.6, 5.7_

- [x] 6. Admin authentication (NextAuth.js)
  - [x] 6.1 Configure NextAuth.js in `src/app/api/auth/[...nextauth]/route.ts` with Credentials provider, Prisma adapter, and JWT strategy; include `role` in session token
    - _Requirements: 9.1, 9.2, 9.3_
  - [x] 6.2 Create `src/middleware.ts` to protect all `/admin/*` routes — redirect unauthenticated users to `/admin/login`, return 403 for non-admin roles
    - _Requirements: 9.1, 9.2_
  - [x] 6.3 Create `src/lib/auth.ts`: `requireAdmin(req)` helper that validates JWT session and role for use in API route handlers
    - _Requirements: 9.3_
  - [ ]* 6.4 Write property test for admin role enforcement
    - **Property 23: Admin Role Enforcement** — any request with role ≠ "admin" must receive HTTP 403
    - **Validates: Requirements 9.2, 9.3**
  - [x] 6.5 Build admin login page `src/app/admin/login/page.tsx` with email/password form
    - _Requirements: 9.1_

- [x] 7. Product Catalog API
  - [x] 7.1 Implement `src/services/productCatalog.ts`: `getFilteredProducts(filters, pagination)` with all filter/sort/search logic and CDN URL resolution; strip `purchasePrice` from output
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 2.8, 3.1, 3.2, 3.3, 3.4, 3.5_
  - [ ]* 7.2 Write property test for active product visibility
    - **Property 1: Active Product Visibility** — only products with status = "active" appear in results
    - **Validates: Requirements 1.7**
  - [ ]* 7.3 Write property test for filter correctness — type
    - **Property 2: Filter Correctness — Type**
    - **Validates: Requirements 1.2**
  - [ ]* 7.4 Write property test for filter correctness — price range
    - **Property 3: Filter Correctness — Price Range**
    - **Validates: Requirements 1.3, 3.2**
  - [ ]* 7.5 Write property test for filter correctness — weight range
    - **Property 4: Filter Correctness — Weight Range**
    - **Validates: Requirements 1.4, 3.3**
  - [ ]* 7.6 Write property test for filter correctness — occasion
    - **Property 5: Filter Correctness — Occasion**
    - **Validates: Requirements 1.5**
  - [ ]* 7.7 Write property test for sort correctness
    - **Property 6: Sort Correctness** — items array is ordered by selected criterion
    - **Validates: Requirements 1.6**
  - [ ]* 7.8 Write property test for search correctness
    - **Property 7: Search Correctness** — all returned products contain query in name or description (case-insensitive)
    - **Validates: Requirements 1.8**
  - [ ]* 7.9 Write property test for primary image URL presence
    - **Property 8: Primary Image URL Present** — every product in listing has non-null primaryImage.url
    - **Validates: Requirements 1.9, 17.4**
  - [ ]* 7.10 Write property test for pagination bounds
    - **Property 9: Pagination Bounds** — items.length ≤ pageSize; response includes total, page, pageSize, totalPages
    - **Validates: Requirements 1.10**
  - [ ]* 7.11 Write property test for filter composition monotonicity
    - **Property 10: Filter Composition — Monotonicity** — adding more filters never increases result count
    - **Validates: Requirements 3.1**
  - [ ]* 7.12 Write property test for purchasePrice exclusion
    - **Property 11: purchasePrice Exclusion from Customer Responses**
    - **Validates: Requirements 2.8**
  - [x] 7.13 Implement `src/app/api/products/route.ts` GET endpoint wiring `getFilteredProducts`
    - _Requirements: 1.1–1.10_
  - [x] 7.14 Implement `src/services/productDetail.ts`: `getProductById(id)`, `getProductBySlug(slug)`, `getRelatedProducts(productId, limit)` — strip `purchasePrice`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.8_
  - [ ]* 7.15 Write property test for related products bounded and categorized
    - **Property 12: Related Products Bounded and Categorized** — at most L items, all sharing category or typeId with P
    - **Validates: Requirements 2.6**
  - [x] 7.16 Implement `src/app/api/products/[slug]/route.ts` GET endpoint
    - _Requirements: 2.1–2.8_
  - [x] 7.17 Implement `src/app/api/products/[slug]/related/route.ts` GET endpoint
    - _Requirements: 2.6_
  - [x] 7.18 Implement `src/app/api/types/route.ts` GET endpoint returning active JewelryTypes only
    - _Requirements: 11.4_
  - [ ]* 7.19 Write property test for active types returned
    - **Property 31: Active Types Returned**
    - **Validates: Requirements 11.4**

- [x] 8. Wishlist Service and API
  - [x] 8.1 Implement `src/services/wishlist.ts`: `getWishlist(userId?)`, `addToWishlist(userId?, productId)` (upsert), `removeFromWishlist(userId?, productId)`, `mergeGuestWishlist(guestItems, userId)` — session-based for guests
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  - [ ]* 8.2 Write property test for wishlist add round-trip
    - **Property 13: Wishlist Add Round-Trip** — after add, wishlist query includes the product
    - **Validates: Requirements 4.1, 4.2**
  - [ ]* 8.3 Write property test for wishlist idempotency
    - **Property 14: Wishlist Idempotency** — adding same product N times results in exactly one entry
    - **Validates: Requirements 4.3**
  - [ ]* 8.4 Write property test for wishlist remove round-trip
    - **Property 15: Wishlist Remove Round-Trip** — after remove, wishlist query excludes the product
    - **Validates: Requirements 4.4**
  - [ ]* 8.5 Write property test for wishlist merge completeness
    - **Property 16: Wishlist Merge Completeness** — every guest item appears in merged user wishlist
    - **Validates: Requirements 4.5**
  - [x] 8.6 Implement `src/app/api/wishlist/route.ts` GET/POST/DELETE endpoints
    - _Requirements: 4.1–4.6_
  - [x] 8.7 Implement `src/app/api/wishlist/merge/route.ts` POST endpoint for guest→user merge
    - _Requirements: 4.5_

- [x] 9. Lead Capture and Appointment API
  - [x] 9.1 Implement `src/services/lead.ts`: `submitPriceRequest(data)`, `submitAppointment(data)`, `capturePopupLead(data)` with phone hashing for deduplication and rate-limit check
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 17.6_
  - [ ]* 9.2 Write property test for lead creation correctness
    - **Property 19: Lead Creation Correctness** — persisted lead has correct type, phone, and productId
    - **Validates: Requirements 6.1, 6.2**
  - [ ]* 9.3 Write property test for lead deduplication
    - **Property 20: Lead Deduplication** — at most one popup_offer lead per phone number
    - **Validates: Requirements 6.4**
  - [ ]* 9.4 Write property test for invalid phone rejection
    - **Property 21: Invalid Phone Rejection** — invalid phone format must not persist a Lead record
    - **Validates: Requirements 6.5**
  - [x] 9.5 Implement `src/app/api/leads/price-request/route.ts` POST endpoint
    - _Requirements: 6.1, 6.5, 6.6_
  - [x] 9.6 Implement `src/app/api/leads/appointment/route.ts` POST endpoint
    - _Requirements: 6.2, 6.5, 6.6_
  - [x] 9.7 Implement `src/app/api/leads/popup/route.ts` POST endpoint
    - _Requirements: 6.3, 6.4, 6.5, 6.6_

- [x] 10. Checkpoint — Ensure all service and API tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Admin Product Management API
  - [x] 11.1 Implement `src/services/adminProduct.ts`: `createProduct(input, adminId)` with slug generation, image linking, audit log; `updateProduct`, `deleteProduct` (cascade images), `bulkUpdateStatus`
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.10, 17.1, 17.2, 17.3, 17.4_
  - [ ]* 11.2 Write property test for product creation field completeness
    - **Property 24: Product Creation Field Completeness**
    - **Validates: Requirements 10.1**
  - [ ]* 11.3 Write property test for price integrity — discount below sale
    - **Property 26: Price Integrity — Discount Below Sale**
    - **Validates: Requirements 10.4**
  - [ ]* 11.4 Write property test for product deletion cascade
    - **Property 27: Product Deletion Cascade** — deleted product and its images are not retrievable
    - **Validates: Requirements 10.6**
  - [ ]* 11.5 Write property test for audit log completeness
    - **Property 28: Audit Log Completeness** — every admin mutation produces an audit log entry with action, entityId, adminId, timestamp
    - **Validates: Requirements 10.7, 12.5**
  - [ ]* 11.6 Write property test for bulk update count accuracy
    - **Property 30: Bulk Update Count Accuracy** — returned count equals number of actually changed records
    - **Validates: Requirements 10.10**
  - [ ]* 11.7 Write property test for product weight validation
    - **Property 40: Product Weight Validation** — weight ≤ 0 must be rejected
    - **Validates: Requirements 17.1**
  - [ ]* 11.8 Write property test for product image requirement
    - **Property 41: Product Image Requirement** — empty images array must be rejected
    - **Validates: Requirements 17.2**
  - [x] 11.9 Implement Cloudinary upload helper `src/lib/cloudinaryUpload.ts`: validate MIME type and file size (max 10MB), upload to Cloudinary, return publicId and url; throw on failure
    - _Requirements: 10.8, 10.9_
  - [ ]* 11.10 Write property test for image upload validation
    - **Property 29: Image Upload Validation** — files > 10MB or invalid MIME type must be rejected without persisting product
    - **Validates: Requirements 10.8_
  - [x] 11.11 Implement admin product API routes:
    - `src/app/api/admin/products/route.ts` GET (list) and POST (create)
    - `src/app/api/admin/products/[id]/route.ts` GET, PUT, DELETE
    - `src/app/api/admin/products/bulk/route.ts` PATCH (bulk status update)
    - _Requirements: 10.1–10.10_

- [x] 12. Admin Type Management API
  - [x] 12.1 Implement `src/services/adminType.ts`: `createType`, `updateType`, `deleteType`
    - _Requirements: 11.1, 11.2, 11.3_
  - [x] 12.2 Implement `src/app/api/admin/types/route.ts` GET/POST and `src/app/api/admin/types/[id]/route.ts` PUT/DELETE
    - _Requirements: 11.1–11.3_

- [x] 13. Order Management API
  - [x] 13.1 Implement `src/services/order.ts`: `getOrders(filters, pagination)`, `getOrderById(id)`, `updateOrderStatus(id, newStatus, adminId)` with state machine validation, `getOrderStats()`
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_
  - [ ]* 13.2 Write property test for order filter correctness
    - **Property 32: Order Filter Correctness** — all returned orders match status and date range filters
    - **Validates: Requirements 12.1**
  - [ ]* 13.3 Write property test for order status transition validity
    - **Property 33: Order Status Transition Validity** — invalid transitions rejected with HTTP 400
    - **Validates: Requirements 12.3, 12.4**
  - [ ]* 13.4 Write property test for order stats accuracy
    - **Property 34: Order Stats Accuracy** — count per status matches actual DB counts
    - **Validates: Requirements 12.6**
  - [x] 13.5 Implement order API routes:
    - `src/app/api/admin/orders/route.ts` GET
    - `src/app/api/admin/orders/[id]/route.ts` GET and PATCH (status update)
    - `src/app/api/admin/orders/stats/route.ts` GET
    - _Requirements: 12.1–12.6_

- [x] 14. Other Charges and Merchant Orders API
  - [x] 14.1 Implement `src/app/api/admin/other-charges/route.ts` GET/PUT for OtherCharges config
    - _Requirements: 13.1, 13.2, 13.3_
  - [x] 14.2 Implement `src/services/merchantOrder.ts`: `logMerchantOrder`, `getMerchantOrders(filters)`, `updateMerchantOrder` with item amount computation
    - _Requirements: 16.1, 16.2, 16.3, 16.4_
  - [ ]* 14.3 Write property test for merchant order item amount calculation
    - **Property 39: Merchant Order Item Amount Calculation** — amount = (weight × ratePerGram) + makingCharges
    - **Validates: Requirements 16.4**
  - [x] 14.4 Implement merchant order API routes:
    - `src/app/api/admin/merchant-orders/route.ts` GET/POST
    - `src/app/api/admin/merchant-orders/[id]/route.ts` PUT
    - _Requirements: 16.1–16.4_

- [x] 15. Revenue Analytics and CSV Export API
  - [x] 15.1 Implement `src/services/analytics.ts`: `getRevenueSummary(period)`, `getDailyBreakdown(month)`, `getMonthlyBreakdown(year)`, `getProfitReport(period)` — delivered orders only
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8_
  - [ ]* 15.2 Write property test for profit calculation identity
    - **Property 36: Profit Calculation Identity** — grossProfit = revenue − totalExpenses; totalExpenses = sum of all expense components; profitMargin formula
    - **Validates: Requirements 14.2, 14.3, 14.4, 14.5**
  - [ ]* 15.3 Write property test for delivered-only revenue inclusion
    - **Property 37: Delivered-Only Revenue Inclusion** — non-delivered orders excluded from all revenue totals
    - **Validates: Requirements 14.6**
  - [x] 15.4 Implement `src/services/csvExport.ts`: `exportOrdersCSV(filters)` and `exportRevenueCSV(period)` using Papa Parse
    - _Requirements: 15.1, 15.2, 15.3_
  - [ ]* 15.5 Write property test for CSV export round-trip
    - **Property 38: CSV Export Round-Trip** — parsing exported CSV yields records matching the orders list API with same filters
    - **Validates: Requirements 15.1, 15.2**
  - [x] 15.6 Implement analytics API routes:
    - `src/app/api/admin/analytics/summary/route.ts` GET
    - `src/app/api/admin/analytics/daily/route.ts` GET
    - `src/app/api/admin/analytics/monthly/route.ts` GET
    - `src/app/api/admin/analytics/export/orders/route.ts` GET (CSV download)
    - `src/app/api/admin/analytics/export/revenue/route.ts` GET (CSV download)
    - _Requirements: 14.1–14.8, 15.1–15.3_

- [x] 16. Testimonials API
  - [x] 16.1 Implement `src/app/api/testimonials/route.ts` GET — return only published testimonials
    - _Requirements: 7.2_
  - [ ]* 16.2 Write property test for testimonials published-only
    - **Property 22: Testimonials — Published Only**
    - **Validates: Requirements 7.2**
  - [x] 16.3 Implement `src/app/api/admin/testimonials/route.ts` GET/POST and `[id]/route.ts` PUT/DELETE
    - _Requirements: 7.2_

- [x] 17. Checkpoint — Ensure all API and service tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 18. Customer storefront — shared layout and global components
  - [x] 18.1 Build `src/app/layout.tsx` root layout with Tailwind luxury theme, React Query provider, NextAuth session provider
    - _Requirements: 7.1, 8.1_
  - [x] 18.2 Build `src/components/GoldRateBanner.tsx` — fetches `/api/gold-rate`, displays rate per gram, purity, and last updated timestamp; auto-refreshes every 60 minutes
    - _Requirements: 5.1_
  - [x] 18.3 Build `src/components/Navbar.tsx` with category navigation links and wishlist icon with item count badge
    - _Requirements: 1.1, 4.6_
  - [x] 18.4 Build `src/components/TrustBadges.tsx` displaying BIS Hallmark and authenticity guarantee badges
    - _Requirements: 7.1_
  - [x] 18.5 Build `src/components/ExitIntentPopup.tsx` — detects cursor leaving viewport, shows discount offer form once per session, submits to `/api/leads/popup`
    - _Requirements: 6.3, 7.4_
  - [x] 18.6 Build `src/components/TestimonialsCarousel.tsx` — fetches published testimonials, renders name, rating, content, location with Framer Motion carousel
    - _Requirements: 7.2_

- [x] 19. Customer storefront — Homepage
  - [x] 19.1 Build `src/app/page.tsx` homepage with hero section, featured products grid (ISR, 5-min revalidation), category quick-links, gold rate banner, video showcase (autoplay on viewport entry), trust badges, testimonials carousel
    - _Requirements: 7.3, 8.2, 18.2_
  - [x] 19.2 Build `src/components/VideoShowcase.tsx` — lazy-loads video, autoplays only when in viewport using IntersectionObserver
    - _Requirements: 7.3_

- [x] 20. Customer storefront — Category and product listing pages
  - [x] 20.1 Build `src/app/[category]/page.tsx` category page with ISR (5-min revalidation), product grid, filter sidebar (type, price range, weight range, occasion, sort), and pagination
    - _Requirements: 1.1–1.10, 3.1–3.5, 8.1, 8.2_
  - [x] 20.2 Build `src/components/ProductGrid.tsx` and `src/components/ProductCard.tsx` — display primary image (WebP srcset via Cloudinary), name, price/price-on-request badge, wishlist heart toggle
    - _Requirements: 1.9, 2.2, 2.3, 2.4, 18.1_
  - [x] 20.3 Build `src/components/FilterSidebar.tsx` with controlled inputs for all filter dimensions; updates URL search params on change
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 3.1_
  - [x] 20.4 Build `src/components/SearchBar.tsx` with debounced input wired to product search API
    - _Requirements: 1.8_
  - [x] 20.5 Generate `src/app/sitemap.ts` including all active product slugs and category pages
    - _Requirements: 8.3_

- [x] 21. Customer storefront — Product detail page
  - [x] 21.1 Build `src/app/[category]/[slug]/page.tsx` with ISR (5-min revalidation), unique meta title/description, product name, category, type, weight, purity, occasion tags, description, image gallery, video (lazy), and related products section
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 8.1, 8.2, 8.4_
  - [x] 21.2 Build `src/components/ProductImageGallery.tsx` using react-image-magnify for hover zoom; renders all product images with thumbnail strip
    - _Requirements: 2.7_
  - [x] 21.3 Build `src/components/PriceRequestForm.tsx` — shown when salePrice is null; submits name, phone, message to `/api/leads/price-request`
    - _Requirements: 2.4, 6.1, 6.5_
  - [x] 21.4 Build `src/components/AppointmentForm.tsx` — submits name, phone, message to `/api/leads/appointment`
    - _Requirements: 6.2, 6.5_

- [x] 22. Customer storefront — Wishlist page and About page
  - [x] 22.1 Build `src/app/wishlist/page.tsx` — displays wishlist items fetched from `/api/wishlist`; handles guest (session) and authenticated states; triggers merge on login
    - _Requirements: 4.1, 4.2, 4.5_
  - [x] 22.2 Build `src/app/about/page.tsx` static about page with shop story, trust signals, and contact info
    - _Requirements: 7.1_

- [x] 23. Admin panel — Layout and shared components
  - [x] 23.1 Build `src/app/admin/layout.tsx` admin shell with sidebar navigation (Products, Types, Orders, Merchant Orders, Other Charges, Analytics), session guard
    - _Requirements: 9.1, 9.2_
  - [x] 23.2 Build `src/components/admin/DashboardCard.tsx` reusable stat card component used across admin pages
    - _Requirements: 12.6, 14.1_

- [x] 24. Admin panel — Product management UI
  - [x] 24.1 Build `src/app/admin/products/page.tsx` product list with search, status filter, bulk status update controls, and per-row edit/delete actions
    - _Requirements: 10.5, 10.6, 10.10_
  - [x] 24.2 Build `src/app/admin/products/new/page.tsx` and `src/app/admin/products/[id]/edit/page.tsx` product form with Cloudinary image upload widget (MIME + size validation), all product fields, and Zod-validated submission
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.7, 10.8, 10.9_
  - [x] 24.3 Build `src/app/admin/types/page.tsx` type management UI with create/edit/delete for JewelryType records
    - _Requirements: 11.1, 11.2, 11.3_

- [x] 25. Admin panel — Order management UI
  - [x] 25.1 Build `src/app/admin/orders/page.tsx` orders list with status filter, date range filter, pagination, and dashboard stat cards (counts by status)
    - _Requirements: 12.1, 12.6_
  - [x] 25.2 Build `src/app/admin/orders/[id]/page.tsx` order detail view with full pricing breakdown and status update dropdown showing only valid next transitions
    - _Requirements: 12.2, 12.3, 12.4, 12.5_

- [x] 26. Admin panel — Other Charges, Merchant Orders, and Gold Rate UI
  - [x] 26.1 Build `src/app/admin/other-charges/page.tsx` form to view and update shippingCost, gstRate, and additional charges
    - _Requirements: 13.1_
  - [x] 26.2 Build `src/app/admin/merchant-orders/page.tsx` list with filters and `new/page.tsx` form for logging merchant purchases with line items
    - _Requirements: 16.1, 16.2, 16.3, 16.4_
  - [x] 26.3 Build `src/app/admin/gold-rate/page.tsx` showing current rate and form to set manual rate
    - _Requirements: 5.6, 5.7_

- [x] 27. Admin panel — Revenue analytics UI
  - [x] 27.1 Build `src/app/admin/analytics/page.tsx` with date range picker, summary dashboard cards (revenue, investment, expenses, profit, margin), daily/monthly Recharts bar charts, and CSV download buttons
    - _Requirements: 14.1–14.8, 15.1–15.3_
  - [x] 27.2 Wire CSV export buttons to trigger file download from `/api/admin/analytics/export/orders` and `/api/admin/analytics/export/revenue`
    - _Requirements: 15.3_

- [x] 28. Performance optimizations
  - [x] 28.1 Add Cloudinary `srcset` helper `src/lib/cloudinaryImage.ts` generating WebP URLs at 400w, 800w, 1200w breakpoints for use in all product image components
    - _Requirements: 18.1_
  - [x] 28.2 Verify ISR `revalidate = 300` (5 minutes) is set on all product listing and detail page exports
    - _Requirements: 8.2, 18.2_
  - [x] 28.3 Add Redis caching layer in `getFilteredProducts` for popular filter combinations (TTL 5 minutes); invalidate on product create/update/delete
    - _Requirements: 18.3_
  - [x] 28.4 Confirm all Prisma schema indexes are applied in migration: `products(status, category, typeId)`, `products(slug)`, `orders(status, createdAt)`, `leads(phone, type)`
    - _Requirements: 18.4_

- [x] 29. Final checkpoint — Ensure all tests pass and integration is complete
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests use fast-check and validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- Implementation language: TypeScript throughout (Next.js 14 App Router)
