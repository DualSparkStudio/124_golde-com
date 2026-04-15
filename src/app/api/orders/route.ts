import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/mockDb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('=== ORDER CREATION START ===');
    console.log('Received order data:', JSON.stringify(body, null, 2));
    
    const {
      customerName,
      customerPhone,
      customerEmail,
      items,
      subtotal,
      shippingCost,
      gstAmount,
      gstRate,
      totalAmount,
      notes,
    } = body;

    // Validate required fields
    if (!customerName || !customerPhone || !items || items.length === 0) {
      console.error('Validation failed:', { customerName, customerPhone, itemsLength: items?.length });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    console.log('Creating order with number:', orderNumber);
    console.log('Orders before creation:', db.orders.getAll().length);

    // Create order with mockDb
    const order = db.orders.create({
      orderNumber,
      customerName,
      customerPhone,
      customerEmail: customerEmail || null,
      items: items.map((item: any, index: number) => ({
        id: `oi-${Date.now()}-${index}`,
        orderId: '', // Will be set by the order
        productId: item.productId,
        productName: item.productName,
        weight: item.weight,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        makingCharges: item.makingCharges || 0,
        purchasePrice: item.purchasePrice || 0,
      })),
      subtotal,
      shippingCost,
      gstAmount,
      gstRate,
      totalAmount,
      status: "pending",
      notes: notes || null,
    });

    console.log('Order created successfully:', order.id, order.orderNumber);
    console.log('Orders after creation:', db.orders.getAll().length);
    console.log('=== ORDER CREATION END ===');

    return NextResponse.json({ order }, { status: 201 });
  } catch (error: any) {
    console.error("=== ORDER CREATION ERROR ===");
    console.error("Error creating order:", error);
    console.error("Error details:", error.message, error.stack);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
