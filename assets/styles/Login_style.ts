import { StyleSheet } from 'react-native';

const LoginStyles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
  },
  logo: {
    width: 150,   // Imposta la larghezza del logo
    height: 150,  // Imposta l'altezza del logo
    alignSelf: 'center', // Centra l'immagine orizzontalmente
    marginBottom: 10,    // Spazio tra il logo e il testo
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Roboto',
  },
  subHeader: {
    fontSize: 18,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Roboto',
  },
  input: {
    borderBottomWidth: 2,
    borderColor: '#3498DB',
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    height: 50,
    width: '100%',
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  inputPassword: {
    borderBottomWidth: 2,
    borderColor: '#3498DB',
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    height: 50,
    width: '100%',
    paddingRight: 40,  // Spazio per l'icona
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 12,  // Posizione a destra
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  eyeIcon: {
    fontSize: 24,
    color: '#3498DB',
  },
  iconContainer: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#BDC3C7',
    marginBottom: 10,
    fontFamily: 'Roboto',
  },
  formError: {
    color: '#E74C3C',
    marginTop: 10,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#3498DB',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Roboto',
  },
  link: {
    color: '#3498DB',
    fontSize: 14,
    marginTop: 15,
    textDecorationLine: 'underline',
    fontFamily: 'Roboto',
  },
  banner: {
    padding: 10,
    marginBottom: 20,
    width: '100%',
    textAlign: 'center',
    borderRadius: 5,
  },
  successBanner: {
    backgroundColor: 'green',
  },
  errorBanner: {
    backgroundColor: 'red',
  },
  bannerText: {
    color: 'white',
    fontWeight: 'bold',
  },
  successBorder: {
    borderColor: '#2ECC71', // Verde quando le password combaciano
    borderWidth: 2,
    borderRadius: 5,
  },
  
  errorBorder: {
    borderColor: '#E74C3C', // Rosso se le password non combaciano
    borderWidth: 2,
    borderRadius: 5,
  },
  
  successText: {
    color: '#2ECC71',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },  

});

export default LoginStyles;
