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
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ExpensesStyles from "../styles/ExpensesInsert_style";
import FilterSelector from "./personalized_components/FilterSelector";

const API_URL = "https://backend.money-app-api.com/api/v1/incomes/insert";
const ME_URL = "https://backend.money-app-api.com/api/v1/me";

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
    // Modifica dell'importo per sostituire la virgola con il punto
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
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={ExpensesStyles.container}>
            <Text style={ExpensesStyles.header}>Inserisci una nuova entrata</Text>

            {userId === null ? (
              <ActivityIndicator size="large" color="#3498DB" />
            ) : (
              <>
                {/* Banner di successo */}
                <Animated.View style={[ExpensesStyles.successBanner, { opacity: successBannerOpacity }]}>
                  <Text style={ExpensesStyles.successText}>Entrata inserita con successo!</Text>
                </Animated.View>

                {/* Banner di errore */}
                <Animated.View style={[ExpensesStyles.errorBanner, { opacity: errorBannerOpacity }]}>
                  <Text style={ExpensesStyles.errorText}>Errore nell'inserimento!</Text>
                </Animated.View>

                <TextInput
                  style={[
                    ExpensesStyles.input,
                    errorFields.amount && ExpensesStyles.errorInput,
                  ]}
                  placeholder="Importo (€) *"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
                {errorFields.amount && <Text style={ExpensesStyles.errorText}>Inserisci un importo!</Text>}

                <TextInput
                  style={[
                    ExpensesStyles.input,
                    errorFields.description && ExpensesStyles.errorInput,
                  ]}
                  placeholder="Descrizione *"
                  value={description}
                  onChangeText={setDescription}
                />
                {errorFields.description && <Text style={ExpensesStyles.errorText}>Inserisci una descrizione!</Text>}

                <Text style={ExpensesStyles.label}>Seleziona il tipo: *</Text>
                <FilterSelector selectedFilters={selectedType} setSelectedFilters={(filters) => setSelectedType([filters[filters.length - 1]])} filterType="entrate"/>
                {errorFields.selectedType && <Text style={ExpensesStyles.errorText}>Seleziona un tipo!</Text>}

                <Text style={ExpensesStyles.label}>Seleziona la data:</Text>
                <TouchableOpacity onPress={openDatePicker} style={ExpensesStyles.datePickerButton}>
                  <Text style={ExpensesStyles.datePickerText}>
                    {date.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} />
                )}

                <TouchableOpacity style={[ExpensesStyles.button, loading && { opacity: 0.6 }]} onPress={handleSubmit} disabled={loading}>
                  <Text style={ExpensesStyles.buttonText}>{loading ? "Invio..." : "Inserisci Entrata"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={ExpensesStyles.linkButton}
                  onPress={() => navigation.navigate("IncomesView")}
                  >
                  <Text style={ExpensesStyles.linkButtonText}>📊 Visualizza le Entrate</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

export default InsertExpensesScreen;
