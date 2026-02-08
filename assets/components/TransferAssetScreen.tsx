import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Modal, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import Toast from "react-native-toast-message";
import API from "../../config/api";
import AssetsStyles from "../styles/Assets_style";

const TransferAssetScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [assets, setAssets] = useState([]);
  const [fromAsset, setFromAsset] = useState(null);
  const [toAsset, setToAsset] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [showAssetPicker, setShowAssetPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState(null); // 'from' or 'to'

  const getToken = async () => {
    try {
      return await AsyncStorage.getItem("authToken");
    } catch (error) {
      console.error("Token fetch error:", error);
      return null;
    }
  };

  const fetchAssets = async () => {
    setLoadingAssets(true);
    try {
      const token = await getToken();
      if (!token) {
        Toast.show({
          type: "error",
          text1: t("token_missing"),
        });
        return;
      }

      const response = await axios.get(`${API.BASE_URL}/api/v1/assets/list`, {
        headers: { "x-access-token": token },
      });

      if (response.data && response.data.assets && Array.isArray(response.data.assets)) {
        setAssets(response.data.assets);
      }
    } catch (error) {
      console.error("Fetch assets error:", error);
      Toast.show({
        type: "error",
        text1: t("fetch_assets_error"),
      });
    } finally {
      setLoadingAssets(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setFromAsset(null);
      setToAsset(null);
      setAmount("");
      fetchAssets();
    });
    return unsubscribe;
  }, [navigation]);

  const openAssetPicker = (mode) => {
    setPickerMode(mode);
    setShowAssetPicker(true);
  };

  const selectAsset = (asset) => {
    if (pickerMode === 'from') {
      setFromAsset(asset);
      if (toAsset && toAsset.id === asset.id) {
        setToAsset(null);
      }
    } else {
      setToAsset(asset);
      if (fromAsset && fromAsset.id === asset.id) {
        setFromAsset(null);
      }
    }
    setShowAssetPicker(false);
  };

  const swapAssets = () => {
    const temp = fromAsset;
    setFromAsset(toAsset);
    setToAsset(temp);
  };

  const validateInputs = () => {
    if (!fromAsset) {
      Toast.show({ type: "error", text1: t("select_source_asset") });
      return false;
    }
    if (!toAsset) {
      Toast.show({ type: "error", text1: t("select_destination_asset") });
      return false;
    }
    if (!amount || parseFloat(amount) <= 0) {
      Toast.show({ type: "error", text1: t("invalid_amount") });
      return false;
    }
    if (parseFloat(amount) > parseFloat(fromAsset.amount)) {
      Toast.show({ type: "error", text1: t("insufficient_funds") });
      return false;
    }
    return true;
  };

  const handleTransfer = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        Toast.show({ type: "error", text1: t("token_missing") });
        setLoading(false);
        return;
      }

      const payload = {
        from_bank: fromAsset.bank,
        from_asset_type: fromAsset.asset_type,
        from_currency: fromAsset.currency,
        to_bank: toAsset.bank,
        to_asset_type: toAsset.asset_type,
        to_currency: toAsset.currency,
        amount: parseFloat(amount),
      };

      const response = await axios.post(`${API.BASE_URL}/api/v1/assets/transfer`, payload, {
        headers: { "x-access-token": token },
      });

      if (response.status === 200) {
        Toast.show({ type: "success", text1: t("transfer_successful") });
        setTimeout(() => navigation.goBack(), 1500);
      }
    } catch (error) {
      console.error("Transfer error:", error.response?.data || error.message);
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || t("transfer_error"),
      });
    } finally {
      setLoading(false);
    }
  };

  const AssetCompactCard = ({ asset, label, onPress, iconColor, isLast }) => (
    <TouchableOpacity
      style={[
        AssetsStyles.compactAssetCard, 
        asset && AssetsStyles.compactAssetCardFilled,
        isLast && { marginBottom: 20 }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={AssetsStyles.compactCardLeft}>
        <View style={[AssetsStyles.compactCardIcon, { backgroundColor: iconColor }]}>
          <MaterialIcons name="account-balance-wallet" size={20} color="#fff" />
        </View>
        <View style={AssetsStyles.compactCardInfo}>
          <Text style={AssetsStyles.compactCardLabel}>{label}</Text>
          {asset ? (
            <>
              <Text style={AssetsStyles.compactCardBank}>{asset.bank}</Text>
              <Text style={AssetsStyles.compactCardAmount}>
                {parseFloat(asset.amount).toLocaleString("it-IT", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} {asset.currency}
              </Text>
            </>
          ) : (
            <Text style={AssetsStyles.compactCardPlaceholder}>{t("tap_to_select")}</Text>
          )}
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );

  const renderAssetItem = ({ item }) => {
    const isExcluded = (pickerMode === 'from' && toAsset?.id === item.id) ||
                       (pickerMode === 'to' && fromAsset?.id === item.id);
    
    return (
      <TouchableOpacity
        style={[
          AssetsStyles.assetPickerItem,
          isExcluded && AssetsStyles.assetPickerItemDisabled
        ]}
        onPress={() => !isExcluded && selectAsset(item)}
        disabled={isExcluded}
        activeOpacity={0.7}
      >
        <View style={AssetsStyles.assetPickerItemLeft}>
          <View style={AssetsStyles.assetPickerItemIcon}>
            <MaterialIcons 
              name={item.is_payable ? "account-balance-wallet" : "trending-up"} 
              size={22} 
              color={isExcluded ? "#ccc" : "#007BFF"} 
            />
          </View>
          <View>
            <Text style={[
              AssetsStyles.assetPickerItemBank,
              isExcluded && AssetsStyles.assetPickerItemTextDisabled
            ]}>
              {item.bank}
            </Text>
            <Text style={[
              AssetsStyles.assetPickerItemType,
              isExcluded && AssetsStyles.assetPickerItemTextDisabled
            ]}>
              {t(item.asset_type)}
            </Text>
          </View>
        </View>
        <View style={AssetsStyles.assetPickerItemRight}>
          <Text style={[
            AssetsStyles.assetPickerItemAmount,
            isExcluded && AssetsStyles.assetPickerItemTextDisabled
          ]}>
            {parseFloat(item.amount).toLocaleString("it-IT", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
          <Text style={[
            AssetsStyles.assetPickerItemCurrency,
            isExcluded && AssetsStyles.assetPickerItemTextDisabled
          ]}>
            {item.currency}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loadingAssets) {
    return (
      <View style={AssetsStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={AssetsStyles.loadingText}>{t("loading_assets")}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F7FB" }}>
      <ScrollView contentContainerStyle={AssetsStyles.transferScrollContainer}>
        <View style={AssetsStyles.transferMainCard}>
          {/* Header */}
          <View style={AssetsStyles.transferHeader}>
            <MaterialIcons name="swap-horiz" size={28} color="#007BFF" />
            <Text style={AssetsStyles.transferHeaderTitle}>{t("transfer_assets")}</Text>
          </View>

          {/* From Asset */}
          <AssetCompactCard
            asset={fromAsset}
            label={t("from")}
            onPress={() => openAssetPicker('from')}
            iconColor="#F44336"
          />

          {/* Swap Button */}
          {fromAsset && toAsset && (
            <TouchableOpacity 
              style={AssetsStyles.swapButton}
              onPress={swapAssets}
            >
              <MaterialIcons name="swap-vert" size={24} color="#007BFF" />
            </TouchableOpacity>
          )}

          {/* To Asset */}
          <AssetCompactCard
            asset={toAsset}
            label={t("to")}
            onPress={() => openAssetPicker('to')}
            iconColor="#4CAF50"
            isLast={true}
          />

          {/* Amount Input */}
          {fromAsset && toAsset && (
            <View style={AssetsStyles.amountSection}>
              <View style={AssetsStyles.amountHeader}>
                <MaterialIcons name="account-balance-wallet" size={20} color="#007BFF" />
                <Text style={AssetsStyles.amountLabel}>{t("amount")}</Text>
              </View>
              <TextInput
                style={AssetsStyles.amountInput}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#999"
              />
              <View style={AssetsStyles.availableRow}>
                <MaterialIcons name="info-outline" size={14} color="#666" />
                <Text style={AssetsStyles.availableText}>
                  {t("available")}: {parseFloat(fromAsset.amount).toLocaleString("it-IT", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} {fromAsset.currency}
                </Text>
              </View>

              {/* Currency Warning */}
              {fromAsset.currency !== toAsset.currency && (
                <View style={AssetsStyles.currencyWarning}>
                  <MaterialIcons name="warning" size={18} color="#F57C00" />
                  <Text style={AssetsStyles.currencyWarningText}>
                    {fromAsset.currency} → {toAsset.currency}
                  </Text>
                </View>
              )}

              {/* Transfer Button */}
              <TouchableOpacity
                style={[AssetsStyles.transferButtonExecute, loading && { opacity: 0.6 }]}
                onPress={handleTransfer}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <MaterialIcons name="send" size={22} color="#fff" />
                    <Text style={AssetsStyles.transferButtonText}>{t("execute_transfer")}</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Asset Picker Modal */}
      <Modal
        visible={showAssetPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAssetPicker(false)}
      >
        <View style={AssetsStyles.modalOverlay}>
          <View style={AssetsStyles.modalContainer}>
            <View style={AssetsStyles.modalHeader}>
              <Text style={AssetsStyles.modalTitle}>
                {pickerMode === 'from' ? t("select_source_asset") : t("select_destination_asset")}
              </Text>
              <TouchableOpacity onPress={() => setShowAssetPicker(false)}>
                <MaterialIcons name="close" size={26} color="#333" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={assets}
              renderItem={renderAssetItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={AssetsStyles.assetPickerList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TransferAssetScreen;