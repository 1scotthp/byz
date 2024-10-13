import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Pressable,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import FontAwesome from "react-native-vector-icons/FontAwesome"; // Import the desired icon set
import { FontAwesome5 } from "@expo/vector-icons"; // Updated import
import { app } from ".././firebaseConfig";
import BidModal from "../components/BidModal";

// const auth = getAuth(app);
// const functions = getFunctions(app);

export function formatMoney(amount, locale = "en-US", currency = "USD") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .toString()
    .concat("/mo");
}

export default function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentBid, setCurrentBid] = useState(1650);

  // Handler functions
  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleSubmitBid = (bidAmount) => {
    // Implement your bid logic here (e.g., API call)
    Alert.alert(
      "Bid Placed",
      `You have placed a bid of ${formatMoney(bidAmount)}.`
    );
    setCurrentBid(bidAmount);
    setIsModalVisible(false);
  };

  const onLeaveAuctionPress = () => {
    Alert.alert("Leave Auction", "You have left the auction.");
    // Implement your leave auction logic here
  };

  const onConfigureNotifsPress = () => {
    Alert.alert(
      "Configure Notifications",
      "Here you can configure your notifications."
    );
    // Implement your configure notifications logic here
  };
  useEffect(() => {
    // Calculate the difference in milliseconds
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetTime - now;

      if (difference <= 0) {
        clearInterval(timerId);
        setTimeLeft("Time is up!");
        return;
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    // Initialize the timer
    calculateTimeLeft();

    // Update the timer every second
    const timerId = setInterval(calculateTimeLeft, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(timerId);
  }, []);

  const targetTime = new Date("2024-12-31T23:59:59");
  const [timeLeft, setTimeLeft] = useState("");
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Text style={{ color: "white" }}>Image</Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.topContainer}>
          <View>
            <Text style={styles.title}>{"3 Beds - 3 Baths"}</Text>
            <Text style={styles.title}>{"1250 sq ft"}</Text>
          </View>
          <View style={{}}>
            <Text style={styles.title}>{"229 East 96th street #6F"}</Text>
            <Text style={styles.title}>{"Eberhart Brothers"}</Text>
          </View>
        </View>
        <View style={styles.bidContentContainer}>
          <Text style={styles.timerText}> {`Ends in ${timeLeft}`}</Text>
          <Text style={styles.timerText}>
            {" "}
            {`Highest Bid: ${formatMoney(currentBid)}`}
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.buttonStyle,
              pressed && styles.buttonPressed,
            ]}
            onPress={openModal} // Opens the modal
          >
            <Text style={styles.buttonText}>
              {`Bid ${formatMoney(currentBid + 50)}`}
            </Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.buttonStyle,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => onBidPress(currentBid + 50)}
          >
            <Text style={styles.buttonText}>{`More bid options`}</Text>
          </Pressable>
        </View>
        <View style={styles.footerContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.buttonStyle,
              pressed && styles.buttonPressed,
              styles.footerButton,
            ]}
            onPress={() => onBidPress(currentBid + 100)}
          >
            <FontAwesome5 name="sign-out-alt" size={24} color="black" />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.buttonStyle,
              pressed && styles.buttonPressed,
              styles.footerButton,
            ]}
            onPress={() => onBidPress(currentBid + 100)}
          >
            <FontAwesome5 name="bell" size={24} color="black" />
          </Pressable>
        </View>
      </View>
      <BidModal
        isVisible={isModalVisible}
        currentBid={currentBid + 50}
        onClose={closeModal}
        onSubmitBid={handleSubmitBid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    backgroundColor: "fff",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    fontSize: 16,
  },
  buttonText: {
    fontSize: 16,
  },
  contentContainer: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    width: "100%",
    height: "60%",
    justifyContent: "space-between",
  },
  imageContainer: {
    height: "40%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    color: "white",
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  timerText: {
    fontSize: 16,
  },
  footerContainer: {
    flexDirection: "row",
    marginTop: 12,
    paddingTop: 12,
    width: "100%",
    justifyContent: "space-between",
  },
  bidContentContainer: {
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "lightgrey",
    flexDirection: "column",
    marginTop: 18,
    padding: 12,
  },
  buttonStyle: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    marginVertical: 6,
    backgroundColor: "lightblue",
    color: "white",
    height: "30%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
  },
  customBidContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  footerButton: {
    width: "44%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    padding: 12,
    height: "80%",
    backgroundColor: "lightgray",
  },
  input: {
    height: 40,
    width: 150,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  },
});
