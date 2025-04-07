import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LoginStyles from '../styles/Login_style'; 

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Errore', 'Per favore inserisci la tua email.');
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch('http://192.168.1.5:5000/request_reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier: email }),  
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert('Successo', 'Ti è stata inviata una email per il reset della password.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Errore', data.message || 'Si è verificato un errore.');
      }
    } catch (error) {
      Alert.alert('Errore', 'Si è verificato un errore nel tentativo di inviare la richiesta.');
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <View style={LoginStyles.container}>
      <Text style={LoginStyles.header}>Recupera la Password</Text>
      <Text style={LoginStyles.subHeader}>Inserisci la tua email per ricevere il link di reset.</Text>

      <TextInput
        style={LoginStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity
        style={LoginStyles.button}
        onPress={handlePasswordReset}
        disabled={loading}
      >
        <Text style={LoginStyles.buttonText}>
          {loading ? 'Caricamento...' : 'Reset Password'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={LoginStyles.link}>Torna alla pagina di login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;
