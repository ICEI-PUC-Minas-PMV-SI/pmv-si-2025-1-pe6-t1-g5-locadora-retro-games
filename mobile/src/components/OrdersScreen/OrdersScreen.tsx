import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { getUserOrders } from '../../services/api';

interface OrderGame {
  id: number;
  name: string;
  price: number;
  console: {
    name: string;
  };
}

interface Order {
  id: string;
  userId: number;
  statusReserveId: number;
  reserveDate: string;
  approveDate?: string;
  returnDate?: string;
  totalAmount?: number;
  games?: OrderGame[];
  // Legacy fields for backward compatibility
  gameId?: number;
  game?: OrderGame;
}

const OrdersScreen = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await getUserOrders();
      setOrders(response || []);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      Alert.alert('Erro', 'Não foi possível carregar seus pedidos. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrders();
    setIsRefreshing(false);
  };

  const getStatusInfo = (statusId: number) => {
    switch (statusId) {
      case 1:
        return { text: 'Reservado', color: '#10b981', icon: 'checkmark-circle-outline' };
      case 2:
        return { text: 'Devolvido', color: '#6b7280', icon: 'return-down-back-outline' };
      case 3:
        return { text: 'Cancelado', color: '#ef4444', icon: 'close-circle-outline' };
      case 4:
        return { text: 'Pendente', color: '#f59e0b', icon: 'time-outline' };
      default:
        return { text: 'Desconhecido', color: '#6b7280', icon: 'help-circle-outline' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return `R$ ${Number(price).toFixed(2).replace('.', ',')}`;
  };
  const renderOrderItem = ({ item }: { item: Order }) => {
    const status = getStatusInfo(item.statusReserveId);
    
    // Calculate total amount if not provided
    const calculateTotal = () => {
      if (item.totalAmount) return item.totalAmount;
      if (item.games && item.games.length > 0) {
        return item.games.reduce((total, game) => total + game.price, 0);
      }
      if (item.game) return item.game.price;
      return 0;
    };

    const totalAmount = calculateTotal();
    const gamesList = item.games || (item.game ? [item.game] : []);
    
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View style={styles.orderIdContainer}>
            <Text style={styles.orderIdLabel}>Pedido</Text>
            <Text style={styles.orderId}>#{item.id}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
            <Ionicons name={status.icon as any} size={16} color="#ffffff" />
            <Text style={styles.statusText}>{status.text}</Text>
          </View>
        </View>

        {/* Games List */}
        {gamesList.length > 0 && (
          <View style={styles.gamesSection}>
            <Text style={styles.gamesSectionTitle}>
              {gamesList.length === 1 ? 'Jogo:' : `Jogos (${gamesList.length}):`}
            </Text>
            {gamesList.map((game, index) => (
              <View key={`${game.id}-${index}`} style={styles.gameItem}>
                <View style={styles.gameItemInfo}>
                  <Text style={styles.gameName}>{game.name}</Text>
                  <Text style={styles.gameConsole}>{game.console?.name}</Text>
                </View>
                <Text style={styles.gamePrice}>{formatPrice(game.price)}</Text>
              </View>
            ))}
            
            {/* Total Amount */}
            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>{formatPrice(totalAmount)}</Text>
            </View>
          </View>
        )}

        <View style={styles.orderDates}>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={16} color="#6b7280" />
            <Text style={styles.dateLabel}>Pedido em:</Text>
            <Text style={styles.dateValue}>{formatDate(item.reserveDate)}</Text>
          </View>
          
          {item.approveDate && (
            <View style={styles.dateRow}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#10b981" />
              <Text style={styles.dateLabel}>Aprovado em:</Text>
              <Text style={styles.dateValue}>{formatDate(item.approveDate)}</Text>
            </View>
          )}
          
          {item.returnDate && (
            <View style={styles.dateRow}>
              <Ionicons name="return-down-back-outline" size={16} color="#6b7280" />
              <Text style={styles.dateLabel}>Devolução em:</Text>
              <Text style={styles.dateValue}>{formatDate(item.returnDate)}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="bag-outline" size={80} color="#d1d5db" />
      <Text style={styles.emptyStateTitle}>Nenhum pedido encontrado</Text>
      <Text style={styles.emptyStateText}>
        Você ainda não fez nenhuma compra. Que tal explorar nossos jogos?
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => router.push('/home')}
      >
        <Text style={styles.exploreButtonText}>Explorar Jogos</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingState}>
      <Ionicons name="refresh-outline" size={40} color="#a855f7" />
      <Text style={styles.loadingText}>Carregando seus pedidos...</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3e8ff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Pedidos</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh-outline" size={24} color="#1f2937" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isLoading ? (
        renderLoadingState()
      ) : (        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[
            styles.listContainer,
            orders.length === 0 && styles.emptyContainer
          ]}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={['#a855f7']}
              tintColor="#a855f7"
            />
          }
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3e8ff'
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
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderIdContainer: {
    flex: 1,
  },
  orderIdLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },
  gamesSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingBottom: 12,
    marginBottom: 12,
  },
  gamesSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  gameItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 6,
  },
  gameItemInfo: {
    flex: 1,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#a855f7',
  },
  gameInfo: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingBottom: 12,
    marginBottom: 12,
  },
  gameName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  gameConsole: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  gamePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#a855f7',
  },
  orderDates: {
    gap: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateLabel: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#a855f7',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  exploreButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
  },
});

export default OrdersScreen;
