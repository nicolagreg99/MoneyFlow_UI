import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { useLinking } from '@react-navigation/native';
import API from "../../config/api";
import { useTranslation } from "react-i18next";

const UpdatePasswordScreen = ({ route, navigation }: any) => {
  const { t } = useTranslation();

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const { getInitialURL } = useLinking();

  useEffect(() => {
    const checkDeepLink = async () => {
      const url = await getInitialURL();
      if (url) {
        const tokenFromUrl = new URL(url).searchParams.get('token');
        if (tokenFromUrl) {
          setToken(tokenFromUrl);
        } else {
          Alert.alert(t("error_title"), t("reset_invalid_token"));
          navigation.navigate('Login');
        }
      } else if (route.params?.token) {
        setToken(route.params.token);
      } else {
        Alert.alert(t("error_title"), t("reset_token_not_found"));
        navigation.navigate('Login');
      }
    };

    checkDeepLink();
  }, [route.params, getInitialURL, navigation, t]);

  const handlePasswordUpdate = async () => {
    if (!password) {
      Alert.alert(t("error_title"), t("reset_empty_password_error"));
      return;
    }

    if (!token) {
      Alert.alert(t("error_title"), t("reset_invalid_token"));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API.BASE_URL}/reset_password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(t("success_title"), t("reset_success"));
        navigation.navigate('Login');
      } else {
        Alert.alert(t("error_title"), data.message || t("reset_error_generic"));
      }
    } catch (error) {
      Alert.alert(t("error_title"), t("reset_error_request"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder={t("reset_new_password_placeholder")}
        secureTextEntry
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 20,
          paddingLeft: 10,
        }}
      />
      <Button
        title={loading ? t("loading") : t("reset_update_button")}
        onPress={handlePasswordUpdate}
        disabled={loading}
      />
    </View>
  );
};

export default UpdatePasswordScreen;
