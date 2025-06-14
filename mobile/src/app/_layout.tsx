import React from "react";
import { Stack } from "expo-router";
import { LogBox } from "react-native";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";

// Configurações para esconder warnings em desenvolvimento
if (__DEV__) {
  // Esconder warnings específicos usando LogBox
  LogBox.ignoreLogs([
    'Text strings must be rendered within a <Text> component',
    'Warning: Failed prop type',
    'Warning: React.jsx: type is invalid',
    'Warning: validateDOMNesting',
    'Warning: Each child in a list should have a unique "key" prop',
    'Non-serializable values were found in the navigation state',
    'VirtualizedLists should never be nested inside plain ScrollViews'
  ]);
  
  // Esconder TODOS os warnings (use com cuidado)
  // LogBox.ignoreAllLogs(true);
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ title: "Splash" }} />
          <Stack.Screen name="home" options={{ title: "Home" }} />
          <Stack.Screen name="login" options={{ title: "Login" }} />          <Stack.Screen name="cart" options={{ title: "Cart" }} />
          <Stack.Screen name="quick-register" options={{ title: "Register" }} />
          <Stack.Screen name="checkout" options={{ title: "Checkout" }} />
          <Stack.Screen name="orders" options={{ title: "Orders" }} />
        </Stack>
      </CartProvider>
    </AuthProvider>
  );
}