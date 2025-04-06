import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard 
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; 
import axios from "axios";
import LoginStyles from "../styles/Login_style";

const RegisterPreferences = () => {
  const route = useRoute();
  const { formData } = route.params as { formData: any };
  const navigation = useNavigation();

  const [expenses, setExpenses] = useState(["Cibo", "Trasporto", "Abbigliamento", 'Extra']);
  const [incomes, setIncomes] = useState(["Stipendio", "Regalo", 'Extra']);
  const [newExpense, setNewExpense] = useState("");
  const [newIncome, setNewIncome] = useState("");

  const addExpense = () => {
    if (newExpense.trim() && !expenses.includes(newExpense)) {
      setExpenses([...expenses, newExpense]);
      setNewExpense("");
    } else {
      Alert.alert("Errore", "Preferenza già presente o campo vuoto.");
    }
  };

  const addIncome = () => {
    if (newIncome.trim() && !incomes.includes(newIncome)) {
      setIncomes([...incomes, newIncome]);
      setNewIncome("");
    } else {
      Alert.alert("Errore", "Preferenza già presente o campo vuoto.");
    }
  };

  const removeExpense = (index: number) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter((_, i) => i !== index));
    } else {
      Alert.alert("Errore", "Devi avere almeno una preferenza.");
    }
  };

  const removeIncome = (index: number) => {
    if (incomes.length > 1) {
      setIncomes(incomes.filter((_, i) => i !== index));
    } else {
      Alert.alert("Errore", "Devi avere almeno una preferenza.");
    }
  };

  const handleRegister = async () => {
    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        expenses: expenses.map(item => item.trim()),
        incomes: incomes.map(item => item.trim()),
      };
  
      if (formData.first_name) payload["first_name"] = formData.first_name;
      if (formData.last_name) payload["last_name"] = formData.last_name;
  
      console.log("Payload inviato:", JSON.stringify(payload, null, 2));
  
      const response = await axios.post("https://backend.money-app-api.com/api/v1/register", payload);
  
      if (response.data.success) {
        Alert.alert("Successo", "Registrazione completata!");
        navigation.navigate("Login");
      } else {
        Alert.alert("Errore", response.data.message || "Registrazione fallita.");
      }
    } catch (error: any) {
      console.error("Errore nella registrazione:", error.response?.data || error.message);
  
      if (error.response) {
        const statusCode = error.response.status;
        const errorMessage = error.response.data.message || "Errore sconosciuto";
  
        if (statusCode === 400) {
          if (errorMessage.toLowerCase().includes("email")) {
            Alert.alert("Errore", "L'email è già in uso. Prova con un'altra.");
          } else if (errorMessage.toLowerCase().includes("username")) {
            Alert.alert("Errore", "Questo username è già stato preso. Scegline un altro.");
          } else {
            Alert.alert("Errore", errorMessage);
          }
        } else if (statusCode === 500) {
          Alert.alert("Errore", "Errore del server. Riprova più tardi.");
        } else {
          Alert.alert("Errore", "Errore sconosciuto. Contatta il supporto.");
        }
      } else {
        Alert.alert("Errore", "Impossibile completare la registrazione. Verifica la connessione.");
      }
    }
  };
  
  
  

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={[LoginStyles.scrollContainer, { paddingHorizontal: 20, paddingTop: 40 }]}>
          <Text style={LoginStyles.header}>Preferenze</Text>

          {/* Contenitore Spese */}
          <View style={LoginStyles.sectionContainer}>
            <Text style={LoginStyles.subHeader}>Categorie di spesa</Text>
            {expenses.map((item, index) => (
              <View key={index} style={LoginStyles.listItemContainer}>
                <Text style={LoginStyles.listItem}>{item}</Text>
                <TouchableOpacity onPress={() => removeExpense(index)}>
                  <Ionicons name="trash-outline" size={20} color="red" />
                </TouchableOpacity>
              </View>
            ))}
            <View style={LoginStyles.inputContainer}>
              <TextInput 
                style={LoginStyles.input} 
                placeholder="Aggiungi nuova preferenza" 
                value={newExpense} 
                onChangeText={setNewExpense} 
              />
              <TouchableOpacity style={LoginStyles.addButton} onPress={addExpense}>
                <Text style={LoginStyles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Contenitore Entrate */}
          <View style={LoginStyles.sectionContainer}>
          <Text style={LoginStyles.subHeader}>Categorie di entrate</Text>
            {incomes.map((item, index) => (
              <View key={index} style={LoginStyles.listItemContainer}>
                <Text style={LoginStyles.listItem}>{item}</Text>
                <TouchableOpacity onPress={() => removeIncome(index)}>
                  <Ionicons name="trash-outline" size={20} color="red" />
                </TouchableOpacity>
              </View>
            ))}
            <View style={LoginStyles.inputContainer}>
              <TextInput 
                style={LoginStyles.input} 
                placeholder="Aggiungi nuova preferenza" 
                value={newIncome} 
                onChangeText={setNewIncome} 
              />
              <TouchableOpacity style={LoginStyles.addButton} onPress={addIncome}>
                <Text style={LoginStyles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={LoginStyles.button} onPress={handleRegister}>
            <Text style={LoginStyles.buttonText}>Completa Registrazione</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={LoginStyles.link}>Hai già un account?</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default RegisterPreferences;
