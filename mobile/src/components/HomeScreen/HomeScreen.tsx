import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { GameService, ConsoleService } from "../../services/gameService";
import { testApiConnection } from "../../services/api";
import { Game, Console } from "../../types/api";
import GameCard from "../GameCard/GameCard";
import GameDetailModal from "../GameDetailModal/GameDetailModal";
import UserProfileModal from "../UserProfileModal/UserProfileModal";
import GuestModal from "../GuestModal/GuestModal";

import { styles } from "./HomeScreen.styles";

// @ts-ignore - Temporary fix for React 19 compatibility issues
const HomeScreen = () => {
  const { addToCart, getCartItemsCount } = useCart();
  const { user } = useAuth();

  // State for games and pagination
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);

  // Search and filter state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
    // Modal state
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [guestModalVisible, setGuestModalVisible] = useState(false);
  
  // Console filter state
  const [consoles, setConsoles] = useState<Console[]>([]);
  const [selectedConsoleId, setSelectedConsoleId] = useState<number | null>(null);

  // API connection state
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);

  // Cart count for header badge
  const cartItemsCount = getCartItemsCount();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
    setGames([]);
    setHasMoreData(true);
  }, [debouncedSearch, selectedConsoleId]);

  // Fetch games function
  const fetchGames = useCallback(async (page = 1, isRefresh = false) => {
    try {
      if (page === 1) {
        isRefresh ? setRefreshing(true) : setLoading(true);
      } else {
        setLoadingMore(true);
      }

      let searchQuery = debouncedSearch;
      
      // If a console is selected, search by console name
      if (selectedConsoleId && !debouncedSearch) {
        const selectedConsole = consoles.find(c => c.id === selectedConsoleId);
        if (selectedConsole) {
          searchQuery = selectedConsole.name;
        }
      }

      const response = await GameService.getGames({
        page,
        limit: 10,
        search: searchQuery,
        field: 'name',
        order: 'asc',
      });

      if (page === 1) {
        setGames(response.games);
      } else {
        setGames(prev => [...prev, ...response.games]);
      }

      setCurrentPage(page);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
      setHasMoreData(page < response.totalPages);

    } catch (error) {
      console.error('Error fetching games:', error);
      Alert.alert(
        'Erro',
        'Não foi possível carregar os jogos. Verifique sua conexão e tente novamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [debouncedSearch, selectedConsoleId, consoles]);

  // Fetch consoles for filter
  const fetchConsoles = useCallback(async () => {
    try {
      const response = await ConsoleService.getAllConsoles();
      setConsoles(response);
    } catch (error) {
      console.error('Error fetching consoles:', error);
    }
  }, []);
  // Initial data load
  useEffect(() => {
    fetchConsoles();
  }, [fetchConsoles]);

  useEffect(() => {
    if (consoles.length > 0 || debouncedSearch) {
      fetchGames(1);
    }
  }, [fetchGames, consoles.length]);

  // Test API connection on component mount
  useEffect(() => {
    const checkApiConnection = async () => {
      console.log('🔍 Testing API connection...');
      const connected = await testApiConnection();
      setApiConnected(connected);
      
      if (!connected) {
        Alert.alert(
          'Erro de Conexão',
          'Não foi possível conectar ao servidor. Verifique se o backend está executando.',
          [{ text: 'OK' }]
        );
      }
    };
    
    checkApiConnection();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    fetchGames(1, true);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (!loadingMore && hasMoreData && currentPage < totalPages) {
      fetchGames(currentPage + 1);
    }
  };

  // Handle game selection
  const handleGamePress = (game: Game) => {
    setSelectedGame(game);
    setModalVisible(true);
  };  // Handle add to cart
  const handleAddToCart = (game: Game): boolean => {
    const success = addToCart(game);
    if (success) {
      Alert.alert(
        'Sucesso!',
        `${game.name} foi adicionado ao carrinho.`,
        [{ text: 'OK' }]
      );
    }
    return success;
  };

  // Handle user icon click
  const handleUserIconClick = () => {
    if (user) {
      setUserModalVisible(true);
    } else {
      setGuestModalVisible(true);
    }
  };
  // Console filter buttons
  const renderConsoleFilters = () => (
    <View style={styles.consoleFiltersContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.consoleFiltersContent}
        style={styles.consoleFiltersScroll}
      >
        <TouchableOpacity
          style={[
            styles.consoleFilterButton,
            selectedConsoleId === null && styles.consoleFilterButtonActive
          ]}
          onPress={() => setSelectedConsoleId(null)}
        >
          <Text style={[
            styles.consoleFilterText,
            selectedConsoleId === null && styles.consoleFilterTextActive
          ]}>
            Todos
          </Text>
        </TouchableOpacity>
        
        {consoles.map((console) => (
          <TouchableOpacity
            key={console.id}
            style={[
              styles.consoleFilterButton,
              selectedConsoleId === console.id && styles.consoleFilterButtonActive
            ]}
            onPress={() => setSelectedConsoleId(console.id)}
          >
            <Text style={[
              styles.consoleFilterText,
              selectedConsoleId === console.id && styles.consoleFilterTextActive
            ]}>
              {console.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // Loading footer for pagination
  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#a855f7" />
        <Text style={styles.loadingText}>Carregando mais jogos...</Text>
      </View>
    );
  };

  // Empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="game-controller-outline" size={64} color="#d1d5db" />
      <Text style={styles.emptyStateTitle}>Nenhum jogo encontrado</Text>
      <Text style={styles.emptyStateText}>
        {debouncedSearch 
          ? `Não encontramos jogos para "${debouncedSearch}"`
          : 'Não há jogos disponíveis no momento'
        }
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#a855f7" />
        <Text style={styles.loadingText}>Carregando jogos...</Text>
      </View>
    );  }  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3e8ff" />
      <View style={styles.content}>
      {/* API Connection Status */}
      {apiConnected === false && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>
            ❌ Não foi possível conectar ao servidor
          </Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>🎮 NintendiN</Text>        <View style={styles.headerIcons}>          <TouchableOpacity 
            onPress={() => router.push("/cart")}
            style={styles.cartButton}
          >
            <Feather name="shopping-cart" size={24} color="#a855f7" />
            {cartItemsCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {user && (
            <TouchableOpacity onPress={() => router.push("/orders")}>
              <Feather name="file-text" size={24} color="#a855f7" />
            </TouchableOpacity>
          )}          <TouchableOpacity onPress={handleUserIconClick}>
            <Feather name="user" size={24} color="#a855f7" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#a855f7" />
        <TextInput
          placeholder="Buscar jogos..."
          placeholderTextColor="#a855f7"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={20} color="#a855f7" />
          </TouchableOpacity>
        )}
      </View>

      {/* Console Filters */}
      {renderConsoleFilters()}      {/* Results Info */}
      <View style={styles.resultsInfo}>
        <Text style={styles.resultsText}>
          {games.length} de {totalItems} {totalItems === 1 ? 'jogo encontrado' : 'jogos encontrados'}
        </Text>
      </View>

      {/* Games List */}
      <FlatList
        data={games}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <GameCard
            game={item}
            onPress={handleGamePress}
            onAddToCart={handleAddToCart}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#a855f7']}
            tintColor="#a855f7"
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={games.length === 0 ? styles.emptyListContainer : styles.listContent}
      />      {/* Game Detail Modal */}
      <GameDetailModal
        visible={modalVisible}
        game={selectedGame}
        onClose={() => setModalVisible(false)}
        onAddToCart={handleAddToCart}
      />      {/* User Profile Modal */}
      <UserProfileModal
        visible={userModalVisible}
        onClose={() => setUserModalVisible(false)}
      />      {/* Guest Modal */}
      <GuestModal
        visible={guestModalVisible}
        onClose={() => setGuestModalVisible(false)}
      />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;