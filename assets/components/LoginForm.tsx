import React, { useState, useEffect } from 'react';
import { 
  View, TextInput, Text, Button, TouchableOpacity, Image, Dimensions, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import LoginStyles from '../styles/Login_style';
import API from "../../config/api";

type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type FormValues = {
  username: string;
  password: string;
};

const { width } = Dimensions.get('window');

const LoginForm = () => {
  const [formValues, setFormValues] = useState<FormValues>({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<any>({});
  const [loginStatus, setLoginStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleChange = (name: string, value: string) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${API.BASE_URL}/api/v1/login`, formValues);
      if (response.data.token) {
        await AsyncStorage.setItem('authToken', response.data.token);
  
        const userResponse = await axios.get(`${API.BASE_URL}/api/v1/me`, {
          headers: { 'x-access-token': response.data.token },
        });
  
        await AsyncStorage.setItem('userData', JSON.stringify(userResponse.data));

        setLoginStatus({ type: 'success', message: 'Accesso riuscito! Reindirizzamento...' });

        setTimeout(() => {
          navigation.navigate('Main');
        }, 1000);
      } else {
        setFormErrors({ general: response.data.message });
        setLoginStatus({ type: 'error', message: 'Token non valido. Riprova.' });
      }
    } catch (error) {
      setFormErrors({ general: "Errore di connessione o credenziali non valide" });
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 50 : 30 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={[LoginStyles.scrollContainer, { justifyContent: 'center', marginTop: 20 }]} 
          keyboardShouldPersistTaps="handled"
        >
          <View style={LoginStyles.container}>
            {loginStatus && (
              <View style={[LoginStyles.banner]}>
                <Text style={LoginStyles.bannerText}>{loginStatus.message}</Text>
              </View>
            )}

            <Image 
              source={require('../logo_money.png')} 
              style={[
                LoginStyles.logo, 
                { 
                  width: isKeyboardVisible ? width * 0.25 : width * 0.35, 
                  height: isKeyboardVisible ? width * 0.25 : width * 0.35, 
                  marginBottom: isKeyboardVisible ? 5 : 30, 
                  marginTop: isKeyboardVisible ? 10 : 40
                }
              ]} 
              resizeMode="contain" 
            />
            
            <Text style={LoginStyles.header}>Benvenuto</Text>
            <Text style={LoginStyles.subHeader}>Inserisci le tue credenziali per accedere alla tua dashboard personale</Text>

            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#BDC3C7',
                marginBottom: 15,
                paddingHorizontal: 15,
                fontSize: 16,
                borderRadius: 10,
                backgroundColor: '#fff',
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 5,
                elevation: 3,
                height: 50,
                width: '100%',
              }}
              placeholder="Username"
              placeholderTextColor="#7F8C8D"
              value={formValues.username}
              onChangeText={(text) => handleChange('username', text)}
            />
            <Text style={LoginStyles.formError}>{formErrors.username}</Text>

            <View>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#BDC3C7',
                  paddingHorizontal: 15,
                  fontSize: 16,
                  borderRadius: 10,
                  backgroundColor: '#fff',
                  shadowColor: '#000',
                  shadowOpacity: 0.1,
                  shadowRadius: 5,
                  elevation: 3,
                  height: 50,
                  width: '100%',
                  paddingRight: 40,
                }}
                placeholder="Password"
                placeholderTextColor="#7F8C8D"
                secureTextEntry={!showPassword}
                value={formValues.password}
                onChangeText={(text) => handleChange('password', text)}
              />
              <TouchableOpacity onPress={togglePasswordVisibility} style={LoginStyles.iconContainer}>
                <MaterialIcons 
                  name={showPassword ? 'visibility' : 'visibility-off'} 
                  size={24} 
                  color="#3498DB" 
                />
              </TouchableOpacity>
            </View>
            <Text style={LoginStyles.formError}>{formErrors.password}</Text>

            <Button title="Login" onPress={handleSubmit} />
            {formErrors.general && <Text style={LoginStyles.formError}>{formErrors.general}</Text>}

            <View style={LoginStyles.footer}>
              <Text style={LoginStyles.footerText}>
                &copy; 2025 Money App
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('RegisterPersonalInfo')}>
                <Text style={LoginStyles.link}>Crea nuovo account</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={LoginStyles.link}>Password dimenticata?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginForm;
