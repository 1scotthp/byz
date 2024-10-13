// BidModal.js
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons"; // Updated import

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

const BidModal = ({ isVisible, currentBid, onClose, onSubmitBid }) => {
  const [customBid, setCustomBid] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const bidAmount = parseFloat(customBid);
    if (isNaN(bidAmount) || bidAmount <= currentBid) {
      setError("Please enter a valid bid higher than the current bid.");
      return;
    }
    onSubmitBid(bidAmount);
    setCustomBid("");
    setError("");
  };

  const handleClose = () => {
    onClose();
    setCustomBid("");
    setError("");
  };

  const bidOptions = [1750, 1800, 1850];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClose}
      accessible={true}
      accessibilityLabel="Bid Modal"
    >
      <Pressable style={styles.modalOverlay} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <Pressable
            style={styles.modalContainer}
            onPress={() => {
              /* Prevent closing when pressing inside modal */
            }}
          >
            <Text style={styles.infoText}>
              Your account will NOT be debited. All financial transactions
              happen between users and owners/brokers.
            </Text>
            <View style={styles.bidRow}>
              <View style={styles.leftBidRowContainer}>
                <Text style={styles.bidTitle}>229 East 96th street</Text>
                <Text style={styles.bidSubtitle}>Eberhart Brothers</Text>
              </View>
              <View style={styles.rightBidRowContainer}>
                <Text style={styles.currentBid}>{formatMoney(currentBid)}</Text>
              </View>
            </View>
            <View style={styles.bidOptionsContainer}>
              <View style={styles.bidOptionsRow}>
                {bidOptions.map((amount) => {
                  return (
                    <Pressable
                      style={[styles.buttonStyle, styles.smallBidButtonStyle]}
                    >
                      <Text style={styles.buttonText}>
                        {`${formatMoney(amount)}`}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <Pressable>
                <Text style={styles.buttonText}>
                  <FontAwesome5
                    name="chevron-down"
                    size={24}
                    color="lightblue"
                  />
                </Text>
              </Pressable>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.buttonStyle,
                pressed && styles.buttonPressed,
                { marginHorizontal: 18 },
              ]}
            >
              <Text style={styles.buttonText}>
                {`Place bid ${formatMoney(currentBid)}`}
              </Text>
            </Pressable>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  bidOptionsRow: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  bidOptionsContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
    marginBottom: 24,
  },
  bidTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  currentBid: {
    fontSize: 16,
    fontWeight: "bold",
  },
  smallBidButtonStyle: {
    width: "30%",
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: "lightblue",
  },
  bidSubtitle: {
    fontSize: 14,
    color: "#555",
  },
  infoText: {
    fontSize: 10,
    marginBottom: 12,
    paddingHorizontal: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "100%",
  },
  buttonText: {
    fontSize: 16,
  },
  modalContainer: {
    width: "100%",
    // height: "70%",
    backgroundColor: "#fff",
    borderRadius: 4,
    alignItems: "center",
    paddingVertical: 18,
    justifyContent: "space-between",
    elevation: 5, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: { width: 0, height: 2 }, // For iOS shadow
    shadowOpacity: 0.5, // For iOS shadow
    shadowRadius: 4, // For iOS shadow
  },
  buttonStyle: {
    width: "92%",
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
    backgroundColor: "lightgreen",
    color: "white",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
  },
  bidRow: {
    flexDirection: "row",
    width: "100%",
    padding: 18,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: "black",
  },
  leftBidRowContainer: {
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-around",
    width: "50%",
    alignItems: "flex-start",
  },
  rightBidRowContainer: {
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    width: "50%",
    alignItems: "flex-end",
  },
  //   modalTitle: {
  //     fontSize: 20,
  //     fontWeight: "bold",
  //     marginBottom: 10,
  //   },
  //   modalSubtitle: {
  //     fontSize: 16,
  //     marginBottom: 20,
  //     color: "#555",
  //   },
  //   input: {
  //     width: "100%",
  //     height: 50,
  //     borderColor: "#ccc",
  //     borderWidth: 1,
  //     borderRadius: 8,
  //     paddingHorizontal: 10,
  //     marginBottom: 10,
  //     fontSize: 16,
  //   },
  //   errorText: {
  //     color: "red",
  //     marginBottom: 10,
  //     textAlign: "center",
  //   },
  //   modalButtonsContainer: {
  //     flexDirection: "row",
  //     justifyContent: "space-between",
  //     width: "100%",
  //   },
  //   modalButton: {
  //     backgroundColor: "#007BFF",
  //     paddingVertical: 12,
  //     paddingHorizontal: 20,
  //     borderRadius: 8,
  //     alignItems: "center",
  //     flex: 1,
  //     marginHorizontal: 5,
  //   },
  //   cancelButton: {
  //     backgroundColor: "#6c757d",
  //   },
  //   modalButtonText: {
  //     color: "#FFFFFF",
  //     fontSize: 16,
  //   },
});

export default BidModal;
