import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import EditUserStyles from "../styles/EditUser_style";
import API from "../../config/api";
import CurrencyPicker from "./personalized_components/CurrencyPicker";
import { useTranslation } from "react-i18next";

// 🔹 COMPONENTE SEZIONE CATEGORIE
const CategorySection = ({
  title,
  value,
  onChangeText,
  onAdd,
  data,
  onRemove,
  color,
  chipStyle,
}) => {
  const { t } = useTranslation();

  return (
    <View style={[EditUserStyles.sectionBox, { borderLeftColor: color }]}>
      <Text style={EditUserStyles.sectionTitle}>
        {t(title === "Spese" ? "expense_categories" : "income_categories")}
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

const EditUser = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [userData, setUserData] = useState({ first_name: "", last_name: "" });
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [currency, setCurrency] = useState("EUR");

  const [newExpenseCategory, setNewExpenseCategory] = useState("");
  const [newIncomeCategory, setNewIncomeCategory] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) return;
        const response = await axios.get(`${API.BASE_URL}/api/v1/me`, {
          headers: { "x-access-token": token },
        });
        const data = response.data;
        if (data) {
          setUserData({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
          });
          setExpenses(data.expenses_categories || []);
          setIncomes(data.incomes_categories || []);
          setCurrency(data.default_currency || "EUR");
        }
      } catch {
        Toast.show({
          type: "error",
          text1: t("profile_load_error"),
          position: "bottom",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // 🔹 Aggiungi categorie
  const handleAddExpenseCategory = () => {
    const trimmed = newExpenseCategory.trim();
    if (!trimmed) {
      Toast.show({ type: "info", text1: t("insert_valid_name"), position: "bottom" });
      return;
    }
    if (expenses.includes(trimmed)) {
      Toast.show({ type: "info", text1: t("category_exists"), position: "bottom" });
      return;
    }
    setExpenses([...expenses, trimmed]);
    setNewExpenseCategory("");
  };

  const handleRemoveExpenseCategory = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const handleAddIncomeCategory = () => {
    const trimmed = newIncomeCategory.trim();
    if (!trimmed) {
      Toast.show({ type: "info", text1: t("insert_valid_name"), position: "bottom" });
      return;
    }
    if (incomes.includes(trimmed)) {
      Toast.show({ type: "info", text1: t("category_exists"), position: "bottom" });
      return;
    }
    setIncomes([...incomes, trimmed]);
    setNewIncomeCategory("");
  };

  const handleRemoveIncomeCategory = (index) => {
    setIncomes(incomes.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    const payload = {
      ...userData,
      expenses,
      incomes,
      default_currency: currency,
    };

    setUpdating(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      await axios.patch(`${API.BASE_URL}/api/v1/edit_user`, payload, {
        headers: { "x-access-token": token },
      });

      const existingDataString = await AsyncStorage.getItem("userData");
      const existingData = existingDataString ? JSON.parse(existingDataString) : {};
      const updatedUserData = {
        ...existingData,
        first_name: userData.first_name,
        last_name: userData.last_name,
        expenses_categories: expenses,
        incomes_categories: incomes,
        default_currency: currency,
      };
      await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));

      Toast.show({
        type: "success",
        text1: t("profile_updated_success"),
        position: "bottom",
      });
      navigation.navigate("Menu", { refresh: true });
    } catch {
      Toast.show({
        type: "error",
        text1: t("update_error"),
        position: "bottom",
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={EditUserStyles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#16A085" />
      ) : (
        <>
          <Text style={EditUserStyles.title}>{t("edit_profile")}</Text>

          <View style={EditUserStyles.profileCard}>
            <View style={EditUserStyles.profileIconContainer}>
              <Text style={EditUserStyles.profileIconText}>
                {userData.first_name?.[0]?.toUpperCase() || "U"}
              </Text>
            </View>

            <View style={EditUserStyles.profileDetailsContainer}>
              <View style={EditUserStyles.nameContainerSmall}>
                <Text style={EditUserStyles.nameLabelSmall}>
                  {t("first_name")}
                </Text>
                <TextInput
                  style={EditUserStyles.profileNameInput}
                  placeholder={t("first_name")}
                  value={userData.first_name}
                  onChangeText={(text) =>
                    setUserData({ ...userData, first_name: text })
                  }
                />
              </View>

              <View style={[EditUserStyles.nameContainerSmall, { marginTop: 10 }]}>
                <Text style={EditUserStyles.nameLabelSmall}>
                  {t("last_name")}
                </Text>
                <TextInput
                  style={EditUserStyles.profileNameInput}
                  placeholder={t("last_name")}
                  value={userData.last_name}
                  onChangeText={(text) =>
                    setUserData({ ...userData, last_name: text })
                  }
                />
              </View>

              <CurrencyPicker
                currency={currency}
                setCurrency={setCurrency}
                label={t("default_currency")}
              />
            </View>
          </View>

          <CategorySection
            title="Spese"
            value={newExpenseCategory}
            onChangeText={setNewExpenseCategory}
            onAdd={handleAddExpenseCategory}
            data={expenses}
            onRemove={handleRemoveExpenseCategory}
            color="#e74c3c"
            chipStyle={EditUserStyles.expenseChip}
          />

          <CategorySection
            title="Entrate"
            value={newIncomeCategory}
            onChangeText={setNewIncomeCategory}
            onAdd={handleAddIncomeCategory}
            data={incomes}
            onRemove={handleRemoveIncomeCategory}
            color="#2ecc71"
            chipStyle={EditUserStyles.incomeChip}
          />

          <TouchableOpacity
            style={EditUserStyles.button}
            onPress={handleUpdate}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={EditUserStyles.buttonText}>{t("save_changes")}</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default EditUser;
