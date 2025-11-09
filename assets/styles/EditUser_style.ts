import { StyleSheet } from 'react-native';

const EditUserStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fb',
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#16A085',
  },

  // --- PROFILE CARD ---
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  profileIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#16A085',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  profileIconText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  profileDetailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  profileNameInput: {
    fontSize: 14,
    color: '#16A085',
    fontWeight: 'bold',
    textAlign: 'right',
    flex: 1,
    padding: 0,
    margin: 0,
  },
  currencyContainerSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    backgroundColor: '#f4f6f7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  currencyLabelSmall: {
    fontSize: 13,
    color: '#666',
  },
  currencyDisplaySmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  currencyValueSmall: {
    fontSize: 14,
    color: '#16A085',
    fontWeight: 'bold',
  },

  // --- SECTION TITLES ---
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
    textAlign: 'left',
  },

  // --- CATEGORY INPUTS & ADD BUTTON ---
  sectionBox: {
    borderLeftWidth: 4,
    paddingLeft: 10,
    paddingRight: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    marginBottom: 25,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryInput: {
    flex: 1,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  addButton: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  expenseButton: {
    backgroundColor: '#e74c3c',
  },
  incomeButton: {
    backgroundColor: '#2ecc71',
  },

  // --- CATEGORY SECTIONS ---
  expenseSection: {
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
    paddingLeft: 10,
    paddingVertical: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  incomeSection: {
    borderLeftWidth: 4,
    borderLeftColor: '#2ecc71',
    paddingLeft: 10,
    paddingVertical: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },

  // --- CHIPS ---
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 6,
  },
  chipText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    marginRight: 5,
  },
  expenseChip: {
    backgroundColor: '#e74c3c',
  },
  incomeChip: {
    backgroundColor: '#2ecc71',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    width: '100%',
    paddingVertical: 10,
  },

  // --- BUTTON ---
  button: {
    backgroundColor: '#16A085',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  // --- MODAL ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16A085',
    marginBottom: 12,
    textAlign: 'center',
  },
  searchInput: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
    marginBottom: 12,
  },
  currencyItem: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  currencyItemText: {
    fontSize: 15,
    color: '#333',
    textAlign: 'left',
  },
  modalCloseButton: {
    marginTop: 10,
    backgroundColor: '#16A085',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditUserStyles;