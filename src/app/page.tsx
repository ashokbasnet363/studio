
import ProductGrid from '@/components/product/ProductGrid';
import { mockProducts } from '@/data/mock';
import type { Product } from '@/types';

async function getProducts(): Promise<Product[]> {
  // In a real app, this would fetch from an API
  return Promise.resolve(mockProducts);
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">Welcome to ShopWave!</h1>
      <ProductGrid products={products} />
    </div>
  );
}
