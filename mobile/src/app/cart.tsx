import React from "react";
import CartScreen from "../components/CartScreen/CartScreen";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CartScreen />
    </ProtectedRoute>
  );
}