import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import axios from "axios";
import API from "../../config/api";
import AssetsStyles from "../styles/Assets_style";
import BankSelector from "./personalized_components/BankSelector";
import AssetTypeSelector from "./personalized_components/AssetTypeSelector";
import CurrencyPicker from "./personalized_components/CurrencyPicker";
import { MaterialIcons } from "@expo/vector-icons";

const InsertAssetScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [bank, setBank] = useState("");
  const [assetType, setAssetType] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [amount, setAmount] = useState("");
  const [isPayable, setIsPayable] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset form when screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      setBank("");
      setAssetType("");
      setCurrency("EUR");
      setAmount("");
      setIsPayable(false);
    });

    return unsubscribe;
  }, [navigation]);

  const getToken = async () => {
    try {
      return await AsyncStorage.getItem("authToken");
    } catch (error) {
      console.error("Token fetch error:", error);
      return null;
    }
  };

  const validateInputs = () => {
    if (!bank || bank.trim() === "") {
      Alert.alert(t("error"), t("bank_required"));
      return false;
    }
    if (!assetType || assetType.trim() === "") {
      Alert.alert(t("error"), t("asset_type_required"));
      return false;
    }
    if (!currency || currency.trim() === "") {
      Alert.alert(t("error"), t("currency_required"));
      return false;
    }
    if (!amount || parseFloat(amount) < 0) {
      Alert.alert(t("error"), t("invalid_amount"));
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    setLoading(true);

    try {
      const token = await getToken();
      if (!token) {
        Alert.alert(t("error"), t("token_missing"));
        setLoading(false);
        return;
      }

      const payload = {
        bank: bank.trim(),
        asset_type: assetType,
        currency: currency,
        amount: parseFloat(amount),
        is_payable: isPayable,
      };

      const response = await axios.post(`${API.BASE_URL}/api/v1/assets/insert`, payload, {
        headers: { "x-access-token": token },
      });

      if (response.status === 201) {
        Alert.alert(t("success"), t("asset_added_successfully"), [
          {
            text: t("ok"),
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error) {
      console.error("Insert asset error:", error.response?.data || error.message);
      
      if (error.response?.status === 409) {
        Alert.alert(t("error"), t("asset_already_exists"));
      } else {
        Alert.alert(t("error"), error.response?.data?.message || t("insert_asset_error"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={AssetsStyles.scrollContainer}>
      <View style={AssetsStyles.container}>
        <View style={AssetsStyles.titleContainer}>
          <Text style={AssetsStyles.title}>{t("add_new_asset")}</Text>
        </View>

        <View style={AssetsStyles.formContainer}>
          {/* Bank Input */}
          <View style={AssetsStyles.inputGroup}>
            <Text style={AssetsStyles.label}>{t("bank")}</Text>
            <BankSelector selectedBank={bank} onSelectBank={setBank} />
          </View>

          {/* Asset Type Selector */}
          <View style={AssetsStyles.inputGroup}>
            <Text style={AssetsStyles.label}>{t("asset_type")}</Text>
            <AssetTypeSelector selectedType={assetType} onSelectType={setAssetType} />
          </View>

          {/* Currency Picker */}
          <View style={AssetsStyles.inputGroup}>
            <Text style={AssetsStyles.label}>{t("currency")}</Text>
            <CurrencyPicker 
              currency={currency}
              setCurrency={(newCurrency) => setCurrency(newCurrency)}
            />
          </View>

          {/* Amount Input */}
          <View style={AssetsStyles.inputGroup}>
            <Text style={AssetsStyles.label}>{t("amount")}</Text>
            <TextInput
              style={AssetsStyles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor="#999"
            />
          </View>

          {/* Is Payable Toggle */}
          <View style={AssetsStyles.checkboxContainer}>
            <TouchableOpacity
              style={AssetsStyles.checkbox}
              onPress={() => setIsPayable(!isPayable)}
            >
              <MaterialIcons
                name={isPayable ? "check-box" : "check-box-outline-blank"}
                size={24}
                color={isPayable ? "#007BFF" : "#999"}
              />
              <Text style={AssetsStyles.checkboxLabel}>{t("is_payable")}</Text>
            </TouchableOpacity>
            <Text style={AssetsStyles.checkboxHint}>{t("payable_hint")}</Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[AssetsStyles.submitButton, loading && AssetsStyles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={AssetsStyles.submitButtonText}>{t("add_asset")}</Text>
            )}
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            style={AssetsStyles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={AssetsStyles.cancelButtonText}>{t("cancel")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default InsertAssetScreen;