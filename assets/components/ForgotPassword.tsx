import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ResetForgotPwd from '../styles/ResetForgotPwd_style'; 

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
      const response = await fetch('https://backend.money-app-api.com/request_reset', {
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
    <View style={ResetForgotPwd.container}>
      <Text style={ResetForgotPwd.header}>Recupera la Password</Text>
      <Text style={ResetForgotPwd.subHeader}>Inserisci la tua email per ricevere il link di reset.</Text>

      <TextInput
        style={ResetForgotPwd.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity
        style={ResetForgotPwd.button}
        onPress={handlePasswordReset}
        disabled={loading}
      >
        <Text style={ResetForgotPwd.buttonText}>
          {loading ? 'Caricamento...' : 'Reset Password'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={ResetForgotPwd.link}>Torna alla pagina di login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;
