# Requirements Document

## Introduction

This document defines the requirements for the Jewelry Shop Ecommerce platform — a full-featured luxury jewelry ecommerce system built with Next.js. The platform serves two audiences: customers browsing and purchasing jewelry, and administrators managing products, orders, revenue, and merchant purchases. Requirements are derived from the approved design document.

## Glossary

- **System**: The Jewelry Shop Ecommerce platform as a whole
- **Customer**: An end user browsing or purchasing jewelry on the storefront
- **Admin**: An authenticated shop administrator with access to the admin panel
- **Product**: A jewelry item with attributes including name, category, type, weight, purity, pricing, and images
- **JewelryType**: A sub-classification of jewelry (e.g., Ring, Pendant, Chain) belonging to a category
- **Category**: Top-level classification of jewelry — gold or silver
- **Order**: A customer purchase record containing items, pricing, and fulfillment status
- **MerchantOrder**: A record of jewelry purchased from a supplier/merchant for inventory
- **Lead**: A customer inquiry captured via price request, appointment booking, or exit-intent popup
- **GoldRate**: The current market price of gold per gram or tola, sourced from an external API or set manually
- **OtherCharges**: Configurable platform-wide shipping cost and GST rate
- **Wishlist**: A saved list of products a customer intends to revisit or purchase
- **Slug**: A URL-safe unique identifier derived from a product's name
- **CDN**: Content Delivery Network (Cloudinary) used for image and video hosting
- **ProfitReport**: A computed summary of revenue, expenses, and gross profit for a date range
- **AuditLog**: A record of all admin mutations including action, entity, admin ID, and timestamp
- **ISR**: Incremental Static Regeneration — Next.js feature for periodically revalidating static pages
- **PriceOnRequest**: A product configuration where salePrice is null and customers must submit a lead to get pricing

---

## Requirements

### Requirement 1: Product Catalog Browsing

**User Story:** As a customer, I want to browse jewelry products by category and type, so that I can discover items relevant to my interests.

#### Acceptance Criteria

1. WHEN a customer visits a category page, THE System SHALL display a paginated grid of active products belonging to that category.
2. WHEN a customer selects a jewelry type filter, THE System SHALL return only products matching that type within the selected category.
3. WHEN a customer applies price range filters, THE System SHALL return only products whose salePrice falls within the specified minimum and maximum values.
4. WHEN a customer applies weight range filters, THE System SHALL return only products whose weight falls within the specified minimum and maximum values.
5. WHEN a customer applies an occasion filter, THE System SHALL return only products whose occasion array contains the selected occasion.
6. WHEN a customer selects a sort option, THE System SHALL order results by the selected criterion (price ascending, price descending, or newest first).
7. THE System SHALL exclude products with status other than "active" from all customer-facing product listings.
8. WHEN a customer submits a search query, THE System SHALL return products whose name or description contains the query string (case-insensitive).
9. THE ProductCatalog SHALL resolve and return a primary image URL from the CDN for every product in a listing response.
10. WHEN pagination parameters are provided, THE System SHALL return at most pageSize items and include total, page, pageSize, and totalPages in the response.

---

### Requirement 2: Product Detail Page

**User Story:** As a customer, I want to view full product details including images, specifications, and pricing, so that I can make an informed purchase decision.

#### Acceptance Criteria

1. WHEN a customer navigates to a product detail page, THE System SHALL display the product name, category, type, weight, purity, occasion tags, description, and all associated images.
2. WHEN a product has a salePrice set, THE System SHALL display the salePrice to the customer.
3. WHEN a product has a discountPrice set, THE System SHALL display both the salePrice and discountPrice, with the discountPrice shown as the current price.
4. WHEN a product has no salePrice (PriceOnRequest), THE System SHALL display a "Price on Request" label instead of a price.
5. WHEN a product has a videoUrl, THE System SHALL display the video on the product detail page with lazy loading.
6. THE ProductDetail SHALL return related products from the same category or type, limited to the requested count.
7. WHEN a customer hovers over a product image, THE System SHALL enable zoom/magnification of the image.
8. THE System SHALL never expose the purchasePrice field in any customer-facing API response.

---

### Requirement 3: Product Filtering and Search

**User Story:** As a customer, I want to use smart filters to narrow down products, so that I can quickly find jewelry matching my specific needs.

#### Acceptance Criteria

1. THE System SHALL support simultaneous application of multiple filters (category, type, price range, weight range, occasion).
2. WHEN both priceMin and priceMax are provided, THE System SHALL only apply the filter if priceMin is less than or equal to priceMax.
3. WHEN both weightMin and weightMax are provided, THE System SHALL only apply the filter if weightMin is less than or equal to weightMax.
4. WHEN no filters are applied, THE System SHALL return all active products ordered by newest first.
5. WHEN a filter yields zero results, THE System SHALL return an empty items array with total equal to zero.

---

### Requirement 4: Wishlist

**User Story:** As a customer, I want to save products to a wishlist, so that I can revisit and purchase them later.

#### Acceptance Criteria

1. WHEN an authenticated customer adds a product to their wishlist, THE WishlistService SHALL persist the wishlist entry linked to their user ID.
2. WHEN a guest customer adds a product to their wishlist, THE WishlistService SHALL store the entry in session-based storage.
3. WHEN a customer adds a product that is already in their wishlist, THE WishlistService SHALL ensure the product appears exactly once (idempotent upsert).
4. WHEN a customer removes a product from their wishlist, THE WishlistService SHALL delete the corresponding wishlist entry.
5. WHEN a guest customer authenticates, THE WishlistService SHALL merge the guest session wishlist into the authenticated user's wishlist.
6. THE WishlistService SHALL return the updated wishlist item count after every add or remove operation.

---

### Requirement 5: Live Gold Rate Banner

**User Story:** As a customer, I want to see the current gold rate displayed on the site, so that I can understand the pricing context for gold jewelry.

#### Acceptance Criteria

1. WHEN a customer loads any page, THE System SHALL display the current gold rate in the banner, including rate per gram, purity (22K/24K), and the last updated timestamp.
2. WHEN the GoldRateService fetches the rate, THE System SHALL return a cached rate if the cached value is less than 1 hour old.
3. WHEN the cache is expired or missing, THE GoldRateService SHALL fetch the current rate from the external gold rate API and store it in Redis with a 1-hour TTL.
4. IF the external gold rate API is unavailable, THEN THE GoldRateService SHALL fall back to the most recent manually set rate.
5. IF no manual rate exists and the API is unavailable, THEN THE GoldRateService SHALL throw a GoldRateUnavailableError.
6. WHEN an admin sets a manual gold rate, THE GoldRateService SHALL persist the rate with source = "manual" and invalidate the Redis cache.
7. WHEN an admin sets a manual gold rate, THE System SHALL only accept rate values greater than zero and unit values from the defined set (per_gram_22k, per_gram_24k, per_tola_22k, per_tola_24k).

---

### Requirement 6: Lead Capture and Appointment Booking

**User Story:** As a customer, I want to request pricing or book an appointment, so that I can get personalized service for high-value purchases.

#### Acceptance Criteria

1. WHEN a customer submits a price request for a PriceOnRequest product, THE System SHALL create a Lead record with type = "price_request", linked to the product, and containing the customer's name and phone.
2. WHEN a customer submits an appointment booking, THE System SHALL create a Lead record with type = "appointment" containing the customer's name, phone, and preferred message/time.
3. WHEN an exit-intent popup is triggered and the customer submits their phone number, THE System SHALL create a Lead record with type = "popup_offer" and send the offer code via WhatsApp or SMS.
4. WHEN a phone number is submitted for a popup offer that already exists in the system with type = "popup_offer", THE System SHALL silently succeed on the frontend without creating a duplicate lead or resending the offer code.
5. IF a submitted phone number is not a valid phone number format, THEN THE System SHALL return an error and not create a lead.
6. THE System SHALL enforce a rate limit of at most 3 lead submissions per IP address per hour on lead capture endpoints.

---

### Requirement 7: Trust and Conversion Elements

**User Story:** As a customer, I want to see trust signals and social proof on the storefront, so that I feel confident purchasing from the shop.

#### Acceptance Criteria

1. THE System SHALL display BIS Hallmark trust badges and authenticity guarantee indicators on relevant product and storefront pages.
2. THE System SHALL display published customer testimonials including customer name, rating (1–5), content, and optional location.
3. WHEN a video showcase is configured, THE System SHALL display the video with autoplay only when the video element is in the viewport.
4. THE System SHALL display an exit-intent popup with a discount offer when a customer's cursor moves toward leaving the page, at most once per session.

---

### Requirement 8: SEO

**User Story:** As a shop owner, I want the storefront to be optimized for search engines, so that customers can discover the shop organically.

#### Acceptance Criteria

1. THE System SHALL generate unique, descriptive meta titles and meta descriptions for every product page and category page.
2. THE System SHALL use ISR with a maximum revalidation interval of 5 minutes for product listing and detail pages.
3. THE System SHALL generate a sitemap including all active product pages and category pages.
4. THE System SHALL use URL slugs derived from product names for all product detail page URLs.

---

### Requirement 9: Admin Authentication

**User Story:** As a shop administrator, I want secure access to the admin panel, so that only authorized users can manage the platform.

#### Acceptance Criteria

1. WHEN an unauthenticated user attempts to access any admin route, THE System SHALL redirect them to the admin login page.
2. WHEN an authenticated user without the "admin" role attempts to access admin routes, THE System SHALL return HTTP 403.
3. THE System SHALL protect all admin API routes with JWT-based session validation and role verification (role = "admin").
4. THE System SHALL validate all admin mutation inputs server-side regardless of client-side validation.

---

### Requirement 10: Admin Product Management

**User Story:** As an admin, I want to create, update, and delete products, so that I can keep the product catalog accurate and up to date.

#### Acceptance Criteria

1. WHEN an admin creates a product, THE AdminProductService SHALL persist a product record with all required fields: name, category, typeId, weight, purity, quantity, at least one image, purchasePrice, and makingCharges.
2. WHEN an admin creates a product, THE System SHALL generate a unique URL-safe slug from the product name.
3. IF a generated slug already exists, THEN THE System SHALL append a short unique identifier to make the slug unique.
4. WHEN an admin creates a product with both salePrice and discountPrice, THE System SHALL reject the product if discountPrice is greater than or equal to salePrice.
5. WHEN an admin updates a product, THE AdminProductService SHALL update the product record and set updatedAt to the current timestamp.
6. WHEN an admin deletes a product, THE AdminProductService SHALL remove the product record and its associated images.
7. WHEN an admin creates or updates a product, THE System SHALL create an audit log entry containing the action, product ID, admin ID, and timestamp.
8. WHEN an admin uploads product images, THE System SHALL validate that each image is a valid MIME type and does not exceed 10MB.
9. IF a CDN image upload fails during product creation, THEN THE System SHALL return HTTP 422 and not persist the product record.
10. WHEN an admin performs a bulk status update, THE AdminProductService SHALL update the status of all specified products and return the count of updated records.

---

### Requirement 11: Admin Type Management

**User Story:** As an admin, I want to manage jewelry types (e.g., Ring, Pendant, Chain), so that products can be accurately categorized.

#### Acceptance Criteria

1. WHEN an admin creates a jewelry type, THE AdminTypeService SHALL persist a JewelryType record with name, category (gold, silver, or both), and a generated slug.
2. WHEN an admin updates a jewelry type name, THE AdminTypeService SHALL update the name and slug accordingly.
3. WHEN an admin deletes a jewelry type, THE AdminTypeService SHALL remove the type record.
4. THE System SHALL return all active jewelry types when the customer-facing getTypes endpoint is called.

---

### Requirement 12: Order Management

**User Story:** As an admin, I want to view and manage customer orders, so that I can fulfill orders and track their status.

#### Acceptance Criteria

1. WHEN an admin views the orders list, THE OrderService SHALL return a paginated list of orders with support for filtering by status and date range.
2. WHEN an admin views an order, THE OrderService SHALL return the full order detail including all order items, customer information, pricing breakdown (subtotal, shipping, GST, total), and current status.
3. WHEN an admin updates an order status, THE OrderService SHALL only allow transitions defined in the valid state machine: pending → confirmed | cancelled, confirmed → processing | cancelled, processing → shipped, shipped → delivered.
4. IF an admin attempts an invalid order status transition, THEN THE System SHALL return HTTP 400 with an error message indicating the invalid transition.
5. WHEN an admin updates an order status, THE System SHALL set the order's updatedAt to the current timestamp and create an audit log entry.
6. THE OrderService SHALL return dashboard summary statistics including counts of orders by status.

---

### Requirement 13: Other Charges Configuration

**User Story:** As an admin, I want to configure shipping costs and GST rates, so that order totals are calculated correctly.

#### Acceptance Criteria

1. WHEN an admin updates the other charges configuration, THE System SHALL persist the new shippingCost, gstRate, and any additional charges label and amount.
2. WHEN an order is created, THE System SHALL apply the current shippingCost and gstRate from the OtherCharges configuration to compute the order total.
3. THE System SHALL compute gstAmount as totalAmount × gstRate and shippingCost as the configured flat rate.

---

### Requirement 14: Revenue Analytics

**User Story:** As an admin, I want to view revenue, expenses, and profit analytics, so that I can understand the financial health of the business.

#### Acceptance Criteria

1. WHEN an admin requests a revenue summary for a date range, THE AnalyticsService SHALL return total revenue, purchase cost, shipping expenses, GST expenses, making charges expenses, total expenses, gross profit, profit margin percentage, and order count.
2. THE AnalyticsService SHALL compute grossProfit as revenue minus totalExpenses.
3. THE AnalyticsService SHALL compute totalExpenses as the sum of purchaseCost, shippingExpenses, gstExpenses, and makingChargesExpenses.
4. WHEN revenue is greater than zero, THE AnalyticsService SHALL compute profitMargin as (grossProfit / revenue) × 100.
5. WHEN revenue is zero, THE AnalyticsService SHALL return profitMargin as zero.
6. THE AnalyticsService SHALL include only orders with status = "delivered" in all revenue and profit calculations.
7. WHEN an admin requests a daily breakdown, THE AnalyticsService SHALL return per-day revenue figures for the specified month.
8. WHEN an admin requests a monthly breakdown, THE AnalyticsService SHALL return per-month revenue figures for the specified year.

---

### Requirement 15: Downloadable Reports

**User Story:** As an admin, I want to download order and revenue data as CSV files, so that I can perform offline analysis and record-keeping.

#### Acceptance Criteria

1. WHEN an admin requests an orders CSV export, THE AnalyticsService SHALL generate and return a CSV file containing order records matching the specified filters.
2. WHEN an admin requests a revenue CSV export, THE AnalyticsService SHALL generate and return a CSV file containing revenue data for the specified date range.
3. THE System SHALL trigger a file download in the admin browser when a CSV export is requested.

---

### Requirement 16: Merchant Purchase Orders

**User Story:** As an admin, I want to log and track purchases from merchants/suppliers, so that I can maintain accurate inventory cost records.

#### Acceptance Criteria

1. WHEN an admin logs a merchant order, THE MerchantOrderService SHALL persist a MerchantOrder record with merchant name, purchase date, purity, total weight, total cost, and all line items.
2. WHEN an admin views merchant orders, THE MerchantOrderService SHALL return a list of merchant orders with support for filtering.
3. WHEN an admin updates a merchant order, THE MerchantOrderService SHALL update the record with the new data.
4. THE System SHALL compute each MerchantOrderItem amount as (weight × ratePerGram) + makingCharges.

---

### Requirement 17: Data Integrity and Validation

**User Story:** As a platform operator, I want all data to be validated and consistent, so that the system operates reliably without corrupt records.

#### Acceptance Criteria

1. THE System SHALL reject any product with weight less than or equal to zero.
2. THE System SHALL reject any product with no images.
3. THE System SHALL enforce slug uniqueness across all products.
4. THE System SHALL ensure every active product has exactly one image with isPrimary = true.
5. WHEN a gold rate is set manually, THE System SHALL reject rate values less than or equal to zero.
6. THE System SHALL store phone numbers in hashed form for lead deduplication, exposing plain text only in the admin view.
7. THE System SHALL enforce that order totalAmount equals subtotal plus shippingCost plus gstAmount.

---

### Requirement 18: Performance and Caching

**User Story:** As a customer, I want the storefront to load quickly, so that I have a smooth browsing experience.

#### Acceptance Criteria

1. THE System SHALL serve product images via CDN in WebP format with responsive srcset for multiple sizes.
2. THE System SHALL use ISR with a revalidation interval of at most 5 minutes for product listing and detail pages.
3. THE System SHALL cache the gold rate in Redis with a TTL of 1 hour.
4. THE System SHALL use database indexes on products(status, category, typeId), products(slug), orders(status, createdAt), and leads(phone, type).
