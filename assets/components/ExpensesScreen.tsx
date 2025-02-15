import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ExpensesStyles from "../styles/Expenses_style";
import DateRangePicker from "./personalized_components/DateRangePicker";
import FilterSelector from "./personalized_components/FilterSelector";
import PieChartGraph from "./personalized_components/PieChart";

const ExpensesScreen = () => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [fromDate, setFromDate] = useState(firstDayOfMonth);
  const [toDate, setToDate] = useState(today);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const fetchTotalExpenses = async () => {
    try {
      const token = await getToken();
      if (!token) return setTotalExpenses(0);

      let params = new URLSearchParams();
      params.append("from_date", fromDate.toISOString().split("T")[0]);
      params.append("to_date", toDate.toISOString().split("T")[0]);
      selectedFilters.forEach((filter) => params.append("tipo", filter));

      const response = await axios.get(
        `http://192.168.1.5:5000/spese/totale?${params.toString()}`,
        {
          headers: { "x-access-token": token },
        }
      );

      setTotalExpenses(parseFloat(response.data.total) || 0);
    } catch (error) {
      console.error("Errore durante la richiesta:", error.response?.data || error.message);
      setTotalExpenses(0);
    }
  };

  const fetchChartData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) {
        setError("Token non trovato");
        setLoading(false);
        return;
      }

      let params = new URLSearchParams();
      params.append("from_date", fromDate.toISOString().split("T")[0]);
      params.append("to_date", toDate.toISOString().split("T")[0]);
      selectedFilters.forEach((filter) => params.append("tipo", filter));

      const response = await axios.get(
        `http://192.168.1.5:5000/spese/totale_per_tipo?${params.toString()}`,
        { headers: { "x-access-token": token } }
      );

      if (!response.data || response.data.length === 0) {
        setChartData([]);
      } else {
        const formattedData = response.data.map((item) => ({
          name: item.tipo,
          value: parseFloat(item.totale_per_tipo) || 0,
          color: fixedColors[item.tipo] || fixedColors["Altro"],
        }));

        setChartData(formattedData);
      }
    } catch (error) {
      console.error("Errore durante il recupero dei dati:", error.response?.data || error.message);
      setError("Errore nel recupero dei dati");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTotalExpenses();
    fetchChartData();
  }, [fromDate, toDate, selectedFilters]);

  return (
    <ScrollView contentContainerStyle={ExpensesStyles.scrollContainer}>
      <View style={ExpensesStyles.container}>
        <Text style={ExpensesStyles.title}>Le tue spese</Text>

        <DateRangePicker fromDate={fromDate} setFromDate={setFromDate} toDate={toDate} setToDate={setToDate} />
        <FilterSelector selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />

        <View style={ExpensesStyles.totalContainer}>
          <Text style={ExpensesStyles.totalText}>Totale spese</Text>
          <Text style={ExpensesStyles.totalAmount}>{totalExpenses !== 0 ? `€${totalExpenses.toFixed(2)}` : "0,00 €"}</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text style={{ color: "red" }}>{error}</Text>
        ) : (
          <PieChartGraph data={chartData} total={totalExpenses} />
        )}
      </View>
    </ScrollView>
  );
};

export default ExpensesScreen;
