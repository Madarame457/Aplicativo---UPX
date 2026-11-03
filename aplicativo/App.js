import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>♻️ EcoQuest</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#081c15', alignItems: 'center', justifyContent: 'center' },
  titulo: { color: '#fff', fontSize: 32, fontWeight: '800' }
});
