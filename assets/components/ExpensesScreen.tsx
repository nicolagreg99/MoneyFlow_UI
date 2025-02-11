import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform } from 'react-native';
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

  // Funzione per recuperare il token salvato
  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return token;
    } catch (error) {
      console.error("Errore nel recupero del token:", error);
      return null;
    }
  };

  // Funzione per effettuare la richiesta delle spese totali
  const fetchTotalExpenses = async () => {
    const fromDateString = fromDate.toISOString().split('T')[0];
    const toDateString = toDate.toISOString().split('T')[0];

    try {
      const token = await getToken(); // Recupera il token

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
          "x-access-token": token, // Usa il token qui
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
        {/* Selezione Data Inizio */}
        <TouchableOpacity onPress={() => setShowFromPicker(true)}>
          <TextInput
            style={ExpensesStyles.datePicker}
            value={fromDate.toISOString().split('T')[0]}
            editable={false}
          />
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

        {/* Selezione Data Fine */}
        <TouchableOpacity onPress={() => setShowToPicker(true)}>
          <TextInput
            style={ExpensesStyles.datePicker}
            value={toDate.toISOString().split('T')[0]}
            editable={false}
          />
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

      {/* Filtri per categoria */}
      <View style={ExpensesStyles.filterContainer}>
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              ExpensesStyles.filterButton,
              selectedFilter === option && ExpensesStyles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter(selectedFilter === option ? null : option)}
          >
            <Text
              style={[
                ExpensesStyles.filterText,
                selectedFilter === option && ExpensesStyles.filterTextActive,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
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
