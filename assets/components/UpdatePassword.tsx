import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import API from "../../config/api";
import { useTranslation } from "react-i18next";

const UpdatePasswordScreen = ({ route, navigation }: any) => {
  const { t } = useTranslation();
  const { token } = route.params || {};

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      Alert.alert(t("error_title"), t("reset_invalid_token"));
      navigation.navigate('Login');
    }
  }, [token]);

  const handlePasswordUpdate = async () => {
    if (!password) {
      Alert.alert(t("error_title"), t("reset_empty_password_error"));
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
        Alert.alert(t("error_title"), data.message);
      }
    } catch {
      Alert.alert(t("error_title"), t("reset_error_request"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder={t("reset_new_password_placeholder")}
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />
      <Button
        title={loading ? t("loading") : t("reset_update_button")}
        onPress={handlePasswordUpdate}
      />
    </View>
  );
};


export default UpdatePasswordScreen;
