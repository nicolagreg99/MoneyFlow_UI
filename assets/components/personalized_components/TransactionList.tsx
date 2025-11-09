import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { getCurrencyFlag } from "../personalized_components/CurrencyPicker";

const TransactionList = ({
  transactions,
  onClose,
  onDelete,
  onEdit,
  transactionType,
}) => {
  const [sortedTransactions, setSortedTransactions] = useState([]);
  const [sortKey, setSortKey] = useState("giorno");
  const [sortOrder, setSortOrder] = useState("desc");

  const navigation = useNavigation();

  useEffect(() => {
    setSortedTransactions(sortTransactions(transactions, sortKey, sortOrder));
  }, [transactions, sortKey, sortOrder]);

  const sortTransactions = (data, key, order) => {
    if (!key) return data;
    return [...data].sort((a, b) => {
      let valueA = a[key] ?? "";
      let valueB = b[key] ?? "";

      // Se l'ordinamento è per "valore", usiamo sempre il valore convertito
      if (key === "valore") {
        valueA = parseFloat(a.converted_value ?? a.valore ?? 0);
        valueB = parseFloat(b.converted_value ?? b.valore ?? 0);
        return order === "asc" ? valueA - valueB : valueB - valueA;
      }

      // Se si ordina per "converted_value", stesso comportamento
      if (key === "converted_value") {
        valueA = parseFloat(valueA) || 0;
        valueB = parseFloat(valueB) || 0;
        return order === "asc" ? valueA - valueB : valueB - valueA;
      }

      // Se si ordina per data
      if (key === "giorno") {
        const dateA = new Date(a.giorno);
        const dateB = new Date(b.giorno);
        return order === "asc" ? dateA - dateB : dateB - dateA;
      }

      // Altri campi testuali (descrizione, tipo, ecc.)
      valueA = valueA.toString().toLowerCase();
      valueB = valueB.toString().toLowerCase();
      return order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
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

  const handleDelete = (id, descrizione, valore, tipo, currency) => {
    const message = `
Descrizione: ${descrizione || "Senza descrizione"}
Valore: ${valore} ${currency || ""}
Tipo: ${tipo || "N/D"}

❗ Questa operazione è irreversibile. Procedere con l'eliminazione?
    `.trim();

    Alert.alert(
      "Conferma Eliminazione",
      message,
      [
        { text: "Annulla", style: "cancel" },
        { text: "Elimina", onPress: () => onDelete(id), style: "destructive" },
      ],
      { cancelable: true }
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/D";
    const date = new Date(dateString);
    if (isNaN(date)) return "N/D";
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
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
                  style={[styles.headerCell, { flex: key === "valore" ? 2 : 2 }]}
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
          renderItem={({ item }) => {
            const origFlag = getCurrencyFlag(item.currency);
            const userFlag = getCurrencyFlag(item.user_currency);

            return (
              <View style={styles.row}>
                <Text style={[styles.cell, { flex: 2 }]}>
                  {item.descrizione || "N/D"}
                </Text>
                <Text style={[styles.cell, { flex: 2 }]}>
                  {item.tipo || "N/D"}
                </Text>

                <View style={[styles.valueContainer, { flex: 2 }]}>
                  <Text style={styles.valueText}>
                    {origFlag} {parseFloat(item.valore).toLocaleString()} {item.currency}
                  </Text>

                  {item.currency !== item.user_currency && (
                    <Text style={styles.convertedText}>
                      ≈ {userFlag} {parseFloat(item.converted_value).toLocaleString()}{" "}
                      {item.user_currency}
                    </Text>
                  )}
                </View>

                <Text style={[styles.cell, { flex: 1.4 }]}>{formatDate(item.giorno)}</Text>

                <View style={{ flexDirection: "row", flex: 1, justifyContent: "space-around" }}>
                  <TouchableOpacity onPress={() => handleEdit(item)}>
                    <Icon name="pencil" size={15} color="#007bff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      handleDelete(
                        item.id,
                        item.descrizione,
                        item.valore,
                        item.tipo,
                        item.currency
                      )
                    }
                  >
                    <Icon name="trash" size={15} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
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
    fontSize: 19,
    fontWeight: "bold",
    color: "#1E3A8A",
    textAlign: "center",
    marginBottom: 10,
  },
  noTransactionsText: {
    fontSize: 15,
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
    fontSize: 11,
    fontWeight: "bold",
    color: "#007bff",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 6,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  cell: {
    fontSize: 12,
    color: "#444",
    textAlign: "center",
  },
  valueContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  valueText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#222",
  },
  convertedText: {
    fontSize: 11,
    color: "#777",
  },
  closeButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: "#007bff",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
});

export default TransactionList;
