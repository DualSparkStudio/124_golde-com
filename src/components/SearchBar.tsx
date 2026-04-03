'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';

interface SearchBarProps {
  compact?: boolean;
}

export default function SearchBar({ compact = false }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(!compact);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (val.trim().length >= 2) {
        router.push(`/search?q=${encodeURIComponent(val.trim())}`);
      }
    }, 300);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  if (compact) {
    return (
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {expanded ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={handleChange}
              placeholder="Search jewelry..."
              autoFocus
              onBlur={() => {
                if (!query) setExpanded(false);
              }}
              style={{
                width: '180px',
                padding: '6px 12px',
                border: '1px solid rgba(201,168,76,0.4)',
                borderRadius: '2px',
                backgroundColor: '#FFF8F0',
                fontSize: '0.85rem',
                outline: 'none',
                fontFamily: 'var(--font-body, Inter, system-ui, sans-serif)',
                color: '#0A0A0A',
              }}
            />
          </form>
        ) : (
          <button
            onClick={() => {
              setExpanded(true);
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
            aria-label="Search"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0A0A0A"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid rgba(201,168,76,0.4)',
        borderRadius: '2px',
        overflow: 'hidden',
        backgroundColor: '#FFF8F0',
      }}
    >
      <input
        type="search"
        value={query}
        onChange={handleChange}
        placeholder="Search jewelry..."
        style={{
          flex: 1,
          padding: '10px 16px',
          border: 'none',
          backgroundColor: 'transparent',
          fontSize: '0.9rem',
          outline: 'none',
          fontFamily: 'var(--font-body, Inter, system-ui, sans-serif)',
          color: '#0A0A0A',
        }}
      />
      <button
        type="submit"
        aria-label="Search"
        style={{
          padding: '10px 14px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C9A84C"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </form>
  );
}
