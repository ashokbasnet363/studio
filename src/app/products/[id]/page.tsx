
"use client"; // Needs to be client component for hooks like useBasket, useState, useEffect

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import type { Product, Review } from '@/types';
import { getProductById, getReviewsByProductId } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Star, ChevronLeft, MessageSquare } from 'lucide-react';
import ReviewCard from '@/components/product/ReviewCard';
import { useBasket } from '@/context/BasketContext';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToBasket } = useBasket();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const id = typeof params.id === 'string' ? params.id : undefined;

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        const foundProduct = getProductById(id);
        if (foundProduct) {
          setProduct(foundProduct);
          setReviews(getReviewsByProductId(id));
        } else {
          // Handle product not found, e.g., redirect to 404 or show message
          router.push('/'); // Or a dedicated 404 page
        }
        setIsLoading(false);
      }, 500);
    }
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Skeleton className="w-full aspect-square rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-8 w-1/4 mb-4" />
            <Skeleton className="h-20 w-full mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-10">Product not found.</div>;
  }

  const handleAddToBasket = () => {
    addToBasket(product, quantity);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" onClick={() => router.back()} className="mb-6 group hover:bg-primary hover:text-primary-foreground transition-colors">
        <ChevronLeft className="mr-2 h-4 w-4 group-hover:text-primary-foreground" /> Back to products
      </Button>
      <Card className="overflow-hidden shadow-xl">
        <div className="grid md:grid-cols-2 gap-0 md:gap-8">
          <div className="relative aspect-square w-full">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
              data-ai-hint={`${product.category} product detail`}
            />
          </div>
          <div className="p-6 md:p-8 flex flex-col">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary">{product.name}</h1>
            <div className="flex items-center mb-4">
              {product.rating && [...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < product.rating! ? 'text-accent fill-accent' : 'text-muted-foreground'}`}
                />
              ))}
              {product.numReviews && <span className="ml-2 text-sm text-muted-foreground">({product.numReviews} reviews)</span>}
            </div>
            <p className="text-2xl font-semibold text-foreground mb-4">${product.price.toFixed(2)}</p>
            <p className="text-muted-foreground mb-6 flex-grow">{product.longDescription || product.description}</p>
            
            <div className="flex items-center space-x-4 mb-6">
              <Label htmlFor="quantity" className="text-sm font-medium">Quantity:</Label>
              <Input 
                type="number" 
                id="quantity" 
                name="quantity"
                min="1" 
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10)))}
                className="w-20 text-center"
              />
            </div>

            <Button onClick={handleAddToBasket} size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Basket
            </Button>
            {product.stock < 10 && <p className="text-sm text-destructive mt-2 text-center">Only {product.stock} left in stock!</p>}
          </div>
        </div>
      </Card>

      <Separator className="my-12" />

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <MessageSquare className="mr-3 h-6 w-6 text-primary" />
          Customer Reviews ({reviews.length})
        </h2>
        {reviews.length > 0 ? (
          reviews.map(review => <ReviewCard key={review.id} review={review} />)
        ) : (
          <p className="text-muted-foreground">No reviews yet for this product.</p>
        )}
        {/* Add Review Form (optional, for future extension) */}
      </div>
    </div>
  );
}
