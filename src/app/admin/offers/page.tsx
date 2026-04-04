'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/mockDb';
import type { MockProduct } from '@/lib/mockDb';

type Product = Pick<MockProduct, 'id' | 'name' | 'category' | 'salePrice' | 'discountPrice' | 'slug'>;

export default function OffersPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'discounted' | 'no-discount'>('all');

  useEffect(() => {
    try {
      setProducts(db.products.getAll());
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredProducts = products.filter(p => {
    if (filter === 'discounted') return p.discountPrice != null;
    if (filter === 'no-discount') return p.discountPrice == null && p.salePrice != null;
    return true;
  });

  const discountedCount = products.filter(p => p.discountPrice != null).length;
  const totalRevenue = products
    .filter(p => p.discountPrice != null && p.salePrice != null)
    .reduce((sum, p) => sum + (p.salePrice! - p.discountPrice!), 0);

  return (
    <>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.75rem', color: '#0A0A0A', marginBottom: '0.5rem' }}>
          Offers & Discounts
        </h1>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Manage product discounts and special offers
        </p>
      </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: '#fff', border: '1px solid #F0F0F0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ color: '#888', fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Active Offers
            </div>
            <div style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '2rem', fontWeight: 700, color: '#C9A84C' }}>
              {discountedCount}
            </div>
            <div style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.25rem' }}>
              out of {products.length} products
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', border: '1px solid #F0F0F0', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ color: '#888', fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Total Discount Value
            </div>
            <div style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '2rem', fontWeight: 700, color: '#e05252' }}>
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
            <div style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.25rem' }}>
              potential savings for customers
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {[
            { value: 'all', label: 'All Products' },
            { value: 'discounted', label: 'With Discount' },
            { value: 'no-discount', label: 'No Discount' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value as typeof filter)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: filter === value ? '#C9A84C' : '#fff',
                color: filter === value ? '#fff' : '#666',
                border: '1px solid',
                borderColor: filter === value ? '#C9A84C' : '#E8E8E8',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Products Table */}
        <div style={{ backgroundColor: '#fff', border: '1px solid #F0F0F0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>Loading...</div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>No products found</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#FAFAFA', borderBottom: '1px solid #F0F0F0' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#888', fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
                    Product
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#888', fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
                    Category
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'right', color: '#888', fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
                    Sale Price
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'right', color: '#888', fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
                    Discount Price
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'right', color: '#888', fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
                    Discount %
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: '#888', fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const discountPercent = product.discountPrice && product.salePrice
                    ? Math.round((1 - product.discountPrice / product.salePrice) * 100)
                    : 0;

                  return (
                    <tr key={product.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                      <td style={{ padding: '1rem', color: '#0A0A0A', fontSize: '0.9rem' }}>
                        {product.name}
                      </td>
                      <td style={{ padding: '1rem', color: '#666', fontSize: '0.85rem', textTransform: 'capitalize' }}>
                        {product.category}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', color: '#0A0A0A', fontSize: '0.9rem' }}>
                        {product.salePrice ? `₹${product.salePrice.toLocaleString('en-IN')}` : '-'}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', color: product.discountPrice ? '#C9A84C' : '#999', fontSize: '0.9rem', fontWeight: product.discountPrice ? 600 : 400 }}>
                        {product.discountPrice ? `₹${product.discountPrice.toLocaleString('en-IN')}` : '-'}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        {discountPercent > 0 ? (
                          <span style={{ backgroundColor: '#e05252', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                            {discountPercent}% OFF
                          </span>
                        ) : (
                          <span style={{ color: '#999', fontSize: '0.85rem' }}>-</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#F5F5F5',
                            color: '#666',
                            textDecoration: 'none',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            display: 'inline-block',
                            transition: 'all 0.2s',
                          }}
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Help Text */}
        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#FFF8F0', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0A0A0A', marginBottom: '0.75rem' }}>
            💡 How to Add Discounts
          </h3>
          <ul style={{ color: '#666', fontSize: '0.85rem', lineHeight: 1.8, margin: 0, paddingLeft: '1.5rem' }}>
            <li>Go to Products page and edit any product</li>
            <li>Set the Sale Price (regular price)</li>
            <li>Set the Discount Price (must be less than sale price)</li>
            <li>The discount percentage will automatically display on product cards</li>
            <li>Leave Discount Price empty to remove the offer</li>
          </ul>
        </div>
    </>
  );
}
