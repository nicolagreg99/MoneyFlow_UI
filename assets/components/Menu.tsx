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

type RootStackParamList = {
  Menu: undefined;
  Login: undefined;
  Main: { screen?: string };
  InsertExpenses: undefined;
  Expenses: undefined;
  InsertIncomes: undefined;
  Incomes: undefined;
  EditUser: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, "Menu">;

const MenuScreen = () => {
  const navigation = useNavigation<NavigationProp>();
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
        console.error("Errore nel recupero dei dati utente:", error);
        navigation.navigate("Login");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        const response = await fetch("http://192.168.1.5:5000/api/v1/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        });

        const contentType = response.headers.get("content-type");

        if (response.ok) {
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            console.log("Logout success:", data);
          } else {
            console.warn("Logout effettuato, ma la risposta non è in formato JSON.");
          }

          await AsyncStorage.removeItem("userData");
          await AsyncStorage.removeItem("authToken");
          navigation.navigate("Login");
        } else {
          let errorMsg = "Errore nel logout API.";
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMsg = errorData.message || errorMsg;
          } else {
            const errorText = await response.text();
            console.error("Errore grezzo:", errorText);
          }
          console.error(errorMsg);
        }
      } else {
        console.error("Token di accesso non trovato.");
      }
    } catch (error) {
      console.error("Errore nel logout:", error);
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      "Conferma Logout", 
      "Sei sicuro di voler uscire?", 
      [
        { text: "Annulla", style: "cancel" },
        { text: "Esci", style: "destructive", onPress: handleLogout }
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
          keyboardShouldPersistTaps="handled"
        >
          {/* Profilo Utente */}
          <View style={MenuStyles.profileContainer}>
            <View style={MenuStyles.profileIcon}>
              <Text style={MenuStyles.profileIconText}>
                {userData.username.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={MenuStyles.profileDetails}>
              <Text style={MenuStyles.header}>Profilo Utente</Text>
              <Text style={MenuStyles.username}>{userData.username}</Text>
              <Text style={MenuStyles.email}>{userData.email}</Text>
            </View>

            <TouchableOpacity 
              style={MenuStyles.settingsButton} 
              onPress={() => navigation.navigate("EditUser")}
            >
              <MaterialIcons name="settings" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Menu Navigazione */}
          <View style={MenuStyles.menuContainer}>
            <TouchableOpacity style={MenuStyles.menuItem} onPress={() => navigation.navigate("Main")}>
              <FontAwesome name="home" size={24} color="#FFF" />
              <Text style={[MenuStyles.menuText, { marginLeft: 4 }]}>Home</Text>
              </TouchableOpacity>

            <TouchableOpacity
              style={MenuStyles.menuItem}
              onPress={() => setShowExpensesSubMenu(!showExpensesSubMenu)}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialIcons name="attach-money" size={24} color="#FFF" />
                  <Text style={[MenuStyles.menuText, { marginLeft: 10 }]}>Spese</Text> {/* Spazio tra icona e testo */}
                </View>
                <MaterialIcons 
                  name={showExpensesSubMenu ? "expand-less" : "expand-more"} 
                  size={24} 
                  color="#FFF" 
                />
              </View>
            </TouchableOpacity>



            {showExpensesSubMenu && (
              <View style={MenuStyles.subMenuContainer}>
                <TouchableOpacity
                  style={MenuStyles.subMenuItem}
                  onPress={() => navigation.navigate("Main", { screen: "Expenses" })}
                >
                  <FontAwesome name="list" size={18} color="#3498DB" />
                  <Text style={MenuStyles.subMenuText}>Visualizza Spese</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={MenuStyles.subMenuItem}
                  onPress={() => navigation.navigate("InsertExpenses")}
                >
                  <MaterialIcons name="add" size={18} color="#3498DB" />
                  <Text style={MenuStyles.subMenuText}>Inserisci Spesa</Text>
                </TouchableOpacity>
              </View>
            )}

          <TouchableOpacity
            style={MenuStyles.menuItem}
            onPress={() => setShowIncomesSubMenu(!showIncomesSubMenu)}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons name="account-balance-wallet" size={24} color="#FFF" />
                <Text style={[MenuStyles.menuText, { marginLeft: 10 }]}>Entrate</Text> {/* Spazio tra icona e testo */}
              </View>
              <MaterialIcons 
                name={showIncomesSubMenu ? "expand-less" : "expand-more"} 
                size={24} 
                color="#FFF" 
              />
            </View>
          </TouchableOpacity>


            {showIncomesSubMenu && (
              <View style={MenuStyles.subMenuContainer}>
                <TouchableOpacity
                  style={MenuStyles.subMenuItem}
                  onPress={() => navigation.navigate("Main", { screen: "Incomes" })}
                >
                  <FontAwesome name="list" size={18} color="#3498DB" />
                  <Text style={MenuStyles.subMenuText}>Visualizza Entrate</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={MenuStyles.subMenuItem}
                  onPress={() => navigation.navigate("InsertIncomes")}
                >
                  <MaterialIcons name="add" size={18} color="#3498DB" />
                  <Text style={MenuStyles.subMenuText}>Inserisci Entrata</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity style={[MenuStyles.menuItem, MenuStyles.logoutButton]} onPress={confirmLogout}>
              <FontAwesome name="sign-out" size={24} color="#FFF" />
              <Text style={MenuStyles.menuText}>Logout</Text>
            </TouchableOpacity>
          </View>

          {/* Versione app */}
          <Text style={MenuStyles.versionText}>Versione {appJson.expo.version}</Text>
        </ScrollView>
      ) : (
        <Text>Errore nel caricamento dei dati utente</Text>
      )}
    </View>
  );
};

export default MenuScreen;
