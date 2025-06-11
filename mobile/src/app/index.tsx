import HomeScreen from "../components/HomeScreen/HomeScreen";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import React from "react";

export default function Index() {
  return (
    <ProtectedRoute>
      <HomeScreen />
    </ProtectedRoute>
  );
}
