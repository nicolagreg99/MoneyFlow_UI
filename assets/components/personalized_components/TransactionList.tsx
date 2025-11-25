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
import { useTranslation } from "react-i18next";

const TransactionList = ({
  transactions,
  onClose,
  onDelete,
  onEdit,
  transactionType,
}) => {
  const { t } = useTranslation();
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

      if (key === "valore") {
        valueA = parseFloat(a.converted_value ?? a.valore ?? 0);
        valueB = parseFloat(b.converted_value ?? b.valore ?? 0);
        return order === "asc" ? valueA - valueB : valueB - valueA;
      }

      if (key === "converted_value") {
        valueA = parseFloat(valueA) || 0;
        valueB = parseFloat(valueB) || 0;
        return order === "asc" ? valueA - valueB : valueB - valueA;
      }

      if (key === "giorno") {
        const dateA = new Date(a.giorno);
        const dateB = new Date(b.giorno);
        return order === "asc" ? dateA - dateB : dateB - dateA;
      }

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
${t("description")}: ${descrizione || t("not_available")}
${t("value")}: ${valore} ${currency || ""}
${t("type")}: ${tipo || t("not_available")}

${t("delete_warning")}
    `.trim();

    Alert.alert(
      t("delete_confirm_title"),
      message,
      [
        { text: t("cancel"), style: "cancel" },
        { text: t("delete"), onPress: () => onDelete(id), style: "destructive" },
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
    if (!dateString) return t("not_available");
    const date = new Date(dateString);
    if (isNaN(date)) return t("not_available");
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
      <Text style={styles.title}>{t("transaction_list")}</Text>

      {sortedTransactions.length === 0 ? (
        <Text style={styles.noTransactionsText}>{t("no_transactions_found")}</Text>
      ) : (
        <FlatList
          data={sortedTransactions}
          keyExtractor={(item) => item.id?.toString()}
          ListHeaderComponent={() => (
            <View style={styles.headerRow}>
              {[
                { key: "descrizione", label: t("description") },
                { key: "tipo", label: t("type") },
                { key: "valore", label: t("value") },
                { key: "giorno", label: t("date") },
              ].map((col, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.headerCell, { flex: col.key === "valore" ? 2 : 2 }]}
                  onPress={() => handleSort(col.key)}
                >
                  <Text style={styles.headerText}>
                    {col.label} {renderSortIcon(col.key)}
                  </Text>
                </TouchableOpacity>
              ))}

              <View style={[styles.headerCell, { flex: 1 }]}>
                <Text style={styles.headerText}>{t("actions")}</Text>
              </View>
            </View>
          )}
          renderItem={({ item }) => {
            const origFlag = getCurrencyFlag(item.currency);
            const userFlag = getCurrencyFlag(item.user_currency);

            return (
              <View style={styles.row}>
                <Text style={[styles.cell, { flex: 2 }]}>
                  {item.descrizione || t("not_available")}
                </Text>
                <Text style={[styles.cell, { flex: 2 }]}>
                  {item.tipo || t("not_available")}
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
        <Text style={styles.closeButtonText}>{t("close")}</Text>
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
