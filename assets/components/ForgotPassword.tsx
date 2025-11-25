import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ResetForgotPwd from '../styles/ResetForgotPwd_style';
import API from "../../config/api";
import { useTranslation } from 'react-i18next';

const ForgotPasswordScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert(t("error_title"), t("forgot_empty_email_error"));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API.BASE_URL}/request_reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier: email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(t("success_title"), t("forgot_email_sent"));
        navigation.navigate('Login');
      } else {
        Alert.alert(t("error_title"), data.message || t("forgot_generic_error"));
      }
    } catch (error) {
      Alert.alert(t("error_title"), t("forgot_request_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={ResetForgotPwd.container}>
      <Text style={ResetForgotPwd.header}>{t("forgot_title")}</Text>
      <Text style={ResetForgotPwd.subHeader}>{t("forgot_subtitle")}</Text>

      <TextInput
        style={ResetForgotPwd.input}
        placeholder={t("input_email")}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity
        style={ResetForgotPwd.button}
        onPress={handlePasswordReset}
        disabled={loading}
      >
        <Text style={ResetForgotPwd.buttonText}>
          {loading ? t("loading") : t("forgot_reset_button")}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={ResetForgotPwd.link}>{t("forgot_back_to_login")}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;
