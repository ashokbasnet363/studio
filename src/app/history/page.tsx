
"use client";

import { useAuth } from '@/context/AuthContext';
import { useHistory } from '@/context/HistoryContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Package, AlertCircle, ShoppingBag } from 'lucide-react';

export default function HistoryPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { purchaseHistory } = useHistory();

  if (authLoading) {
    return <div className="text-center py-10">Loading purchase history...</div>;
  }

  if (!user) {
    return (
      <Alert variant="default" className="max-w-md mx-auto mt-10 text-center">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          Please <Link href="/auth/signin?redirect=/history" className="font-semibold text-primary hover:underline">sign in</Link> to view your purchase history.
        </AlertDescription>
      </Alert>
    );
  }

  if (purchaseHistory.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-semibold mb-4">No Purchase History</h1>
        <p className="text-muted-foreground mb-6">You haven't made any purchases yet.</p>
        <Link href="/" passHref>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-8 text-primary">Your Purchase History</h1>
      <div className="space-y-6">
        {purchaseHistory.map(order => (
          <Card key={order.id} className="shadow-lg">
            <CardHeader className="bg-secondary/50 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Order ID: {order.id.substring(0,18)}...</CardTitle>
                  <CardDescription>
                    Date: {new Date(order.orderDate).toLocaleDateString()} | Status: <span className="font-medium text-green-600">{order.status}</span>
                  </CardDescription>
                </div>
                <p className="text-xl font-bold text-primary">${order.totalAmount.toFixed(2)}</p>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <h3 className="text-md font-semibold mb-3 text-foreground">Items:</h3>
              <ul className="space-y-4">
                {order.items.map(item => (
                  <li key={item.product.id} className="flex items-center space-x-4 pb-2 border-b border-border last:border-b-0">
                    <div className="relative w-16 h-16 rounded overflow-hidden">
                       <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                        data-ai-hint={`${item.product.category} product thumbnail`}
                      />
                    </div>
                    <div>
                      <Link href={`/products/${item.product.id}`} className="font-medium hover:text-primary">{item.product.name}</Link>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      <p className="text-sm text-muted-foreground">Price: ${item.product.price.toFixed(2)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
