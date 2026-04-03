'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { ProductImage } from '@/types';
import { DEFAULT_PRODUCT_IMAGE, DEFAULT_PRODUCT_IMAGES, pickFrom } from '@/constants/images';
import { isValidRemoteImageUrl } from '@/utils/images';

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const cleaned = images?.map((img, i) => ({
    ...img,
    url: isValidRemoteImageUrl(img?.url) ? img.url : pickFrom(DEFAULT_PRODUCT_IMAGES, String(i)),
  })) ?? [];
  const primaryIndex = cleaned.findIndex((img) => img.isPrimary);
  const [activeIndex, setActiveIndex] = useState(primaryIndex >= 0 ? primaryIndex : 0);
  const [zoomed, setZoomed] = useState(false);

  if (cleaned.length === 0) {
    return (
      <div
        style={{
          aspectRatio: '1/1',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={DEFAULT_PRODUCT_IMAGE} alt={productName} referrerPolicy="no-referrer"
             style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    );
  }

  const activeImage = cleaned[activeIndex] ?? { id: 'default', url: DEFAULT_PRODUCT_IMAGE, isPrimary: true } as unknown as ProductImage;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Main image */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '1/1',
          overflow: 'hidden',
          borderRadius: '10px',
          border: '1px solid rgba(201,168,76,0.18)',
          backgroundColor: '#FAF8F5',
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
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
          quality={90}
          unoptimized
          style={{
            objectFit: 'cover',
            transform: zoomed ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.4s ease',
          }}
        />
      </div>

      {/* Thumbnail strip */}
      {cleaned.length > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
          }}
        >
          {cleaned.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              aria-label={`View image ${i + 1}`}
              style={{
                position: 'relative',
                width: '72px',
                height: '72px',
                flexShrink: 0,
                borderRadius: '6px',
                overflow: 'hidden',
                border: i === activeIndex ? '2px solid #C9A84C' : '2px solid transparent',
                cursor: 'pointer',
                padding: 0,
                backgroundColor: '#FAF8F5',
                transition: 'border-color 0.2s',
              }}
            >
              <Image
                src={img.url}
                alt={`Thumbnail ${i + 1}`}
                fill
                sizes="72px"
                unoptimized
                quality={85}
                style={{ objectFit: 'cover', filter: i === activeIndex ? 'none' : 'saturate(0.95)' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
