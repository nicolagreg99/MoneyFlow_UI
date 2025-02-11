import { StyleSheet } from 'react-native';

const ExpensesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  expenseItem: {
    backgroundColor: '#e74c3c',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  expenseText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ExpensesStyles;
