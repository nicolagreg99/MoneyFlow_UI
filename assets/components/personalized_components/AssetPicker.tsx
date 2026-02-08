import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Modal,
  FlatList,
  Image,
} from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import API from "../../../config/api";
import { useTranslation } from "react-i18next";

// Importa le valute dal CurrencyPicker
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

// Loghi delle banche
const bankLogos: { [key: string]: any } = {
  revolut: require("../../../assets/banks/revolut.png"),
  mediolanum: require("../../../assets/banks/mediolanum.png"),
  traderepublic: require("../../../assets/banks/trade_republic.png"),
  bbva: require("../../../assets/banks/bbva.png"),
  poste: require("../../../assets/banks/poste.png"),
  intesa: require("../../../assets/banks/intesa.png"),
};

interface Asset {
  id: number;
  bank: string;
  asset_type: string;
  currency: string;
  amount: string;
  is_payable: boolean;
}

interface AssetPickerProps {
  selectedAsset: number | null;
  setSelectedAsset: (id: number | null) => void;
  hasError?: boolean;
  authToken: string | null;
}

const AssetPicker = forwardRef<{ reloadAssets: () => void }, AssetPickerProps>(
  ({ selectedAsset, setSelectedAsset, hasError = false, authToken }, ref) => {
    const { t } = useTranslation();
    const [payableAssets, setPayableAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
      loadPayableAssets();
    }, [authToken]);

    const loadPayableAssets = async () => {
      if (!authToken) return;

      setLoading(true);
      try {
        const response = await axios.get(
          `${API.BASE_URL}/api/v1/assets/list?is_payable=true`,
          {
            headers: {
              "x-access-token": authToken,
            },
          }
        );
        // Correzione: accedi a response.data.assets invece di response.data
        setPayableAssets(response.data.assets || []);
      } catch (error) {
        console.error("Errore nel caricamento degli asset:", error);
        Toast.show({
          type: "error",
          text1:
            t("error_loading_assets") || "Errore nel caricamento degli asset",
        });
      } finally {
        setLoading(false);
      }
    };

    // Esponi la funzione reloadAssets tramite ref
    useImperativeHandle(ref, () => ({
      reloadAssets: loadPayableAssets,
    }));

    const getCurrencyFlag = (currencyCode: string) => {
      const currency = currencies.find((c) => c.code === currencyCode);
      return currency ? currency.flag : "💰";
    };

    const getBankLogo = (bankName: string) => {
      const bankKey = bankName.toLowerCase().replace(/\s+/g, "");
      return bankLogos[bankKey];
    };

    const getSelectedAssetLabel = () => {
      if (!selectedAsset) {
        return t("select_payment_asset") || "Seleziona asset";
      }

      const asset = payableAssets.find((a) => a.id === selectedAsset);
      if (!asset) {
        // Se l'asset è selezionato ma non è ancora nella lista (loading)
        if (loading) {
          return t("loading") || "Caricamento...";
        }
        // Se non sta caricando ma non trova l'asset, mostra l'ID
        return `Asset #${selectedAsset}`;
      }

      return `${asset.bank} - ${parseFloat(asset.amount).toFixed(2)} ${getCurrencyFlag(
        asset.currency
      )}`;
    };

    const renderAssetItem = ({ item }: { item: Asset }) => {
      const logo = getBankLogo(item.bank);
      const isSelected = selectedAsset === item.id;

      return (
        <TouchableOpacity
          style={styles.assetOptionRow}
          onPress={() => {
            setSelectedAsset(item.id);
            setModalVisible(false);
          }}
          activeOpacity={0.7}
        >
          <View style={styles.assetOptionContent}>
            <View style={styles.assetIconContainer}>
              {logo ? (
                <Image
                  source={logo}
                  style={styles.bankLogo}
                  resizeMode="contain"
                />
              ) : (
                <MaterialIcons
                  name="account-balance"
                  size={24}
                  color={isSelected ? "#3498DB" : "#7F8C8D"}
                />
              )}
            </View>
            <View style={styles.assetTextContainer}>
              <Text style={styles.assetBankName}>{item.bank}</Text>
              <Text style={styles.assetAmount}>
                {parseFloat(item.amount).toFixed(2)}{" "}
                {getCurrencyFlag(item.currency)}
              </Text>
            </View>
            {isSelected && (
              <Feather name="check-circle" size={22} color="#3498DB" />
            )}
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.assetPickerButton, hasError && styles.errorInput]}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons
              name="account-balance-wallet"
              size={18}
              color="#3498DB"
              style={{ marginRight: 8 }}
            />
            <Text
              style={[
                styles.assetPickerText,
                !selectedAsset && styles.placeholderText,
              ]}
            >
              {getSelectedAssetLabel()}
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color="#3498DB" />
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                {t("select_payment_asset") || "Seleziona metodo di pagamento"}
              </Text>

              {loading ? (
                <ActivityIndicator size="large" color="#3498DB" />
              ) : payableAssets.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                  <MaterialIcons
                    name="account-balance-wallet"
                    size={48}
                    color="#D1D5DB"
                  />
                  <Text style={styles.noAssetsText}>
                    {t("no_payable_assets") ||
                      "Nessun asset disponibile per il pagamento"}
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={payableAssets}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderAssetItem}
                />
              )}

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCloseText}>
                  {t("close") || "Chiudi"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
);

const PRIMARY = "#2C3E50";
const ACCENT = "#3498DB";
const DANGER = "#E53935";
const SURFACE = "#FFFFFF";
const PLACEHOLDER = "#95A5A6";

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },

  assetPickerButton: {
    backgroundColor: SURFACE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D6E0F0",
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },

  errorInput: {
    borderColor: DANGER,
  },

  assetPickerText: {
    fontSize: 16,
    color: PRIMARY,
    fontWeight: "500",
    flex: 1,
  },

  placeholderText: {
    color: PLACEHOLDER,
    fontWeight: "400",
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: SURFACE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: PRIMARY,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },

  assetOptionRow: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  assetOptionContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  assetIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F5F7FB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    overflow: "hidden",
  },

  bankLogo: {
    width: 36,
    height: 36,
  },

  assetTextContainer: {
    flex: 1,
  },

  assetBankName: {
    fontSize: 16,
    fontWeight: "700",
    color: PRIMARY,
    marginBottom: 3,
  },

  assetAmount: {
    fontSize: 14,
    color: "#7F8C8D",
    fontWeight: "500",
  },

  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },

  noAssetsText: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 15,
    color: PLACEHOLDER,
    fontStyle: "italic",
  },

  modalCloseButton: {
    marginTop: 16,
    marginHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: ACCENT,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  modalCloseText: {
    fontSize: 16,
    fontWeight: "700",
    color: SURFACE,
  },
});

export default AssetPicker;