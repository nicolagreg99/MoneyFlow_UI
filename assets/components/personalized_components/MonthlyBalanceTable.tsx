import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useTranslation } from "react-i18next";
import { formatMonth } from "./formatMonth";

type SortKey = "month" | "balance" | "income" | "expense";

interface BalanceItem {
  month: string; // "2025-03"
  income: number;
  expense: number;
  balance: number;
  cumulative?: number;
}

interface MonthlyBalanceTableProps {
  balances: BalanceItem[];
  currency: string;
}

const money = (v: number | undefined | null) => (Number(v) || 0).toFixed(2);

const MonthlyBalanceTable: React.FC<MonthlyBalanceTableProps> = ({
  balances,
  currency,
}) => {
  const { t } = useTranslation();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortKey, setSortKey] = useState<SortKey>("month");

  const sortedData = useMemo(() => {
    const data = (balances ?? []).filter((b) => typeof b?.month === "string");
    return [...data].sort((a, b) => {
      let cmp: number;
      if (sortKey === "month") {
        // "YYYY-MM" si ordina correttamente come stringa
        cmp = a.month.localeCompare(b.month);
      } else {
        cmp = (Number(a[sortKey]) || 0) - (Number(b[sortKey]) || 0);
      }
      return sortOrder === "asc" ? cmp : -cmp;
    });
  }, [balances, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (key: SortKey) => (
    <Icon
      name={
        sortKey === key
          ? sortOrder === "asc"
            ? "sort-up"
            : "sort-down"
          : "sort"
      }
      size={14}
      color={sortKey === key ? "#007bff" : "#ccc"}
      style={{ marginLeft: 6 }}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 {t("monthly_balances")}</Text>

      <View style={styles.table}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.headerCell}
            onPress={() => handleSort("month")}
          >
            <Text style={styles.headerText}>
              {t("month")} {renderSortIcon("month")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerCell}
            onPress={() => handleSort("income")}
          >
            <Text style={styles.headerText}>
              {t("incomes")} {renderSortIcon("income")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerCell}
            onPress={() => handleSort("expense")}
          >
            <Text style={styles.headerText}>
              {t("expenses")} {renderSortIcon("expense")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerCell}
            onPress={() => handleSort("balance")}
          >
            <Text style={styles.headerText}>
              {t("balance")} {renderSortIcon("balance")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Rows */}
        {sortedData.map((item, index) => (
          <View
            key={`${item.month}-${index}`}
            style={[styles.row, index % 2 === 0 && styles.rowAlternate]}
          >
            <Text style={styles.cell}>{formatMonth(item.month, t)}</Text>

            <Text
              style={[
                styles.cell,
                { color: "#27ae60", textAlign: "right" },
              ]}
            >
              {currency} {money(item.income)}
            </Text>

            <Text
              style={[
                styles.cell,
                { color: "#c0392b", textAlign: "right" },
              ]}
            >
              {currency} {money(item.expense)}
            </Text>

            <Text
              style={[
                styles.cell,
                {
                  textAlign: "right",
                  fontWeight: "bold",
                  color: (Number(item.balance) || 0) >= 0 ? "#27ae60" : "#c0392b",
                },
              ]}
            >
              {currency} {money(item.balance)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 12,
    textAlign: "center",
    color: "#2c3e50",
  },
  table: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f0f4f7",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerCell: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#34495e",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
    alignItems: "center",
  },
  rowAlternate: {
    backgroundColor: "#fafafa",
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: "center",
  },
});

export default MonthlyBalanceTable;