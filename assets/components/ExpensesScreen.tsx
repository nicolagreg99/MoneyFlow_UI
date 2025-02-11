import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ExpensesStyles from '../styles/Expenses_style';


const ExpensesScreen = () => {
  return (
    <View style={ExpensesStyles.container}>
      <Text style={ExpensesStyles.expenseText}>Benvenuto nella tua Dashboard!</Text>
    </View>
  );
};

export default ExpensesScreen;