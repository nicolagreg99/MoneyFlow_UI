import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import IncomesStyles from "../styles/IncomesInsertEdit_style";
import FilterSelector from "./personalized_components/FilterSelector";
import AssetPicker from "./personalized_components/AssetPicker";
import CurrencyPicker from "./personalized_components/CurrencyPicker";
import API from "../../config/api";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";

const EditIncomeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { income } = route.params || {};

  const [amount, setAmount] = useState("");
  const [amountFocused, setAmountFocused] = useState(false);
  const [description, setDescription] = useState("");
  const [descriptionFocused, setDescriptionFocused] = useState(false);
  const [selectedType, setSelectedType] = useState([]);
  const [date, setDate] = useState(new Date());
  const [currency, setCurrency] = useState("EUR");
  const [userCurrency, setUserCurrency] = useState("EUR");
  const [selectedAsset, setSelectedAsset] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [errorFields, setErrorFields] = useState({
    amount: false,
    description: false,
    selectedType: false,
    selectedAsset: false,
  });

  const assetPickerRef = useRef(null);

  useEffect(() => {
    if (!income) {
      navigation.goBack();
      return;
    }

    setAmount(income.valore?.toString() || "");
    setDescription(income.descrizione || "");
    setSelectedType([income.tipo]);
    setDate(new Date(income.giorno));
    setCurrency(income.currency || "EUR");
    setSelectedAsset(income.payment_asset_id || null);

    const fetchUserData = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        const user = JSON.parse(storedUserData);
        const defaultCurrency = user.default_currency || user.currency || "EUR";
        setUserCurrency(defaultCurrency);
      }
      setAuthToken(token);
    };

    fetchUserData();
  }, []);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleSubmit = async () => {
    const formattedAmount = amount.replace(",", ".");
    const errors = {
      amount: !formattedAmount.trim() || isNaN(formattedAmount),
      description: !description.trim(),
      selectedType: selectedType.length === 0,
      selectedAsset: !selectedAsset,
    };

    setErrorFields(errors);

    if (Object.values(errors).some(Boolean) || !authToken) {
      Toast.show({
        type: "error",
        text1: t("fill_required_fields"),
      });
      return;
    }

    const payload = {
      tipo: selectedType[0],
      valore: parseFloat(formattedAmount),
      giorno: date.toISOString().split("T")[0],
      descrizione: description.trim(),
      currency,
      payment_asset_id: selectedAsset,
    };

    const PATCH_URL = `${API.BASE_URL}/api/v1/edit_income/${income.id}`;
    setLoading(true);

    try {
      await axios.patch(PATCH_URL, payload, {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": authToken,
        },
      });

      Toast.show({
        type: "success",
        text1: t("success_income_updated"),
        position: "bottom",
      });

      setTimeout(() => navigation.goBack(), 1500);
    } catch (error) {
      console.error("Errore aggiornamento:", error);
      Toast.show({
        type: "error",
        text1: t("error_updating"),
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "#F5F7FB" }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={IncomesStyles.container}>
          <Text style={IncomesStyles.header}>✏️ {t("edit_income")}</Text>

          {/* Campo importo */}
          <View style={[IncomesStyles.inputWrapper, { position: "relative" }]}>
            {(amount.length > 0 || amountFocused) && (
              <Text style={IncomesStyles.floatingLabel}>
                {t("amount_label")} *
              </Text>
            )}

            <View style={{ position: "relative", justifyContent: "center" }}>
              <MaterialIcons
                name="monetization-on"
                size={20}
                color="#3498DB"
                style={IncomesStyles.iconLeft}
              />
              <TextInput
                style={[
                  IncomesStyles.input,
                  errorFields.amount && IncomesStyles.errorInput,
                ]}
                onFocus={() => setAmountFocused(true)}
                onBlur={() => setAmountFocused(false)}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                placeholder={
                  amount.length > 0 || amountFocused
                    ? ""
                    : `${t("amount_label")} (${currency}) *`
                }
                placeholderTextColor="#7F8C8D"
              />

              <View style={IncomesStyles.currencyPickerInside}>
                <CurrencyPicker
                  currency={currency}
                  setCurrency={setCurrency}
                  compactMode
                />
              </View>
            </View>
          </View>
          {errorFields.amount && (
            <Text style={IncomesStyles.errorText}>{t("amount_required")}</Text>
          )}

          {/* Campo descrizione */}
          <View style={IncomesStyles.inputWrapper}>
            {(description.length > 0 || descriptionFocused) && (
              <Text style={IncomesStyles.floatingLabel}>
                {t("description_label")} *
              </Text>
            )}
            <MaterialIcons
              name="description"
              size={20}
              color="#3498DB"
              style={IncomesStyles.iconLeft}
            />
            <TextInput
              style={[
                IncomesStyles.input,
                errorFields.description && IncomesStyles.errorInput,
              ]}
              onFocus={() => setDescriptionFocused(true)}
              onBlur={() => setDescriptionFocused(false)}
              value={description}
              onChangeText={setDescription}
              placeholder={
                description.length > 0 || descriptionFocused
                  ? ""
                  : `${t("description_label")} *`
              }
              placeholderTextColor="#7F8C8D"
            />
          </View>
          {errorFields.description && (
            <Text style={IncomesStyles.errorText}>
              {t("description_required")}
            </Text>
          )}

          {/* Categoria */}
          <FilterSelector
            selectedFilters={selectedType}
            setSelectedFilters={(filters) =>
              setSelectedType([filters[filters.length - 1]])
            }
            filterType="entrate"
          />
          {errorFields.selectedType && (
            <Text style={IncomesStyles.errorText}>{t("type_required")}</Text>
          )}

          {/* Asset Picker */}
          <AssetPicker
            ref={assetPickerRef}
            selectedAsset={selectedAsset}
            setSelectedAsset={setSelectedAsset}
            hasError={errorFields.selectedAsset}
            authToken={authToken}
          />

          {/* Data */}
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={IncomesStyles.datePickerButton}
          >
            <MaterialIcons name="event" size={20} color="#2C3E50" />
            <Text style={IncomesStyles.datePickerText}>
              {date.toLocaleDateString("it-IT")}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
            />
          )}

          {/* Pulsante salva */}
          <TouchableOpacity
            style={[IncomesStyles.button, loading && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={IncomesStyles.buttonText}>
              {loading ? t("saving") : t("save_changes")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditIncomeScreen;