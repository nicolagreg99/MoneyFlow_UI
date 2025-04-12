import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

const TransactionList = ({ transactions, onClose, onDelete, onEdit, transactionType }) => {
  const [sortedTransactions, setSortedTransactions] = useState([]);
  const [sortKey, setSortKey] = useState("giorno");
  const [sortOrder, setSortOrder] = useState("desc");  
  const [editingTransaction, setEditingTransaction] = useState(null);

  const navigation = useNavigation();

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
        return order === "asc" ? valueA - valueB : valueB - valueA;
      }

      valueA = valueA.toString().toLowerCase();
      valueB = valueB.toString().toLowerCase();
      return order === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
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

  const handleDelete = (id) => {
    Alert.alert(
      "Conferma Eliminazione",
      "Sei sicuro di voler eliminare questa transazione?",
      [
        { text: "Annulla", style: "cancel" },
        { text: "Elimina", onPress: () => onDelete(id), style: "destructive" },
      ]
    );
  };

  const handleEdit = (transaction) => {
    onClose();
    setTimeout(() => {
      if (transactionType === "entrata") {
        navigation.navigate("EditIncomes", { income: transaction });
      } else {
        navigation.navigate("EditExpenses", { expense: transaction });
      }
    }, 300);
  };
  

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const handleSaveEdit = async (updatedTransaction) => {
    await onEdit(updatedTransaction);
    setEditingTransaction(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/D";
    const date = new Date(dateString);
    return isNaN(date) ? "N/D" : date.toLocaleDateString("it-IT");
  };

  const renderSortIcon = (key) => (
    <Icon
      name={sortKey === key ? (sortOrder === "asc" ? "sort-up" : "sort-down") : "sort"}
      size={12}
      color={sortKey === key ? "#007bff" : "#aaa"}
      style={{ marginLeft: 5 }}
    />
  );

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
              {["descrizione", "tipo", "valore", "giorno"].map((key, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.headerCell, { flex: key === "valore" ? 1.5 : 2 }]}
                  onPress={() => handleSort(key)}
                >
                  <Text style={styles.headerText}>
                    {key.charAt(0).toUpperCase() + key.slice(1)} {renderSortIcon(key)}
                  </Text>
                </TouchableOpacity>
              ))}
              <View style={[styles.headerCell, { flex: 1 }]}>
                <Text style={styles.headerText}>Azioni</Text>
              </View>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={[styles.cell, { flex: 2 }]}>{item.descrizione || "N/D"}</Text>
              <Text style={[styles.cell, { flex: 2 }]}>{item.tipo || "N/D"}</Text>
              <Text style={[styles.cell, { flex: 1.5 }]}>€{parseFloat(item.valore).toFixed(2)}</Text>
              <Text style={[styles.cell, { flex: 2 }]}>{formatDate(item.giorno)}</Text>
              <View style={{ flexDirection: "row", flex: 1, justifyContent: "space-around" }}>
                <TouchableOpacity onPress={() => handleEdit(item)}>
                  <Icon name="pencil" size={16} color="#007bff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Icon name="trash" size={16} color="red" />
                </TouchableOpacity>
              </View>
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
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E3A8A",
    textAlign: "center",
    marginBottom: 10,
  },
  noTransactionsText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 12,
  },
  headerRow: {
    flexDirection: "row",
    paddingVertical: 6,
    backgroundColor: "#e3e3e3",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  headerCell: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#007bff",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  cell: {
    fontSize: 13,
    color: "#444",
    textAlign: "center",
  },
  iconButton: {
    flex: 1,
    alignItems: "center",
    padding: 4,
  },
  closeButton: {
    marginTop: 12,
    padding: 8,
    backgroundColor: "#007bff",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default TransactionList;
