import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
// import {
//   useFonts,
//   Poppins_400Regular,
//   Poppins_600SemiBold,
// } from "@expo-google-fonts/poppins";
import { router } from "expo-router";

import { useCart } from "../../context/CartContext";

import tlouImg from "../../../assets/images/tlou.png";
import fifa24Img from "../../../assets/images/fifa24.png";
import mariokartImg from "../../../assets/images/mariokart.png";

import { styles } from "./HomeScreen.styles";

type Game = {
  id: string;
  title: string;
  category: string;
  image: string | any;
};

const fakeGames: Game[] = [
  {
    id: "1",
    title: "FIFA 24",
    category: "Esporte",
    image: fifa24Img,
  },
  {
    id: "2",
    title: "The Last of Us",
    category: "Aventura",
    image: tlouImg,
  },
  {
    id: "3",
    title: "Mario Kart",
    category: "Corrida",
    image: mariokartImg,
  },
];

const HomeScreen = () => {
  const { addToCart } = useCart();

  const [search, setSearch] = useState<string>("");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filteredGames = fakeGames.filter((game) =>
    game.title.toLowerCase().includes(search.toLowerCase())
  );

  // let [fontsLoaded] = useFonts({
  //   Poppins_400Regular,
  //   Poppins_600SemiBold,
  // });

  // if (!fontsLoaded) return null;

  const openModal = (game: Game) => {
    setSelectedGame(game);
    setModalVisible(true);
  };

  const handleAddToCartInModal = () => {
    if (selectedGame) {
      addToCart(selectedGame);
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>🎮 NintendiN</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => router.push("/cart")}>
            <Feather name="shopping-cart" size={24} color="#a855f7" />
          </TouchableOpacity>
          <Feather name="user" size={24} color="#a855f7" />
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
      </View>

      {/* Lista de jogos */}
      <FlatList
        data={filteredGames}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item)}>
            <View style={styles.card}>
              <Image
                source={
                  typeof item.image === "string"
                    ? { uri: item.image }
                    : item.image
                }
                style={styles.cardImage}
                resizeMode="contain"
              />
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardCategory}>{item.category}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Modal do jogo */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedGame && (
              <>
                <Image
                  source={selectedGame.image}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
                <Text style={styles.modalTitle}>{selectedGame.title}</Text>
                <Text style={styles.modalCategory}>
                  {selectedGame.category}
                </Text>

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddToCartInModal}
                >
                  <Text style={styles.addButtonText}>
                    Adicionar ao Carrinho
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Fechar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;