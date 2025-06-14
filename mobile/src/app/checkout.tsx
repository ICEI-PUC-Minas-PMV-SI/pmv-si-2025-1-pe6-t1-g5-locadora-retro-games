import React from "react";
import CheckoutScreen from "../components/CheckoutScreen/CheckoutScreen";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutScreen />
    </ProtectedRoute>
  );
}
