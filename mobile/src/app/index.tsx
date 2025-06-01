import { View, Text, StyleSheet, Alert} from "react-native";
import {Button} from "../components/Button/Index";
export default function Index() {
  function handleMenssage() {
    Alert.alert("Hello World!!!");
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World!!!</Text>
      <Button title="Entrar"/>
      <Button title="Sair"/>
      <Button title="Logar"/>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  title: {
    color: "blue",
    fontSize: 24,
  },
});
