import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { useLinking } from '@react-navigation/native';

const UpdatePasswordScreen = ({ route, navigation }: any) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const { getInitialURL } = useLinking();
  
  useEffect(() => {
    const checkDeepLink = async () => {
      const url = await getInitialURL();
      if (url) {
        const tokenFromUrl = new URL(url).searchParams.get('token');
        if (tokenFromUrl) {
          setToken(tokenFromUrl);
        } else {
          Alert.alert('Errore', 'Token non valido nel link profondo.');
          navigation.navigate('Login');
        }
      } else if (route.params?.token) {
        setToken(route.params.token); 
      } else {
        Alert.alert('Errore', 'Token non trovato.');
        navigation.navigate('Login'); 
      }
    };

    checkDeepLink();
  }, [route.params, getInitialURL, navigation]);

  const handlePasswordUpdate = async () => {
    if (!password) {
      Alert.alert('Errore', 'Per favore inserisci una nuova password.');
      return;
    }

    if (!token) {
      Alert.alert('Errore', 'Token non valido.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://192.168.1.159:5000/reset_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }), 
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Successo', 'Password aggiornata con successo!');
        navigation.navigate('Login'); // Naviga al login dopo un aggiornamento della password riuscito
      } else {
        Alert.alert('Errore', data.message || 'Si è verificato un errore.');
      }
    } catch (error) {
      Alert.alert('Errore', 'Si è verificato un errore durante l’aggiornamento della password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Nuova password"
        secureTextEntry
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 20,
          paddingLeft: 10,
        }}
      />
      <Button
        title={loading ? "Caricamento..." : "Aggiorna Password"}
        onPress={handlePasswordUpdate}
        disabled={loading}
      />
    </View>
  );
};

export default UpdatePasswordScreen;
