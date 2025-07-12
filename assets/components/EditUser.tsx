import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  Alert, ActivityIndicator
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import EditUserStyles from '../styles/EditUser_style';
import API from "../../config/api";


const CategorySection = ({ title, value, onChangeText, onAdd, data, onRemove, color, sectionStyle, buttonStyle }) => (
  <View style={sectionStyle}>
    <Text style={[EditUserStyles.sectionTitle, { textAlign: 'center' }]}>{`Categorie di ${title}`}</Text>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ flex: 1 }}>
        <View style={EditUserStyles.inputContainer}>
          <TextInput
            style={EditUserStyles.input}
            placeholder={`Nuova categoria di ${title.toLowerCase()}`}
            placeholderTextColor="#aaa"
            value={value}
            onChangeText={onChangeText}
          />
        </View>
      </View>
      <TouchableOpacity
        style={[EditUserStyles.addButton, buttonStyle]}
        onPress={onAdd}
        accessible accessibilityLabel={`Aggiungi categoria ${title}`}>
        <Text style={EditUserStyles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>

    {data.length > 0 ? (
      data.map((item, index) => (
        <View
          key={index}
          style={[EditUserStyles.listItemContainer, { borderLeftColor: color }]}
        >
          <Text style={EditUserStyles.listItem}>{item}</Text>
          <TouchableOpacity
            onPress={() => onRemove(index)}
            style={EditUserStyles.deleteIcon}
            accessible accessibilityLabel={`Rimuovi categoria ${item}`}>
            <Ionicons name="trash-outline" size={20} color="red" />
          </TouchableOpacity>
        </View>
      ))
    ) : (
      <Text style={{ textAlign: 'center', color: '#aaa', marginTop: 5 }}>
        Nessuna categoria di {title.toLowerCase()}
      </Text>
    )}
  </View>
);

const EditUser = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [userData, setUserData] = useState({ first_name: '', last_name: '' });
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [newExpense, setNewExpense] = useState('');
  const [newIncome, setNewIncome] = useState('');

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
        }
      } catch (error) {
        console.error("❌ Errore nel recupero dati utente:", error);
        Alert.alert("Errore", "Impossibile recuperare i dati");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const addCategory = (type) => {
    const value = type === 'expense' ? newExpense.trim() : newIncome.trim();
    const list = type === 'expense' ? expenses : incomes;

    if (!value) return Alert.alert('Errore', 'Il campo è vuoto');
    if (list.includes(value)) return Alert.alert('Errore', 'Categoria già presente');

    if (type === 'expense') {
      setExpenses([...expenses, value]);
      setNewExpense('');
    } else {
      setIncomes([...incomes, value]);
      setNewIncome('');
    }
  };

  const removeCategory = (type, index) => {
    type === 'expense'
      ? setExpenses(expenses.filter((_, i) => i !== index))
      : setIncomes(incomes.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    if (!userData.first_name || !userData.last_name) {
      Alert.alert('Errore', 'Nome e cognome non possono essere vuoti');
      return;
    }

    const dataToSend = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      expenses,
      incomes,
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
        Alert.alert('Successo', 'Dati aggiornati correttamente');
        navigation.goBack();
      } else {
        Alert.alert('Errore', response.data.message || "Errore nell'aggiornamento");
      }
    } catch (error) {
      console.error("❌ Errore nell'aggiornamento:", error);
      Alert.alert('Errore', 'Impossibile aggiornare i dati');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={EditUserStyles.container}
      keyboardShouldPersistTaps="handled"
    >
      {loading ? (
        <ActivityIndicator size="large" color="#16A085" style={EditUserStyles.loadingIndicator} />
      ) : (
        <>
          <Text style={EditUserStyles.title}>Modifica Profilo</Text>

          <View style={EditUserStyles.inputContainer}>
            <TextInput
              style={EditUserStyles.input}
              placeholder="Nome"
              placeholderTextColor="#aaa"
              value={userData.first_name}
              onChangeText={(text) => setUserData({ ...userData, first_name: text })}
            />
          </View>

          <View style={EditUserStyles.inputContainer}>
            <TextInput
              style={EditUserStyles.input}
              placeholder="Cognome"
              placeholderTextColor="#aaa"
              value={userData.last_name}
              onChangeText={(text) => setUserData({ ...userData, last_name: text })}
            />
          </View>

          <CategorySection
            title="Spesa"
            value={newExpense}
            onChangeText={setNewExpense}
            onAdd={() => addCategory('expense')}
            data={expenses}
            onRemove={(index) => removeCategory('expense', index)}
            color="#e74c3c"
            sectionStyle={EditUserStyles.expenseSection}
            buttonStyle={EditUserStyles.expenseButton}
          />

          <CategorySection
            title="Entrata"
            value={newIncome}
            onChangeText={setNewIncome}
            onAdd={() => addCategory('income')}
            data={incomes}
            onRemove={(index) => removeCategory('income', index)}
            color="#2ecc71"
            sectionStyle={EditUserStyles.incomeSection}
            buttonStyle={EditUserStyles.incomeButton}
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
        </>
      )}
    </ScrollView>
  );
};

export default EditUser;
