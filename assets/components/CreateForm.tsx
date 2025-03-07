import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LoginStyles from '../styles/Login_style';

type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Register: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

type FormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const CreateForm = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<any>({});
  const [registerStatus, setRegisterStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const navigation = useNavigation<NavigationProp>();

  const handleChange = (name: string, value: string) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const isConfirmPasswordTouched = formValues.confirmPassword.length > 0;
  const passwordsMatch = formValues.password === formValues.confirmPassword && isConfirmPasswordTouched;
  const showPasswordError = isConfirmPasswordTouched && !passwordsMatch;

  const handleSubmit = async () => {
    if (!passwordsMatch) {
      setFormErrors({ confirmPassword: 'Le password non corrispondono' });
      return;
    }

    try {
      const response = await axios.post("http://192.168.1.159:5000/api/v1/register", {
        username: formValues.username,
        email: formValues.email,
        password: formValues.password,
      });

      if (response.data.token) {
        setRegisterStatus({ type: 'success', message: 'Registrazione completata! Puoi accedere ora.' });
        setTimeout(() => navigation.navigate('Login'), 2000);
      } else {
        setFormErrors({ general: response.data.message });
        setRegisterStatus({ type: 'error', message: 'Registrazione fallita. Riprova.' });
      }
    } catch (error) {
      setFormErrors({ general: "Errore di connessione o dati non validi" });
      setRegisterStatus({ type: 'error', message: "Errore di connessione o dati non validi" });
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={LoginStyles.container}>
      <ScrollView contentContainerStyle={LoginStyles.scrollContainer} keyboardShouldPersistTaps="handled">
        {registerStatus && (
          <View
            style={[
              LoginStyles.banner,
              registerStatus.type === 'success' ? LoginStyles.successBanner : LoginStyles.errorBanner,
            ]}
          >
            <Text style={LoginStyles.bannerText}>{registerStatus.message}</Text>
          </View>
        )}

        <Image source={require('../logo_money.png')} style={LoginStyles.logo} resizeMode="contain" />

        <Text style={LoginStyles.header}>Registrazione</Text>
        <Text style={LoginStyles.subHeader}>Crea un account per iniziare</Text>

        <TextInput
          style={LoginStyles.input}
          placeholder="Username"
          value={formValues.username}
          onChangeText={(text) => handleChange('username', text)}
        />
        <Text style={LoginStyles.formError}>{formErrors.username}</Text>

        <TextInput
          style={LoginStyles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={formValues.email}
          onChangeText={(text) => handleChange('email', text)}
        />
        <Text style={LoginStyles.formError}>{formErrors.email}</Text>

        <View style={LoginStyles.passwordContainer}>
          <TextInput
            style={LoginStyles.inputPassword}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={formValues.password}
            onChangeText={(text) => handleChange('password', text)}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={LoginStyles.iconContainer}>
            <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="#3498DB" />
          </TouchableOpacity>
        </View>
        <Text style={LoginStyles.formError}>{formErrors.password}</Text>

        <View style={[LoginStyles.passwordContainer, { marginBottom: 20 }]}>
          <TextInput
            style={[
              LoginStyles.inputPassword,
              showPasswordError && { borderColor: 'red' },
              passwordsMatch && { borderColor: 'green' },
            ]}
            placeholder="Conferma Password"
            secureTextEntry={!showConfirmPassword}
            value={formValues.confirmPassword}
            onChangeText={(text) => handleChange('confirmPassword', text)}
          />
          <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={LoginStyles.iconContainer}>
            <MaterialIcons
              name={showConfirmPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color={passwordsMatch ? 'green' : '#3498DB'}
            />
          </TouchableOpacity>
        </View>

        {showPasswordError && <Text style={LoginStyles.formError}>Le password non corrispondono</Text>}

        <TouchableOpacity style={LoginStyles.button} onPress={handleSubmit}>
          <Text style={LoginStyles.buttonText}>Registrati</Text>
        </TouchableOpacity>

        {formErrors.general && <Text style={LoginStyles.formError}>{formErrors.general}</Text>}

        <View style={LoginStyles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={LoginStyles.link}>Hai già un account? Accedi</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateForm;
