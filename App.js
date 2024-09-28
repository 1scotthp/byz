// App.js
import React, { useState, useEffect, useContext, useMemo } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { AccountProvider, AccountContext } from "./AccountContext";
import Auction from "./pages/Auction";

// const functions = getFunctions(app);

export function formatMoney(amount, locale = "en-US", currency = "USD") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function App() {
  return (
    <AccountProvider>
      <AppLoggedIn />
    </AccountProvider>
  );
}

const AppLoggedIn = () => {
  const { user } = useContext(AccountContext);
  const [auctionId, setAuctionId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Extract auctionId once on mount
  useEffect(() => {
    const extractAuctionId = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("id");
      console.log("Auction ID:", id);
      setAuctionId(id);
      setLoading(false);
    };

    extractAuctionId();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (auctionId) {
    console.log("AUCTION ID:", auctionId);
    return <Auction auctionId={auctionId} />;
  }

  return <Home />; // Render the Home component when no auctionId is present
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
