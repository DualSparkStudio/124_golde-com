'use client';

import React from 'react';

export default function MessageForm() {
  const input: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid rgba(201,168,76,0.25)',
    borderRadius: '6px',
    backgroundColor: '#fff',
    fontSize: '0.9rem',
    color: '#0A0A0A',
    outline: 'none',
    boxSizing: 'border-box',
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    await fetch('/api/leads/popup', {
      method: 'POST',
      body: JSON.stringify({
        name: formData.get('name'),
        phone: formData.get('phone'),
        message: formData.get('message'),
      }),
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {});
    form.reset();
    alert('Thanks! We’ll get back to you shortly.');
  }

  return (
    <div style={{ border: '1px solid rgba(201,168,76,0.15)', borderRadius: '8px', padding: '24px', backgroundColor: '#FFF8F0' }}>
      <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.1rem', color: '#0A0A0A', margin: '0 0 8px' }}>
        Send us a Message
      </h3>
      <p style={{ color: '#666', fontSize: '0.85rem', margin: '0 0 16px' }}>
        Prefer messaging? Share your question and we’ll respond promptly.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input name="name" type="text" required placeholder="Your name *" style={input} />
        <input name="phone" type="tel" required placeholder="Phone number *" style={input} />
        <textarea name="message" rows={3} placeholder="How can we help?" style={{ ...input, resize: 'vertical' }} />
        <button
          type="submit"
          style={{
            padding: '14px',
            background: 'linear-gradient(90deg, #C9A84C, #B8860B)',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '0.875rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

