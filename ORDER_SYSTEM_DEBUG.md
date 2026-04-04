# Order System Debugging Guide

## Overview
The order system uses localStorage (mockDb) to store orders. This guide helps you verify and debug the order flow.

## How It Works

1. **Customer places order** → Cart page (`/cart`)
2. **Order sent to API** → `/api/orders` (POST)
3. **Order saved to localStorage** → `mockdb_orders` key
4. **Admin panel reads orders** → `/api/admin/orders` (GET)
5. **Admin panel displays orders** → `/admin/orders`

## Testing Steps

### Step 1: Test Order Creation
1. Go to the shop page: `http://localhost:3000/shop`
2. Add a product to cart
3. Go to cart: `http://localhost:3000/cart`
4. Fill in the form and place an order
5. Check browser console for logs:
   - Should see: `=== ORDER CREATION START ===`
   - Should see: `Order created successfully`
   - Should see: `Orders after creation: X` (where X is the new count)

### Step 2: Verify Order in Debug Endpoint
1. Visit: `http://localhost:3000/api/debug/orders`
2. You should see JSON with:
   - `totalOrders`: Number of orders
   - `orders`: Array of order objects
3. Your new order should be in the list

### Step 3: Check localStorage Directly
1. Open browser DevTools (F12)
2. Go to Application tab → Local Storage
3. Find `mockdb_orders` key
4. You should see an array of order objects
5. Verify your order is in the array

### Step 4: Check Admin Panel
1. Go to admin dashboard: `http://localhost:3000/admin`
2. Should see order statistics updated
3. Should see recent orders in the table
4. Go to orders page: `http://localhost:3000/admin/orders`
5. Your order should appear in the list

### Step 5: Use Test Orders Page
1. Go to: `http://localhost:3000/admin/test-orders`
2. Click "Check Orders (API)" - Shows orders from API
3. Click "Check localStorage" - Shows raw localStorage data
4. Click "Create Test Order" - Creates a test order
5. Verify the test order appears in admin panel

## Auto-Refresh Feature

The admin panel now auto-refreshes every 10 seconds:
- Dashboard: Auto-refreshes stats and recent orders
- Orders page: Auto-refreshes order list and stats

You can also manually refresh using the "🔄 Refresh" button.

## Common Issues & Solutions

### Issue 1: Orders not appearing in admin panel
**Symptoms**: Order placed successfully but not showing in admin panel

**Solutions**:
1. Wait 10 seconds for auto-refresh
2. Click the "🔄 Refresh" button manually
3. Check browser console for errors
4. Verify order exists in debug endpoint
5. Check localStorage directly

### Issue 2: localStorage not persisting
**Symptoms**: Orders disappear after page refresh

**Solutions**:
1. Check if browser is in private/incognito mode
2. Check browser localStorage quota
3. Clear browser cache and try again
4. Check for browser extensions blocking localStorage

### Issue 3: Order creation fails
**Symptoms**: Error message when placing order

**Solutions**:
1. Check browser console for error details
2. Verify all required fields are filled
3. Check network tab for API response
4. Look for validation errors in console

### Issue 4: Seed orders showing instead of real orders
**Symptoms**: Only seeing dummy/seed orders

**Solutions**:
1. This is normal on first load
2. Place a new order - it will be added to the list
3. Seed orders are mixed with real orders
4. Use date filter to see only recent orders

## Console Logs to Look For

### When placing an order:
```
=== ORDER CREATION START ===
Received order data: {...}
Creating order with number: ORD-...
Orders before creation: X
Order created successfully: order-id ORD-...
Orders after creation: X+1
=== ORDER CREATION END ===
```

### When viewing admin orders:
```
=== FETCHING ORDERS ===
Total orders in DB: X
Filtered orders: X Page: 1 Returning: Y
=== END FETCHING ORDERS ===
```

## API Endpoints

- `POST /api/orders` - Create new order
- `GET /api/admin/orders` - Get all orders (with filters)
- `GET /api/admin/orders/stats` - Get order statistics
- `GET /api/admin/orders/[id]` - Get single order details
- `GET /api/debug/orders` - Debug endpoint to check orders

## localStorage Keys

- `mockdb_orders` - All orders
- `mockdb_products` - All products
- `mockdb_types` - Jewelry types
- `mockdb_goldRate` - Current gold rate
- `mockdb_otherCharges` - Shipping/GST settings

## Clearing Data

### Clear all orders:
1. Go to: `http://localhost:3000/admin/test-orders`
2. Click "Clear All Orders"
3. Confirm the action

### Clear all data:
1. Open DevTools (F12)
2. Application → Local Storage
3. Right-click → Clear
4. Refresh page to reseed with default data

## Need More Help?

1. Check browser console for errors
2. Check network tab for failed API calls
3. Use the test orders page to diagnose issues
4. Verify localStorage is working in your browser
