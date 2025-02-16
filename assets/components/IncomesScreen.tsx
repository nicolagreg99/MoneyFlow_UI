import React, { useState, useEffect } from "react";
import { 
  View, Text, ScrollView, ActivityIndicator, TouchableOpacity 
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import IncomesStyles from "../styles/Incomes_style";
import DateRangePicker from "./personalized_components/DateRangePicker";
import FilterSelector from "./personalized_components/FilterSelector";
import PieChartGraph from "./personalized_components/PieChart";
import { Ionicons } from "@expo/vector-icons";

const IncomesScreen = () => {
  const navigation = useNavigation();

  // 📆 Date iniziali
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // 🔹 Stati
  const [fromDate, setFromDate] = useState(firstDayOfMonth);
  const [toDate, setToDate] = useState(today);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [totalIncomes, setTotalIncomes] = useState<number>(0);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Colori grafico
  const fixedColors = {
    Stipendio: "#FFCE56",
    Investimenti: "#4BC0C0",
    Regalo: "#FF6384",
    Extra: "#36A2EB",
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

  // 📌 Fetch API per entrate totali e grafico
  const fetchIncomesData = async () => {
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

      // 🔹 Richiesta per il totale entrate
      const totalResponse = await axios.get(`http://192.168.1.5:5000/entrate/totale?${params}`, {
        headers: { "x-access-token": token },
      });
      setTotalIncomes(parseFloat(totalResponse.data.total) || 0);

      // 🔹 Richiesta per i dati del grafico
      const chartResponse = await axios.get(`http://192.168.1.5:5000/entrate/totale_per_tipo?${params}`, {
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
    fetchIncomesData();
  }, [fromDate, toDate, selectedFilters]);

  return (
    <ScrollView contentContainerStyle={IncomesStyles.scrollContainer}>
      <View style={IncomesStyles.container}>
        
        {/* 🔹 Titolo + Refresh */}
        <View style={IncomesStyles.titleContainer}>
          <Text style={IncomesStyles.title}>Le tue entrate</Text>
          <TouchableOpacity style={IncomesStyles.refreshButton} onPress={resetFilters}>
            <Ionicons name="refresh" size={30} color="#555" />
          </TouchableOpacity>
        </View>

        {/* 🔹 Pulsante per inserire entrata */}
        <TouchableOpacity 
          style={IncomesStyles.addIncomesButton}
          onPress={() => navigation.navigate("InsertIncomes")}
        >
          <Ionicons name="add-circle-outline" size={30} color="#fff" />
          <Text style={IncomesStyles.addIncomesText}>Inserisci Entrata</Text>
        </TouchableOpacity>

        {/* 📅 Selettori date */}
        <DateRangePicker fromDate={fromDate} setFromDate={setFromDate} toDate={toDate} setToDate={setToDate} />

        {/* 🔹 Filtri */}
        <FilterSelector selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters}   filterType="entrate" />

        {/* 🏆 Totale Entrate */}
        <View style={IncomesStyles.totalContainer}>
          <Text style={IncomesStyles.totalText}>Totale entrate</Text>
          <Text style={IncomesStyles.totalAmount}>
            {totalIncomes !== 0 ? `€${totalIncomes.toFixed(2)}` : "0,00 €"}
          </Text>
        </View>

        {/* 📊 Stato del caricamento o dati */}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text style={IncomesStyles.errorText}>{error}</Text>
        ) : chartData.length > 0 ? (
          <PieChartGraph data={chartData} total={totalIncomes} />
        ) : (
          <Text style={IncomesStyles.noDataText}>Nessun dato disponibile</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default IncomesScreen;
