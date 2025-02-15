import { StyleSheet } from 'react-native';

const ExpensesStyles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 20,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", 
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
    letterSpacing: 0.5,
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
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },

  /** 🎛️ Filtro Spese **/
  filterContainer: {
    marginBottom: 20,
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
  totalContainer: {
    backgroundColor: '#ff0000',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },  
  totalText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  totalAmount: {
    fontSize: 34,
    color: '#fff',
    fontWeight: '700',
  },

  /** 📊 Contenitore del Grafico **/
  chartWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },  
  chartScrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  chartContainer: {
    width: "100%",
    minHeight: 250,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center", // 🔹 Centra il grafico orizzontalmente
    alignItems: "center", // 🔹 Centra verticalmente
    marginBottom: 10,
  },   
  chartPlaceholder: {
    width: "100%",
    minHeight: 300, // 📏 Più spazio per evitare sovrapposizioni
    flexDirection: "column", 
    alignItems: "center",  // ✅ Centra ORIZZONTALMENTE
    justifyContent: "center", // ✅ Centra VERTICALMENTE
  },
  
  /** 🔹 Legenda (Adattabile) **/
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
    color: "#333", // Colore testo
    marginLeft: 10, // Spazio tra l'icona e il testo
  },  
  // Refresh Button
  refreshButton: {
    padding: 10,
    color: '#555', // Grigio scuro
    alignSelf: "flex-end",
  }
  
});

export default ExpensesStyles;
