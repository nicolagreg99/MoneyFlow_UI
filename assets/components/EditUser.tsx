import React, { useEffect, useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator 
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import EditUserStyles from '../styles/EditUser_style';

const CategorySection = ({ title, value, onChangeText, onAdd, data, onRemove, color }) => (
  <View>
    <Text style={EditUserStyles.sectionTitle}>Categorie di {title}</Text>
    <View style={EditUserStyles.inputContainer}>
      <TextInput
        style={EditUserStyles.input}
        placeholder={`Nuova Categoria di ${title}`}
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity style={[EditUserStyles.addButton, { backgroundColor: color }]} onPress={onAdd}>
        <Text style={EditUserStyles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
    {data.length > 0 ? (
      data.map((item, index) => (
        <View key={index} style={EditUserStyles.listItemContainer}>
          <Text style={EditUserStyles.listItem}>{item}</Text>
          <TouchableOpacity onPress={() => onRemove(index)}>
            <Ionicons name="trash-outline" size={20} color="red" />
          </TouchableOpacity>
        </View>
      ))
    ) : (
      <Text style={{ textAlign: "center", color: "#aaa" }}>Nessuna categoria di {title.toLowerCase()}</Text>
    )}
  </View>
);

const EditUser = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
  });

  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [newExpense, setNewExpense] = useState('');
  const [newIncome, setNewIncome] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) return;

        const response = await axios.get('http://192.168.1.5:5000/api/v1/me', {
          headers: { 'x-access-token': token },
        });

        if (response.data) {
          setUserData((prev) => ({
            ...prev,
            first_name: response.data.first_name || '',
            last_name: response.data.last_name || '',
          }));

          setExpenses(response.data.expenses_categories || []);
          setIncomes(response.data.incomes_categories || []);
        }
      } catch (error) {
        console.error("❌ Errore nel recupero dei dati utente:", error);
        Alert.alert("Errore", "Impossibile recuperare i dati utente");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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

  const removeCategory = (type, index) => {
    if (type === "expense") {
      setExpenses(expenses.filter((_, i) => i !== index));
    } else {
      setIncomes(incomes.filter((_, i) => i !== index));
    }
  };

  const handleUpdate = async () => {
    if (!userData.first_name || !userData.last_name) {
      Alert.alert("Errore", "Nome e cognome non possono essere vuoti");
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
        'http://192.168.1.5:5000/api/v1/edit_user',
        dataToSend,
        { headers: { 'x-access-token': token } }
      );

      if (response.data.success) {
        Alert.alert("Successo", "Dati aggiornati con successo");
        navigation.goBack();
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

          <CategorySection
            title="Spesa"
            value={newExpense}
            onChangeText={setNewExpense}
            onAdd={() => addCategory("expense")}
            data={expenses}
            onRemove={(index) => removeCategory("expense", index)}
            color="#e74c3c"
          />

          <CategorySection
            title="Entrata"
            value={newIncome}
            onChangeText={setNewIncome}
            onAdd={() => addCategory("income")}
            data={incomes}
            onRemove={(index) => removeCategory("income", index)}
            color="#2ecc71"
          />

          <TouchableOpacity style={EditUserStyles.button} onPress={handleUpdate} disabled={updating}>
            {updating ? <ActivityIndicator color="#fff" /> : <Text style={EditUserStyles.buttonText}>Salva Modifiche</Text>}
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default EditUser;
