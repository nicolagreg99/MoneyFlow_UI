import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  Button,
  TouchableOpacity,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";

import LoginStyles from "../styles/Login_style";
import API from "../../config/api";

type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, "Login">;

type FormValues = {
  username: string;
  password: string;
};

const { width } = Dimensions.get("window");

const LoginForm = () => {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState<FormValues>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<any>({});
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );

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
    setFormErrors({});

    try {
      const response = await axios.post(`${API.BASE_URL}/api/v1/login`, formValues);

      if (response.data.token) {
        await AsyncStorage.setItem("authToken", response.data.token);

        const userResponse = await axios.get(`${API.BASE_URL}/api/v1/me`, {
          headers: { "x-access-token": response.data.token },
        });

        await AsyncStorage.setItem("userData", JSON.stringify(userResponse.data));

        Toast.show({
          type: "success",
          text1: t("login_redirect_success"),
        });

        setTimeout(() => {
          navigation.navigate("Main");
        }, 900);
      } else {
        Toast.show({
          type: "error",
          text1: t("login_token_invalid"),
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: t("login_credentials_error"),
      });

      setFormErrors({ general: t("login_credentials_error") });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, paddingTop: Platform.OS === "ios" ? 50 : 30 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={[
            LoginStyles.scrollContainer,
            { justifyContent: "center", marginTop: 20 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={LoginStyles.container}>
            <Image
              source={require("../logo_money.png")}
              style={[
                LoginStyles.logo,
                {
                  width: isKeyboardVisible ? width * 0.25 : width * 0.35,
                  height: isKeyboardVisible ? width * 0.25 : width * 0.35,
                  marginBottom: isKeyboardVisible ? 5 : 30,
                  marginTop: isKeyboardVisible ? 10 : 40,
                },
              ]}
              resizeMode="contain"
            />

            <Text style={LoginStyles.header}>{t("login_title")}</Text>
            <Text style={LoginStyles.subHeader}>{t("login_subtitle")}</Text>

            <TextInput
              style={LoginStyles.input}
              placeholder={t("input_username")}
              placeholderTextColor="#7F8C8D"
              value={formValues.username}
              onChangeText={(text) => handleChange("username", text)}
            />
            <Text style={LoginStyles.formError}>{formErrors.username}</Text>

            <View>
              <TextInput
                style={[LoginStyles.input, { paddingRight: 40 }]}
                placeholder={t("input_password")}
                placeholderTextColor="#7F8C8D"
                secureTextEntry={!showPassword}
                value={formValues.password}
                onChangeText={(text) => handleChange("password", text)}
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                style={LoginStyles.iconContainer}
              >
                <MaterialIcons
                  name={showPassword ? "visibility" : "visibility-off"}
                  size={24}
                  color="#3498DB"
                />
              </TouchableOpacity>
            </View>

            <Text style={LoginStyles.formError}>{formErrors.password}</Text>

            <Button title={t("button_login")} onPress={handleSubmit} />

            <View style={LoginStyles.footer}>
              <Text style={LoginStyles.footerText}>{t("footer_copy")}</Text>

              <TouchableOpacity
                onPress={() => navigation.navigate("RegisterPersonalInfo")}
              >
                <Text style={LoginStyles.link}>{t("create_account")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("ForgotPassword")}
              >
                <Text style={LoginStyles.link}>{t("forgot_password")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginForm;
