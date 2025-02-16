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
import IncomesStyles from "../styles/IncomesInsert_style";
import FilterSelector from "./personalized_components/FilterSelector";

const API_URL = "http://192.168.1.5:5000/entrate"; // API per le entrate
const ME_URL = "http://192.168.1.5:5000/me";

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
      if (!token) {
        return;
      }
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
    const errors = {
      amount: !amount.trim(),
      description: !description.trim(),
      selectedType: selectedType.length === 0,
    };
    setErrorFields(errors);

    if (Object.values(errors).some((err) => err) || !userId || !authToken) {
      return;
    }

    const incomeData = {
      tipo: selectedType[0],
      valore: parseFloat(amount),
      giorno: date.toISOString().split("T")[0],
      descrizione: description.trim(),
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
    <View style={IncomesStyles.container}>
      <Text style={IncomesStyles.header}>Inserisci una nuova entrata</Text>

      {userId === null ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <>
          <TextInput
            style={[
              IncomesStyles.input,
              errorFields.amount && IncomesStyles.errorInput,
            ]}
            placeholder="Importo (€) *"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          {errorFields.amount && <Text style={IncomesStyles.errorText}>Inserisci un importo!</Text>}

          <TextInput
            style={[
              IncomesStyles.input,
              errorFields.description && IncomesStyles.errorInput,
            ]}
            placeholder="Descrizione *"
            value={description}
            onChangeText={setDescription}
          />
          {errorFields.description && <Text style={IncomesStyles.errorText}>Inserisci una descrizione!</Text>}

          <Text style={IncomesStyles.label}>Seleziona il tipo: *</Text>
          <FilterSelector selectedFilters={selectedType} setSelectedFilters={(filters) => setSelectedType([filters[filters.length - 1]])} filterType="entrate"/>
          {errorFields.selectedType && <Text style={IncomesStyles.errorText}>Seleziona un tipo!</Text>}

          <Text style={IncomesStyles.label}>Seleziona la data:</Text>
          <TouchableOpacity onPress={openDatePicker} style={IncomesStyles.datePickerButton}>
            <Text style={IncomesStyles.datePickerText}>
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
            style={[IncomesStyles.button, loading && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={IncomesStyles.buttonText}>
              {loading ? "Invio..." : "Inserisci Entrata"}
            </Text>
          </TouchableOpacity>

          {/* 🔹 Link per visualizzare le entrate */}
          <TouchableOpacity
            style={IncomesStyles.linkButton}
            onPress={() => navigation.navigate("IncomesView")}
            >
            <Text style={IncomesStyles.linkButtonText}>📊 Visualizza le Entrate</Text>
          </TouchableOpacity>

          {/* Banner di Successo */}
          <Animated.View
            style={[
              IncomesStyles.successBanner,
              { opacity: successBannerOpacity },
            ]}
          >
            <Text style={IncomesStyles.successText}>✅ Entrata registrata con successo!</Text>
          </Animated.View>

          {/* Banner di Errore */}
          <Animated.View
            style={[
              IncomesStyles.errorBanner,
              { opacity: errorBannerOpacity },
            ]}
          >
            <Text style={IncomesStyles.errorText}> Errore! Riprova più tardi.</Text>
          </Animated.View>
        </>
      )}
    </View>
  );
};

export default InsertIncomesScreen;
