import React from 'react';
import { View, Text } from 'react-native';
import MainStyles from '../styles/Main_style'; // Importa gli stili

const MainPage = () => {
  return (
    <View style={MainStyles.container}>
      <Text style={MainStyles.header}>Benvenuto nella tua Dashboard!</Text>
    </View>
  );
};

export default MainPage;
