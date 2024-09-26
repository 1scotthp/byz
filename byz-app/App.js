import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ActivityIndicator, TextInput } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import GoogleSignIn from './GoogleSignIn';
import { app } from './firebaseConfig';

const auth = getAuth(app);
const functions = getFunctions(app);

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
  const [customBid, setCustomBid] = useState('');
  const [auctionId, setAuctionId] = useState(null);

  const getAuction = httpsCallable(functions, 'getAuction');
  const placeBid = httpsCallable(functions, 'placeBid');

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Get the auction ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    setAuctionId(id);

    if (!id) {
      setLoading(false);
      return;
    }

    // Fetch auction data
    getAuction({ auctionId: id })
      .then((result) => {
        setAuction(result.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching auction:", error);
        setLoading(false);
      });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const handlePlaceBid = async (bidAmount) => {
    if (!user) {
      alert("Please sign in to place a bid");
      return;
    }

    if (!auctionId) {
      alert("No auction ID available");
      return;
    }

    if (!auction) {
      alert("No auction data available");
      return;
    }

    if (typeof bidAmount === 'string') {
      bidAmount = parseFloat(bidAmount);
    }

    if (isNaN(bidAmount) || bidAmount <= auction.currentBid) {
      alert("Please enter a valid bid amount higher than the current bid");
      return;
    }

    try {
      const result = await placeBid({ 
        auctionId: auctionId, 
        bidAmount: bidAmount,
        userId: user.uid 
      });
      setAuction(result.data);
      setCustomBid(''); // Clear the input after successful bid
    } catch (error) {
      console.error("Error placing bid:", error);
      alert(error.message || "Failed to place bid. Please try again.");
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

  const suggestedBids = [50, 100, 200].map(increment => auction.currentBid + increment);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{auction.title}</Text>
      <Text>Current bid: {formatMoney(auction.currentBid || 0)}</Text>
      <View style={styles.bidButtonsContainer}>
        {suggestedBids.map((bid, index) => (
          <Button
            key={index}
            title={`Bid ${formatMoney(bid)}`}
            onPress={() => handlePlaceBid(bid)}
            disabled={!user}
          />
        ))}
      </View>
      <View style={styles.customBidContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setCustomBid}
          value={customBid}
          placeholder="Enter custom bid"
          keyboardType="numeric"
        />
        <Button 
          title="Place Custom Bid"
          onPress={() => handlePlaceBid(customBid)}
          disabled={!user || !customBid}
        />
      </View>
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
  bidButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  customBidContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    height: 40,
    width: 150,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  },
});