
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useBasket } from '@/context/BasketContext';
import { useAuth } from '@/context/AuthContext';
import { useHistory } from '@/context/HistoryContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2, ShoppingCart, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function BasketPage() {
  const { basket, removeFromBasket, updateQuantity, clearBasket, basketCount, basketTotal } = useBasket();
  const { user } = useAuth();
  const { addOrder } = useHistory();
  const router = useRouter();
  const { toast } = useToast();

  const handlePayment = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to proceed with payment.",
        variant: "destructive",
      });
      router.push('/auth/signin?redirect=/basket'); // Redirect to signin, then back to basket
      return;
    }

    // Simulate payment success
    addOrder(basket, basketTotal);
    clearBasket();
    toast({
      title: "Payment Successful!",
      description: "Your order has been placed. Thank you for shopping with ShopWave!",
    });
    router.push('/');
  };

  if (basketCount === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-semibold mb-4">Your Basket is Empty</h1>
        <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your basket yet.</p>
        <Link href="/" passHref>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-8 text-primary">Your Shopping Basket</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {basket.map(item => (
            <Card key={item.product.id} className="flex items-center p-4 shadow-sm">
              <div className="relative w-20 h-20 mr-4 rounded overflow-hidden">
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                  data-ai-hint={`${item.product.category} product thumbnail`}
                />
              </div>
              <div className="flex-grow">
                <Link href={`/products/${item.product.id}`} className="hover:text-primary">
                  <h2 className="text-lg font-semibold">{item.product.name}</h2>
                </Link>
                <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)} each</p>
              </div>
              <div className="flex items-center space-x-2 mx-4">
                <Label htmlFor={`quantity-${item.product.id}`} className="sr-only">Quantity</Label>
                <Input
                  id={`quantity-${item.product.id}`}
                  type="number"
                  min="1"
                  max={item.product.stock}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                  className="w-16 text-center h-9"
                />
              </div>
              <p className="font-semibold w-24 text-right">${(item.product.price * item.quantity).toFixed(2)}</p>
              <Button variant="ghost" size="icon" onClick={() => removeFromBasket(item.product.id)} className="ml-4 text-destructive hover:bg-destructive/10">
                <Trash2 className="h-5 w-5" />
              </Button>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <p>Subtotal ({basketCount} items)</p>
                <p>${basketTotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Shipping</p>
                <p>FREE</p>
              </div>
              <hr/>
              <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>${basketTotal.toFixed(2)}</p>
              </div>
            </CardContent>
            <CardFooter>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
                    <CreditCard className="mr-2 h-5 w-5" /> Proceed to Payment
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to pay ${basketTotal.toFixed(2)}. 
                      This is a simulated payment. Clicking 'Confirm' will process your order.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handlePayment} className="bg-primary hover:bg-primary/90">
                      Confirm Payment
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
