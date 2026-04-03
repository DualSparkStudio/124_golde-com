'use client';

import { useEffect, useState } from 'react';

function generateOfferCode() {
  return 'LUMIERE5-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const offerCode = generateOfferCode();

  useEffect(() => {
    const shown = sessionStorage.getItem('exitPopupShown');
    if (shown) return;

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0) {
        setVisible(true);
        sessionStorage.setItem('exitPopupShown', '1');
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    }

    // Small delay so it doesn't fire immediately on page load
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 3000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/leads/popup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, email: email || undefined, offerCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
      } else {
        setSubmitted(true);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10,10,10,0.75)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setVisible(false);
      }}
    >
      <div
        style={{
          backgroundColor: '#1A1A1A',
          border: '1px solid #C9A84C',
          borderRadius: '4px',
          padding: '48px 40px',
          maxWidth: '460px',
          width: '100%',
          position: 'relative',
          textAlign: 'center',
        }}
      >
        {/* Close button */}
        <button
          onClick={() => setVisible(false)}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#999',
            fontSize: '1.2rem',
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        {/* Gold accent line */}
        <div
          style={{
            width: '40px',
            height: '2px',
            background: 'linear-gradient(90deg, #C9A84C, #FFD700)',
            margin: '0 auto 24px',
          }}
        />

        <p
          style={{
            color: '#C9A84C',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            margin: '0 0 12px',
            fontFamily: 'var(--font-body, Inter, system-ui, sans-serif)',
          }}
        >
          Exclusive Offer
        </p>

        <h2
          style={{
            fontFamily: 'var(--font-heading, "Playfair Display", Georgia, serif)',
            fontSize: '2rem',
            color: '#FFF8F0',
            margin: '0 0 12px',
            fontWeight: 700,
          }}
        >
          Get 5% OFF
        </h2>

        <p
          style={{
            color: '#ccc',
            fontSize: '0.9rem',
            margin: '0 0 32px',
            lineHeight: 1.6,
            fontFamily: 'var(--font-body, Inter, system-ui, sans-serif)',
          }}
        >
          Your first order. Enter your details and we&apos;ll send your exclusive discount code.
        </p>

        {submitted ? (
          <div>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: '2px solid #C9A84C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p style={{ color: '#FFF8F0', fontSize: '1rem', margin: 0 }}>
              Your code <strong style={{ color: '#FFD700' }}>{offerCode}</strong> has been sent!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="tel"
              placeholder="Phone number *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(201,168,76,0.4)',
                borderRadius: '2px',
                color: '#FFF8F0',
                fontSize: '0.9rem',
                outline: 'none',
                fontFamily: 'var(--font-body, Inter, system-ui, sans-serif)',
              }}
            />
            <input
              type="email"
              placeholder="Email address (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(201,168,76,0.4)',
                borderRadius: '2px',
                color: '#FFF8F0',
                fontSize: '0.9rem',
                outline: 'none',
                fontFamily: 'var(--font-body, Inter, system-ui, sans-serif)',
              }}
            />
            {error && (
              <p style={{ color: '#ff6b6b', fontSize: '0.8rem', margin: 0 }}>{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '14px',
                background: 'linear-gradient(90deg, #C9A84C, #B8860B)',
                border: 'none',
                borderRadius: '2px',
                color: '#fff',
                fontSize: '0.875rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                fontFamily: 'var(--font-body, Inter, system-ui, sans-serif)',
              }}
            >
              {loading ? 'Sending...' : 'Claim My 5% Off'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
