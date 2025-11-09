import React, { useState } from "react";
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

// --- Lista valute ---
export const currencies = [
  { code: "AED", name: "Dirham degli Emirati Arabi", flag: "🇦🇪" },
  { code: "ALL", name: "Lek Albanese", flag: "🇦🇱" },
  { code: "ARS", name: "Peso Argentino", flag: "🇦🇷" },
  { code: "AUD", name: "Dollaro Australiano", flag: "🇦🇺" },
  { code: "BGN", name: "Lev Bulgaro", flag: "🇧🇬" },
  { code: "BRL", name: "Real Brasiliano", flag: "🇧🇷" },
  { code: "CAD", name: "Dollaro Canadese", flag: "🇨🇦" },
  { code: "CHF", name: "Franco Svizzero", flag: "🇨🇭" },
  { code: "CNY", name: "Yuan Cinese", flag: "🇨🇳" },
  { code: "CZK", name: "Corona Ceca", flag: "🇨🇿" },
  { code: "DKK", name: "Corona Danese", flag: "🇩🇰" },
  { code: "DZD", name: "Dinaro Algerino", flag: "🇩🇿" },
  { code: "EGP", name: "Sterlina Egiziana", flag: "🇪🇬" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "Sterlina Britannica", flag: "🇬🇧" },
  { code: "HRK", name: "Kuna Croata", flag: "🇭🇷" },
  { code: "HUF", name: "Fiorino Ungherese", flag: "🇭🇺" },
  { code: "INR", name: "Rupia Indiana", flag: "🇮🇳" },
  { code: "ISK", name: "Corona Islandese", flag: "🇮🇸" },
  { code: "JPY", name: "Yen Giapponese", flag: "🇯🇵" },
  { code: "MAD", name: "Dirham Marocchino", flag: "🇲🇦" },
  { code: "MXN", name: "Peso Messicano", flag: "🇲🇽" },
  { code: "NOK", name: "Corona Norvegese", flag: "🇳🇴" },
  { code: "PLN", name: "Zloty Polacco", flag: "🇵🇱" },
  { code: "RON", name: "Leu Rumeno", flag: "🇷🇴" },
  { code: "RSD", name: "Dinaro Serbo", flag: "🇷🇸" },
  { code: "RUB", name: "Rublo Russo", flag: "🇷🇺" },
  { code: "SAR", name: "Riyal Saudita", flag: "🇸🇦" },
  { code: "SEK", name: "Corona Svedese", flag: "🇸🇪" },
  { code: "TRY", name: "Lira Turca", flag: "🇹🇷" },
  { code: "USD", name: "Dollaro Statunitense", flag: "🇺🇸" },
  { code: "ZAR", name: "Rand Sudafricano", flag: "🇿🇦" },
].sort((a, b) => a.code.localeCompare(b.code));

export const getCurrencyFlag = (code: string): string => {
  const currency = currencies.find((c) => c.code === code);
  return currency ? currency.flag : "💱";
};

// --- Props ---
interface CurrencyPickerProps {
  currency: string;
  setCurrency: (code: string) => void;
  label?: string;
  compactMode?: boolean; // ✅ nuova prop per modalità compatta
}

// --- Componente ---
const CurrencyPicker: React.FC<CurrencyPickerProps> = ({
  currency,
  setCurrency,
  label = "Valuta",
  compactMode = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");

  const filteredCurrencies = currencies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
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
            <Text style={styles.modalTitle}>Seleziona valuta</Text>

            <TextInput
              style={styles.searchInput}
              placeholder="Cerca..."
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
                    {item.flag} {item.name} ({item.code})
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
              <Text style={styles.modalCloseText}>Chiudi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

// --- Stili ---
const styles = StyleSheet.create({
  // --- MODAL ---
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
  // --- VERSIONE STANDARD ---
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
  // --- VERSIONE COMPATTA ---
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
