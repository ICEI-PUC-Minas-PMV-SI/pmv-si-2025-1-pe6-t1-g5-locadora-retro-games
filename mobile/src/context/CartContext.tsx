import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Game, CartItem } from '../types/api';

type CartContextType = {
  cart: CartItem[];
  addToCart: (game: Game) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getCartItemsCount: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (game: Game) => {
    setCart((prev) => [
      ...prev,
      { 
        ...game, 
        cartItemId: `${game.id}-${Date.now()}-${Math.random()}`,
        quantity: 1
      },
    ]);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      getTotalPrice, 
      getCartItemsCount 
    }}>
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