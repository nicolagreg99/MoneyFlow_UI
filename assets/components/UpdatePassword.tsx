import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

const UpdatePasswordScreen = ({ route, navigation }: any) => {
  const { token } = route.params; // Ottieni il token dalla route
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordUpdate = async () => {
    if (!password) {
      Alert.alert('Errore', 'Per favore inserisci una nuova password.');
      return;
    }

    if (!token) {
      Alert.alert('Errore', 'Token non trovato.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://192.168.1.5:5000/reset_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Successo', 'Password aggiornata con successo!');
        // Naviga alla pagina principale dopo il reset della password
        navigation.navigate('Main');
      } else {
        Alert.alert('Errore', data.message || 'Si è verificato un errore.');
      }
    } catch (error) {
      Alert.alert('Errore', 'Si è verificato un errore nel tentativo di aggiornare la password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Nuova password"
        secureTextEntry
      />
      <Button title="Aggiorna Password" onPress={handlePasswordUpdate} disabled={loading} />
    </View>
  );
};

export default UpdatePasswordScreen;
