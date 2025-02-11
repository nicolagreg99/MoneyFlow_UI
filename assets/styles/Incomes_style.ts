import { StyleSheet } from 'react-native';

const IncomesStyles = StyleSheet.create({
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
  incomeItem: {
    backgroundColor: '#2ecc71',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  incomeText: {
    color: 'white',
    fontSize: 16,
  },
});

export default IncomesStyles;
