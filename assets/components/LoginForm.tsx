import React, { useState } from 'react';
import { View, TextInput, Text, Button, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import LoginStyles from './Login_style';

type RootStackParamList = {
  Login: undefined;
  Main: undefined;
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
  const navigation = useNavigation<NavigationProp>();

  const handleChange = (name: string, value: string) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://192.168.1.5:5000/login", formValues);
      if (response.data.token) {
        navigation.navigate('Main');
      } else {
        setFormErrors({ general: response.data.message });
      }
    } catch (error) {
      setFormErrors({ general: "Errore di connessione o credenziali non valide" });
    }
  };

  return (
    <View style={LoginStyles.container}>
      <Image 
        source={require('../logo_money.png')} 
        style={[LoginStyles.logo, { width: width * 0.3, height: width * 0.3 }]} 
        resizeMode="contain" 
      />
      
      <Text style={LoginStyles.header}>Benvenuto</Text>
      <Text style={LoginStyles.subHeader}>Inserisci le tue credenziali per accedere alla tua dashboard personale</Text>

      <TextInput
        style={LoginStyles.input}
        placeholder="Username"
        value={formValues.username}
        onChangeText={(text) => handleChange('username', text)}
      />
      <Text style={LoginStyles.formError}>{formErrors.username}</Text>

      <View style={LoginStyles.passwordContainer}>
        <TextInput
          style={LoginStyles.inputPassword}
          placeholder="Password"
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
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={LoginStyles.link}>Crea nuovo account</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={LoginStyles.link}>Password dimenticata?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginForm;
