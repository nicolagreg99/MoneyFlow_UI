import { StyleSheet } from 'react-native';

const EditUserStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#16A085',
  },
  input: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    elevation: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbb',
    paddingHorizontal: 10,
    marginBottom: 12,
    elevation: 3,
  },
  addButton: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 10,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 3,
  },
  listItem: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  deleteIcon: {
    padding: 6,
  },
  expenseButton: {
    backgroundColor: '#e74c3c',
  },
  incomeButton: {
    backgroundColor: '#2ecc71',
  },
  expenseSection: {
    borderLeftWidth: 5,
    borderLeftColor: '#e74c3c',
    paddingLeft: 10,
    paddingVertical: 10,
  },
  incomeSection: {
    borderLeftWidth: 5,
    borderLeftColor: '#2ecc71',
    paddingLeft: 10,
    paddingVertical: 10,
  },
  button: {
    backgroundColor: '#16A085',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginTop: 10,
  },
});

export default EditUserStyles;
