import { StyleSheet } from 'react-native';

const ExpensesStyles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 20,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    letterSpacing: 0.8,
  },
  /** 📅 Date Picker **/
  accordionContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  datePickerContainer: {
    marginTop: 20,
  },
  datePickerLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  datePickerBox: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  filterBox: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  filterBoxActive: {
    backgroundColor: '#2C3E50',
    borderColor: '#1C2833',
  },
  filterText: {
    fontSize: 16,
    color: '#333',
  },
  /** 🏆 Totale Spese **/
  // totalContainer: {
  //   backgroundColor: '#FF6347',
  //   paddingVertical: 12,
  //   paddingHorizontal: 20,
  //   borderRadius: 12,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   shadowColor: '#000',
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  //   elevation: 3,
  //   marginBottom: 20,
  // },
  // totalText: {
  //   fontSize: 20,
  //   color: '#fff',
  //   fontWeight: 'bold',
  //   marginBottom: 10,
  // },
  // totalAmount: {
  //   fontSize: 25,
  //   color: '#fff',
  //   fontWeight: '700',
  // },
  /** 📊 Contenitore del Grafico **/
  chartWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartScrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  chartContainer: {
    width: "100%",
    minHeight: 250,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  chartPlaceholder: {
    width: "100%",
    minHeight: 300,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  /** 🔹 Legenda **/
  legendContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    paddingBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  colorBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  /** 📌 Modale per la selezione **/
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  filterOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalCloseButton: {
    marginTop: 15,
    backgroundColor: '#16A085',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterOptionText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  /** 🔄 Pulsante di Refresh **/
  refreshButton: {
    backgroundColor: "#EAEAEA",
    padding: 12,
    borderRadius: 8,
  },
  /** ➕ Pulsante di Inserimento Spese **/
  addExpenseButton: {
    backgroundColor: "#FF6347", // Rosso di Totale Spese
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  addExpenseText: {
    color: "#fff", // Testo bianco
    fontSize: 18,
    marginLeft: 10,
  },
  /** ❌ Testo di Errore **/
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#555",
  },
  /** 🟠 Modale **/
  modalButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  closeModalButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  closeModalText: {
    color: "#fff",
    fontSize: 16,
  },
  /** 🔝 Top Bar (Icone) **/
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    gap: 20,
  },
  iconButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#FF6347", // Rosso di Totale Spese
  },
  iconButtonText: {
    color: "#fff", // Testo bianco per le icone
    fontSize: 16,
  },
});

export default ExpensesStyles;
