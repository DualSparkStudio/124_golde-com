import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lumière Jewels | Luxury Gold & Silver Jewelry',
  description:
    'Discover our curated collection of 2gm gold & silver jewelry. BIS Hallmark certified, 100% authentic luxury jewelry crafted with timeless elegance.',
  keywords: 'gold jewelry, silver jewelry, bridal jewelry, BIS hallmark, luxury jewelry India',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${inter.variable}`}>
      <body
        style={{
          backgroundColor: '#FFF8F0',
          color: '#0A0A0A',
          fontFamily: 'var(--font-body, Inter, system-ui, sans-serif)',
          margin: 0,
          padding: 0,
          minHeight: '100vh',
        }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
