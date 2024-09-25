import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button} from 'react-native';
import GoogleSignIn from './GoogleSignIn';
export function formatMoney(amount, locale = 'en-US', currency = 'USD') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2, // Ensures two decimal places
    maximumFractionDigits: 2, // Ensures two decimal places
  }).format(amount);
}
// import React from 'react';
// import MainApp from './MainApp';

// export default function App() {
//   return (
//     <AuthProvider>
//       <MainApp />
//     </AuthProvider>
//   );
// }

export default function App() {
  const nextBid = 100;
  const currentBid = 50;
  return (
    <View style={styles.container}>
      <Text>Current bid {formatMoney(currentBid)}</Text>
      <Button> Bid {formatMoney(nextBid)} </Button>
      <StatusBar style="auto" />
      <GoogleSignIn />
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
});
