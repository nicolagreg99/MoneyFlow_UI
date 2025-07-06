import { StyleSheet } from 'react-native';

const MainStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 20, // sopra e sotto
    paddingHorizontal: 20, // a sinistra e destra
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2C3E50',
  },
  widgetsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  widget: {
    width: '32%',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  widgetTitle: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  widgetIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  widgetName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
  },
  widgetValue: {
    fontSize: 14, 
    fontWeight: 'bold',
    color: '#3498DB',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default MainStyles;