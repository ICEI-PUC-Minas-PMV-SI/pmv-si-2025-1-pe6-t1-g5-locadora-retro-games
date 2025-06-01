import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useCart } from "../../context/CartContext";

const CartScreen = () => {
  const { cart } = useCart();

  return (
    <View style={styles.safeArea}>
      <Text style={styles.title}>🛒 Carrinho</Text>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.cartItemId}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <View>
              <Text>{item.title}</Text>
              <Text>{item.category}</Text>
            </View>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={() => {
          /* Navegação futura */
        }}
      >
        <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff7ed",
    padding: 20,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight ?? 32 : 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#a855f7",
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    marginBottom: 15,
    gap: 10,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
   checkoutButton: {
    backgroundColor: '#a855f7',
    width: '50%',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center', // Centraliza horizontalmente
    marginTop: 10,       // Diminui o espaço acima do botão
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
