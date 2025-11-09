import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import IncomesStyles from "../styles/IncomesInsertEdit_style";
import FilterSelector from "./personalized_components/FilterSelector";
import CurrencyPicker from "./personalized_components/CurrencyPicker";
import API from "../../config/api";
import Toast from "react-native-toast-message";

const EditIncomeScreen = () => {
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [errorFields, setErrorFields] = useState({
    amount: false,
    description: false,
    selectedType: false,
  });

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
    };

    setErrorFields(errors);

    if (Object.values(errors).some(Boolean) || !authToken) return;

    const payload = {
      tipo: selectedType[0],
      valore: parseFloat(formattedAmount),
      giorno: date.toISOString().split("T")[0],
      descrizione: description.trim(),
      currency,
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
        text1: "Entrata modificata con successo",
        position: "bottom",
      });

      setTimeout(() => navigation.goBack(), 1500);
    } catch (error) {
      console.error("Errore aggiornamento:", error);
      Toast.show({
        type: "error",
        text1: "Errore durante la modifica",
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={IncomesStyles.container}>
      <Text style={IncomesStyles.header}>Modifica Entrata</Text>

      <View style={[IncomesStyles.inputWrapper, { position: "relative" }]}>
        {(amount.length > 0 || amountFocused) && (
          <Text style={IncomesStyles.floatingLabel}>Importo *</Text>
        )}

        <View style={{ position: "relative", justifyContent: "center" }}>
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
              amount.length > 0 || amountFocused ? "" : `Importo (${currency}) *`
            }
            placeholderTextColor="#7F8C8D"
          />

          <View
            style={{
              position: "absolute",
              right: 10,
              top: 0,
              bottom: 0,
              justifyContent: "center",
              transform: [{ translateY: -6 }],
            }}
          >
            <CurrencyPicker
              currency={currency}
              setCurrency={setCurrency}
              compactMode
            />
          </View>
        </View>
      </View>
      {errorFields.amount && (
        <Text style={IncomesStyles.errorText}>Inserisci un importo!</Text>
      )}

      <View style={IncomesStyles.inputWrapper}>
        {(description.length > 0 || descriptionFocused) && (
          <Text style={IncomesStyles.floatingLabel}>Descrizione *</Text>
        )}
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
            description.length > 0 || descriptionFocused ? "" : "Descrizione *"
          }
          placeholderTextColor="#7F8C8D"
        />
      </View>
      {errorFields.description && (
        <Text style={IncomesStyles.errorText}>Inserisci una descrizione!</Text>
      )}

      <Text style={IncomesStyles.label}>Tipo *</Text>
      <FilterSelector
        selectedFilters={selectedType}
        setSelectedFilters={(filters) =>
          setSelectedType([filters[filters.length - 1]])
        }
        filterType="entrate"
      />
      {errorFields.selectedType && (
        <Text style={IncomesStyles.errorText}>Seleziona un tipo!</Text>
      )}

      <Text style={IncomesStyles.label}>Data:</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={IncomesStyles.datePickerButton}
      >
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

      <TouchableOpacity
        style={[IncomesStyles.button, loading && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={IncomesStyles.buttonText}>
          {loading ? "Salvataggio..." : "Salva Modifiche"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditIncomeScreen;
