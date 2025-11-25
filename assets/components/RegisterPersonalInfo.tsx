import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import RegisterStyles from "../styles/Register_style";

const RegisterPersonalInfo = () => {
  const { t } = useTranslation();

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

    if (!formData.username.trim()) newErrors.username = t("error_field_required");
    if (!formData.email.trim() || !formData.email.includes("@")) newErrors.email = t("error_invalid_email");
    if (formData.password.length < 6) newErrors.password = t("error_min_password");
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = t("error_password_mismatch");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      navigation.navigate("RegisterPreferences", { userData: formData });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={[RegisterStyles.scrollContainer, { padding: 20 }]}>
          
          <Text style={RegisterStyles.header}>{t("register_title")}</Text>
          <Text style={RegisterStyles.subHeader}>{t("register_subtitle")}</Text>

          <TextInput
            style={[RegisterStyles.input, errors.username && RegisterStyles.errorBorder]}
            placeholder={t("input_username") + " *"}
            value={formData.username}
            placeholderTextColor="#7F8C8D"
            onChangeText={(text) => setFormData({ ...formData, username: text })}
          />
          {errors.username && <Text style={RegisterStyles.formError}>{errors.username}</Text>}

          <TextInput
            style={[RegisterStyles.input, errors.email && RegisterStyles.errorBorder]}
            placeholder="Email *"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#7F8C8D"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />
          {errors.email && <Text style={RegisterStyles.formError}>{errors.email}</Text>}

          <TextInput
            style={[RegisterStyles.input, errors.password && RegisterStyles.errorBorder]}
            placeholder={t("input_password") + " *"}
            secureTextEntry
            placeholderTextColor="#7F8C8D"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
          />
          {errors.password && <Text style={RegisterStyles.formError}>{errors.password}</Text>}

          <TextInput
            style={[RegisterStyles.input, errors.confirmPassword && RegisterStyles.errorBorder]}
            placeholder={t("input_confirm_password")}
            secureTextEntry
            placeholderTextColor="#7F8C8D"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
          />
          {errors.confirmPassword && (
            <Text style={RegisterStyles.formError}>{errors.confirmPassword}</Text>
          )}

          <TextInput
            style={RegisterStyles.input}
            placeholder={t("input_first_name")}
            placeholderTextColor="#7F8C8D"
            value={formData.first_name}
            onChangeText={(text) => setFormData({ ...formData, first_name: text })}
          />

          <TextInput
            style={RegisterStyles.input}
            placeholder={t("input_last_name")}
            placeholderTextColor="#7F8C8D"
            value={formData.last_name}
            onChangeText={(text) => setFormData({ ...formData, last_name: text })}
          />

          <TouchableOpacity style={RegisterStyles.button} onPress={handleNext}>
            <Text style={RegisterStyles.buttonText}>{t("button_next")}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={RegisterStyles.link}>{t("login_redirect")}</Text>
          </TouchableOpacity>

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default RegisterPersonalInfo;
