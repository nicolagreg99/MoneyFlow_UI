import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import IncomesStyles from '../styles/Incomes_style';


const IncomesScreen = () => {
  return (
    <View style={IncomesStyles.container}>
      <Text style={IncomesStyles.incomeText}>Pagina delle Entrate</Text>
    </View>
  );
};

export default IncomesScreen;
