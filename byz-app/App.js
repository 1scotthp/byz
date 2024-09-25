import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import GoogleSignIn from './GoogleSignIn';
import { app } from './firebaseConfig';

const auth = getAuth(app);
const db = getFirestore(app);

export function formatMoney(amount, locale = 'en-US', currency = 'USD') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function App() {
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Get the auction ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const auctionId = urlParams.get('id');

    console.log("Auction ID: ", auctionId);

    if (!auctionId) {
      setLoading(false);
      return;
    }

    const auctionRef = doc(db, 'auctions', auctionId);
    const unsubscribeSnapshot = onSnapshot(auctionRef, (doc) => {
      if (doc.exists()) {
        console.log("Auction data: ", doc.data());
        setAuction({ id: doc.id, ...doc.data() });
      } else {
        console.log("No such auction!");
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot();
    };
  }, []);

  const placeBid = async () => {
    if (!user) {
      alert("Please sign in to place a bid");
      return;
    }

    if (!auction) {
      alert("No auction data available");
      return;
    }

    const nextBid = (auction.currentBid || 0) + auction.bidIncrement;
    const auctionRef = doc(db, 'auctions', auction.id);

    try {
      await updateDoc(auctionRef, {
        currentBid: nextBid,
        currentWinner: user.uid
      });
    } catch (error) {
      console.error("Error placing bid: ", error);
      alert("Failed to place bid. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!auction) {
    return (
      <View style={styles.container}>
        <Text>No auction found. Please check the URL.</Text>
        <GoogleSignIn />
      </View>
    );
  }

  const nextBid = (auction.currentBid || 0) + auction.bidIncrement;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{auction.title}</Text>
      <Text>Current bid: {formatMoney(auction.currentBid || 0)}</Text>
      <Button 
        title={`Bid ${formatMoney(nextBid)}`}
        onPress={placeBid}
        disabled={!user}
      />
      {!user && <Text>Please sign in to place a bid</Text>}
      <GoogleSignIn />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});