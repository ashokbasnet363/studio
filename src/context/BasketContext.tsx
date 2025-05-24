
"use client";

import type { BasketItem, Product } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface BasketContextType {
  basket: BasketItem[];
  addToBasket: (product: Product, quantity?: number) => void;
  removeFromBasket: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearBasket: () => void;
  basketCount: number;
  basketTotal: number;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export const BasketProvider = ({ children }: { children: ReactNode }) => {
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedBasket = localStorage.getItem('shopwave-basket');
    if (storedBasket) {
      setBasket(JSON.parse(storedBasket));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('shopwave-basket', JSON.stringify(basket));
  }, [basket]);

  const addToBasket = (product: Product, quantity: number = 1) => {
    setBasket(prevBasket => {
      const existingItem = prevBasket.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevBasket.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevBasket, { product, quantity }];
    });
    toast({
      title: "Added to Basket",
      description: `${product.name} has been added to your basket.`,
    });
  };

  const removeFromBasket = (productId: string) => {
    setBasket(prevBasket => prevBasket.filter(item => item.product.id !== productId));
    toast({
      title: "Removed from Basket",
      description: `Item has been removed from your basket.`,
      variant: "destructive"
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromBasket(productId);
      return;
    }
    setBasket(prevBasket =>
      prevBasket.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearBasket = () => {
    setBasket([]);
  };

  const basketCount = basket.reduce((count, item) => count + item.quantity, 0);
  const basketTotal = basket.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <BasketContext.Provider
      value={{ basket, addToBasket, removeFromBasket, updateQuantity, clearBasket, basketCount, basketTotal }}
    >
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = (): BasketContextType => {
  const context = useContext(BasketContext);
  if (context === undefined) {
    throw new Error('useBasket must be used within a BasketProvider');
  }
  return context;
};
