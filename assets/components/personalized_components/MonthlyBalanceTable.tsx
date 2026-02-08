import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useTranslation } from "react-i18next";

type SortKey = "mese" | "valore" | "entrate" | "spese";

interface BalanceItem {
  mese: string; // es: "January 2025"
  entrate: number;
  spese: number;
  valore: number;
}

interface MonthlyBalanceTableProps {
  balances: BalanceItem[];
  currency: string;
}

const MonthlyBalanceTable: React.FC<MonthlyBalanceTableProps> = ({
  balances,
  currency,
}) => {
  const { t } = useTranslation();
  const [sortedData, setSortedData] = useState<BalanceItem[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortKey, setSortKey] = useState<SortKey>("mese");

  useEffect(() => {
    const sorted = sortBalances(balances, sortKey, sortOrder);
    setSortedData(sorted);
  }, [balances, sortKey, sortOrder]);

  // Parsing mese + anno (basato sulle traduzioni correnti)
  const parseDateKey = (str: string): Date => {
    const [mese, anno] = str.split(" ");

    const mesi = [
      t("january"),
      t("february"),
      t("march"),
      t("april"),
      t("may"),
      t("june"),
      t("july"),
      t("august"),
      t("september"),
      t("october"),
      t("november"),
      t("december"),
    ];

    const monthIndex = mesi.indexOf(mese);

    return new Date(
      parseInt(anno, 10),
      monthIndex === -1 ? 0 : monthIndex
    );
  };

  const sortBalances = (
    data: BalanceItem[],
    key: SortKey,
    order: "asc" | "desc"
  ) => {
    return [...data].sort((a, b) => {
      if (key === "mese") {
        const dateA = parseDateKey(a.mese);
        const dateB = parseDateKey(b.mese);

        return order === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }

      return order === "asc" ? a[key] - b[key] : b[key] - a[key];
    });
  };

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
            onPress={() => handleSort("mese")}
          >
            <Text style={styles.headerText}>
              {t("month")} {renderSortIcon("mese")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerCell}
            onPress={() => handleSort("entrate")}
          >
            <Text style={styles.headerText}>
              {t("incomes")} {renderSortIcon("entrate")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerCell}
            onPress={() => handleSort("spese")}
          >
            <Text style={styles.headerText}>
              {t("expenses")} {renderSortIcon("spese")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerCell}
            onPress={() => handleSort("valore")}
          >
            <Text style={styles.headerText}>
              {t("balance")} {renderSortIcon("valore")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Rows */}
        {sortedData.map((item, index) => (
          <View
            key={`${item.mese}-${index}`}
            style={[styles.row, index % 2 === 0 && styles.rowAlternate]}
          >
            <Text style={styles.cell}>{item.mese}</Text>

            <Text
              style={[
                styles.cell,
                { color: "#27ae60", textAlign: "right" },
              ]}
            >
              {currency} {item.entrate.toFixed(2)}
            </Text>

            <Text
              style={[
                styles.cell,
                { color: "#c0392b", textAlign: "right" },
              ]}
            >
              {currency} {item.spese.toFixed(2)}
            </Text>

            <Text
              style={[
                styles.cell,
                {
                  textAlign: "right",
                  fontWeight: "bold",
                  color: item.valore >= 0 ? "#27ae60" : "#c0392b",
                },
              ]}
            >
              {currency} {item.valore.toFixed(2)}
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
