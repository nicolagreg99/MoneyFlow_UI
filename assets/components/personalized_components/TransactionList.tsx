import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const TransactionList = ({ transactions, onClose }) => {
  return (
    <View style={styles.modalContent}>
      <Text style={styles.title}>Lista Transazioni</Text>

      {/* Tabella delle transazioni */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id?.toString()}
        ListHeaderComponent={() => (
          <View style={styles.headerRow}>
            <Text style={[styles.headerCell, { flex: 2 }]}>Descrizione</Text>
            <Text style={[styles.headerCell, { flex: 2 }]}>Tipo</Text>
            <Text style={[styles.headerCell, { flex: 1 }]}>Valore</Text>
            <Text style={[styles.headerCell, { flex: 2 }]}>Data</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={[styles.cell, { flex: 2 }]}>{item.descrizione || "N/D"}</Text>
            <Text style={[styles.cell, { flex: 2 }]}>{item.tipo || "N/D"}</Text>
            <Text style={[styles.cell, { flex: 1 }]}>€{parseFloat(item.valore).toFixed(2)}</Text>
            <Text style={[styles.cell, { flex: 2 }]}>{item.giorno || "N/D"}</Text>
          </View>
        )}
      />

      {/* Pulsante Chiudi */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Chiudi</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  headerRow: {
    flexDirection: "row",
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerCell: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  cell: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TransactionList;