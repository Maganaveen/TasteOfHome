import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  addedAt?: Date;
}
interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}
const CartContext = createContext<CartContextType | undefined>(undefined);
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      setCart(JSON.parse(saved));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    saveCartToDB(cart); // Automatically sync to backend
  }, [cart]);
  const addToCart = (item: CartItem) => {
    const updatedCart = [...cart, { ...item, addedAt: new Date() }];
    setCart(updatedCart);
  };
  const removeFromCart = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
  };
  const clearCart = () => {
    setCart([]);
  };
  const saveCartToDB = async (items: CartItem[]) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await fetch("http://localhost:5000/api/cart/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items }),
      });
    } catch (error) {
      console.error("Failed to save cart to DB:", error);
    }
  };
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};