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

  const [errorFields, setErrorFields] = useState({});
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Effetto fade-in
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  // Recupero utente
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
        text1: "Compila tutti i campi obbligatori",
      });
      return;
    }

    if (!userId || !authToken) {
      Toast.show({
        type: "error",
        text1: "Utente non autenticato",
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
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": authToken,
        },
      });
      Toast.show({
        type: "success",
        text1: "Entrata registrata!",
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
        text1: "Errore durante l'invio",
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
        <Animated.View style={[IncomesStyles.container, { opacity: fadeAnim }]}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 15 }}>
            <Text style={[IncomesStyles.header, { marginLeft: 8 }]}>
              💰 Aggiungi una nuova entrata
            </Text>
          </View>

          {userId === null ? (
            <ActivityIndicator size="large" color="#3498DB" />
          ) : (
            <>
              {/* Importo */}
              <View style={IncomesStyles.inputWrapper}>
                <MaterialIcons
                  name="euro"
                  size={20}
                  color="#3498DB"
                  style={IncomesStyles.iconLeft}
                />
                <TextInput
                  style={[
                    IncomesStyles.input,
                    errorFields.amount && IncomesStyles.errorInput,
                  ]}
                  keyboardType="numeric"
                  placeholder={`Importo (${currency}) *`}
                  placeholderTextColor="#95A5A6"
                  value={amount}
                  onChangeText={setAmount}
                />
                <View style={IncomesStyles.currencyPickerInside}>
                  <CurrencyPicker
                    currency={currency}
                    setCurrency={setCurrency}
                    compactMode
                  />
                </View>
              </View>

              {/* Descrizione */}
              <View style={IncomesStyles.inputWrapper}>
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
                  placeholder="Descrizione *"
                  placeholderTextColor="#95A5A6"
                  value={description}
                  onChangeText={setDescription}
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
                  display="default"
                  onChange={handleDateChange}
                />
              )}

              {/* Pulsante principale */}
              <TouchableOpacity onPress={handleSubmit} disabled={loading}>
                <LinearGradient
                  colors={["#43e97b", "#38f9d7"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={IncomesStyles.gradientButton}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={IncomesStyles.gradientButtonText}>
                      Inserisci Entrata
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Pulsante Visualizza Entrate */}
              <TouchableOpacity
                style={IncomesStyles.secondaryButton}
                onPress={() => navigation.navigate("Main", { screen: "Incomes" })}
              >
              <Text style={IncomesStyles.secondaryButtonText}>📊 Visualizza le Entrate</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default InsertIncomesScreen;
