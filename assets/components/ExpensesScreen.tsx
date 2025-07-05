import React, { useState, useEffect } from "react";
import { 
  View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Modal 
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
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

  const getToken = async () => {
    try {
      return await AsyncStorage.getItem("authToken");
    } catch (error) {
      console.error("Errore nel recupero del token:", error);
      return null;
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const buildQueryParams = () => {
    let params = new URLSearchParams();
    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(toDate);

    params.append("from_date", formattedFromDate);
    params.append("to_date", formattedToDate);
    selectedFilters.forEach((filter) => params.append("tipo", filter));

    const queryString = params.toString();

    console.log("Query Params:", queryString);

    return queryString;
  };


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
        axios.get(`https://backend.money-app-api.com/api/v1/expenses/total?${params}`, {
          headers: { "x-access-token": token },
        }),
        axios.get(`https://backend.money-app-api.com/api/v1/expenses/total_by_category?${params}`, {
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
        setError(chartResponse.data.messaggio || "Nessun dato disponibile");
      }
    } catch (error) {
      console.error("Errore durante la richiesta:", error.response?.data || error.message);
      setError("Errore nel recupero dei dati. Controlla la tua connessione.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionList = async () => {
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
      const response = await axios.get(`https://backend.money-app-api.com/api/v1/expenses/list?${params}`, {
        headers: { "x-access-token": token },
      });

      if (response.data && Array.isArray(response.data)) {
        setTransactions(response.data);
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

  const deleteExpense = async (expenseId) => {
    try {
      const token = await getToken();
      if (!token) {
        setError("Token non trovato. Effettua nuovamente il login.");
        return;
      }

      await axios.delete(`https://backend.money-app-api.com/api/v1/expenses/${expenseId}`, {
        headers: { "x-access-token": token },
      });

      setTransactions((prevTransactions) =>
        prevTransactions.filter((transaction) => transaction.id !== expenseId)
      );
    } catch (error) {
      console.error("Errore durante l'eliminazione della spesa:", error.response?.data || error.message);
      setError("Errore durante la cancellazione della spesa.");
    }
  };

  const resetFilters = () => {
    setFromDate(firstDayOfMonth);
    setToDate(today);
    setSelectedFilters([]);
  };

  const handleEdit = (expense) => {
    navigation.navigate("EditExpenses", { expense });
  };

  useEffect(() => {
    setModalVisible(false);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchExpensesData();
      fetchTransactionList();
    }, [fromDate, toDate, selectedFilters])
  );

  return (
    <>
      <ScrollView contentContainerStyle={ExpensesStyles.scrollContainer}>
        <View style={ExpensesStyles.container}>
          <View style={ExpensesStyles.titleContainer}>
            <Text style={ExpensesStyles.title}>Gestione Spese</Text>
          </View>

          <View style={ExpensesStyles.actionsContainer}>
            <TouchableOpacity
              style={ExpensesStyles.iconButton}
              onPress={() => navigation.navigate("InsertExpenses")}
            >
              <Ionicons name="add-circle-outline" size={30} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={ExpensesStyles.iconButton}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="list-outline" size={30} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={ExpensesStyles.refreshButton}
              onPress={resetFilters}
            >
              <Ionicons name="refresh" size={30} color="#555" />
            </TouchableOpacity>
          </View>

          <DateRangePicker
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
          />

          <FilterSelector
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            filterType="spese"
          />

          <View style={ExpensesStyles.totalContainer}>
            <Text style={ExpensesStyles.totalText}>Totale Spese</Text>
            <Text style={ExpensesStyles.totalAmount}>
              {totalExpenses !== 0 ? `€${totalExpenses.toFixed(2)}` : "0,00 €"}
            </Text>
          </View>

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

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <TransactionList
          transactions={transactions}
          onClose={() => setModalVisible(false)}
          onDelete={deleteExpense}
          onEdit={handleEdit}
          transactionType="spesa"
        />
      </Modal>
    </>
  );
};

export default ExpensesScreen; 
