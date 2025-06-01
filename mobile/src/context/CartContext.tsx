import React, { createContext, useContext, useState, ReactNode } from 'react';

type Game = {
  id: string;
  title: string;
  category: string;
  image: any;
};

type CartItem = Game & { cartItemId: string };

type CartContextType = {
  cart: CartItem[];
  addToCart: (game: Game) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (game: Game) => {
    setCart((prev) => [
      ...prev,
      { ...game, cartItemId: `${game.id}-${Date.now()}-${Math.random()}` },
    ]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
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