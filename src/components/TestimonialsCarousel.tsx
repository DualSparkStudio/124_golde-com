'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  id: string;
  customerName: string;
  location: string | null;
  rating: number;
  content: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: '3px', justifyContent: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={star <= rating ? '#C9A84C' : 'none'}
          stroke="#C9A84C"
          strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((data) => {
        setTestimonials(Array.isArray(data) ? data : data.items ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % Math.max(testimonials.length, 1));
  }, [testimonials.length]);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [testimonials.length, next]);

  if (loading) {
    return (
      <section style={{ padding: '80px 24px', backgroundColor: '#FAF0E6', textAlign: 'center' }}>
        <div style={{ width: '200px', height: '20px', background: 'rgba(201,168,76,0.2)', borderRadius: '4px', margin: '0 auto' }} />
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  const t = testimonials[current];

  return (
    <section
      style={{
        padding: '80px 24px',
        backgroundColor: '#FAF0E6',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
          What Our Customers Say
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-heading, "Playfair Display", Georgia, serif)',
            fontSize: '2rem',
            color: '#0A0A0A',
            margin: '0 0 48px',
          }}
        >
          Stories of Elegance
        </h2>

        <AnimatePresence mode="wait">
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            style={{
              backgroundColor: '#FFF8F0',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '4px',
              padding: '40px 48px',
              position: 'relative',
            }}
          >
            {/* Quote mark */}
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '28px',
                fontFamily: 'Georgia, serif',
                fontSize: '4rem',
                color: 'rgba(201,168,76,0.2)',
                lineHeight: 1,
              }}
            >
              &ldquo;
            </div>

            <StarRating rating={t.rating} />

            <p
              style={{
                fontFamily: 'var(--font-heading, "Playfair Display", Georgia, serif)',
                fontSize: '1.15rem',
                color: '#1A1A1A',
                lineHeight: 1.8,
                margin: '20px 0 24px',
                fontStyle: 'italic',
              }}
            >
              {t.content}
            </p>

            <div>
              <p
                style={{
                  margin: 0,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: '#0A0A0A',
                  fontFamily: 'var(--font-body, Inter, system-ui, sans-serif)',
                }}
              >
                {t.customerName}
              </p>
              {t.location && (
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: '0.8rem',
                    color: '#888',
                    fontFamily: 'var(--font-body, Inter, system-ui, sans-serif)',
                  }}
                >
                  {t.location}
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        {testimonials.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                style={{
                  width: i === current ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: i === current ? '#C9A84C' : 'rgba(201,168,76,0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'width 0.3s, background 0.3s',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
