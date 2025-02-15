import { StyleSheet, Platform } from 'react-native';

const LoginStyles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
    paddingTop: Platform.OS === 'ios' ? 50 : 30, // Abbassiamo tutto per evitare la barra di stato
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20, // Spazio extra in basso
  },
  logo: {
    width: 130, // Leggermente più piccolo per bilanciare lo spazio
    height: 130,
    alignSelf: 'center',
    marginBottom: 20, // Abbassato per evitare che sia troppo vicino ai testi
    marginTop: 30, // Sposta il logo più in basso
  },
  header: {
    fontSize: 28, // Leggermente più piccolo per ridurre il blocco di testo
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 15, // Spazio ridotto sotto il titolo
    fontFamily: 'Roboto',
  },
  subHeader: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 25,
    fontFamily: 'Roboto',
  },
  input: {
    borderBottomWidth: 2,
    borderColor: '#3498DB',
    marginBottom: 15, // Leggermente ridotto per compattezza
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
    paddingRight: 40, // Spazio per l'icona
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 12,
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
    marginTop: 30, // Spostato un po' più in alto
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#BDC3C7',
    marginBottom: 8,
    fontFamily: 'Roboto',
  },
  formError: {
    color: '#E74C3C',
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3498DB',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15, // Ridotto lo spazio sopra il pulsante
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
    marginTop: 12,
    textDecorationLine: 'underline',
    fontFamily: 'Roboto',
  },
  banner: {
    padding: 10,
    marginBottom: 15, // Ridotto per non occupare troppo spazio
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
    textAlign: 'center',
  },
  successBorder: {
    borderColor: '#2ECC71',
    borderWidth: 2,
    borderRadius: 5,
  },
  errorBorder: {
    borderColor: '#E74C3C',
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
