import React, { useState, useEffect } from "react";
import { 
  View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Modal 
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import IncomesStyle from "../styles/Incomes_style";
import DateRangePicker from "./personalized_components/DateRangePicker";
import FilterSelector from "./personalized_components/FilterSelector";
import PieChartGraph from "./personalized_components/PieChart";
import TransactionList from "./personalized_components/TransactionList";
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
  const [isModalVisible, setModalVisible] = useState(false);
  const [incomesList, setIncomesList] = useState([]);

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

  // 📌 Fetch lista entrate (Visualizza Entrate)
  const fetchIncomesList = async () => {
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
      // Utilizzo dell'API indicata
      const response = await axios.get(
        `http://192.168.1.5:5000/entrate/lista_entrate?${params}`,
        { headers: { "x-access-token": token } }
      );

      if (response.data && Array.isArray(response.data)) {
        setIncomesList(response.data);
        setModalVisible(true);
      } else {
        setIncomesList([]);
        setError("Nessuna entrata trovata per il periodo selezionato.");
      }
    } catch (error) {
      console.error("Errore durante il recupero della lista delle entrate:", error.response?.data || error.message);
      setError("Errore nel recupero dei dati della lista");
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
    <ScrollView contentContainerStyle={IncomesStyle.scrollContainer}>
      <View style={IncomesStyle.container}>
        
        {/* 🔝 Titolo */}
        <View style={IncomesStyle.titleContainer}>
          <Text style={IncomesStyle.title}>Gestione Entrate</Text>
        </View>
        
        {/* 🔹 Azioni (su due livelli separati) */}
        <View style={IncomesStyle.actionsContainer}>
          {/* Pulsante per inserire entrata (solo icona) */}
          <TouchableOpacity 
            style={IncomesStyle.iconButton}
            onPress={() => navigation.navigate("InsertIncomes")}
          >
            <Ionicons name="add-circle-outline" size={30} color="#fff" />
          </TouchableOpacity>
          {/* Pulsante per visualizzare le entrate (solo icona) */}
          <TouchableOpacity 
            style={IncomesStyle.iconButton}
            onPress={fetchIncomesList}
          >
            <Ionicons name="list-outline" size={30} color="#fff" />
          </TouchableOpacity>
          {/* Pulsante di refresh */}
          <TouchableOpacity 
            style={IncomesStyle.refreshButton}
            onPress={resetFilters}
          >
            <Ionicons name="refresh" size={30} color="#555" />
          </TouchableOpacity>
        </View>

        {/* 📅 Selettori date */}
        <DateRangePicker 
          fromDate={fromDate} 
          setFromDate={setFromDate} 
          toDate={toDate} 
          setToDate={setToDate} 
        />

        {/* 🔹 Filtri */}
        <FilterSelector 
          selectedFilters={selectedFilters} 
          setSelectedFilters={setSelectedFilters} 
          filterType="entrate" 
        />

        {/* 🏆 Totale Entrate */}
        <View style={IncomesStyle.totalContainer}>
          <Text style={IncomesStyle.totalText}>Totale entrate</Text>
          <Text style={IncomesStyle.totalAmount}>
            {totalIncomes !== 0 ? `€${totalIncomes.toFixed(2)}` : "0,00 €"}
          </Text>
        </View>

        {/* 📊 Stato del caricamento o dati */}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text style={IncomesStyle.errorText}>{error}</Text>
        ) : chartData.length > 0 ? (
          <PieChartGraph data={chartData} total={totalIncomes} />
        ) : (
          <Text style={IncomesStyle.noDataText}>Nessun dato disponibile</Text>
        )}

        {/* 🟠 Modale per la lista delle entrate */}
        <Modal visible={isModalVisible} animationType="slide" transparent={false}>
          <TransactionList transactions={incomesList} onClose={() => setModalVisible(false)} />
        </Modal>
      </View>
    </ScrollView>
  );
};

export default IncomesScreen;
