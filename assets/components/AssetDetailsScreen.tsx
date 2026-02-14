import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator, FlatList, Modal } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import API from "../../config/api";
import AssetsStyles from "../styles/Assets_style";

// Importa le valute
const currencies = [
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

const AssetDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();

  const { asset } = route.params;

  const [isEditing, setIsEditing] = useState(false);
  const [editedBank, setEditedBank] = useState(asset.bank);
  const [editedAssetType, setEditedAssetType] = useState(asset.asset_type);
  const [editedAmount, setEditedAmount] = useState(asset.amount.toString());
  const [showAssetTypeModal, setShowAssetTypeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [summary, setSummary] = useState({ total_inflow: 0, total_outflow: 0, net_flow: 0 });

  // Lista dei tipi di asset
  const assetTypes = [
    { value: "BONDS", icon: "insert-chart", color: "#795548" },
    { value: "BUONI_POSTALI", icon: "local-post-office", color: "#FFB300" },
    { value: "COMMODITIES", icon: "grain", color: "#FFC107" },
    { value: "CRYPTO", icon: "currency-bitcoin", color: "#9C27B0" },
    { value: "DEPOSIT_ACCOUNT", icon: "lock", color: "#81C784" },
    { value: "ETF", icon: "pie-chart", color: "#42A5F5" },
    { value: "GOLD", icon: "star", color: "#FFD54F" },
    { value: "GOVERNMENT_BONDS", icon: "account-balance", color: "#8D6E63" },
    { value: "LIBRETTO_POSTALE", icon: "book", color: "#FFA726" },
    { value: "LIFE_INSURANCE", icon: "favorite-border", color: "#E91E63" },
    { value: "LIQUIDITY", icon: "account-balance-wallet", color: "#4CAF50" },
    { value: "MUTUAL_FUND", icon: "account-balance", color: "#64B5F6" },
    { value: "OTHER", icon: "category", color: "#9E9E9E" },
    { value: "PENSION_FUND", icon: "elderly", color: "#00897B" },
    { value: "PIP", icon: "security", color: "#00ACC1" },
    { value: "REAL_ESTATE", icon: "home", color: "#607D8B" },
    { value: "SAVINGS_ACCOUNT", icon: "savings", color: "#66BB6A" },
    { value: "STOCKS", icon: "show-chart", color: "#2196F3" },
  ];

  const getAssetTypeInfo = (type) => {
    return assetTypes.find(t => t.value === type) || assetTypes[assetTypes.length - 1];
  };

  useEffect(() => {
    // Reset editing state when screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      setIsEditing(false);
      setEditedBank(asset.bank);
      setEditedAssetType(asset.asset_type);
      setEditedAmount(asset.amount.toString());
      fetchTransactionHistory();
    });

    return unsubscribe;
  }, [navigation, asset.amount, asset.bank, asset.asset_type]);

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  const getToken = async () => {
    try {
      return await AsyncStorage.getItem("authToken");
    } catch (error) {
      console.error("Token fetch error:", error);
      return null;
    }
  };

  const getCurrencyFlag = (currencyCode) => {
    const currency = currencies.find((c) => c.code === currencyCode);
    return currency ? currency.flag : currencyCode;
  };

  const fetchTransactionHistory = async () => {
    setLoadingTransactions(true);
    try {
      const token = await getToken();
      if (!token) {
        console.error("Token missing");
        setLoadingTransactions(false);
        return;
      }

      const response = await axios.get(
        `${API.BASE_URL}/api/v1/assets/history/${asset.id}`,
        {
          headers: { "x-access-token": token },
        }
      );

      if (response.status === 200) {
        setTransactions(response.data.transactions || []);
        setSummary(response.data.summary || { total_inflow: 0, total_outflow: 0, net_flow: 0 });
      }
    } catch (error) {
      console.error("Fetch transaction history error:", error.response?.data || error.message);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const handleUpdate = async () => {
    // Validazione del nome della banca
    if (!editedBank || editedBank.trim() === "") {
      Toast.show({
        type: "error",
        text1: t("bank_required"),
      });
      return;
    }

    // Validazione del tipo di asset
    if (!editedAssetType) {
      Toast.show({
        type: "error",
        text1: t("asset_type_required"),
      });
      return;
    }

    // Validazione dell'importo
    if (!editedAmount || parseFloat(editedAmount) < 0) {
      Toast.show({
        type: "error",
        text1: t("invalid_amount"),
      });
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();
      if (!token) {
        Toast.show({
          type: "error",
          text1: t("token_missing"),
        });
        setLoading(false);
        return;
      }

      const payload = {
        bank: editedBank.trim(),
        asset_type: editedAssetType,
        amount: parseFloat(editedAmount),
      };

      const response = await axios.patch(
        `${API.BASE_URL}/api/v1/assets/edit_asset/${asset.id}`,
        payload,
        {
          headers: { "x-access-token": token },
        }
      );

      if (response.status === 200) {
        Toast.show({
          type: "success",
          text1: t("asset_updated_successfully"),
        });
        setIsEditing(false);
        setTimeout(() => {
          navigation.goBack();
        }, 1000);
      }
    } catch (error) {
      console.error("Update asset error:", error.response?.data || error.message);
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || t("update_asset_error"),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      t("confirm_delete"),
      t("delete_asset_confirmation", { bank: asset.bank, type: t(asset.asset_type) }),
      [
        {
          text: t("cancel"),
          style: "cancel",
        },
        {
          text: t("delete"),
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              const token = await getToken();
              if (!token) {
                Toast.show({
                  type: "error",
                  text1: t("token_missing"),
                });
                setLoading(false);
                return;
              }

              await axios.delete(`${API.BASE_URL}/api/v1/assets/delete_asset/${asset.id}`, {
                headers: { "x-access-token": token },
              });

              Toast.show({
                type: "success",
                text1: t("asset_deleted_successfully"),
              });
              setTimeout(() => {
                navigation.goBack();
              }, 1000);
            } catch (error) {
              console.error("Delete asset error:", error.response?.data || error.message);
              Toast.show({
                type: "error",
                text1: error.response?.data?.message || t("delete_asset_error"),
              });
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return t("n_a");
    const date = new Date(dateString);
    return date.toLocaleDateString("it-IT", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatSimpleDate = (dateString) => {
    if (!dateString) return t("n_a");
    const date = new Date(dateString);
    return date.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const renderTransactionItem = ({ item }) => {
    const isInflow = item.flow_type === "INFLOW";
    const iconName = isInflow ? "arrow-downward" : "arrow-upward";
    const iconColor = isInflow ? "#4CAF50" : "#F44336";
    const amountColor = isInflow ? "#4CAF50" : "#F44336";
    
    // Check if currency conversion is needed
    const isForeignCurrency = item.currency !== asset.currency;
    const convertedAmount = isForeignCurrency 
      ? parseFloat(item.amount) * parseFloat(item.exchange_rate)
      : null;

    return (
      <View style={AssetsStyles.transactionItem}>
        <View style={[AssetsStyles.transactionIcon, { backgroundColor: iconColor }]}>
          <MaterialIcons name={iconName} size={20} color="#fff" />
        </View>

        <View style={AssetsStyles.transactionContent}>
          <Text style={AssetsStyles.transactionType}>{item.type}</Text>
          <Text style={AssetsStyles.transactionDate}>{formatSimpleDate(item.date)}</Text>
          {item.fields?.descrizione && (
            <Text style={AssetsStyles.transactionDescription} numberOfLines={1}>
              {item.fields.descrizione}
            </Text>
          )}
        </View>

        <View style={AssetsStyles.transactionRight}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[AssetsStyles.transactionAmount, { color: amountColor }]}>
              {isInflow ? "+" : "-"}
              {parseFloat(item.amount).toLocaleString("it-IT", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {getCurrencyFlag(item.currency)}
            </Text>
            {isForeignCurrency && convertedAmount !== null && (
              <Text style={[AssetsStyles.transactionAmount, { 
                color: amountColor, 
                fontSize: 12, 
                marginLeft: 6,
                opacity: 0.7 
              }]}>
                (≈{convertedAmount.toLocaleString("it-IT", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                {getCurrencyFlag(asset.currency)})
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  const selectedAssetTypeInfo = getAssetTypeInfo(editedAssetType);

  return (
    <ScrollView contentContainerStyle={AssetsStyles.scrollContainer}>
      <View style={AssetsStyles.container}>
        <View style={AssetsStyles.titleContainer}>
          <Text style={AssetsStyles.title}>{t("asset_details")}</Text>
        </View>

        <View style={AssetsStyles.detailsCard}>
          {/* Bank */}
          <View style={AssetsStyles.detailRow}>
            <MaterialIcons name="account-balance" size={24} color="#007BFF" />
            <View style={AssetsStyles.detailContent}>
              <Text style={AssetsStyles.detailLabel}>{t("bank")}</Text>
              {isEditing ? (
                <TextInput
                  style={AssetsStyles.editInput}
                  value={editedBank}
                  onChangeText={setEditedBank}
                  placeholder={t("enter_bank_name")}
                  placeholderTextColor="#999"
                />
              ) : (
                <Text style={AssetsStyles.detailValue}>{asset.bank}</Text>
              )}
            </View>
          </View>

          {/* Asset Type */}
          <View style={AssetsStyles.detailRow}>
            <MaterialIcons name="category" size={24} color="#007BFF" />
            <View style={AssetsStyles.detailContent}>
              <Text style={AssetsStyles.detailLabel}>{t("asset_type")}</Text>
              {isEditing ? (
                <TouchableOpacity
                  style={AssetsStyles.editableField}
                  onPress={() => setShowAssetTypeModal(true)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[AssetsStyles.smallIcon, { backgroundColor: selectedAssetTypeInfo.color }]}>
                      <MaterialIcons name={selectedAssetTypeInfo.icon} size={16} color="#fff" />
                    </View>
                    <Text style={AssetsStyles.editableFieldText}>{t(editedAssetType)}</Text>
                  </View>
                  <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
                </TouchableOpacity>
              ) : (
                <Text style={AssetsStyles.detailValue}>{t(asset.asset_type)}</Text>
              )}
            </View>
          </View>

          {/* Currency */}
          <View style={AssetsStyles.detailRow}>
            <MaterialIcons name="attach-money" size={24} color="#007BFF" />
            <View style={AssetsStyles.detailContent}>
              <Text style={AssetsStyles.detailLabel}>{t("currency")}</Text>
              <Text style={AssetsStyles.detailValue}>{asset.currency}</Text>
            </View>
          </View>

          {/* Amount */}
          <View style={AssetsStyles.detailRow}>
            <MaterialIcons name="account-balance-wallet" size={24} color="#007BFF" />
            <View style={AssetsStyles.detailContent}>
              <Text style={AssetsStyles.detailLabel}>{t("amount")}</Text>
              {isEditing ? (
                <TextInput
                  style={AssetsStyles.editInput}
                  value={editedAmount}
                  onChangeText={setEditedAmount}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor="#999"
                />
              ) : (
                <Text style={AssetsStyles.detailValueLarge}>
                  {parseFloat(asset.amount).toLocaleString("it-IT", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  {asset.currency}
                </Text>
              )}
            </View>
          </View>

          {/* Exchange Rate */}
          {asset.exchange_rate && parseFloat(asset.exchange_rate) !== 1.0 && (
            <View style={AssetsStyles.detailRow}>
              <MaterialIcons name="sync-alt" size={24} color="#007BFF" />
              <View style={AssetsStyles.detailContent}>
                <Text style={AssetsStyles.detailLabel}>{t("exchange_rate")}</Text>
                <Text style={AssetsStyles.detailValue}>{asset.exchange_rate}</Text>
              </View>
            </View>
          )}

          {/* Is Payable */}
          <View style={AssetsStyles.detailRow}>
            <MaterialIcons
              name={asset.is_payable ? "check-circle" : "cancel"}
              size={24}
              color={asset.is_payable ? "#4CAF50" : "#999"}
            />
            <View style={AssetsStyles.detailContent}>
              <Text style={AssetsStyles.detailLabel}>{t("is_payable")}</Text>
              <Text style={AssetsStyles.detailValue}>
                {asset.is_payable ? t("yes") : t("no")}
              </Text>
            </View>
          </View>

          {/* Last Updated */}
          <View style={AssetsStyles.detailRow}>
            <MaterialIcons name="update" size={24} color="#007BFF" />
            <View style={AssetsStyles.detailContent}>
              <Text style={AssetsStyles.detailLabel}>{t("last_updated")}</Text>
              <Text style={AssetsStyles.detailValue}>{formatDate(asset.last_updated)}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={AssetsStyles.actionsSection}>
          {isEditing ? (
            <>
              <TouchableOpacity
                style={[AssetsStyles.submitButton, loading && AssetsStyles.submitButtonDisabled]}
                onPress={handleUpdate}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <MaterialIcons name="save" size={24} color="#fff" />
                    <Text style={AssetsStyles.submitButtonText}>{t("save")}</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={AssetsStyles.cancelButton}
                onPress={() => {
                  setIsEditing(false);
                  setEditedBank(asset.bank);
                  setEditedAssetType(asset.asset_type);
                  setEditedAmount(asset.amount.toString());
                }}
              >
                <Text style={AssetsStyles.cancelButtonText}>{t("cancel")}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={AssetsStyles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <MaterialIcons name="edit" size={24} color="#fff" />
                <Text style={AssetsStyles.submitButtonText}>{t("edit")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={AssetsStyles.deleteButton}
                onPress={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <MaterialIcons name="delete" size={24} color="#fff" />
                    <Text style={AssetsStyles.submitButtonText}>{t("delete")}</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Asset Type Modal */}
        <Modal
          visible={showAssetTypeModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowAssetTypeModal(false)}
        >
          <View style={AssetsStyles.modalOverlay}>
            <View style={AssetsStyles.modalContainer}>
              <View style={AssetsStyles.modalHeader}>
                <Text style={AssetsStyles.modalTitle}>{t("select_asset_type")}</Text>
                <TouchableOpacity onPress={() => setShowAssetTypeModal(false)}>
                  <MaterialIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <ScrollView 
                style={AssetsStyles.modalContent}
                contentContainerStyle={{ paddingBottom: 40 }}
              >
                {assetTypes.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      AssetsStyles.modalOption,
                      editedAssetType === type.value && AssetsStyles.modalOptionSelected,
                    ]}
                    onPress={() => {
                      setEditedAssetType(type.value);
                      setShowAssetTypeModal(false);
                    }}
                  >
                    <View style={AssetsStyles.modalOptionContent}>
                      <View style={[AssetsStyles.modalOptionIcon, { backgroundColor: type.color }]}>
                        <MaterialIcons name={type.icon} size={24} color="#fff" />
                      </View>
                      <Text style={AssetsStyles.modalOptionText}>{t(type.value)}</Text>
                    </View>
                    {editedAssetType === type.value && (
                      <MaterialIcons name="check" size={24} color="#007BFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Transaction History */}
        <View style={AssetsStyles.transactionHistorySection}>
          <View style={AssetsStyles.transactionHistoryHeader}>
            <Text style={AssetsStyles.transactionHistoryTitle}>{t("transaction_history")}</Text>
            <TouchableOpacity onPress={fetchTransactionHistory}>
              <MaterialIcons name="refresh" size={24} color="#007BFF" />
            </TouchableOpacity>
          </View>

          {/* Summary Cards */}
          {!loadingTransactions && transactions.length > 0 && (
            <View style={AssetsStyles.summaryContainer}>
              <View style={AssetsStyles.summaryCard}>
                <MaterialIcons name="arrow-downward" size={20} color="#4CAF50" />
                <View style={AssetsStyles.summaryCardContent}>
                  <Text style={AssetsStyles.summaryCardLabel}>{t("total_inflow")}</Text>
                  <Text style={[AssetsStyles.summaryCardValue, { color: "#4CAF50" }]}>
                    +{parseFloat(summary.total_inflow).toLocaleString("it-IT", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </View>
              </View>

              <View style={AssetsStyles.summaryCard}>
                <MaterialIcons name="arrow-upward" size={20} color="#F44336" />
                <View style={AssetsStyles.summaryCardContent}>
                  <Text style={AssetsStyles.summaryCardLabel}>{t("total_outflow")}</Text>
                  <Text style={[AssetsStyles.summaryCardValue, { color: "#F44336" }]}>
                    -{parseFloat(summary.total_outflow).toLocaleString("it-IT", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Transactions List */}
          {loadingTransactions ? (
            <View style={AssetsStyles.transactionLoadingContainer}>
              <ActivityIndicator size="large" color="#007BFF" />
              <Text style={AssetsStyles.loadingText}>{t("loading_transactions")}</Text>
            </View>
          ) : transactions.length === 0 ? (
            <View style={AssetsStyles.emptyTransactionsContainer}>
              <MaterialIcons name="receipt-long" size={64} color="#BDBDBD" />
              <Text style={AssetsStyles.emptyTransactionsText}>{t("no_transactions")}</Text>
              <Text style={AssetsStyles.emptyTransactionsSubtext}>
                {t("no_transactions_description")}
              </Text>
            </View>
          ) : (
            <FlatList
              data={transactions}
              renderItem={renderTransactionItem}
              keyExtractor={(item) => `${item.source}-${item.id}`}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={AssetsStyles.transactionSeparator} />}
              contentContainerStyle={AssetsStyles.transactionListContainer}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default AssetDetailsScreen;