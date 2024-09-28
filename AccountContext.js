import React, { createContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import GoogleSignIn from "./GoogleSignIn"; // Ensure this path is correct
import { app } from "./firebaseConfig";

// Create the context
export const AccountContext = createContext();

// Create the provider component
export const AccountProvider = ({ children }) => {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  if (authLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <GoogleSignIn />;
  }
  console.log("USER: ", user);

  return (
    <AccountContext.Provider value={{ user }}>
      {children}
    </AccountContext.Provider>
  );
};

// Optional: Add some basic styles
import { StyleSheet, View, ActivityIndicator } from "react-native";

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
