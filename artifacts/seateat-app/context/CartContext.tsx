import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { MenuItem } from '@/data/menu';

export type CartLine = MenuItem & { quantity: number };

type CartValue = {
  lines: CartLine[];
  addItem: (item: MenuItem, quantity?: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  serviceFee: number;
  total: number;
};

const CartContext = createContext<CartValue | null>(null);
const STORAGE_KEY = 'seateat-cart-v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (!stored) return;
      try {
        setLines(JSON.parse(stored) as CartLine[]);
      } catch {
        setLines([]);
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const value = useMemo<CartValue>(() => {
    const addItem = (item: MenuItem, quantity = 1) => {
      setLines((current) => {
        const existing = current.find((line) => line.id === item.id);
        if (existing) return current.map((line) => line.id === item.id ? { ...line, quantity: line.quantity + quantity } : line);
        return [...current, { ...item, quantity }];
      });
    };
    const setQuantity = (id: string, quantity: number) => setLines((current) => quantity <= 0 ? current.filter((line) => line.id !== id) : current.map((line) => line.id === id ? { ...line, quantity } : line));
    const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
    const serviceFee = lines.length ? Math.round(subtotal * 0.05 * 100) / 100 : 0;
    return { lines, addItem, setQuantity, clearCart: () => setLines([]), itemCount: lines.reduce((sum, line) => sum + line.quantity, 0), subtotal, serviceFee, total: subtotal + serviceFee };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error('useCart must be used inside CartProvider');
  return value;
}