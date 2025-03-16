import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import LoginStyles from "../styles/Login_style";

const RegisterPersonalInfo = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigation = useNavigation();

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};

    if (!formData.username) newErrors.username = "Il nome utente è obbligatorio";
    if (!formData.email.includes("@")) newErrors.email = "L'email non è valida";
    if (formData.password.length < 6) newErrors.password = "Minimo 6 caratteri";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Le password non coincidono";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateForm()) return;
    navigation.navigate("RegisterPreferences", { formData });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={[LoginStyles.scrollContainer, { paddingHorizontal: 20, paddingTop: 40 }]}>
          <Text style={LoginStyles.header}>Registrazione</Text>

          <TextInput
            style={[LoginStyles.input, errors.username ? LoginStyles.errorBorder : null]}
            placeholder="Username *"
            onChangeText={(text) => setFormData({ ...formData, username: text })}
          />
          {errors.username && <Text style={LoginStyles.formError}>{errors.username}</Text>}

          <TextInput
            style={[LoginStyles.input, errors.email ? LoginStyles.errorBorder : null]}
            placeholder="Email *"
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />
          {errors.email && <Text style={LoginStyles.formError}>{errors.email}</Text>}

          <TextInput
            style={[LoginStyles.input, errors.password ? LoginStyles.errorBorder : null]}
            placeholder="Password *"
            secureTextEntry
            onChangeText={(text) => setFormData({ ...formData, password: text })}
          />
          {errors.password && <Text style={LoginStyles.formError}>{errors.password}</Text>}

          <TextInput
            style={[LoginStyles.input, errors.confirmPassword ? LoginStyles.errorBorder : null]}
            placeholder="Conferma Password *"
            secureTextEntry
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
          />
          {errors.confirmPassword && <Text style={LoginStyles.formError}>{errors.confirmPassword}</Text>}

          <TextInput
            style={LoginStyles.input}
            placeholder="Nome"
            onChangeText={(text) => setFormData({ ...formData, first_name: text })}
          />

          <TextInput
            style={LoginStyles.input}
            placeholder="Cognome"
            onChangeText={(text) => setFormData({ ...formData, last_name: text })}
          />

          <TouchableOpacity style={LoginStyles.button} onPress={handleNext}>
            <Text style={LoginStyles.buttonText}>Avanti</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={LoginStyles.link}>Hai già un account? Accedi</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default RegisterPersonalInfo;
