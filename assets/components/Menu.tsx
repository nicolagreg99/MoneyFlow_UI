import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MenuStyles from '../styles/Menu_style';

type RootStackParamList = {
  Menu: undefined;
  Login: undefined;
  Main: undefined; // Main contiene il navigatore dei tab
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Menu'>;

const MenuScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (!storedUserData) {
          navigation.navigate('Login');
          return;
        }

        setUserData(JSON.parse(storedUserData));
      } catch (error) {
        console.error('Errore nel recupero dei dati utente:', error);
        navigation.navigate('Login');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const response = await fetch('http://192.168.1.5:5000/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
        });

        const data = await response.json();

        if (response.ok) {
          await AsyncStorage.removeItem('userData');
          await AsyncStorage.removeItem('authToken');
          navigation.navigate('Login');
        } else {
          console.error('Errore nel logout API:', data);
        }
      } else {
        console.error('Token di accesso non trovato.');
      }
    } catch (error) {
      console.error('Errore nel logout:', error);
    }
  };

  return (
    <View style={MenuStyles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#3498DB" />
      ) : userData ? (
        <>
          <View style={MenuStyles.profileContainer}>
            <View style={MenuStyles.profileIcon}>
              <Text style={MenuStyles.profileIconText}>
                {userData.username.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={MenuStyles.profileDetails}>
              <Text style={MenuStyles.header}>Profilo Utente</Text>
              <Text style={MenuStyles.username}>{userData.username}</Text>
              <Text style={MenuStyles.email}>{userData.email}</Text>
            </View>
          </View>

          {/* Menu options */}
          <View style={MenuStyles.menuContainer}>
            <TouchableOpacity style={MenuStyles.menuItem} onPress={() => navigation.navigate('Main')}>
              <Text style={MenuStyles.menuText}>🏠 Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={MenuStyles.menuItem}
              onPress={() => navigation.navigate('Main', { screen: 'Expenses' })}>
              <Text style={MenuStyles.menuText}>💸 Expenses</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={MenuStyles.menuItem}
              onPress={() => navigation.navigate('Main', { screen: 'Incomes' })}>
              <Text style={MenuStyles.menuText}>📈 Incomes</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={MenuStyles.logoutButton} onPress={handleLogout}>
            <Text style={MenuStyles.menuText}>🚪 Logout</Text>
          </TouchableOpacity>

          <Text style={MenuStyles.versionText}>Versione 1.0.0</Text>
        </>
      ) : (
        <Text>Errore nel caricamento dei dati utente</Text>
      )}
    </View>
  );
};

export default MenuScreen;
