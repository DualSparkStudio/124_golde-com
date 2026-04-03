'use client';

import { useEffect, useRef } from 'react';

interface VideoShowcaseProps {
  videoUrl: string;
}

export default function VideoShowcase({ videoUrl }: VideoShowcaseProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        borderRadius: '4px',
        overflow: 'hidden',
        border: '1px solid rgba(201,168,76,0.4)',
        boxShadow: '0 8px 32px rgba(201,168,76,0.15)',
        maxWidth: '800px',
        margin: '0 auto',
        aspectRatio: '16/9',
        backgroundColor: '#1A1A1A',
      }}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        muted
        loop
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </div>
  );
}
