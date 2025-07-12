import React, { useState, useEffect, useRef } from "react";
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
import { useNavigation } from "@react-navigation/native";
import ExpensesStyles from "../styles/ExpensesInsertEdit_style";
import FilterSelector from "./personalized_components/FilterSelector";
import API from "../../config/api";

const API_URL = `${API.BASE_URL}/api/v1/expenses/insert`;
const ME_URL = `${API.BASE_URL}/api/v1/me`;

const InsertExpensesScreen = () => {
  const navigation = useNavigation();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedType, setSelectedType] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [amountFocused, setAmountFocused] = useState(false);
  const [descriptionFocused, setDescriptionFocused] = useState(false);
  const [errorFields, setErrorFields] = useState({
    amount: false,
    description: false,
    selectedType: false,
  });

  const successBannerOpacity = useRef(new Animated.Value(0)).current;
  const errorBannerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;
      setAuthToken(token);

      const response = await axios.get(ME_URL, {
        headers: { "x-access-token": token },
      });

      setUserId(response.data.id);
    } catch (error) {
      console.error("Errore nel recupero utente:", error);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const openDatePicker = () => {
    if (Platform.OS === "android") {
      setShowDatePicker(true);
    }
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
    const formattedAmount = amount.replace(',', '.');

    const errors = {
      amount: !formattedAmount.trim() || isNaN(formattedAmount),
      description: !description.trim(),
      selectedType: selectedType.length === 0,
    };

    setErrorFields(errors);

    if (Object.values(errors).some((err) => err) || !userId || !authToken) {
      return;
    }

    const expenseData = {
      tipo: selectedType[0],
      valore: parseFloat(formattedAmount),
      giorno: date.toISOString().split("T")[0],
      descrizione: description.trim(),
      user_id: userId,
    };

    setLoading(true);

    try {
      await axios.post(API_URL, expenseData, {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          "x-access-token": authToken,
        },
      });

      showBanner(successBannerOpacity);

      setAmount("");
      setDescription("");
      setSelectedType([]);
      setDate(new Date());
    } catch (error) {
      console.error("Errore nell'invio:", error);
      showBanner(errorBannerOpacity);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={ExpensesStyles.container}>
      <Text style={ExpensesStyles.header}>Inserisci una nuova spesa</Text>

      {userId === null ? (
        <ActivityIndicator size="large" color="#3498DB" />
      ) : (
        <>
          {/* Floating Label - Amount */}
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
              placeholderTextColor="#7F8C8D"
            />
          </View>
          {errorFields.amount && <Text style={ExpensesStyles.errorText}>Inserisci un importo!</Text>}

          {/* Floating Label - Description */}
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
              placeholderTextColor="#7F8C8D"
            />
          </View>
          {errorFields.description && <Text style={ExpensesStyles.errorText}>Inserisci una descrizione!</Text>}

          <FilterSelector
            selectedFilters={selectedType}
            setSelectedFilters={(filters) => setSelectedType([filters[filters.length - 1]])}
            filterType="spese"
          />
          {errorFields.selectedType && <Text style={ExpensesStyles.errorText}>Seleziona un tipo!</Text>}

          <Text style={ExpensesStyles.label}>Seleziona la data:</Text>
          <TouchableOpacity onPress={openDatePicker} style={ExpensesStyles.datePickerButton}>
            <Text style={ExpensesStyles.datePickerText}>
              {date.toLocaleDateString()}
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

          <TouchableOpacity
            style={[ExpensesStyles.button, loading && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={ExpensesStyles.buttonText}>
              {loading ? "Invio..." : "Inserisci Spesa"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={ExpensesStyles.linkButton}
            onPress={() => navigation.navigate("ExpensesView")}
          >
            <Text style={ExpensesStyles.linkButtonText}>📊 Visualizza le Spese</Text>
          </TouchableOpacity>

          <Animated.View
            style={[
              ExpensesStyles.successBanner,
              { opacity: successBannerOpacity },
            ]}
          >
            <Text style={ExpensesStyles.successText}>✅ Spesa registrata con successo!</Text>
          </Animated.View>

          <Animated.View
            style={[
              ExpensesStyles.errorBanner,
              { opacity: errorBannerOpacity },
            ]}
          >
            <Text style={ExpensesStyles.errorText}>Errore! Riprova più tardi.</Text>
          </Animated.View>
        </>
      )}
    </View>
  );
};

export default InsertExpensesScreen;
