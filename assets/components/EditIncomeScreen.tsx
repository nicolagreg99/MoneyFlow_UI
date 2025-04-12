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
import IncomesStyles from "../styles/IncomesInsertEdit_style";
import FilterSelector from "./personalized_components/FilterSelector";

const EditIncomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { income } = route.params || {};

  // DEBUG LOGS
  console.log("== ROUTE PARAMS ==");
  console.log(route.params);
  console.log("== INCOME OBJ ==");
  console.log(income);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
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
    if (!income) {
      console.error("❌ Errore: parametro 'income' non trovato!");
      navigation.goBack();
      return;
    }

    // Log valori income
    console.log("📦 Income ricevuta:", income);

    setAmount(income.valore?.toString() || "");
    setDescription(income.descrizione || "");
    setSelectedType([income.tipo]);
    setDate(new Date(income.giorno));

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

    const PATCH_URL = `http://192.168.1.5:5000/api/v1/edit_income/${income.id}`;

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

      console.log("✅ Entrata aggiornata con successo!");
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
    <View style={IncomesStyles.container}>
      <Text style={IncomesStyles.header}>Modifica Entrata</Text>

      <TextInput
        style={[IncomesStyles.input, errorFields.amount && IncomesStyles.errorInput]}
        placeholder="Importo (€) *"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      {errorFields.amount && <Text style={IncomesStyles.errorText}>Inserisci un importo!</Text>}

      <TextInput
        style={[IncomesStyles.input, errorFields.description && IncomesStyles.errorInput]}
        placeholder="Descrizione *"
        value={description}
        onChangeText={setDescription}
      />
      {errorFields.description && <Text style={IncomesStyles.errorText}>Inserisci una descrizione!</Text>}

      <Text style={IncomesStyles.label}>Tipo *</Text>
      <FilterSelector
        selectedFilters={selectedType}
        setSelectedFilters={(filters) => setSelectedType([filters[filters.length - 1]])}
        filterType="entrate"
      />
      {errorFields.selectedType && <Text style={IncomesStyles.errorText}>Seleziona un tipo!</Text>}

      <Text style={IncomesStyles.label}>Data:</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={IncomesStyles.datePickerButton}>
        <Text style={IncomesStyles.datePickerText}>{date.toLocaleDateString()}</Text>
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

      <Animated.View style={[IncomesStyles.successBanner, { opacity: successBannerOpacity }]}>
        <Text style={IncomesStyles.successText}>✅ Entrata modificata!</Text>
      </Animated.View>

      <Animated.View style={[IncomesStyles.errorBanner, { opacity: errorBannerOpacity }]}>
        <Text style={IncomesStyles.errorText}>Errore! Riprova più tardi.</Text>
      </Animated.View>
    </View>
  );
};

export default EditIncomeScreen;
