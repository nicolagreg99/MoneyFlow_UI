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
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  /** 📅 Accordion Date Picker **/
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

  /** 🎛️ Filter Selector **/
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
    backgroundColor: '#2C3E50', // Grigio scuro elegante
    borderColor: '#1C2833',
  },
  filterText: {
    fontSize: 16,
    color: '#333',
  },
  filterOption: {
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  filterOptionText: {
    fontSize: 16,
    color: '#333',
  },

  /** 🏆 Totale Spese **/
  totalContainer: {
    backgroundColor: '#16A085', // Verde elegante
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1, // Ombra leggera per un effetto professionale
    shadowRadius: 4,
    elevation: 3,
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

  /** 📊 Placeholder per il Grafico **/
  chartPlaceholder: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartText: {
    fontSize: 18,
    color: '#7f8c8d',
  },

  /** 🔽 Lista dei filtri migliorata **/
  filterList: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    maxHeight: 250, // Evita che il filtro si espanda troppo
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 10, // Assicura che sia in primo piano
  },

  /** 📌 Nuova icona per il Date Picker **/
  dateIcon: {
    marginLeft: 10,
    tintColor: '#7f8c8d', // Colore più neutro per maggiore leggibilità
  },
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
  
});

export default ExpensesStyles;
