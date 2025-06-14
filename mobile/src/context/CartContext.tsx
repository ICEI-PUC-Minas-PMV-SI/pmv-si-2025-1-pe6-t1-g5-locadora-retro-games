import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Alert } from 'react-native';
import { Game, CartItem } from '../types/api';

type CartContextType = {
  cart: CartItem[];
  addToCart: (game: Game) => boolean;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getCartItemsCount: () => number;
  getGameQuantityInCart: (gameId: number) => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const addToCart = (game: Game): boolean => {
    // Verificar quantos deste jogo já estão no carrinho
    const currentQuantity = getGameQuantityInCart(game.id);
    
    // Verificar se ainda há estoque disponível
    if (currentQuantity >= game.amount) {
      Alert.alert(
        'Estoque Insuficiente',
        `Você já tem ${currentQuantity} ${currentQuantity === 1 ? 'unidade' : 'unidades'} deste jogo no carrinho. Estoque disponível: ${game.amount}`,
        [{ text: 'OK' }]
      );
      return false;
    }

    setCart((prev) => [
      ...prev,
      { 
        ...game, 
        cartItemId: `${game.id}-${Date.now()}-${Math.random()}`,
        quantity: 1
      },
    ]);
    return true;
  };

  const getGameQuantityInCart = (gameId: number): number => {
    return cart.filter(item => item.id === gameId).length;
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };
  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
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
      getCartItemsCount,
      getGameQuantityInCart
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