"use client";

import { useState } from "react";

export default function TestOrdersPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function checkOrders() {
    setLoading(true);
    try {
      const res = await fetch('/api/debug/orders');
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: String(error) });
    } finally {
      setLoading(false);
    }
  }

  async function checkLocalStorage() {
    if (typeof window !== 'undefined') {
      const orders = localStorage.getItem('mockdb_orders');
      setResult({
        localStorage: orders ? JSON.parse(orders) : null,
        totalInStorage: orders ? JSON.parse(orders).length : 0,
      });
    }
  }

  async function createTestOrder() {
    setLoading(true);
    try {
      const testOrder = {
        customerName: "Test Customer " + Date.now(),
        customerPhone: "9999999999",
        customerEmail: "test@example.com",
        items: [{
          productId: "prod-1",
          productName: "Test Product",
          weight: 2.5,
          quantity: 1,
          unitPrice: 10000,
          makingCharges: 500,
          purchasePrice: 8000,
        }],
        subtotal: 10000,
        shippingCost: 99,
        gstAmount: 300,
        gstRate: 0.03,
        totalAmount: 10399,
        notes: "Test order from admin panel",
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testOrder),
      });

      const data = await res.json();
      setResult({ success: res.ok, data });
    } catch (error) {
      setResult({ error: String(error) });
    } finally {
      setLoading(false);
    }
  }

  async function clearOrders() {
    if (typeof window !== 'undefined') {
      if (confirm('Are you sure you want to clear all orders? This cannot be undone!')) {
        localStorage.removeItem('mockdb_orders');
        setResult({ message: 'Orders cleared from localStorage' });
      }
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: "1.75rem", marginBottom: "1rem" }}>
        Order System Test
      </h1>
      
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        <button 
          onClick={checkOrders} 
          disabled={loading}
          style={{ padding: "0.75rem 1.5rem", backgroundColor: "#C9A84C", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600 }}
        >
          Check Orders (API)
        </button>
        
        <button 
          onClick={checkLocalStorage} 
          disabled={loading}
          style={{ padding: "0.75rem 1.5rem", backgroundColor: "#4c9ac9", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600 }}
        >
          Check localStorage
        </button>
        
        <button 
          onClick={createTestOrder} 
          disabled={loading}
          style={{ padding: "0.75rem 1.5rem", backgroundColor: "#4caf7d", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600 }}
        >
          Create Test Order
        </button>
        
        <button 
          onClick={clearOrders} 
          disabled={loading}
          style={{ padding: "0.75rem 1.5rem", backgroundColor: "#e05252", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600 }}
        >
          Clear All Orders
        </button>
      </div>

      {result && (
        <div style={{ backgroundColor: "#fff", border: "1px solid #F0F0F0", borderRadius: "12px", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h2 style={{ fontSize: "1rem", marginBottom: "1rem", color: "#0A0A0A" }}>Result:</h2>
          <pre style={{ backgroundColor: "#FAFAFA", padding: "1rem", borderRadius: "8px", overflow: "auto", fontSize: "0.8rem", lineHeight: 1.5 }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#FFF8F0", border: "1px solid #C9A84C33", borderRadius: "8px" }}>
        <h3 style={{ fontSize: "0.9rem", marginBottom: "0.5rem", color: "#C9A84C" }}>Instructions:</h3>
        <ul style={{ fontSize: "0.85rem", color: "#666", lineHeight: 1.8, paddingLeft: "1.5rem" }}>
          <li><strong>Check Orders (API)</strong> - Fetches orders from the API endpoint</li>
          <li><strong>Check localStorage</strong> - Directly reads from browser localStorage</li>
          <li><strong>Create Test Order</strong> - Creates a new test order via API</li>
          <li><strong>Clear All Orders</strong> - Removes all orders from localStorage (use with caution!)</li>
        </ul>
      </div>
    </div>
  );
}
