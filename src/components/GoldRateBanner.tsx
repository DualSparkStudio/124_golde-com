'use client';

import { useEffect, useState } from 'react';

interface GoldRateData {
  ratePerGram: number;
  purity: string;
  updatedAt: string;
}

export default function GoldRateBanner() {
  const [data, setData] = useState<GoldRateData | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchRate() {
    try {
      const res = await fetch('/api/gold-rate');
      if (res.ok) {
        const json = await res.json();
        setData(json.rate ?? json);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRate();
    const interval = setInterval(fetchRate, 60 * 60 * 1000); // refresh every 60 min
    return () => clearInterval(interval);
  }, []);

  const formattedTime = data?.updatedAt
    ? new Date(data.updatedAt).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #C9A84C 0%, #B8860B 100%)',
        color: '#fff',
        textAlign: 'center',
        padding: '6px 16px',
        fontSize: '0.78rem',
        letterSpacing: '0.04em',
        fontFamily: 'var(--font-body, Inter, system-ui, sans-serif)',
      }}
    >
      {loading ? (
        <span
          style={{
            display: 'inline-block',
            width: '260px',
            height: '14px',
            background: 'rgba(255,255,255,0.25)',
            borderRadius: '4px',
            verticalAlign: 'middle',
          }}
        />
      ) : data ? (
        <span>
          ✦ Today&apos;s Gold Rate:{' '}
          <strong>₹{data.ratePerGram.toLocaleString('en-IN')}/gram</strong>{' '}
          ({data.purity}) &nbsp;|&nbsp; Updated: {formattedTime} ✦
        </span>
      ) : (
        <span>✦ Lumière Jewels — Crafting Timeless Elegance ✦</span>
      )}
    </div>
  );
}
