import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import IncomesStyles from "../styles/IncomesInsertEdit_style";
import FilterSelector from "./personalized_components/FilterSelector";
import API from "../../config/api";
import CurrencyPicker from "./personalized_components/CurrencyPicker";

const API_URL = `${API.BASE_URL}/api/v1/incomes/insert`;

const InsertIncomesScreen = () => {
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

  const [amountFocused, setAmountFocused] = useState(false);
  const [descriptionFocused, setDescriptionFocused] = useState(false);
  const [errorFields, setErrorFields] = useState({
    amount: false,
    description: false,
    selectedType: false,
  });

  // 🔹 Recupera user e valuta da AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const storedUserData = await AsyncStorage.getItem("userData");
        if (!token || !storedUserData) return;

        const user = JSON.parse(storedUserData);
        setAuthToken(token);
        setUserId(user.id);

        const defaultCurrency = user.default_currency || user.currency || "EUR";
        setUserCurrency(defaultCurrency);
        setCurrency(defaultCurrency);
      } catch (error) {
        console.error("Errore nel recupero dati utente:", error);
      }
    };
    loadUserData();
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

    if (Object.values(errors).some(Boolean)) {
      if (errors.amount) {
        Toast.show({
          type: "error",
          text1: "Importo non valido",
          text2: "Inserisci un importo numerico.",
        });
      } else if (errors.description) {
        Toast.show({
          type: "error",
          text1: "Descrizione mancante",
          text2: "Inserisci una breve descrizione dell’entrata.",
        });
      } else if (errors.selectedType) {
        Toast.show({
          type: "error",
          text1: "Categoria mancante",
          text2: "Seleziona una categoria per l’entrata.",
        });
      }
      return;
    }

    if (!userId || !authToken) {
      Toast.show({
        type: "error",
        text1: "Utente non autenticato",
        text2: "Effettua nuovamente il login.",
      });
      return;
    }

    const incomeData = {
      tipo: selectedType[0],
      valore: parseFloat(formattedAmount),
      giorno: date.toISOString().split("T")[0],
      descrizione: description.trim(),
      currency,
      user_id: userId,
    };

    setLoading(true);
    try {
      await axios.post(API_URL, incomeData, {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          "x-access-token": authToken,
        },
      });

      Toast.show({
        type: "success",
        text1: "Entrata registrata con successo!",
        visibilityTime: 2000,
      });

      setAmount("");
      setDescription("");
      setSelectedType([]);
      setCurrency(userCurrency);
      setDate(new Date());
    } catch (error) {
      console.error("Errore nell'invio:", error);
      Toast.show({
        type: "error",
        text1: "Errore durante l'invio",
        text2: "Controlla la connessione o riprova più tardi.",
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={IncomesStyles.container}>
      <Text style={IncomesStyles.header}>Inserisci una nuova entrata</Text>

      {userId === null ? (
        <ActivityIndicator size="large" color="#3498DB" />
      ) : (
        <>
          {/* Importo */}
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
                placeholderTextColor="#33a6aeff"
              />

              {/* Selettore valuta */}
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

          {/* Descrizione */}
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

          {/* Tipo */}
          <FilterSelector
            selectedFilters={selectedType}
            setSelectedFilters={(filters) =>
              setSelectedType([filters[filters.length - 1]])
            }
            filterType="entrate"
          />

          {/* Data */}
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
              display="default"
              onChange={handleDateChange}
            />
          )}

          {/* Pulsante invio */}
          <TouchableOpacity
            style={[IncomesStyles.button, loading && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={IncomesStyles.buttonText}>
              {loading ? "Invio..." : "Inserisci Entrata"}
            </Text>
          </TouchableOpacity>

          {/* Pulsante visualizza entrate */}
          <TouchableOpacity
            style={IncomesStyles.linkButton}
            onPress={() => navigation.navigate("IncomesView")}
          >
            <Text style={IncomesStyles.linkButtonText}>
              📊 Visualizza le Entrate
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default InsertIncomesScreen;
