import type { CustomerProduct } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: CustomerProduct[];
  emptyMessage?: string;
}

export default function ProductGrid({ products, emptyMessage = 'No products found.' }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '80px 24px',
          color: '#888',
          fontFamily: 'var(--font-body, Inter, system-ui, sans-serif)',
        }}
      >
        <div style={{ fontSize: '2rem', marginBottom: '16px', color: 'rgba(201,168,76,0.4)' }}>✦</div>
        <p style={{ fontSize: '1rem', margin: 0 }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '24px',
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
