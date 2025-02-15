import React from "react";
import { View, Text, StyleSheet } from "react-native";

const InsertIncomesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Schermata di Inserimento Entrate</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});

export default InsertIncomesScreen;
