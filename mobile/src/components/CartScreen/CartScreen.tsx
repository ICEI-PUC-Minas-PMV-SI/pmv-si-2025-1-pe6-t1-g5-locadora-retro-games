import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { CartItem } from '../../types/api';

const CartScreen = () => {
  const { cart, removeFromCart, clearCart, getTotalPrice, getCartItemsCount } = useCart();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleRemoveItem = (cartItemId: string) => {
    Alert.alert(
      'Remover Item',
      'Deseja remover este jogo do carrinho?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', onPress: () => removeFromCart(cartItemId) },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Limpar Carrinho',
      'Deseja remover todos os itens do carrinho?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar', onPress: clearCart },
      ]
    );
  };
  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Carrinho Vazio', 'Adicione itens ao carrinho antes de finalizar a compra.');
      return;
    }
    
    // Se usuário não está logado, vai para cadastro rápido
    if (!user) {
      router.push('/quick-register');
    } else {
      router.push('/checkout');
    }
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemConsole}>{item.console?.name || 'Console não informado'}</Text>
        <Text style={styles.itemPrice}>
          R$ {item.price && Number(item.price).toFixed(2).replace('.', ',')}
        </Text>
        {item.quantity && item.quantity > 1 && (
          <Text style={styles.itemQuantity}>Quantidade: {item.quantity}</Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item.cartItemId)}
      >
        <Ionicons name="trash-outline" size={24} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3e8ff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Carrinho</Text>
        <TouchableOpacity onPress={handleClearCart} disabled={cart.length === 0}>
          <Ionicons 
            name="trash-outline" 
            size={24} 
            color={cart.length === 0 ? "#9ca3af" : "#ef4444"} 
          />
        </TouchableOpacity>
      </View>

      {/* Cart Content */}
      {cart.length === 0 ? (
        <View style={styles.emptyCart}>
          <Ionicons name="cart-outline" size={80} color="#9ca3af" />
          <Text style={styles.emptyCartText}>Seu carrinho está vazio</Text>
          <Text style={styles.emptyCartSubText}>
            Adicione jogos ao carrinho para começar
          </Text>
          <TouchableOpacity 
            style={styles.continueShoppingButton}
            onPress={() => router.push('/home')}
          >
            <Text style={styles.continueShoppingText}>Continuar Comprando</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.cartItemId}
            style={styles.cartList}
            showsVerticalScrollIndicator={false}
          />

          {/* Cart Summary */}
          <View style={styles.cartSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Total de itens: {getCartItemsCount()}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalPrice}>{formatPrice(getTotalPrice())}</Text>
            </View>
            
            <TouchableOpacity
              style={[styles.checkoutButton, isLoading && styles.checkoutButtonDisabled]}
              onPress={handleCheckout}
              disabled={isLoading}
            >
              <Text style={styles.checkoutButtonText}>
                {isLoading ? 'Processando...' : 'Finalizar Compra'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3e8ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  cartList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  cartItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  itemConsole: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#a855f7',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 12,
    color: '#9ca3af',
  },
  removeButton: {
    padding: 8,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyCartText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyCartSubText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  continueShoppingButton: {
    backgroundColor: '#a855f7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  continueShoppingText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  cartSummary: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#a855f7',
  },
  checkoutButton: {
    backgroundColor: '#a855f7',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  checkoutButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  checkoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
