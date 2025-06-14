import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Game } from '../../types/api';
import { useCart } from '../../context/CartContext';

interface GameDetailModalProps {
  visible: boolean;
  game: Game | null;
  onClose: () => void;
  onAddToCart: (game: Game) => boolean;
}

const GameDetailModal: React.FC<GameDetailModalProps> = ({
  visible,
  game,
  onClose,
  onAddToCart,
}) => {
  const { getGameQuantityInCart } = useCart();
  
  if (!game) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const quantityInCart = getGameQuantityInCart(game.id);
  const availableStock = game.amount - quantityInCart;

  const getAvailabilityStatus = (available: number, inCart: number) => {
    if (available === 0) {
      if (inCart > 0) {
        return { text: `${inCart} no carrinho - Limite atingido`, color: '#ef4444' };
      }
      return { text: 'Indisponível', color: '#ef4444' };
    }
    if (available <= 2) {
      const cartText = inCart > 0 ? ` (${inCart} no carrinho)` : '';
      return { text: `${available} disponível${cartText}`, color: '#f59e0b' };
    }
    const cartText = inCart > 0 ? ` (${inCart} no carrinho)` : '';
    return { text: `Disponível${cartText}`, color: '#10b981' };
  };

  const availability = getAvailabilityStatus(availableStock, quantityInCart);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalhes do Jogo</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.scrollContent} 
            showsVerticalScrollIndicator={true}
            indicatorStyle="default"
            contentContainerStyle={styles.scrollContentContainer}
          >
            {/* Game Image Placeholder */}            <View style={styles.imageContainer}>
              <View style={styles.gamePlaceholder}>
                <Ionicons name="game-controller" size={100} color="#a855f7" />
              </View>
            </View>

            {/* Game Information */}
            <View style={styles.gameDetails}>
              <Text style={styles.gameName}>{game.name}</Text>
              
              <View style={styles.infoRow}>
                <Ionicons name="hardware-chip" size={16} color="#6b7280" />
                <Text style={styles.infoText}>
                  {game.console?.name || game.consoleName || 'Console não informado'}
                </Text>
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Preço de locação:</Text>
                <Text style={styles.price}>{formatPrice(game.price)}</Text>
              </View>

              <View style={styles.availabilityContainer}>
                <View style={styles.availabilityRow}>
                  <View style={[styles.availabilityDot, { backgroundColor: availability.color }]} />
                  <Text style={[styles.availabilityText, { color: availability.color }]}>
                    {availability.text}
                  </Text>
                </View>
                <Text style={styles.quantityText}>
                  {game.amount} {game.amount === 1 ? 'unidade disponível' : 'unidades disponíveis'}
                </Text>
              </View>

              {game.description && (
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionLabel}>Descrição:</Text>
                  <Text style={styles.description}>{game.description}</Text>
                </View>              )}
            </View>
          </ScrollView>          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <View style={styles.actionButtonsShadow} />
            <View style={styles.actionButtons}>            <TouchableOpacity
              style={[
                styles.addToCartButton,
                availableStock === 0 && styles.addToCartButtonDisabled
              ]}
              onPress={() => {
                const success = onAddToCart(game);
                if (success) {
                  onClose();
                }
              }}
              disabled={availableStock === 0}
            >
              <Ionicons 
                name="cart" 
                size={20} 
                color={availableStock === 0 ? '#9ca3af' : '#ffffff'} 
              />
              <Text style={[
                styles.addToCartButtonText,
                availableStock === 0 && styles.addToCartButtonTextDisabled
              ]}>
                {availableStock === 0 ? 'Limite Atingido' : 'Adicionar ao Carrinho'}
              </Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: '100%',
    height: '75%',
    maxHeight: 600,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },  scrollContent: {
    flex: 1,
  },  scrollContentContainer: {
    paddingBottom: 30,
  },imageContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  gamePlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },gameDetails: {
    padding: 25,
  },
  gameName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 18,
    color: '#6b7280',
    marginLeft: 8,
  },
  priceContainer: {
    marginBottom: 25,
  },
  priceLabel: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: '#a855f7',
  },
  availabilityContainer: {
    marginBottom: 25,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  availabilityText: {
    fontSize: 16,
    fontWeight: '600',
  },
  quantityText: {
    fontSize: 14,
    color: '#6b7280',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,    color: '#6b7280',
    lineHeight: 20,
  },  actionButtonsContainer: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  actionButtonsShadow: {
    height: 10,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  actionButtons: {
    padding: 25,
    paddingTop: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  addToCartButton: {
    backgroundColor: '#a855f7',
    borderRadius: 15,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  addToCartButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  addToCartButtonTextDisabled: {
    color: '#9ca3af',
  },
});

export default GameDetailModal;
