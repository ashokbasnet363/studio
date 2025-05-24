
"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShoppingCart, Star } from 'lucide-react';
import { useBasket } from '@/context/BasketContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToBasket } = useBasket();

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`} passHref>
          <div className="aspect-[4/3] relative w-full overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              data-ai-hint={`${product.category} product`}
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Link href={`/products/${product.id}`} passHref className="hover:text-primary">
          <CardTitle className="text-lg font-semibold mb-1 truncate" title={product.name}>{product.name}</CardTitle>
        </Link>
        <CardDescription className="text-sm text-muted-foreground mb-2 h-10 overflow-hidden">
          {product.description}
        </CardDescription>
        {product.rating && product.numReviews && (
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <Star className="w-4 h-4 text-accent fill-accent mr-1" />
            <span>{product.rating.toFixed(1)} ({product.numReviews} reviews)</span>
          </div>
        )}
        <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button 
          onClick={() => addToBasket(product)} 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          aria-label={`Add ${product.name} to basket`}
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Basket
        </Button>
      </CardFooter>
    </Card>
  );
}
