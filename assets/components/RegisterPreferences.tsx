import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import API from "../../config/api";
import EditUserStyles from "../styles/EditUser_style";
import CurrencyPicker from "./personalized_components/CurrencyPicker";
import LoginStyles from "../styles/Login_style";

const CategorySection = ({
  title,
  value,
  onChangeText,
  onAdd,
  data,
  onRemove,
  color,
  chipStyle
}) => {
  const { t } = useTranslation();

  return (
    <View style={[EditUserStyles.sectionBox, { borderLeftColor: color }]}>
      <Text style={EditUserStyles.sectionTitle}>
        {title === "Spese" ? t("expense_categories") : t("income_categories")}
      </Text>

      <View style={EditUserStyles.addRow}>
        <TextInput
          style={EditUserStyles.categoryInput}
          placeholder={
            title === "Spese"
              ? t("add_expense_category_placeholder")
              : t("add_income_category_placeholder")
          }
          value={value}
          onChangeText={onChangeText}
        />
        <TouchableOpacity
          style={[EditUserStyles.addButton, { backgroundColor: color }]}
          onPress={onAdd}
        >
          <Text style={EditUserStyles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={EditUserStyles.chipsContainer}>
        {data.length > 0 ? (
          data.map((item, index) => (
            <View key={index} style={[EditUserStyles.chip, chipStyle]}>
              <Text style={EditUserStyles.chipText}>{item}</Text>
              <TouchableOpacity onPress={() => onRemove(index)}>
                <Text style={{ color: "#fff" }}>✕</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={EditUserStyles.emptyText}>
            {title === "Spese"
              ? t("no_expense_categories")
              : t("no_income_categories")}
          </Text>
        )}
      </View>
    </View>
  );
};

const RegisterPreferences = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { userData } = route.params;

  const [expenses, setExpenses] = useState([
    t("expense_food"),
    t("expense_transport"),
    t("expense_clothing"),
    t("extra")
  ]);
  const [incomes, setIncomes] = useState([
    t("income_salary"),
    t("income_gift"),
    t("extra")
  ]);

  const [currency, setCurrency] = useState("EUR");

  const [newExpense, setNewExpense] = useState("");
  const [newIncome, setNewIncome] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddExpense = () => {
    const trimmed = newExpense.trim();
    if (!trimmed) {
      Toast.show({ type: "info", text1: t("insert_valid_name") });
      return;
    }
    if (expenses.includes(trimmed)) {
      Toast.show({ type: "info", text1: t("category_exists") });
      return;
    }
    setExpenses([...expenses, trimmed]);
    setNewExpense("");
  };

  const handleRemoveExpense = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const handleAddIncome = () => {
    const trimmed = newIncome.trim();
    if (!trimmed) {
      Toast.show({ type: "info", text1: t("insert_valid_name") });
      return;
    }
    if (incomes.includes(trimmed)) {
      Toast.show({ type: "info", text1: t("category_exists") });
      return;
    }
    setIncomes([...incomes, trimmed]);
    setNewIncome("");
  };

  const handleRemoveIncome = (index) => {
    setIncomes(incomes.filter((_, i) => i !== index));
  };

  const handleRegister = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const payload = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        expenses,
        incomes,
        default_currency: currency,
        first_name: userData.first_name || "",
        last_name: userData.last_name || ""
      };

      const response = await axios.post(`${API.BASE_URL}/api/v1/register`, payload);

      if (response.data.success) {
        Toast.show({
          type: "info",
          text1: t("account_created"),
          text2: t("check_email")
        });
        navigation.navigate("Login");
      } else {
        Toast.show({
          type: "error",
          text1: response.data.message || t("error_generic")
        });
      }
    } catch (e) {
      Toast.show({ type: "error", text1: t("error_generic") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={[LoginStyles.scrollContainer]}>
          <Text style={EditUserStyles.title}>{t("preferences_title")}</Text>

          <View style={EditUserStyles.profileCard}>
            <View style={EditUserStyles.profileIconContainer}>
              <Text style={EditUserStyles.profileIconText}>
                {userData.first_name?.[0]?.toUpperCase() || "U"}
              </Text>
            </View>

            <View style={EditUserStyles.profileDetailsContainer}>
              <CurrencyPicker
                currency={currency}
                setCurrency={setCurrency}
                label={t("default_currency")}
              />
            </View>
          </View>

          <CategorySection
            title="Spese"
            value={newExpense}
            onChangeText={setNewExpense}
            onAdd={handleAddExpense}
            data={expenses}
            onRemove={handleRemoveExpense}
            color="#e74c3c"
            chipStyle={EditUserStyles.expenseChip}
          />

          <CategorySection
            title="Entrate"
            value={newIncome}
            onChangeText={setNewIncome}
            onAdd={handleAddIncome}
            data={incomes}
            onRemove={handleRemoveIncome}
            color="#2ecc71"
            chipStyle={EditUserStyles.incomeChip}
          />

          <TouchableOpacity
            style={EditUserStyles.button}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={EditUserStyles.buttonText}>
                {t("complete_registration")}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default RegisterPreferences;
