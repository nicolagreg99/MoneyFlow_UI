import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import ExpensesStyles from "../styles/ExpensesInsertEdit_style";
import FilterSelector from "./personalized_components/FilterSelector";
import API from "../../config/api";
import CurrencyPicker from "./personalized_components/CurrencyPicker";
import { useTranslation } from "react-i18next";

const API_URL = `${API.BASE_URL}/api/v1/expenses/insert`;

const InsertExpensesScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedType, setSelectedType] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userCurrency, setUserCurrency] = useState<string>("EUR");
  const [currency, setCurrency] = useState<string>("EUR");

  const [errorFields, setErrorFields] = useState({});
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // 🔹 Effetto fade-in all'apertura
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  // 🔹 Recupero dati utente
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const storedUserData = await AsyncStorage.getItem("userData");
        if (!token || !storedUserData) return;
        const user = JSON.parse(storedUserData);
        setAuthToken(token);
        setUserId(user.id);
        const defaultCurrency = user.default_currency || "EUR";
        setUserCurrency(defaultCurrency);
        setCurrency(defaultCurrency);
      } catch (error) {
        console.error("Errore nel recupero dati utente:", error);
      }
    };
    loadUserData();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleSubmit = async () => {
    const formattedAmount = amount.replace(",", ".");
    const errors = {
      amount: !formattedAmount.trim() || isNaN(formattedAmount),
      description: !description.trim(),
      selectedType: selectedType.length === 0,
    };
    setErrorFields(errors);
    if (Object.values(errors).some(Boolean)) {
      Toast.show({
        type: "error",
        text1: t("fill_required_fields"),
      });
      return;
    }

    if (!userId || !authToken) {
      Toast.show({
        type: "error",
        text1: t("user_not_authenticated"),
      });
      return;
    }

    const expenseData = {
      tipo: selectedType[0],
      valore: parseFloat(formattedAmount),
      giorno: date.toISOString().split("T")[0],
      descrizione: description.trim(),
      currency,
      user_id: userId,
    };

    setLoading(true);
    try {
      await axios.post(API_URL, expenseData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": authToken,
        },
      });
      Toast.show({
        type: "success",
        text1: t("expense_registered"),
      });
      setAmount("");
      setDescription("");
      setSelectedType([]);
      setCurrency(userCurrency);
      setDate(new Date());
    } catch (error) {
      console.error("Errore:", error);
      Toast.show({
        type: "error",
        text1: t("error_sending"),
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
        <Animated.View style={[ExpensesStyles.container, { opacity: fadeAnim }]}>

          <Text style={ExpensesStyles.header}> 💸 {t("add_new_expense")}</Text>

          {userId === null ? (
            <ActivityIndicator size="large" color="#3498DB" />
          ) : (
            <>
              {/* Campo importo */}
              <View style={ExpensesStyles.inputWrapper}>
                <MaterialIcons
                  name="euro"
                  size={20}
                  color="#3498DB"
                  style={ExpensesStyles.iconLeft}
                />
                <TextInput
                  style={[
                    ExpensesStyles.input,
                    errorFields.amount && ExpensesStyles.errorInput,
                  ]}
                  keyboardType="numeric"
                  placeholder={`${t("amount_label")} (${currency}) *`}
                  placeholderTextColor="#95A5A6"
                  value={amount}
                  onChangeText={setAmount}
                />
                <View style={ExpensesStyles.currencyPickerInside}>
                  <CurrencyPicker
                    currency={currency}
                    setCurrency={setCurrency}
                    compactMode
                  />
                </View>
              </View>

              {/* Campo descrizione */}
              <View style={ExpensesStyles.inputWrapper}>
                <MaterialIcons
                  name="description"
                  size={20}
                  color="#3498DB"
                  style={ExpensesStyles.iconLeft}
                />
                <TextInput
                  style={[
                    ExpensesStyles.input,
                    errorFields.description && ExpensesStyles.errorInput,
                  ]}
                  placeholder={t("description_label")}
                  placeholderTextColor="#95A5A6"
                  value={description}
                  onChangeText={setDescription}
                />
              </View>

              {/* Categoria */}
              <FilterSelector
                selectedFilters={selectedType}
                setSelectedFilters={(filters) =>
                  setSelectedType([filters[filters.length - 1]])
                }
                filterType="spese"
              />

              {/* Data */}
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={ExpensesStyles.datePickerButton}
              >
                <MaterialIcons name="event" size={20} color="#2C3E50" />
                <Text style={ExpensesStyles.datePickerText}>
                  {date.toLocaleDateString("it-IT")}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}

              {/* Pulsante principale */}
              <TouchableOpacity onPress={handleSubmit} disabled={loading}>
                <LinearGradient
                  colors={["#36D1DC", "#5B86E5"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={ExpensesStyles.gradientButton}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={ExpensesStyles.gradientButtonText}>
                      {t("insert_expense")}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Pulsante secondario */}
            <TouchableOpacity
              style={ExpensesStyles.secondaryButton}
              onPress={() => navigation.navigate("Main", { screen: "Expenses" })}
            >
              <Text style={ExpensesStyles.secondaryButtonText}>📊 {t("view_expenses")}</Text>
            </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default InsertExpensesScreen;
