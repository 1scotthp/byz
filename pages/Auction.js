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
  Image,
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
  const [previousMaxBid, setPreviousMaxBid] = useState(1600);

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
        {/* <Text style={{ color: "white" }}>Image</Text> */}
        <Image
          source={require("../assets/apt.png")} // Adjust the path as needed
          style={styles.image}
          resizeMode="cover" // or "cover", "stretch", "center"
          accessible={true}
          accessibilityLabel="Description of the image"
        />
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
          <FontAwesome5
            name="info-circle"
            style={{ position: "absolute", left: 6, top: 6 }}
            size={18}
            color="black"
          />
          <Text style={styles.timerText}> {`Ends in ${timeLeft}`}</Text>
          <Text style={styles.timerText}>
            {`Highest Bid: ${formatMoney(previousMaxBid)}`}
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.buttonStyle,
              pressed && styles.buttonPressed,
            ]}
            onPress={openModal} // Opens the modal
          >
            <Text style={styles.buttonText}>
              {`Bid ${formatMoney(currentBid)}`}
            </Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.buttonStyle,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => onBidPress(currentBid)}
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
          >
            <FontAwesome5 name="sign-out-alt" size={24} color="black" />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.buttonStyle,
              pressed && styles.buttonPressed,
              styles.footerButton,
            ]}
          >
            <FontAwesome5 name="bell" size={24} color="black" />
          </Pressable>
        </View>
      </View>
      <BidModal
        setCurrentBid={setCurrentBid}
        isVisible={isModalVisible}
        currentBid={currentBid}
        onClose={closeModal}
        onSubmitBid={handleSubmitBid}
        previousMaxBid={previousMaxBid}
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
  image: {
    width: "100%", // Ensures the image fills the container's width
    height: "100%", // Ensures the image fills the container's height
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
    borderRadius: 6,
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
    borderRadius: 6,
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
    backgroundColor: "transparent",
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
