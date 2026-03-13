import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { titulo } from './util';
import titulo_default from './util'

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{titulo}</Text>
      <Text style = {styles.titulo_text} > {titulo_default}</Text>
      <Button title = 'Butao'/> 
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
  titulo_text: {
    margin: 30, 
    color: '#d82727ff',
    fontSize: 30,

  }
});
