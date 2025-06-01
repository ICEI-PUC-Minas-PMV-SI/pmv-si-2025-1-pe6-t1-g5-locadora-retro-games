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

interface GameDetailModalProps {
  visible: boolean;
  game: Game | null;
  onClose: () => void;
  onAddToCart: (game: Game) => void;
}

const GameDetailModal: React.FC<GameDetailModalProps> = ({
  visible,
  game,
  onClose,
  onAddToCart,
}) => {
  if (!game) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const getAvailabilityStatus = (amount: number) => {
    if (amount === 0) return { text: 'Indisponível', color: '#ef4444' };
    if (amount <= 5) return { text: 'Poucos disponíveis', color: '#f59e0b' };
    return { text: 'Disponível', color: '#10b981' };
  };

  const availability = getAvailabilityStatus(game.amount);

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

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Game Image Placeholder */}
            <View style={styles.imageContainer}>
              <View style={styles.gamePlaceholder}>
                <Ionicons name="game-controller" size={80} color="#a855f7" />
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
                </View>
              )}

              {/* Game Stats */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>ID</Text>
                  <Text style={styles.statValue}>#{game.id}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Console ID</Text>
                  <Text style={styles.statValue}>#{game.consoleId}</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.addToCartButton,
                game.amount === 0 && styles.addToCartButtonDisabled
              ]}
              onPress={() => {
                onAddToCart(game);
                onClose();
              }}
              disabled={game.amount === 0}
            >
              <Ionicons 
                name="cart" 
                size={20} 
                color={game.amount === 0 ? '#9ca3af' : '#ffffff'} 
              />
              <Text style={[
                styles.addToCartButtonText,
                game.amount === 0 && styles.addToCartButtonTextDisabled
              ]}>
                {game.amount === 0 ? 'Indisponível' : 'Adicionar ao Carrinho'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    minHeight: '50%',
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
  },
  scrollContent: {
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  gamePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameDetails: {
    padding: 20,
  },
  gameName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#6b7280',
    marginLeft: 8,
  },
  priceContainer: {
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#a855f7',
  },
  availabilityContainer: {
    marginBottom: 20,
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
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  actionButtons: {
    padding: 20,
    paddingTop: 16,
  },
  addToCartButton: {
    backgroundColor: '#a855f7',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  addToCartButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  addToCartButtonTextDisabled: {
    color: '#9ca3af',
  },
});

export default GameDetailModal;
