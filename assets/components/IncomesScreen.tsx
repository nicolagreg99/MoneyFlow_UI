import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import IncomesStyle from "../styles/Incomes_style";
import DateRangePicker from "./personalized_components/DateRangePicker";
import FilterSelector from "./personalized_components/FilterSelector";
import PieChartGraph from "./personalized_components/PieChart";
import TransactionList from "./personalized_components/TransactionList";
import API from "../../config/api";
import { getCurrencyFlag } from "./personalized_components/CurrencyPicker";

const IncomesScreen = () => {
  const navigation = useNavigation();

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [fromDate, setFromDate] = useState(firstDayOfMonth);
  const [toDate, setToDate] = useState(today);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [totalIncomes, setTotalIncomes] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [userCurrency, setUserCurrency] = useState("EUR");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  const formatDate = (date) => {
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
      const response = await axios.get(
        `${API.BASE_URL}/api/v1/incomes/total_by_category?${params}`,
        {
          headers: { "x-access-token": token },
        }
      );

      const data = response.data;

      if (
        data &&
        Array.isArray(data.totali_per_categoria) &&
        data.totali_per_categoria.length > 0
      ) {
        const totali = data.totali_per_categoria;
        const totalSum = totali.reduce(
          (sum, item) => sum + (parseFloat(item.totale_per_tipo) || 0),
          0
        );

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
        setError(
          data.message || "Nessun dato disponibile per il periodo selezionato."
        );
      }
    } catch (error) {
      console.error(
        "Errore durante il fetch delle entrate:",
        error.response?.data || error.message
      );
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
      const response = await axios.get(
        `${API.BASE_URL}/api/v1/incomes/list?${params}`,
        {
          headers: { "x-access-token": token },
        }
      );

      if (response.data && Array.isArray(response.data.incomes)) {
        setTransactions(response.data.incomes);
      } else if (Array.isArray(response.data)) {
        setTransactions(response.data);
      } else {
        setTransactions([]);
        setError("Nessuna transazione trovata per il periodo selezionato.");
      }
    } catch (error) {
      console.error(
        "Errore nel recupero transazioni:",
        error.response?.data || error.message
      );
      setError("Errore durante il recupero delle transazioni.");
    } finally {
      setLoading(false);
    }
  };

  const deleteIncome = async (incomeId) => {
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
    } catch (error) {
      console.error(
        "Errore durante l'eliminazione:",
        error.response?.data || error.message
      );
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
          {/* Titolo */}
          <View style={IncomesStyle.titleContainer}>
            <Text style={IncomesStyle.title}>Gestione Entrate</Text>
          </View>

          {/* Azioni principali */}
          <View style={IncomesStyle.actionsContainer}>
            <TouchableOpacity
              style={IncomesStyle.iconButton}
              onPress={() => navigation.navigate("InsertIncomes")}
            >
              <MaterialIcons name="add-circle-outline" size={30} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={IncomesStyle.listButton}
              onPress={() => setModalVisible(true)}
            >
              <MaterialIcons name="list-alt" size={30} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={IncomesStyle.refreshButton}
              onPress={resetFilters}
            >
              <MaterialIcons name="refresh" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Selettore date */}
          <DateRangePicker
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
          />

          {/* Filtri */}
          <FilterSelector
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            filterType="entrate"
          />

          {/* Grafico o messaggio */}
          {loading ? (
            <ActivityIndicator size="large" color="#4CAF50" />
          ) : error ? (
            <Text style={IncomesStyle.errorText}>{error}</Text>
          ) : chartData.length > 0 ? (
            <PieChartGraph
              data={chartData}
              total={totalIncomes}
              userCurrency={userCurrency}
            />
          ) : (
            <Text style={IncomesStyle.noDataText}>
              Nessun dato disponibile
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Lista Transazioni */}
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
