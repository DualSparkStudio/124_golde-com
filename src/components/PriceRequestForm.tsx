'use client';

import { useState } from 'react';
import { leadsStore } from '@/lib/leadsStore';

interface PriceRequestFormProps {
  productId: string;
  productName: string;
}

export default function PriceRequestForm({ productId, productName }: PriceRequestFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!phone.trim()) { setError('Phone number is required.'); return; }
    setLoading(true);
    try {
      leadsStore.add({ type: 'price_request', name, phone, message: message || undefined, productId });
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid rgba(201,168,76,0.4)',
    borderRadius: '2px',
    backgroundColor: '#FFF8F0',
    fontSize: '0.9rem',
    color: '#0A0A0A',
    outline: 'none',
    fontFamily: 'var(--font-body, Inter, system-ui, sans-serif)',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ border: '1px solid rgba(201,168,76,0.3)', borderRadius: '4px', padding: '28px', backgroundColor: '#FAF0E6' }}>
      <h3 style={{ fontFamily: 'var(--font-heading, "Playfair Display", Georgia, serif)', fontSize: '1.2rem', color: '#0A0A0A', margin: '0 0 8px' }}>
        Request Price
      </h3>
      <p style={{ color: '#666', fontSize: '0.85rem', margin: '0 0 20px', fontFamily: 'var(--font-body, Inter, system-ui, sans-serif)' }}>
        Interested in <em>{productName}</em>? We&apos;ll contact you with pricing details within 24 hours.
      </p>

      {submitted ? (
        <div style={{ textAlign: 'center', padding: '24px', color: '#0A0A0A' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p style={{ fontFamily: 'var(--font-body, Inter, system-ui, sans-serif)', margin: 0 }}>
            Thank you! We&apos;ll contact you within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input type="text" placeholder="Your name *" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
          <input type="tel" placeholder="Phone number *" value={phone} onChange={(e) => setPhone(e.target.value)} required style={inputStyle} />
          <textarea placeholder="Message (optional)" value={message} onChange={(e) => setMessage(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          {error && <p style={{ color: '#c0392b', fontSize: '0.8rem', margin: 0, fontFamily: 'var(--font-body, Inter, system-ui, sans-serif)' }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ padding: '14px', background: 'linear-gradient(90deg, #C9A84C, #B8860B)', border: 'none', borderRadius: '2px', color: '#fff', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'var(--font-body, Inter, system-ui, sans-serif)' }}>
            {loading ? 'Sending...' : 'Request Price'}
          </button>
        </form>
      )}
    </div>
  );
}
