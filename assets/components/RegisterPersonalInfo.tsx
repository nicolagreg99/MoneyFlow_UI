import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import RegisterStyles from "../styles/Register_style";

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
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) newErrors.username = "Il nome utente è obbligatorio";
    if (!formData.email.trim() || !formData.email.includes("@")) newErrors.email = "Email non valida";
    if (formData.password.length < 6) newErrors.password = "Minimo 6 caratteri";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Le password non coincidono";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      navigation.navigate("RegisterPreferences", { formData });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={[RegisterStyles.scrollContainer, { padding: 20 }]}>
          <Text style={RegisterStyles.header}>Registrazione</Text>
          <Text style={RegisterStyles.subHeader}>Compila i campi obbligatori</Text>

          <TextInput
            style={[RegisterStyles.input, errors.username && RegisterStyles.errorBorder]}
            placeholder="Username *"
            value={formData.username}
            onChangeText={(text) => setFormData({ ...formData, username: text })}
          />
          {errors.username && <Text style={RegisterStyles.formError}>{errors.username}</Text>}

          <TextInput
            style={[RegisterStyles.input, errors.email && RegisterStyles.errorBorder]}
            placeholder="Email *"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />
          {errors.email && <Text style={RegisterStyles.formError}>{errors.email}</Text>}

          <TextInput
            style={[RegisterStyles.input, errors.password && RegisterStyles.errorBorder]}
            placeholder="Password *"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
          />
          {errors.password && <Text style={RegisterStyles.formError}>{errors.password}</Text>}

          <TextInput
            style={[RegisterStyles.input, errors.confirmPassword && RegisterStyles.errorBorder]}
            placeholder="Conferma Password *"
            secureTextEntry
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
          />
          {errors.confirmPassword && <Text style={RegisterStyles.formError}>{errors.confirmPassword}</Text>}

          <TextInput
            style={RegisterStyles.input}
            placeholder="Nome"
            value={formData.first_name}
            onChangeText={(text) => setFormData({ ...formData, first_name: text })}
          />

          <TextInput
            style={RegisterStyles.input}
            placeholder="Cognome"
            value={formData.last_name}
            onChangeText={(text) => setFormData({ ...formData, last_name: text })}
          />

          <TouchableOpacity style={RegisterStyles.button} onPress={handleNext}>
            <Text style={RegisterStyles.buttonText}>Avanti</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={RegisterStyles.link}>Hai già un account? Accedi</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default RegisterPersonalInfo;
