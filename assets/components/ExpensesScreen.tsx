import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExpensesStyles from '../styles/Expenses_style';
import DateRangePicker from './personalized_components/DateRangePicker';
import FilterSelector from './personalized_components/FilterSelector';

const ExpensesScreen = () => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [fromDate, setFromDate] = useState(firstDayOfMonth);
  const [toDate, setToDate] = useState(today);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [totalExpenses, setTotalExpenses] = useState<string | null>(null);

  const getToken = async () => {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error("Errore nel recupero del token:", error);
      return null;
    }
  };

  const fetchTotalExpenses = async () => {
    try {
      const token = await getToken();
      if (!token) return setTotalExpenses(null);
  
      let params = new URLSearchParams();
      params.append("from_date", fromDate.toISOString().split("T")[0]);
      params.append("to_date", toDate.toISOString().split("T")[0]);
  
      // Se ci sono filtri selezionati, aggiungili separatamente
      selectedFilters.forEach(filter => params.append("tipo", filter));
  
      const response = await axios.get(`http://192.168.1.5:5000/spese/totale?${params.toString()}`, {
        headers: { "x-access-token": token },
      });
  
      setTotalExpenses(response.data.total);
    } catch (error) {
      console.error("Errore durante la richiesta:", error.response?.data || error.message);
      setTotalExpenses(null);
    }
  };
  
  

  useEffect(() => { fetchTotalExpenses(); }, [fromDate, toDate, selectedFilters]);

  return (
    <ScrollView contentContainerStyle={ExpensesStyles.scrollContainer}>
      <View style={ExpensesStyles.container}>
        <Text style={ExpensesStyles.title}>Le tue spese</Text>

        <DateRangePicker fromDate={fromDate} setFromDate={setFromDate} toDate={toDate} setToDate={setToDate} />
        <FilterSelector selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />

        <View style={ExpensesStyles.totalContainer}>
          <Text style={ExpensesStyles.totalText}>Totale spese</Text>
          <Text style={ExpensesStyles.totalAmount}>{totalExpenses !== null ? `€${totalExpenses}` : "0,00 €"}</Text>
        </View>

        <View style={ExpensesStyles.chartPlaceholder}>
          <Text style={ExpensesStyles.chartText}>[Grafico a torta qui]</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ExpensesScreen;
