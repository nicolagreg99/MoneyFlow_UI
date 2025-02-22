import React, { useState, useEffect } from "react";
import { 
  View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Modal 
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import ExpensesStyles from "../styles/Expenses_style";
import DateRangePicker from "./personalized_components/DateRangePicker";
import FilterSelector from "./personalized_components/FilterSelector";
import PieChartGraph from "./personalized_components/PieChart";
import TransactionList from "./personalized_components/TransactionList";
import { Ionicons } from "@expo/vector-icons";

const ExpensesScreen = () => {
  const navigation = useNavigation();

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [fromDate, setFromDate] = useState(firstDayOfMonth);
  const [toDate, setToDate] = useState(today);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalVisible, setModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);

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

  // 📊 Recupera i dati delle spese e del grafico
  const fetchExpensesData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) {
        setError("Token non trovato. Effettua nuovamente il login.");
        setLoading(false);
        return;
      }

      const params = buildQueryParams();

      const [totalResponse, chartResponse] = await Promise.all([
        axios.get(`http://192.168.1.5:5000/spese/totale?${params}`, {
          headers: { "x-access-token": token },
        }),
        axios.get(`http://192.168.1.5:5000/spese/totale_per_tipo?${params}`, {
          headers: { "x-access-token": token },
        }),
      ]);

      setTotalExpenses(parseFloat(totalResponse.data.total) || 0);

      if (chartResponse.data && Array.isArray(chartResponse.data) && chartResponse.data.length > 0) {
        const formattedData = chartResponse.data.map((item) => ({
          name: item.tipo,
          value: parseFloat(item.totale_per_tipo) || 0,
          color: fixedColors[item.tipo] || fixedColors["Altro"],
        }));
        setChartData(formattedData);
      } else {
        setChartData([]);
        setError("Nessun dato disponibile per il grafico.");
      }
    } catch (error) {
      console.error("Errore durante la richiesta:", error.response?.data || error.message);
      setError("Errore nel recupero dei dati. Controlla la tua connessione.");
    } finally {
      setLoading(false);
    }
  };

  // 🧾 Recupera la lista delle transazioni
  const fetchTransactionList = async () => {
    setLoading(true);

    try {
      const token = await getToken();
      if (!token) {
        setError("Token non trovato. Effettua nuovamente il login.");
        setLoading(false);
        return;
      }

      const params = buildQueryParams();
      const response = await axios.get(`http://192.168.1.5:5000/spese/lista_spese?${params}`, {
        headers: { "x-access-token": token },
      });

      if (response.data && Array.isArray(response.data)) {
        setTransactions(response.data);
        setModalVisible(true);
      } else {
        setTransactions([]);
        setError("Nessuna transazione trovata per il periodo selezionato.");
      }
    } catch (error) {
      console.error("Errore durante il recupero delle transazioni:", error.response?.data || error.message);
      setError("Errore nel recupero delle transazioni.");
    } finally {
      setLoading(false);
    }
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
        
        {/* 🔝 Titolo */}
        <View style={ExpensesStyles.titleContainer}>
          <Text style={ExpensesStyles.title}>Gestione Spese</Text>
        </View>
        
        {/* 🔹 Icone delle azioni */}
        <View style={ExpensesStyles.actionsContainer}>
          <TouchableOpacity 
            style={ExpensesStyles.iconButton}
            onPress={() => navigation.navigate("InsertExpenses")}
          >
            <Ionicons name="add-circle-outline" size={30} color="#3498DB" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={ExpensesStyles.iconButton}
            onPress={fetchTransactionList}
          >
            <Ionicons name="list-outline" size={30} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={ExpensesStyles.iconButton}
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
          filterType="spese" 
        />
  
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
  
        {/* 🟠 Modale con la lista delle transazioni */}
        <Modal visible={isModalVisible} animationType="slide" transparent={false}>
          <TransactionList transactions={transactions} onClose={() => setModalVisible(false)} />
        </Modal>
        
      </View>
    </ScrollView>
  );
};

export default ExpensesScreen;
