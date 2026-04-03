'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { ProductImage } from '@/types';

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const primaryIndex = images.findIndex((img) => img.isPrimary);
  const [activeIndex, setActiveIndex] = useState(primaryIndex >= 0 ? primaryIndex : 0);
  const [zoomed, setZoomed] = useState(false);

  if (images.length === 0) {
    return (
      <div
        style={{
          aspectRatio: '1/1',
          backgroundColor: '#FAF0E6',
          border: '1px solid rgba(201,168,76,0.2)',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#C9A84C',
          fontSize: '3rem',
        }}
      >
        ✦
      </div>
    );
  }

  const activeImage = images[activeIndex];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Main image */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '1/1',
          overflow: 'hidden',
          borderRadius: '4px',
          border: '1px solid rgba(201,168,76,0.2)',
          backgroundColor: '#FAF0E6',
          cursor: 'zoom-in',
        }}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
      >
        <Image
          src={activeImage.url}
          alt={`${productName} - image ${activeIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={activeIndex === 0}
          style={{
            objectFit: 'cover',
            transform: zoomed ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.4s ease',
          }}
        />
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
          }}
        >
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              aria-label={`View image ${i + 1}`}
              style={{
                position: 'relative',
                width: '72px',
                height: '72px',
                flexShrink: 0,
                borderRadius: '2px',
                overflow: 'hidden',
                border: i === activeIndex ? '2px solid #C9A84C' : '2px solid transparent',
                cursor: 'pointer',
                padding: 0,
                backgroundColor: '#FAF0E6',
                transition: 'border-color 0.2s',
              }}
            >
              <Image
                src={img.url}
                alt={`Thumbnail ${i + 1}`}
                fill
                sizes="72px"
                style={{ objectFit: 'cover' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
