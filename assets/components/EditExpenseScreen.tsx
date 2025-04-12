import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import ExpensesStyles from "../styles/ExpensesInsertEdit_style";
import FilterSelector from "./personalized_components/FilterSelector";

const EditExpenseScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { expense } = route.params || {};

  const [amount, setAmount] = useState("");
  const [amountFocused, setAmountFocused] = useState(false);

  const [description, setDescription] = useState("");
  const [descriptionFocused, setDescriptionFocused] = useState(false);

  const [selectedType, setSelectedType] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [errorFields, setErrorFields] = useState({
    amount: false,
    description: false,
    selectedType: false,
  });

  const successBannerOpacity = useRef(new Animated.Value(0)).current;
  const errorBannerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!expense) {
      console.error("❌ Errore: parametro 'expense' non trovato!");
      navigation.goBack();
      return;
    }

    console.log("📦 Expense ricevuta:", expense);

    setAmount(expense.valore?.toString() || "");
    setDescription(expense.descrizione || "");
    setSelectedType([expense.tipo]);
    setDate(new Date(expense.giorno));

    const fetchToken = async () => {
      const token = await AsyncStorage.getItem("authToken");
      setAuthToken(token);
    };
    fetchToken();
  }, []);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const showBanner = (bannerOpacity: Animated.Value) => {
    Animated.sequence([
      Animated.timing(bannerOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(bannerOpacity, {
        toValue: 0,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSubmit = async () => {
    const formattedAmount = amount.replace(",", ".");

    const errors = {
      amount: !formattedAmount.trim() || isNaN(formattedAmount),
      description: !description.trim(),
      selectedType: selectedType.length === 0,
    };

    setErrorFields(errors);

    if (Object.values(errors).some((err) => err) || !authToken) return;

    const payload = {
      tipo: selectedType[0],
      valore: parseFloat(formattedAmount),
      giorno: date.toISOString().split("T")[0],
      descrizione: description.trim(),
    };

    const PATCH_URL = `https://backend.money-app-api.com/api/v1/edit_expense/${expense.id}`;

    console.log("🔧 Invio PATCH a:", PATCH_URL);
    console.log("📤 Payload:", payload);

    setLoading(true);

    try {
      await axios.patch(PATCH_URL, payload, {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": authToken,
        },
      });

      console.log("✅ Spesa aggiornata con successo!");
      showBanner(successBannerOpacity);
      setTimeout(() => navigation.goBack(), 1500);
    } catch (error) {
      console.error("❌ Errore aggiornamento:", error);
      showBanner(errorBannerOpacity);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={ExpensesStyles.container}>
      <Text style={ExpensesStyles.header}>Modifica Spesa</Text>

      {/* Importo */}
      <View style={ExpensesStyles.inputWrapper}>
        {(amount.length > 0 || amountFocused) && (
          <Text style={ExpensesStyles.floatingLabel}>Importo (€) *</Text>
        )}
        <TextInput
          style={[
            ExpensesStyles.input,
            errorFields.amount && ExpensesStyles.errorInput,
          ]}
          onFocus={() => setAmountFocused(true)}
          onBlur={() => setAmountFocused(false)}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          placeholder={amount.length > 0 || amountFocused ? "" : "Importo (€) *"}
        />
      </View>
      {errorFields.amount && (
        <Text style={ExpensesStyles.errorText}>Inserisci un importo!</Text>
      )}

      {/* Descrizione */}
      <View style={ExpensesStyles.inputWrapper}>
        {(description.length > 0 || descriptionFocused) && (
          <Text style={ExpensesStyles.floatingLabel}>Descrizione *</Text>
        )}
        <TextInput
          style={[
            ExpensesStyles.input,
            errorFields.description && ExpensesStyles.errorInput,
          ]}
          onFocus={() => setDescriptionFocused(true)}
          onBlur={() => setDescriptionFocused(false)}
          value={description}
          onChangeText={setDescription}
          placeholder={description.length > 0 || descriptionFocused ? "" : "Descrizione *"}
        />
      </View>
      {errorFields.description && (
        <Text style={ExpensesStyles.errorText}>Inserisci una descrizione!</Text>
      )}

      <Text style={ExpensesStyles.label}>Tipo *</Text>
      <FilterSelector
        selectedFilters={selectedType}
        setSelectedFilters={(filters) => setSelectedType([filters[filters.length - 1]])}
        filterType="spese"
      />
      {errorFields.selectedType && (
        <Text style={ExpensesStyles.errorText}>Seleziona un tipo!</Text>
      )}

      <Text style={ExpensesStyles.label}>Data:</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={ExpensesStyles.datePickerButton}>
        <Text style={ExpensesStyles.datePickerText}>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      )}

      <TouchableOpacity
        style={[ExpensesStyles.button, loading && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={ExpensesStyles.buttonText}>
          {loading ? "Salvataggio..." : "Salva Modifiche"}
        </Text>
      </TouchableOpacity>

      <Animated.View style={[ExpensesStyles.successBanner, { opacity: successBannerOpacity }]}>
        <Text style={ExpensesStyles.successText}>✅ Spesa modificata!</Text>
      </Animated.View>

      <Animated.View style={[ExpensesStyles.errorBanner, { opacity: errorBannerOpacity }]}>
        <Text style={ExpensesStyles.errorText}>Errore! Riprova più tardi.</Text>
      </Animated.View>
    </View>
  );
};

export default EditExpenseScreen;
