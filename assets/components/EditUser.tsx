import React, { useEffect, useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator 
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import EditUserStyles from '../styles/EditUser_style';

const EditUser = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [newExpense, setNewExpense] = useState('');
  const [newIncome, setNewIncome] = useState('');

  // Recupera i dati utente iniziali
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) return;

        const response = await axios.get('http://192.168.1.5:5000/api/v1/me', {
          headers: { 'x-access-token': token },
        });

        console.log("📩 Dati ricevuti dal backend:", response.data);

        if (response.data) {
          setUserData((prev) => ({
            ...prev,
            first_name: response.data.first_name || '',
            last_name: response.data.last_name || '',
          }));

          setExpenses(response.data.expenses_categories || []);
          setIncomes(response.data.incomes_categories || []);
        }

        console.log("✅ Spese aggiornate:", response.data.expenses_categories);
        console.log("✅ Redditi aggiornati:", response.data.incomes_categories);

      } catch (error) {
        console.error("❌ Errore nel recupero dei dati utente:", error);
        Alert.alert("Errore", "Impossibile recuperare i dati utente");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Aggiungi una categoria di spesa o di reddito
  const addCategory = (type) => {
    if (type === "expense" && newExpense.trim() && !expenses.includes(newExpense)) {
      setExpenses([...expenses, newExpense]);
      setNewExpense('');
    } else if (type === "income" && newIncome.trim() && !incomes.includes(newIncome)) {
      setIncomes([...incomes, newIncome]);
      setNewIncome('');
    } else {
      Alert.alert("Errore", "Categoria già presente o campo vuoto.");
    }
  };

  // Rimuovi una categoria di spesa o di reddito
  const removeCategory = (type, index) => {
    if (type === "expense") {
      setExpenses(expenses.filter((_, i) => i !== index));
    } else {
      setIncomes(incomes.filter((_, i) => i !== index));
    }
  };

  // Gestisci l'aggiornamento dei dati utente
  const handleUpdate = async () => {
    // Rimuovi i campi vuoti se non sono stati modificati
    const dataToSend = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      expenses: expenses.length > 0 ? expenses : [],  // Cambiato da `expenses_categories` a `expenses`
      incomes: incomes.length > 0 ? incomes : [],    // Cambiato da `incomes_categories` a `incomes`
    };
  
    setUpdating(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;
  
      console.log("🚀 Dati inviati al backend:", dataToSend); // Assicurati di stampare i dati
  
      const response = await axios.patch(
        'http://192.168.1.5:5000/api/v1/edit_user',
        dataToSend,
        { headers: { 'x-access-token': token } }
      );
  
      if (response.data.success) {
        Alert.alert("Successo", "Dati aggiornati con successo");
        navigation.goBack(); // Torna indietro dopo l'aggiornamento
      } else {
        Alert.alert("Errore", response.data.message || "Errore nell'aggiornamento");
      }
    } catch (error) {
      console.error("❌ Errore nell'aggiornamento:", error);
      Alert.alert("Errore", "Impossibile aggiornare i dati utente");
    } finally {
      setUpdating(false);
    }
  };
  
  

  return (
    <ScrollView contentContainerStyle={EditUserStyles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#16A085" />
      ) : (
        <>
          <Text style={EditUserStyles.title}>Modifica Profilo</Text>

          <TextInput
            style={EditUserStyles.input}
            value={userData.first_name}
            onChangeText={(text) => setUserData({ ...userData, first_name: text })}
            placeholder="Nome"
          />

          <TextInput
            style={EditUserStyles.input}
            value={userData.last_name}
            onChangeText={(text) => setUserData({ ...userData, last_name: text })}
            placeholder="Cognome"
          />

      {/* Sezione Spese */}
      <View>
        <Text style={EditUserStyles.sectionTitle}>Categorie di Spesa</Text>
        <View style={EditUserStyles.inputContainer}>
          <TextInput
            style={EditUserStyles.input}
            placeholder="Nuova Categoria di Spesa"
            value={newExpense}
            onChangeText={setNewExpense}
          />
          <TouchableOpacity 
            style={[EditUserStyles.addButton, { backgroundColor: "#e74c3c" }]} 
            onPress={() => addCategory("expense")}
          >
            <Text style={EditUserStyles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        {expenses.length > 0 ? (
          expenses.map((item, index) => (
            <View key={index} style={EditUserStyles.listItemContainer}>
              <Text style={EditUserStyles.listItem}>{item}</Text>
              <TouchableOpacity onPress={() => removeCategory("expense", index)}>
                <Ionicons name="trash-outline" size={20} color="red" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: "center", color: "#aaa" }}>Nessuna categoria di spesa</Text>
        )}
      </View>

      {/* Sezione Entrate */}
      <View>
        <Text style={EditUserStyles.sectionTitle}>Categorie di Entrata</Text>
        <View style={EditUserStyles.inputContainer}>
          <TextInput
            style={EditUserStyles.input}
            placeholder="Nuova Categoria di Entrata"
            value={newIncome}
            onChangeText={setNewIncome}
          />
          <TouchableOpacity 
            style={[EditUserStyles.addButton, { backgroundColor: "#2ecc71" }]} 
            onPress={() => addCategory("income")}
          >
            <Text style={EditUserStyles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        {incomes.length > 0 ? (
          incomes.map((item, index) => (
            <View key={index} style={EditUserStyles.listItemContainer}>
              <Text style={EditUserStyles.listItem}>{item}</Text>
              <TouchableOpacity onPress={() => removeCategory("income", index)}>
                <Ionicons name="trash-outline" size={20} color="red" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: "center", color: "#aaa" }}>Nessuna categoria di entrata</Text>
        )}
      </View>

            ))
          ) : (
            <Text style={{ textAlign: "center", color: "#aaa" }}>Nessuna categoria di entrata</Text>
          )}

          <TouchableOpacity style={EditUserStyles.button} onPress={handleUpdate} disabled={updating}>
            {updating ? <ActivityIndicator color="#fff" /> : <Text style={EditUserStyles.buttonText}>Salva Modifiche</Text>}
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default EditUser;
