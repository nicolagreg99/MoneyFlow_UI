import React, { useState, useEffect } from "react";
import { 
  View, Text, ScrollView, ActivityIndicator, TouchableOpacity 
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import ExpensesStyles from "../styles/Expenses_style";
import DateRangePicker from "./personalized_components/DateRangePicker";
import FilterSelector from "./personalized_components/FilterSelector";
import PieChartGraph from "./personalized_components/PieChart";
import { Ionicons } from "@expo/vector-icons";

const ExpensesScreen = () => {
  const navigation = useNavigation();

  // 📆 Date iniziali
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // 🔹 Stati
  const [fromDate, setFromDate] = useState(firstDayOfMonth);
  const [toDate, setToDate] = useState(today);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Colori grafico
  const fixedColors = {
    Cibo: "#FF6384",
    Trasporto: "#36A2EB",
    Vestiti: "#FFCE56",
    Regalo: "#4BC0C0",
    Extra: "#9966FF",
    Altro: "#AAAAAA",
  };

  // 📌 Recupera il token utente
  const getToken = async () => {
    try {
      return await AsyncStorage.getItem("authToken");
    } catch (error) {
      console.error("Errore nel recupero del token:", error);
      return null;
    }
  };

  // 📌 Costruisce la query string per i filtri
  const buildQueryParams = () => {
    let params = new URLSearchParams();
    params.append("from_date", fromDate.toISOString().split("T")[0]);
    params.append("to_date", toDate.toISOString().split("T")[0]);
    selectedFilters.forEach((filter) => params.append("tipo", filter));
    return params.toString();
  };

  // 📌 Fetch API per spese totali e grafico
  const fetchExpensesData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) {
        setError("Token non trovato");
        setLoading(false);
        return;
      }

      const params = buildQueryParams();

      // 🔹 Richiesta per il totale spese
      const totalResponse = await axios.get(`http://192.168.1.5:5000/spese/totale?${params}`, {
        headers: { "x-access-token": token },
      });
      setTotalExpenses(parseFloat(totalResponse.data.total) || 0);

      // 🔹 Richiesta per i dati del grafico
      const chartResponse = await axios.get(`http://192.168.1.5:5000/spese/totale_per_tipo?${params}`, {
        headers: { "x-access-token": token },
      });

      if (chartResponse.data && Array.isArray(chartResponse.data) && chartResponse.data.length > 0) {
        const formattedData = chartResponse.data.map((item) => ({
          name: item.tipo,
          value: parseFloat(item.totale_per_tipo) || 0,
          color: fixedColors[item.tipo] || fixedColors["Altro"],
        }));
        setChartData(formattedData);
      } else {
        setChartData([]);
        setError(chartResponse.data.messaggio || "Nessun dato disponibile");
      }
    } catch (error) {
      console.error("Errore durante la richiesta:", error.response?.data || error.message);
      setError("Errore nel recupero dei dati");
    }

    setLoading(false);
  };

  // 📌 Reset filtri
  const resetFilters = () => {
    setFromDate(firstDayOfMonth);
    setToDate(today);
    setSelectedFilters([]);
  };

  // 📌 Effettua la chiamata API quando cambiano le date o i filtri
  useEffect(() => {
    fetchExpensesData();
  }, [fromDate, toDate, selectedFilters]);

  return (
    <ScrollView contentContainerStyle={ExpensesStyles.scrollContainer}>
      <View style={ExpensesStyles.container}>
        
        {/* 🔹 Titolo + Refresh */}
        <View style={ExpensesStyles.titleContainer}>
          <Text style={ExpensesStyles.title}>Le tue spese</Text>
          <TouchableOpacity style={ExpensesStyles.refreshButton} onPress={resetFilters}>
            <Ionicons name="refresh" size={30} color="#555" />
          </TouchableOpacity>
        </View>

        {/* 🔹 Pulsante per inserire spesa */}
        <TouchableOpacity 
          style={ExpensesStyles.addExpenseButton}
          onPress={() => navigation.navigate("InsertExpenses")}
        >
          <Ionicons name="add-circle-outline" size={30} color="#fff" />
          <Text style={ExpensesStyles.addExpenseText}>Inserisci Spesa</Text>
        </TouchableOpacity>

        {/* 📅 Selettori date */}
        <DateRangePicker fromDate={fromDate} setFromDate={setFromDate} toDate={toDate} setToDate={setToDate} />

        {/* 🔹 Filtri */}
        <FilterSelector selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters}  filterType="spese"         />

        {/* 💰 Totale Spese */}
        <View style={ExpensesStyles.totalContainer}>
          <Text style={ExpensesStyles.totalText}>Totale spese</Text>
          <Text style={ExpensesStyles.totalAmount}>
            {totalExpenses !== 0 ? `€${totalExpenses.toFixed(2)}` : "0,00 €"}
          </Text>
        </View>

        {/* 📊 Stato del caricamento o dati */}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text style={ExpensesStyles.errorText}>{error}</Text>
        ) : chartData.length > 0 ? (
          <PieChartGraph data={chartData} total={totalExpenses} />
        ) : (
          <Text style={ExpensesStyles.noDataText}>Nessun dato disponibile</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default ExpensesScreen;
