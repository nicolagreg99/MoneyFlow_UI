import React, { useEffect, useState } from "react";
import { 
  View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MenuStyles from "../styles/Menu_style";
import appJson from "../../app.json";
import API from "../../config/api";
import { getCurrencyFlag } from "./personalized_components/CurrencyPicker";
import { useTranslation } from "react-i18next";

type RootStackParamList = {
  Menu: undefined;
  Login: undefined;
  Main: { screen?: string };
  InsertExpenses: undefined;
  InsertIncomes: undefined;
  EditUser: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, "Menu">;

const MenuScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showExpensesSubMenu, setShowExpensesSubMenu] = useState(false);
  const [showIncomesSubMenu, setShowIncomesSubMenu] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (!storedUserData) {
          navigation.navigate("Login");
          return;
        }
        setUserData(JSON.parse(storedUserData));
      } catch (error) {
        console.error("Error loading user:", error);
        navigation.navigate("Login");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
    const unsubscribe = navigation.addListener("focus", loadUserData);
    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        await fetch(`${API.BASE_URL}/api/v1/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        });
      }
      await AsyncStorage.multiRemove(["authToken", "userData"]);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      t("logout_confirm_title"),
      t("logout_confirm_message"),
      [
        { text: t("cancel"), style: "cancel" },
        { text: t("exit"), style: "destructive", onPress: handleLogout },
      ]
    );
  };

  return (
    <View style={MenuStyles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#3498DB" />
      ) : userData ? (
        <ScrollView 
          style={{ width: "100%" }} 
          contentContainerStyle={{ flexGrow: 1, alignItems: "center", paddingBottom: 20 }}
        >
          {/* Profilo Utente */}
          <View style={MenuStyles.profileCard}>
            <View style={MenuStyles.avatar}>
              <Text style={MenuStyles.avatarText}>
                {userData.username?.[0]?.toUpperCase() || "U"}
              </Text>
            </View>

            <View style={MenuStyles.profileInfo}>
              <Text style={MenuStyles.nameText}>{userData.username}</Text>
              <Text style={MenuStyles.emailText}>{userData.email}</Text>
              {userData.default_currency && (
                <Text style={MenuStyles.currencyText}>
                  {getCurrencyFlag(userData.default_currency)} {userData.default_currency}
                </Text>
              )}
            </View>

            <TouchableOpacity 
              style={MenuStyles.settingsButton} 
              onPress={() => navigation.navigate("EditUser")}
            >
              <MaterialIcons name="settings" size={22} color="#3498DB" />
            </TouchableOpacity>
          </View>

          {/* Menu */}
          <View style={MenuStyles.menuWrapper}>
            <TouchableOpacity 
              style={MenuStyles.menuItem} 
              onPress={() => navigation.navigate("Main")}
            >
              <FontAwesome name="home" size={20} color="#3498DB" />
              <Text style={MenuStyles.menuLabel}>{t("home")}</Text>
            </TouchableOpacity>

            {/* SPESE */}
            <TouchableOpacity 
              style={MenuStyles.menuItem}
              onPress={() => setShowExpensesSubMenu(!showExpensesSubMenu)}
            >
              <MaterialIcons name="attach-money" size={20} color="#3498DB" />
              <Text style={MenuStyles.menuLabel}>{t("expenses")}</Text>
              <MaterialIcons 
                name={showExpensesSubMenu ? "expand-less" : "expand-more"} 
                size={22} 
                color="#3498DB"
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>

            {showExpensesSubMenu && (
              <View style={MenuStyles.subMenu}>
                <TouchableOpacity 
                  style={MenuStyles.subItem}
                  onPress={() => navigation.navigate("Main", { screen: "Expenses" })}
                >
                  <FontAwesome name="list" size={16} color="#3498DB" />
                  <Text style={MenuStyles.subText}>{t("view_expenses")}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={MenuStyles.subItem}
                  onPress={() => navigation.navigate("InsertExpenses")}
                >
                  <MaterialIcons name="add" size={18} color="#3498DB" />
                  <Text style={MenuStyles.subText}>{t("add_expense")}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ENTRATE */}
            <TouchableOpacity 
              style={MenuStyles.menuItem}
              onPress={() => setShowIncomesSubMenu(!showIncomesSubMenu)}
            >
              <MaterialIcons name="account-balance-wallet" size={20} color="#3498DB" />
              <Text style={MenuStyles.menuLabel}>{t("incomes")}</Text>
              <MaterialIcons 
                name={showIncomesSubMenu ? "expand-less" : "expand-more"} 
                size={22} 
                color="#3498DB"
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>

            {showIncomesSubMenu && (
              <View style={MenuStyles.subMenu}>
                <TouchableOpacity 
                  style={MenuStyles.subItem}
                  onPress={() => navigation.navigate("Main", { screen: "Incomes" })}
                >
                  <FontAwesome name="list" size={16} color="#3498DB" />
                  <Text style={MenuStyles.subText}>{t("view_incomes")}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={MenuStyles.subItem}
                  onPress={() => navigation.navigate("InsertIncomes")}
                >
                  <MaterialIcons name="add" size={18} color="#3498DB" />
                  <Text style={MenuStyles.subText}>{t("add_income")}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* LOGOUT */}
            <TouchableOpacity 
              style={[MenuStyles.menuItem, MenuStyles.logoutButton]} 
              onPress={confirmLogout}
            >
              <FontAwesome name="sign-out" size={20} color="#fff" />
              <Text style={MenuStyles.logoutText}>{t("logout")}</Text>
            </TouchableOpacity>
          </View>

          {/* App Version */}
          <Text style={MenuStyles.versionText}>
            {t("app_version")} {appJson.expo.version}
          </Text>

        </ScrollView>
      ) : (
        <Text>{t("error_loading_user")}</Text>
      )}
    </View>
  );
};

export default MenuScreen;
