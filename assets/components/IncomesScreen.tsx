import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Modal } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import IncomesStyle from "../styles/Incomes_style";
import DateRangePicker from "./personalized_components/DateRangePicker";
import FilterSelector from "./personalized_components/FilterSelector";
import PieChartGraph from "./personalized_components/PieChart";
import TransactionList from "./personalized_components/TransactionList";
import { Ionicons } from "@expo/vector-icons";
import API from "../../config/api";
import { getCurrencyFlag } from "./personalized_components/CurrencyPicker";

const IncomesScreen = () => {
  const navigation = useNavigation();

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [fromDate, setFromDate] = useState(firstDayOfMonth);
  const [toDate, setToDate] = useState(today);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [totalIncomes, setTotalIncomes] = useState<number>(0);
  const [chartData, setChartData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [userCurrency, setUserCurrency] = useState("EUR");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const fixedColors = {
    Stipendio: "#FFCE56",
    Investimenti: "#4BC0C0",
    Regalo: "#FF6384",
    Extra: "#36A2EB",
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

  const loadUserCurrency = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUserCurrency(userData.default_currency || "EUR");
      }
    } catch (error) {
      console.error("Errore nel recupero valuta utente:", error);
    }
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const buildQueryParams = () => {
    let params = new URLSearchParams();
    params.append("from_date", formatDate(fromDate));
    params.append("to_date", formatDate(toDate));
    selectedFilters.forEach((filter) => params.append("tipo", filter));
    return params.toString();
  };

  const fetchIncomesData = async () => {
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
      const response = await axios.get(`${API.BASE_URL}/api/v1/incomes/total_by_category?${params}`, {
        headers: { "x-access-token": token },
      });

      const data = response.data;

      if (data && Array.isArray(data.totali_per_categoria) && data.totali_per_categoria.length > 0) {
        const totali = data.totali_per_categoria;
        const totalSum = totali.reduce((sum, item) => sum + (parseFloat(item.totale_per_tipo) || 0), 0);

        setTotalIncomes(totalSum);
        setUserCurrency(data.currency || "EUR");

        const formattedData = totali.map((item) => ({
          name: item.tipo,
          value: parseFloat(item.totale_per_tipo) || 0,
          color: fixedColors[item.tipo] || fixedColors["Altro"],
        }));

        setChartData(formattedData);
      } else {
        setChartData([]);
        setTotalIncomes(0);
        setError(data.message || "Nessun dato disponibile per il periodo selezionato.");
      }
    } catch (error: any) {
      console.error("Errore durante il fetch delle entrate:", error.response?.data || error.message);
      setError("Errore nel recupero dei dati.");
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
      const response = await axios.get(`${API.BASE_URL}/api/v1/incomes/list?${params}`, {
        headers: { "x-access-token": token },
      });

      if (response.data && Array.isArray(response.data.incomes)) {
        setTransactions(response.data.incomes);
      } else if (Array.isArray(response.data)) {
        setTransactions(response.data);
      } else {
        setTransactions([]);
        setError("Nessuna transazione trovata per il periodo selezionato.");
      }
    } catch (error) {
      console.error("Errore nel recupero transazioni:", error.response?.data || error.message);
      setError("Errore durante il recupero delle transazioni.");
    } finally {
      setLoading(false);
    }
  };

  const deleteIncome = async (incomeId: number) => {
    try {
      const token = await getToken();
      if (!token) {
        setError("Token non trovato. Effettua nuovamente il login.");
        return;
      }

      await axios.delete(`${API.BASE_URL}/api/v1/incomes/${incomeId}`, {
        headers: { "x-access-token": token },
      });

      setTransactions((prev) => prev.filter((t) => t.id !== incomeId));
    } catch (error: any) {
      console.error("Errore durante l'eliminazione:", error.response?.data || error.message);
      setError("Errore durante la cancellazione dell'entrata.");
    }
  };

  const resetFilters = () => {
    setFromDate(firstDayOfMonth);
    setToDate(today);
    setSelectedFilters([]);
  };

  const handleEdit = (income) => {
    navigation.navigate("EditIncomes", { income });
  };

  useEffect(() => {
    loadUserCurrency();
    setModalVisible(false);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchIncomesData();
      fetchTransactionList();
    }, [fromDate, toDate, selectedFilters])
  );

  const currencyFlag = getCurrencyFlag(userCurrency);

  return (
    <>
      <ScrollView contentContainerStyle={IncomesStyle.scrollContainer}>
        <View style={IncomesStyle.container}>
          <View style={IncomesStyle.titleContainer}>
            <Text style={IncomesStyle.title}>Gestione Entrate</Text>
          </View>

          <View style={IncomesStyle.actionsContainer}>
            <TouchableOpacity
              style={IncomesStyle.iconButton}
              onPress={() => navigation.navigate("InsertIncomes")}
            >
              <Ionicons name="add-circle-outline" size={30} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={IncomesStyle.iconButton}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="list-outline" size={30} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={IncomesStyle.refreshButton} onPress={resetFilters}>
              <Ionicons name="refresh" size={30} color="#555" />
            </TouchableOpacity>
          </View>

          <DateRangePicker fromDate={fromDate} setFromDate={setFromDate} toDate={toDate} setToDate={setToDate} />

          <FilterSelector
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            filterType="entrate"
          />

          <View style={IncomesStyle.totalContainer}>
            <Text style={IncomesStyle.totalText}>Totale Entrate</Text>
            <Text style={IncomesStyle.totalAmount}>
              {currencyFlag} {totalIncomes.toFixed(2)} {userCurrency}
            </Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#007BFF" />
          ) : error ? (
            <Text style={IncomesStyle.errorText}>{error}</Text>
          ) : chartData.length > 0 ? (
            <PieChartGraph
              data={chartData}
              total={totalIncomes}
              userCurrency={userCurrency}
            />
          ) : (
            <Text style={IncomesStyle.noDataText}>Nessun dato disponibile</Text>
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
          onDelete={deleteIncome}
          onEdit={handleEdit}
          transactionType="entrata"
        />
      </Modal>
    </>
  );
};

export default IncomesScreen;
