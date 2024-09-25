import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { formatMoney } from 'utils.ts'

export default function App() {
  const nextBid = 100;
  const currentBid = 50;
  return (
    <View style={styles.container}>
      <Text>Current bid {formatMoney(currentBid)}</Text>
      <Button> Bid {formatMoney(nextBid)} </Button>
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
});
