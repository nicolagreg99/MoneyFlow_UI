import { StyleSheet } from 'react-native';

const MenuStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3498DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  profileIconText: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  profileDetails: {
    alignItems: 'flex-start',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495E',
  },
  email: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 20,
  },
  menuContainer: {
    width: '100%',
    borderRadius: 15,
    backgroundColor: '#fff',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  menuItem: {
    backgroundColor: '#3498DB',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  menuText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#E74C3C',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    width: '90%',
  },
  versionText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default MenuStyles;
