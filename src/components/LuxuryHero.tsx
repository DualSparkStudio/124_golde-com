'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ImageData {
  src: string;
  alt: string;
  position: 'left' | 'center' | 'right';
}

export default function LuxuryHero() {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const images: ImageData[] = [
    {
      src: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=90',
      alt: 'Gold Bracelet Collection',
      position: 'left',
    },
    {
      src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=90',
      alt: 'Pearl Necklace',
      position: 'center',
    },
    {
      src: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=90',
      alt: 'Gold Chain Bracelet',
      position: 'right',
    },
  ];

  const getParallaxOffset = (position: string) => {
    const multipliers = { left: 0.03, center: 0.05, right: 0.04 };
    return scrollY * (multipliers[position as keyof typeof multipliers] || 0);
  };

  return (
    <section className="hero" role="banner" aria-label="Hero Section">
      <div className="hero__container">
        {/* Tagline */}
        <div className="hero__tagline" data-loaded={isLoaded}>
          <span>ELEVATE YOUR STYLE WITH OUR</span>
        </div>

        {/* Main Content */}
        <div className="hero__content">
          {/* Image Grid */}
          <div className="hero__gallery" data-loaded={isLoaded}>
            {/* Left Image */}
            <div
              className="hero__image-wrapper hero__image-wrapper--left"
              style={{
                transform: `translateY(${getParallaxOffset('left')}px)`,
              }}
              data-index={0}
            >
              <div className="hero__image-container">
                <Image
                  src={images[0].src}
                  alt={images[0].alt}
                  fill
                  sizes="(max-width: 768px) 80vw, 400px"
                  quality={90}
                  className="hero__image"
                />
                <div className="hero__image-overlay" aria-hidden="true" />
              </div>
            </div>

            {/* Center Section - Typography + Image */}
            <div className="hero__center">
              {/* Typography */}
              <h1 className="hero__title" data-loaded={isLoaded}>
                <span className="hero__title-line hero__title-line--italic">
                  Exquisite
                </span>
                <span className="hero__title-line hero__title-line--regular">
                  Jewelry
                </span>
              </h1>

              {/* Center Image - Below Typography */}
              <div
                className="hero__image-wrapper hero__image-wrapper--center"
                style={{
                  transform: `translateY(${getParallaxOffset('center')}px)`,
                }}
                data-index={1}
              >
                <div className="hero__image-container">
                  <Image
                    src={images[1].src}
                    alt={images[1].alt}
                    fill
                    priority
                    sizes="(max-width: 768px) 90vw, 600px"
                    quality={90}
                    className="hero__image"
                  />
                  <div className="hero__image-overlay" aria-hidden="true" />
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div
              className="hero__image-wrapper hero__image-wrapper--right"
              style={{
                transform: `translateY(${getParallaxOffset('right')}px)`,
              }}
              data-index={2}
            >
              <div className="hero__image-container">
                <Image
                  src={images[2].src}
                  alt={images[2].alt}
                  fill
                  sizes="(max-width: 768px) 80vw, 400px"
                  quality={90}
                  className="hero__image"
                />
                <div className="hero__image-overlay" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="hero__cta" data-loaded={isLoaded}>
          <Link href="/shop" className="hero__link">
            <span className="hero__link-text">EXPLORE COLLECTION</span>
            <span className="hero__link-line" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <style jsx>{`
        /* ============================================
           Hero Section - Base Styles
           ============================================ */
        .hero {
          position: relative;
          height: 100vh;
          min-height: 700px;
          background: linear-gradient(135deg, #F8F6F3 0%, #EFEBE6 50%, #F8F6F3 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 0 60px;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(212, 175, 55, 0.03) 0%, transparent 50%);
          pointer-events: none;
        }

        .hero__container {
          max-width: 1600px;
          width: 100%;
          margin: 0 auto;
          padding: 80px 60px 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;
        }

        /* ============================================
           Tagline
           ============================================ */
        .hero__tagline {
          text-align: center;
          margin-bottom: 20px;
          opacity: 0;
          transform: translateY(-20px);
          transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero__tagline[data-loaded="true"] {
          opacity: 1;
          transform: translateY(0);
        }

        .hero__tagline span {
          font-family: 'Poppins', sans-serif;
          font-size: 0.625rem;
          font-weight: 500;
          letter-spacing: 0.3em;
          color: #A0958A;
          text-transform: uppercase;
        }

        /* ============================================
           Content Layout
           ============================================ */
        .hero__content {
          position: relative;
        }

        /* ============================================
           Image Gallery
           ============================================ */
        .hero__gallery {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr;
          gap: 20px;
          align-items: flex-start;
        }

        .hero__center {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }

        /* ============================================
           Typography
           ============================================ */
        .hero__title {
          position: relative;
          z-index: 10;
          margin: 0;
          text-align: center;
          line-height: 0.85;
        }

        .hero__title[data-loaded="true"] .hero__title-line {
          opacity: 1;
          transform: translateX(0);
        }

        .hero__title-line {
          display: block;
          font-family: 'Playfair Display', Georgia, serif;
          color: #1A1A1A;
          letter-spacing: -0.03em;
          opacity: 0;
          transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero__title-line--italic {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 400;
          font-style: italic;
          margin-bottom: -6px;
          transform: translateX(-60px);
          transition-delay: 0.2s;
        }

        .hero__title-line--regular {
          font-size: clamp(3rem, 7vw, 5.5rem);
          font-weight: 300;
          transform: translateX(60px);
          transition-delay: 0.4s;
        }

        .hero__image-wrapper {
          position: relative;
          transition: transform 0.1s ease-out;
          opacity: 0;
          transform: scale(0.9);
        }

        .hero__gallery[data-loaded="true"] .hero__image-wrapper {
          opacity: 1;
          transform: scale(1);
        }

        .hero__image-wrapper[data-index="0"] {
          transition: opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.6s,
                      transform 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.6s;
        }

        .hero__image-wrapper[data-index="1"] {
          transition: opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.8s,
                      transform 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.8s;
        }

        .hero__image-wrapper[data-index="2"] {
          transition: opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1) 1s,
                      transform 1.4s cubic-bezier(0.16, 1, 0.3, 1) 1s;
        }

        .hero__image-wrapper--left {
          justify-self: end;
          width: 100%;
          max-width: 220px;
          aspect-ratio: 4/5;
          margin-top: 30px;
        }

        .hero__image-wrapper--center {
          width: 100%;
          max-width: 300px;
          aspect-ratio: 1;
        }

        .hero__image-wrapper--right {
          justify-self: start;
          width: 100%;
          max-width: 220px;
          aspect-ratio: 4/5;
          margin-top: 30px;
        }

        .hero__image-container {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.08),
            0 8px 24px rgba(0, 0, 0, 0.04),
            0 0 1px rgba(0, 0, 0, 0.1);
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero__image-wrapper:hover .hero__image-container {
          transform: translateY(-16px) scale(1.02);
          box-shadow: 
            0 32px 80px rgba(0, 0, 0, 0.12),
            0 12px 32px rgba(0, 0, 0, 0.06),
            0 0 1px rgba(0, 0, 0, 0.1);
        }

        .hero__image {
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero__image-wrapper:hover .hero__image {
          transform: scale(1.05);
        }

        .hero__image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(212, 175, 55, 0.08) 0%,
            transparent 50%,
            rgba(212, 175, 55, 0.04) 100%
          );
          opacity: 0;
          transition: opacity 0.6s ease;
          pointer-events: none;
        }

        .hero__image-wrapper:hover .hero__image-overlay {
          opacity: 1;
        }

        /* ============================================
           CTA Section
           ============================================ */
        .hero__cta {
          text-align: center;
          margin-top: 35px;
          opacity: 0;
          transform: translateY(20px);
          transition: all 1s cubic-bezier(0.16, 1, 0.3, 1) 1.2s;
        }

        .hero__cta[data-loaded="true"] {
          opacity: 1;
          transform: translateY(0);
        }

        .hero__link {
          position: relative;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero__link-text {
          font-family: 'Poppins', sans-serif;
          font-size: 0.8125rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          color: #1A1A1A;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero__link:hover .hero__link-text {
          color: #D4AF37;
          letter-spacing: 0.28em;
        }

        .hero__link-line {
          display: block;
          width: 100%;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            #1A1A1A 20%,
            #1A1A1A 80%,
            transparent 100%
          );
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero__link:hover .hero__link-line {
          width: 130%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            #D4AF37 20%,
            #D4AF37 80%,
            transparent 100%
          );
        }

        /* ============================================
           Responsive Design
           ============================================ */
        @media (max-width: 1400px) {
          .hero__image-wrapper--left,
          .hero__image-wrapper--right {
            max-width: 200px;
          }

          .hero__image-wrapper--center {
            max-width: 280px;
          }

          .hero__title-line--italic {
            font-size: clamp(2.3rem, 6vw, 4.2rem);
          }

          .hero__title-line--regular {
            font-size: clamp(2.8rem, 7vw, 5.2rem);
          }
        }

        @media (max-width: 1200px) {
          .hero__container {
            padding: 100px 40px 0;
          }

          .hero__gallery {
            gap: 18px;
          }

          .hero__title-line--italic {
            font-size: clamp(2.2rem, 6vw, 4rem);
          }

          .hero__title-line--regular {
            font-size: clamp(2.7rem, 7vw, 5rem);
          }
        }

        @media (max-width: 1024px) {
          .hero {
            height: auto;
            min-height: 100vh;
            padding: 120px 0 80px;
          }

          .hero__tagline {
            margin-bottom: 80px;
          }

          .hero__gallery {
            display: flex;
            flex-direction: column;
            gap: 60px;
            align-items: center;
          }

          .hero__center {
            order: 1;
          }

          .hero__image-wrapper {
            margin: 0 !important;
            max-width: 100% !important;
            justify-self: center !important;
          }

          .hero__image-wrapper--left {
            order: 0;
            max-width: 400px !important;
          }

          .hero__image-wrapper--center {
            max-width: 500px !important;
          }

          .hero__image-wrapper--right {
            order: 2;
            max-width: 400px !important;
          }

          .hero__cta {
            margin-top: 80px;
          }
        }

        @media (max-width: 768px) {
          .hero {
            height: auto;
            min-height: 100vh;
          }
          .hero__container {
            padding: 120px 24px 0;
          }

          .hero__tagline {
            margin-bottom: 60px;
          }

          .hero__title-line--italic {
            font-size: clamp(3rem, 12vw, 5rem);
          }

          .hero__title-line--regular {
            font-size: clamp(3.5rem, 13vw, 6rem);
          }

          .hero__gallery {
            gap: 40px;
          }

          .hero__cta {
            margin-top: 60px;
          }
        }

        @media (max-width: 480px) {
          .hero__title-line--italic {
            font-size: clamp(2.5rem, 14vw, 4rem);
          }

          .hero__title-line--regular {
            font-size: clamp(3rem, 15vw, 5rem);
          }

          .hero__link-text {
            font-size: 0.75rem;
            letter-spacing: 0.2em;
          }
        }

        /* ============================================
           Accessibility & Performance
           ============================================ */
        @media (prefers-reduced-motion: reduce) {
          .hero__tagline,
          .hero__title-line,
          .hero__image-wrapper,
          .hero__cta {
            transition: none;
          }

          .hero__image-wrapper {
            transform: none !important;
          }
        }

        @media print {
          .hero {
            min-height: auto;
            padding: 40px 0;
          }
        }
      `}</style>
    </section>
  );
}
