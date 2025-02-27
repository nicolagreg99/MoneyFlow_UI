import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const TransactionList = ({ transactions, onClose }) => {
  const [sortedTransactions, setSortedTransactions] = useState([]);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  useEffect(() => {
    setSortedTransactions(sortTransactions(transactions, sortKey, sortOrder));
  }, [transactions, sortKey, sortOrder]);

  const sortTransactions = (data, key, order) => {
    if (!key) return data;

    return [...data].sort((a, b) => {
      let valueA = a[key] ?? "";
      let valueB = b[key] ?? "";

      if (key === "valore") {
        valueA = parseFloat(valueA) || 0;
        valueB = parseFloat(valueB) || 0;
      } else {
        if (typeof valueA === "string") valueA = valueA.toLowerCase();
        if (typeof valueB === "string") valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) return order === "asc" ? -1 : 1;
      if (valueA > valueB) return order === "asc" ? 1 : -1;
      return 0;
    });
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/D";
    const date = new Date(dateString);
    return isNaN(date) ? "N/D" : date.toLocaleDateString("it-IT");
  };

  const renderSortIcon = (key) => {
    if (sortKey === key) {
      return <Icon name={sortOrder === "asc" ? "sort-up" : "sort-down"} size={12} color="#007bff" style={{ marginLeft: 5 }} />;
    }
    return <Icon name="sort" size={12} color="#aaa" style={{ marginLeft: 5 }} />;
  };

  return (
    <View style={styles.modalContent}>
      <Text style={styles.title}>Lista Transazioni</Text>

      {sortedTransactions.length === 0 ? (
        <Text style={styles.noTransactionsText}>Nessuna transazione trovata.</Text>
      ) : (
        <FlatList
          data={sortedTransactions}
          keyExtractor={(item) => item.id?.toString()}
          ListHeaderComponent={() => (
            <View style={styles.headerRow}>
              <TouchableOpacity style={[styles.headerCell, { flex: 2 }]} onPress={() => handleSort("descrizione")}>
                <Text style={styles.headerText}>Descrizione {renderSortIcon("descrizione")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.headerCell, { flex: 2 }]} onPress={() => handleSort("tipo")}>
                <Text style={styles.headerText}>Tipo {renderSortIcon("tipo")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.headerCell, { flex: 1.5 }]} onPress={() => handleSort("valore")}>
                <Text style={styles.headerText}>Valore {renderSortIcon("valore")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.headerCell, { flex: 2 }]} onPress={() => handleSort("giorno")}>
                <Text style={styles.headerText}>Data {renderSortIcon("giorno")}</Text>
              </TouchableOpacity>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={[styles.cell, { flex: 2 }]}>{item.descrizione || "N/D"}</Text>
              <Text style={[styles.cell, { flex: 2 }]}>{item.tipo || "N/D"}</Text>
              <Text style={[styles.cell, { flex: 1.5 }]}>€{parseFloat(item.valore).toFixed(2)}</Text>
              <Text style={[styles.cell, { flex: 2 }]}>{formatDate(item.giorno)}</Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Chiudi</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E3A8A",
    textAlign: "center",
    marginBottom: 15,
  },
  noTransactionsText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    paddingVertical: 12,
    backgroundColor: "#e8e8e8",
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  headerCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007bff",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  cell: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#007bff",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default TransactionList;
