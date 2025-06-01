import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Game } from '../../types/api';

interface GameCardProps {
  game: Game;
  onPress: (game: Game) => void;
  onAddToCart: (game: Game) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onPress, onAddToCart }) => {
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
    <TouchableOpacity style={styles.card} onPress={() => onPress(game)}>
      <View style={styles.cardContent}>
        {/* Game Image Placeholder */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Ionicons name="game-controller" size={40} color="#a855f7" />
          </View>
        </View>

        {/* Game Info */}
        <View style={styles.gameInfo}>
          <Text style={styles.gameName} numberOfLines={2}>
            {game.name}
          </Text>
          
          <Text style={styles.consoleName} numberOfLines={1}>
            {game.console?.name || game.consoleName || 'Console não informado'}
          </Text>

          <Text style={styles.price}>
            {formatPrice(game.price)}
          </Text>

          <View style={styles.availabilityContainer}>
            <View style={[styles.availabilityDot, { backgroundColor: availability.color }]} />
            <Text style={[styles.availabilityText, { color: availability.color }]}>
              {availability.text} ({game.amount})
            </Text>
          </View>

          {game.description && (
            <Text style={styles.description} numberOfLines={2}>
              {game.description}
            </Text>
          )}
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={[
            styles.addButton,
            game.amount === 0 && styles.addButtonDisabled
          ]}
          onPress={() => onAddToCart(game)}
          disabled={game.amount === 0}
        >
          <Ionicons 
            name="add-circle" 
            size={24} 
            color={game.amount === 0 ? '#9ca3af' : '#ffffff'} 
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: 12,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameInfo: {
    flex: 1,
    marginRight: 12,
  },
  gameName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  consoleName: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#a855f7',
    marginBottom: 6,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  availabilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#a855f7',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
});

export default GameCard;
