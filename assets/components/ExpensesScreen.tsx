import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import ExpensesStyles from '../styles/Expenses_style';
import AsyncStorage from '@react-native-async-storage/async-storage';

const filterOptions = ["Vestiti", "Cibo", "Extra", "Trasporto", "Regalo"];

const ExpensesScreen = () => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [fromDate, setFromDate] = useState(firstDayOfMonth);
  const [toDate, setToDate] = useState(today);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [totalExpenses, setTotalExpenses] = useState<string | null>(null);
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return token;
    } catch (error) {
      console.error("Errore nel recupero del token:", error);
      return null;
    }
  };

  const fetchTotalExpenses = async () => {
    const fromDateString = fromDate.toISOString().split('T')[0];
    const toDateString = toDate.toISOString().split('T')[0];

    try {
      const token = await getToken(); 

      if (!token) {
        console.log("Token non trovato, impossibile effettuare la richiesta.");
        setTotalExpenses(null);
        return;
      }

      const response = await axios.get(`http://192.168.1.5:5000/spese/totale`, {
        params: {
          from_date: fromDateString,
          to_date: toDateString,
          tipo: selectedFilter || '',
        },
        headers: {
          "x-access-token": token, 
        },
      });

      setTotalExpenses(response.data.total);
    } catch (error) {
      console.error("Errore durante la richiesta:", error.response?.data || error.message);
      setTotalExpenses(null);
    }
  };

  useEffect(() => {
    fetchTotalExpenses();
  }, [fromDate, toDate, selectedFilter]);

  return (
    <View style={ExpensesStyles.container}>
      <Text style={ExpensesStyles.title}>Le tue spese</Text>

      {/* Date Picker */}
      <View style={ExpensesStyles.datePickerContainer}>
        <Text style={ExpensesStyles.datePickerLabel}>Seleziona Data Inizio</Text>
        <TouchableOpacity 
          style={ExpensesStyles.datePickerBox} 
          onPress={() => setShowFromPicker(true)}>
          <Text style={ExpensesStyles.dateText}>{fromDate.toISOString().split('T')[0]}</Text>
        </TouchableOpacity>

        {showFromPicker && (
          <DateTimePicker
            value={fromDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                setFromDate(selectedDate);
              }
              if (Platform.OS === 'android') setShowFromPicker(false);
            }}
          />
        )}

        <Text style={ExpensesStyles.datePickerLabel}>Seleziona Data Fine</Text>
        <TouchableOpacity 
          style={ExpensesStyles.datePickerBox} 
          onPress={() => setShowToPicker(true)}>
          <Text style={ExpensesStyles.dateText}>{toDate.toISOString().split('T')[0]}</Text>
        </TouchableOpacity>

        {showToPicker && (
          <DateTimePicker
            value={toDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                setToDate(selectedDate);
              }
              if (Platform.OS === 'android') setShowToPicker(false);
            }}
          />
        )}
      </View>

      {/* Filtro per categoria */}
      <View style={ExpensesStyles.filterContainer}>
        <TouchableOpacity 
          style={[ExpensesStyles.filterBox, selectedFilter && ExpensesStyles.filterBoxActive]} 
          onPress={() => setShowFilterOptions(!showFilterOptions)}>
          <Text style={ExpensesStyles.filterText}>
            {selectedFilter ? selectedFilter : "Seleziona Categoria"}
          </Text>
        </TouchableOpacity>

        {showFilterOptions && (
          <FlatList
            data={filterOptions}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={ExpensesStyles.filterOption}
                onPress={() => {
                  setSelectedFilter(item);
                  setShowFilterOptions(false);
                }}
              >
                <Text style={ExpensesStyles.filterOptionText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
        )}
      </View>

      {/* Totale delle spese */}
      <View style={ExpensesStyles.totalContainer}>
        <Text style={ExpensesStyles.totalText}>Totale spese</Text>
        <Text style={ExpensesStyles.totalAmount}>{totalExpenses ? `€${totalExpenses}` : "Caricamento..."}</Text>
      </View>
    </View>
  );
};

export default ExpensesScreen;
