
"use client";

import type { Order, BasketItem, User } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface HistoryContextType {
  purchaseHistory: Order[];
  addOrder: (items: BasketItem[], totalAmount: number) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const [purchaseHistory, setPurchaseHistory] = useState<Order[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const storedHistory = localStorage.getItem(`shopwave-history-${user.id}`);
      if (storedHistory) {
        setPurchaseHistory(JSON.parse(storedHistory));
      } else {
        setPurchaseHistory([]); // Clear history if user changes and no history found
      }
    } else {
      setPurchaseHistory([]); // Clear history if no user
    }
  }, [user]);

  useEffect(() => {
    if (user && purchaseHistory.length > 0) {
      localStorage.setItem(`shopwave-history-${user.id}`, JSON.stringify(purchaseHistory));
    } else if (user && purchaseHistory.length === 0) {
      // If history is cleared for a user, remove it from local storage
      localStorage.removeItem(`shopwave-history-${user.id}`);
    }
  }, [purchaseHistory, user]);

  const addOrder = (items: BasketItem[], totalAmount: number) => {
    if (!user) return; // Should not happen if called after payment with logged in user

    const newOrder: Order = {
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      items,
      totalAmount,
      orderDate: new Date().toISOString(),
      status: 'Paid',
    };
    setPurchaseHistory(prevHistory => [newOrder, ...prevHistory]);
  };

  return (
    <HistoryContext.Provider value={{ purchaseHistory, addOrder }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
