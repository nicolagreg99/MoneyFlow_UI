import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  Alert, ActivityIndicator, Modal, FlatList
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Toast from "react-native-toast-message";
import EditUserStyles from '../styles/EditUser_style';
import API from "../../config/api";

const currencies = [
  { code: 'AED', name: 'Dirham degli Emirati Arabi', flag: '🇦🇪' },
  { code: 'ALL', name: 'Lek Albanese', flag: '🇦🇱' },
  { code: 'ARS', name: 'Peso Argentino', flag: '🇦🇷' },
  { code: 'AUD', name: 'Dollaro Australiano', flag: '🇦🇺' },
  { code: 'BGN', name: 'Lev Bulgaro', flag: '🇧🇬' },
  { code: 'BRL', name: 'Real Brasiliano', flag: '🇧🇷' },
  { code: 'CAD', name: 'Dollaro Canadese', flag: '🇨🇦' },
  { code: 'CHF', name: 'Franco Svizzero', flag: '🇨🇭' },
  { code: 'CNY', name: 'Yuan Cinese', flag: '🇨🇳' },
  { code: 'CZK', name: 'Corona Ceca', flag: '🇨🇿' },
  { code: 'DKK', name: 'Corona Danese', flag: '🇩🇰' },
  { code: 'DZD', name: 'Dinaro Algerino', flag: '🇩🇿' },
  { code: 'EGP', name: 'Sterlina Egiziana', flag: '🇪🇬' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'Sterlina Britannica', flag: '🇬🇧' },
  { code: 'HRK', name: 'Kuna Croata', flag: '🇭🇷' },
  { code: 'HUF', name: 'Fiorino Ungherese', flag: '🇭🇺' },
  { code: 'INR', name: 'Rupia Indiana', flag: '🇮🇳' },
  { code: 'ISK', name: 'Corona Islandese', flag: '🇮🇸' },
  { code: 'JPY', name: 'Yen Giapponese', flag: '🇯🇵' },
  { code: 'MAD', name: 'Dirham Marocchino', flag: '🇲🇦' },
  { code: 'MXN', name: 'Peso Messicano', flag: '🇲🇽' },
  { code: 'NOK', name: 'Corona Norvegese', flag: '🇳🇴' },
  { code: 'PLN', name: 'Zloty Polacco', flag: '🇵🇱' },
  { code: 'RON', name: 'Leu Rumeno', flag: '🇷🇴' },
  { code: 'RSD', name: 'Dinaro Serbo', flag: '🇷🇸' },
  { code: 'RUB', name: 'Rublo Russo', flag: '🇷🇺' },
  { code: 'SAR', name: 'Riyal Saudita', flag: '🇸🇦' },
  { code: 'SEK', name: 'Corona Svedese', flag: '🇸🇪' },
  { code: 'TRY', name: 'Lira Turca', flag: '🇹🇷' },
  { code: 'USD', name: 'Dollaro Statunitense', flag: '🇺🇸' },
  { code: 'ZAR', name: 'Rand Sudafricano', flag: '🇿🇦' },
].sort((a, b) => a.code.localeCompare(b.code));

export const getCurrencyFlag = (code: string): string => {
  const currency = currencies.find((c) => c.code === code);
  return currency ? currency.flag : "💱";
};

const CategorySection = ({ title, value, onChangeText, onAdd, data, onRemove, color, chipStyle }) => (
  <View style={[EditUserStyles.sectionBox, { borderLeftColor: color }]}>
    <Text style={EditUserStyles.sectionTitle}>{`Categorie di ${title}`}</Text>

    <View style={EditUserStyles.addRow}>
      <TextInput
        style={EditUserStyles.categoryInput}
        placeholder={`Aggiungi categoria di ${title.toLowerCase()}`}
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity
        style={[EditUserStyles.addButton, { backgroundColor: color }]}
        onPress={onAdd}
      >
        <Text style={EditUserStyles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>

    <View style={EditUserStyles.chipsContainer}>
      {data.length > 0 ? (
        data.map((item, index) => (
          <View key={index} style={[EditUserStyles.chip, chipStyle]}>
            <Text style={EditUserStyles.chipText}>{item}</Text>
            <TouchableOpacity onPress={() => onRemove(index)}>
              <Ionicons name="close" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={EditUserStyles.emptyText}>
          Nessuna categoria di {title.toLowerCase()}
        </Text>
      )}
    </View>
  </View>
);

const EditUser = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [userData, setUserData] = useState({ first_name: '', last_name: '' });
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [currency, setCurrency] = useState('EUR');
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [search, setSearch] = useState('');

  const [newExpense, setNewExpense] = useState('');
  const [newIncome, setNewIncome] = useState('');

  const filteredCurrencies = currencies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) return;
        const response = await axios.get(`${API.BASE_URL}/api/v1/me`, {
          headers: { 'x-access-token': token },
        });
        if (response.data) {
          setUserData({
            first_name: response.data.first_name || '',
            last_name: response.data.last_name || '',
          });
          setExpenses(response.data.expenses_categories || []);
          setIncomes(response.data.incomes_categories || []);
          setCurrency(response.data.default_currency || 'EUR');
        }
      } catch {
      Toast.show({
        type: "error",
        text1: "Errore durante l'aggiornamento del profilo",
        position: "bottom",
      });
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    const dataToSend = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      expenses,
      incomes,
      default_currency: currency,
    };

    setUpdating(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;
      const response = await axios.patch(
        `${API.BASE_URL}/api/v1/edit_user`,
        dataToSend,
        { headers: { 'x-access-token': token } }
      );
      if (response.data.success) {
        const storedUserData = await AsyncStorage.getItem("userData");
        const previousUserData = storedUserData ? JSON.parse(storedUserData) : {};

        const updatedUserData = {
          ...previousUserData,
          first_name: userData.first_name,
          last_name: userData.last_name,
          expenses_categories: expenses,
          incomes_categories: incomes,
          default_currency: currency,
        };
        await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));
        Toast.show({
          type: "success",
          text1: "Profilo aggiornato con successo!",
          position: "bottom",
          visibilityTime: 2500,
        });
        navigation.navigate("Menu", { refresh: true });
      }

      else {
        Toast.show({
          type: "error",
          text1: "Errore durante l'aggiornamento del profilo",
          position: "bottom",
        });
      }
    } catch {
    Toast.show({
      type: "error",
      text1: "Errore durante l'aggiornamento del profilo",
      position: "bottom",
    });
    } finally {
      setUpdating(false);
    }
  };

  const addExpense = () => {
    if (!newExpense.trim()) return;
    setExpenses([...expenses, newExpense.trim()]);
    setNewExpense('');
  };

  const addIncome = () => {
    if (!newIncome.trim()) return;
    setIncomes([...incomes, newIncome.trim()]);
    setNewIncome('');
  };

  const removeExpense = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const removeIncome = (index) => {
    setIncomes(incomes.filter((_, i) => i !== index));
  };

  return (
    <ScrollView contentContainerStyle={EditUserStyles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#16A085" />
      ) : (
        <>
          <Text style={EditUserStyles.title}>Modifica Profilo</Text>

          {/* Profile Card */}
          <View style={EditUserStyles.profileCard}>
            <View style={EditUserStyles.profileIconContainer}>
              <Text style={EditUserStyles.profileIconText}>
                {userData.first_name?.[0]?.toUpperCase() || 'U'}
              </Text>
            </View>

            <View style={EditUserStyles.profileDetailsContainer}>
              {/* Campo Nome */}
              <View style={EditUserStyles.currencyContainerSmall}>
                <Text style={EditUserStyles.currencyLabelSmall}>Nome</Text>
                <TextInput
                  style={EditUserStyles.profileNameInput}
                  placeholder="Inserisci nome"
                  value={userData.first_name}
                  onChangeText={(text) =>
                    setUserData({ ...userData, first_name: text })
                  }
                />
              </View>

              {/* Campo Cognome */}
              <View style={[EditUserStyles.currencyContainerSmall, { marginTop: 10 }]}>
                <Text style={EditUserStyles.currencyLabelSmall}>Cognome</Text>
                <TextInput
                  style={EditUserStyles.profileNameInput}
                  placeholder="Inserisci cognome"
                  value={userData.last_name}
                  onChangeText={(text) =>
                    setUserData({ ...userData, last_name: text })
                  }
                />
              </View>

              {/* Valuta predefinita */}
              <TouchableOpacity
                style={[EditUserStyles.currencyContainerSmall, { marginTop: 10 }]}
                onPress={() => setCurrencyModalVisible(true)}
              >
                <Text style={EditUserStyles.currencyLabelSmall}>
                  Valuta predefinita
                </Text>
                <View style={EditUserStyles.currencyDisplaySmall}>
                  <Text style={EditUserStyles.currencyValueSmall}>
                    {currencies.find((c) => c.code === currency)?.flag} {currency}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#16A085" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <CategorySection
            title="Spese"
            value={newExpense}
            onChangeText={setNewExpense}
            onAdd={addExpense}
            data={expenses}
            onRemove={removeExpense}
            color="#e74c3c"
            chipStyle={EditUserStyles.expenseChip}
          />

          <CategorySection
            title="Entrate"
            value={newIncome}
            onChangeText={setNewIncome}
            onAdd={addIncome}
            data={incomes}
            onRemove={removeIncome}
            color="#2ecc71"
            chipStyle={EditUserStyles.incomeChip}
          />

          <TouchableOpacity
            style={EditUserStyles.button}
            onPress={handleUpdate}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={EditUserStyles.buttonText}>Salva Modifiche</Text>
            )}
          </TouchableOpacity>

          {/* MODAL CURRENCY */}
          <Modal visible={currencyModalVisible} transparent animationType="fade">
            <View style={EditUserStyles.modalOverlay}>
              <View style={EditUserStyles.modalCard}>
                <Text style={EditUserStyles.modalTitle}>Seleziona valuta</Text>

                <TextInput
                  style={EditUserStyles.searchInput}
                  placeholder="Cerca..."
                  value={search}
                  onChangeText={setSearch}
                />

                <FlatList
                  data={filteredCurrencies}
                  keyExtractor={(item) => item.code}
                  style={{ maxHeight: 300, width: '100%' }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={EditUserStyles.currencyItem}
                      onPress={() => {
                        setCurrency(item.code);
                        setCurrencyModalVisible(false);
                        setSearch('');
                      }}
                    >
                      <Text style={EditUserStyles.currencyItemText}>
                        {item.flag} {item.name} ({item.code})
                      </Text>
                    </TouchableOpacity>
                  )}
                />

                <TouchableOpacity
                  style={EditUserStyles.modalCloseButton}
                  onPress={() => {
                    setCurrencyModalVisible(false);
                    setSearch('');
                  }}
                >
                  <Text style={EditUserStyles.modalCloseText}>Chiudi</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}
    </ScrollView>
  );
};

export default EditUser;