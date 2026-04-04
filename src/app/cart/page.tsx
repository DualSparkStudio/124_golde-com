"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { useStore } from "@/context/StoreContext";

export default function CartPage() {
  const { cartItems, removeFromCart, updateCartQty, clearCart, cartTotal } = useStore();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });
  const [placing, setPlacing] = useState(false);

  const shipping = cartTotal > 5000 ? 0 : 99;
  const gst = Math.round(cartTotal * 0.03);
  const grandTotal = cartTotal + shipping + gst;

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setPlacing(true);
    
    try {
      // Create order via API
      const orderData = {
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: form.email || null,
        items: cartItems.map(item => ({
          productId: item.productId,
          productName: item.name,
          weight: item.weight,
          quantity: item.quantity,
          unitPrice: item.price,
          makingCharges: 0, // You can calculate this based on your logic
          purchasePrice: 0, // This should come from product data
        })),
        subtotal: cartTotal,
        shippingCost: shipping,
        gstAmount: gst,
        gstRate: 0.03,
        totalAmount: grandTotal,
        notes: form.address || null,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.error || 'Failed to place order');
      }

      const result = await response.json();
      console.log('Order placed successfully:', result);

      clearCart();
      setOrderPlaced(true);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  }

  if (orderPlaced) {
    return (
      <>
        <Navbar />
        <main style={{ backgroundColor: "#fff", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ textAlign: "center", maxWidth: "480px" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "rgba(76,175,125,0.1)", border: "2px solid #4caf7d", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "2rem" }}>✓</div>
            <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "2rem", color: "#0A0A0A", margin: "0 0 12px" }}>Order Placed!</h1>
            <p style={{ color: "#666", fontSize: "1rem", lineHeight: 1.7, margin: "0 0 32px" }}>Thank you for your order. We&apos;ll contact you on <strong>{form.phone}</strong> to confirm and arrange delivery.</p>
            <Link href="/shop" style={{ display: "inline-block", padding: "14px 40px", background: "linear-gradient(90deg, #C9A84C, #B8860B)", color: "#fff", textDecoration: "none", fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: "6px" }}>
              Continue Shopping
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ backgroundColor: "#F8F9FA", minHeight: "100vh" }}>
        {/* Hero */}
        <div style={{ paddingTop: "120px", paddingBottom: "40px", backgroundColor: "#0A0A0A", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginBottom: "16px" }}>
            <div style={{ width: "40px", height: "1px", background: "linear-gradient(90deg, transparent, #C9A84C)" }} />
            <span style={{ color: "#C9A84C", fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase" }}>Your Order</span>
            <div style={{ width: "40px", height: "1px", background: "linear-gradient(90deg, #C9A84C, transparent)" }} />
          </div>
          <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "clamp(2rem, 4vw, 3rem)", color: "#FFF8F0", margin: 0 }}>Shopping Cart</h1>
        </div>

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px 80px", display: "grid", gridTemplateColumns: "1fr 380px", gap: "32px", alignItems: "flex-start" }} className="cart-grid">
          {/* Cart Items */}
          <div>
            {cartItems.length === 0 ? (
              <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "60px 24px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: "3rem", marginBottom: "16px", opacity: 0.2 }}>🛒</div>
                <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "1.5rem", color: "#0A0A0A", margin: "0 0 12px" }}>Your cart is empty</h2>
                <p style={{ color: "#888", margin: "0 0 28px" }}>Add some beautiful jewelry to get started.</p>
                <Link href="/shop" style={{ display: "inline-block", padding: "14px 36px", background: "linear-gradient(90deg, #C9A84C, #B8860B)", color: "#fff", textDecoration: "none", fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: "6px" }}>
                  Browse Collection
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "1.2rem", color: "#0A0A0A", margin: 0 }}>
                    {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                  </h2>
                  <button onClick={clearCart} style={{ background: "none", border: "none", color: "#e05252", fontSize: "0.8rem", cursor: "pointer", fontWeight: 600 }}>Clear All</button>
                </div>
                {cartItems.map((item) => (
                  <div key={item.productId} style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "20px", display: "flex", gap: "16px", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: "1px solid #F0F0F0" }}>
                    <div style={{ width: "80px", height: "80px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, backgroundColor: "#FAF8F5" }}>
                      {item.image ? (
                        item.image.startsWith("data:") ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <Image src={item.image} alt={item.name} width={80} height={80} style={{ objectFit: "cover" }} />
                        )
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#C9A84C", fontSize: "1.5rem" }}>✦</div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link href={`/${item.category}/${item.slug}`} style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "0.95rem", fontWeight: 600, color: "#0A0A0A", textDecoration: "none", display: "block", marginBottom: "4px" }}>
                        {item.name}
                      </Link>
                      <p style={{ color: "#888", fontSize: "0.78rem", margin: "0 0 10px" }}>{item.purity} · {item.weight}g</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", border: "1px solid #E8E8E8", borderRadius: "6px", overflow: "hidden" }}>
                          <button onClick={() => updateCartQty(item.productId, item.quantity - 1)} style={{ width: "32px", height: "32px", border: "none", background: "#FAFAFA", cursor: "pointer", fontSize: "1rem", color: "#555" }}>−</button>
                          <span style={{ width: "36px", textAlign: "center", fontSize: "0.875rem", fontWeight: 600, color: "#0A0A0A" }}>{item.quantity}</span>
                          <button onClick={() => updateCartQty(item.productId, item.quantity + 1)} style={{ width: "32px", height: "32px", border: "none", background: "#FAFAFA", cursor: "pointer", fontSize: "1rem", color: "#555" }}>+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.productId)} style={{ background: "none", border: "none", color: "#e05252", fontSize: "0.78rem", cursor: "pointer", fontWeight: 600 }}>Remove</button>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "1.1rem", fontWeight: 700, color: "#C9A84C" }}>
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </div>
                      <div style={{ color: "#999", fontSize: "0.75rem" }}>₹{item.price.toLocaleString("en-IN")} each</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary + Checkout */}
          {cartItems.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Summary */}
              <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #F0F0F0" }}>
                <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "1.1rem", color: "#0A0A0A", margin: "0 0 20px" }}>Order Summary</h3>
                {[
                  { label: "Subtotal", value: `₹${cartTotal.toLocaleString("en-IN")}` },
                  { label: "Shipping", value: shipping === 0 ? "FREE" : `₹${shipping}` },
                  { label: "GST (3%)", value: `₹${gst.toLocaleString("en-IN")}` },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F8F8F8", color: "#555", fontSize: "0.875rem" }}>
                    <span>{label}</span>
                    <span style={{ color: value === "FREE" ? "#4caf7d" : "#0A0A0A", fontWeight: value === "FREE" ? 600 : 400 }}>{value}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0 0", color: "#0A0A0A", fontWeight: 700, fontSize: "1.1rem" }}>
                  <span>Total</span>
                  <span style={{ color: "#C9A84C", fontFamily: '"Playfair Display", Georgia, serif' }}>₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
                {shipping === 0 && <p style={{ color: "#4caf7d", fontSize: "0.75rem", margin: "8px 0 0", textAlign: "center" }}>✓ Free shipping on orders above ₹5,000</p>}
              </div>

              {/* Checkout Form */}
              <div style={{ backgroundColor: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #F0F0F0" }}>
                <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "1.1rem", color: "#0A0A0A", margin: "0 0 20px" }}>Delivery Details</h3>
                <form onSubmit={placeOrder} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    { key: "name", label: "Full Name *", placeholder: "Your name", type: "text" },
                    { key: "phone", label: "Phone *", placeholder: "+91 98765 43210", type: "tel" },
                    { key: "email", label: "Email", placeholder: "your@email.com", type: "email" },
                    { key: "address", label: "Address *", placeholder: "Delivery address", type: "text" },
                  ].map(({ key, label, placeholder, type }) => (
                    <div key={key}>
                      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#888", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>{label}</label>
                      <input type={type} placeholder={placeholder} value={form[key as keyof typeof form]}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                        required={key !== "email"}
                        style={{ width: "100%", padding: "10px 12px", border: "1px solid #E8E8E8", borderRadius: "8px", fontSize: "0.875rem", color: "#0A0A0A", outline: "none", boxSizing: "border-box", backgroundColor: "#FAFAFA" }} />
                    </div>
                  ))}
                  <button type="submit" disabled={placing} style={{ width: "100%", padding: "14px", background: placing ? "#ccc" : "linear-gradient(90deg, #C9A84C, #B8860B)", color: "#fff", border: "none", borderRadius: "8px", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: placing ? "not-allowed" : "pointer", marginTop: "4px" }}>
                    {placing ? "Placing Order..." : "Place Order"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
        <SiteFooter />
      </main>
    </>
  );
}
