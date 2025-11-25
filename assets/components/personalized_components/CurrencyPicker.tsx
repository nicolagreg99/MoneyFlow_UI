import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Lista delle valute con i relativi codici e bandiere
export const currencies = [
  { code: "AED", flag: "🇦🇪" },
  { code: "ALL", flag: "🇦🇱" },
  { code: "ARS", flag: "🇦🇷" },
  { code: "AUD", flag: "🇦🇺" },
  { code: "BGN", flag: "🇧🇬" },
  { code: "BRL", flag: "🇧🇷" },
  { code: "CAD", flag: "🇨🇦" },
  { code: "CHF", flag: "🇨🇭" },
  { code: "CNY", flag: "🇨🇳" },
  { code: "CZK", flag: "🇨🇿" },
  { code: "DKK", flag: "🇩🇰" },
  { code: "DZD", flag: "🇩🇿" },
  { code: "EGP", flag: "🇪🇬" },
  { code: "EUR", flag: "🇪🇺" },
  { code: "GBP", flag: "🇬🇧" },
  { code: "HRK", flag: "🇭🇷" },
  { code: "HUF", flag: "🇭🇺" },
  { code: "INR", flag: "🇮🇳" },
  { code: "ISK", flag: "🇮🇸" },
  { code: "JPY", flag: "🇯🇵" },
  { code: "MAD", flag: "🇲🇦" },
  { code: "MXN", flag: "🇲🇽" },
  { code: "NOK", flag: "🇳🇴" },
  { code: "PLN", flag: "🇵🇱" },
  { code: "RON", flag: "🇷🇴" },
  { code: "RSD", flag: "🇷🇸" },
  { code: "RUB", flag: "🇷🇺" },
  { code: "SAR", flag: "🇸🇦" },
  { code: "SEK", flag: "🇸🇪" },
  { code: "TRY", flag: "🇹🇷" },
  { code: "USD", flag: "🇺🇸" },
  { code: "ZAR", flag: "🇿🇦" },
].sort((a, b) => a.code.localeCompare(b.code));

// Funzione esportata per ottenere la bandiera di una valuta
export const getCurrencyFlag = (code: string): string => {
  const currency = currencies.find((c) => c.code === code);
  return currency ? currency.flag : "💱";
};

const CurrencyPicker = ({ currency, setCurrency, label = "Valuta", compactMode = false }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");

  // Filtro le valute in base alla ricerca
  const filteredCurrencies = currencies.filter(
    (c) =>
      t(`currency_${c.code}`).toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Bottone principale */}
      <TouchableOpacity
        style={compactMode ? styles.compactButton : styles.currencyContainerSmall}
        onPress={() => setVisible(true)}
      >
        {compactMode ? (
          <Text style={styles.compactText}>
            {getCurrencyFlag(currency)} {currency}
          </Text>
        ) : (
          <>
            <Text style={styles.currencyLabelSmall}>{label}</Text>
            <View style={styles.currencyDisplaySmall}>
              <Text style={styles.currencyValueSmall}>
                {getCurrencyFlag(currency)} {currency}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#16A085" />
            </View>
          </>
        )}
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t("select_currency")}</Text>

            <TextInput
              style={styles.searchInput}
              placeholder={t("search_placeholder")}
              value={search}
              onChangeText={setSearch}
            />

            <FlatList
              data={filteredCurrencies}
              keyExtractor={(item) => item.code}
              style={{ maxHeight: 300, width: "100%" }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.currencyItem}
                  onPress={() => {
                    setCurrency(item.code);
                    setVisible(false);
                    setSearch("");
                  }}
                >
                  <Text style={styles.currencyItemText}>
                    {item.flag} {t(`currency_${item.code}`)} ({item.code})
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => {
                setVisible(false);
                setSearch("");
              }}
            >
              <Text style={styles.modalCloseText}>{t("close")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

// --- Stili ---
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "85%",
    maxHeight: "70%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#16A085",
    marginBottom: 12,
    textAlign: "center",
  },
  searchInput: {
    width: "100%",
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
    marginBottom: 12,
  },
  currencyItem: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  currencyItemText: {
    fontSize: 15,
    color: "#333",
    textAlign: "left",
  },
  modalCloseButton: {
    marginTop: 10,
    backgroundColor: "#16A085",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "center",
  },
  modalCloseText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  currencyContainerSmall: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    backgroundColor: "#f4f6f7",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e1e5e9",
    marginTop: 10,
  },
  currencyLabelSmall: {
    fontSize: 13,
    color: "#666",
  },
  currencyDisplaySmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  currencyValueSmall: {
    fontSize: 14,
    color: "#16A085",
    fontWeight: "bold",
  },
  compactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  compactText: {
    fontSize: 14,
    color: "#16A085",
    fontWeight: "600",
  },
});

export default CurrencyPicker;