import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { toastConfig } from "./assets/config/toastConfig";
import { useTranslation } from "react-i18next";

// Screens
import LoginForm from "./assets/components/LoginForm";
import RegisterPersonalInfo from "./assets/components/RegisterPersonalInfo";
import RegisterPreferences from "./assets/components/RegisterPreferences";
import ForgotPasswordScreen from "./assets/components/ForgotPassword";
import MainPage from "./assets/components/MainPage";
import ExpensesScreen from "./assets/components/ExpensesScreen";
import InsertExpensesScreen from "./assets/components/InsertExpensesScreen";
import IncomesScreen from "./assets/components/IncomesScreen";
import InsertIncomesScreen from "./assets/components/InsertIncomesScreen";
import MenuScreen from "./assets/components/Menu";
import UpdatePasswordScreen from "./assets/components/UpdatePassword";
import EditUser from "./assets/components/EditUser";
import EditExpenseScreen from "./assets/components/EditExpenseScreen";
import EditIncomeScreen from "./assets/components/EditIncomeScreen";


// Parametri delle schermate
export type RootStackParamList = {
  Login: undefined;
  RegisterPersonalInfo: undefined;
  RegisterPreferences: { userData: any };
  ForgotPassword: undefined;
  Main: undefined;
  Menu: undefined;
  UpdatePassword: { token: string };
  InsertExpenses: undefined;
  InsertIncomes: undefined;
  ExpensesView: undefined;
  IncomesView: undefined;
  EditUser: undefined;
  EditTransaction: { transaction: any };
  EditExpenses: { transaction: any };
};

export type BottomTabParamList = {
  Home: undefined;
  Expenses: undefined;
  Incomes: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

// Pulsante per accedere al Menu
const MenuButton = ({ navigation }: any) => (
  <TouchableOpacity style={{ marginRight: 15 }} onPress={() => navigation.navigate("Menu")}>
    <Icon name="menu" size={28} color="#3498DB" />
  </TouchableOpacity>
);

const MainTabs = ({ navigation }: any) => {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "home";
          if (route.name === "Expenses") iconName = "money-off";
          if (route.name === "Incomes") iconName = "attach-money";
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        headerRight: () => <MenuButton navigation={navigation} />,
      })}
    >
      <Tab.Screen
        name="Home"
        component={MainPage}
        options={{ tabBarLabel: t("home"), title: t("home")}}
      />

      <Tab.Screen
        name="Expenses"
        component={ExpensesScreen}
        options={{ tabBarLabel: t("expenses"), title: t("expenses") }}
      />

      <Tab.Screen
        name="Incomes"
        component={IncomesScreen}
        options={{ tabBarLabel: t("incomes"), title: t("incomes") }}
      />
    </Tab.Navigator>
  );
};


// App principale
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error("Errore nel recupero del token:", error);
      }
    };
    checkAuth();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? "Main" : "Login"}>
        <Stack.Screen name="Login" component={LoginForm} options={{ headerShown: false }} />
        <Stack.Screen name="RegisterPersonalInfo" component={RegisterPersonalInfo} options={{ headerShown: false }} />
        <Stack.Screen name="RegisterPreferences" component={RegisterPreferences} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen 
          name="InsertExpenses" 
          component={InsertExpensesScreen} 
          options={({ navigation }) => ({ title: t("insert_expense"), headerRight: () => <MenuButton navigation={navigation} /> })}
        />
        <Stack.Screen 
          name="InsertIncomes" 
          component={InsertIncomesScreen} 
          options={({ navigation }) => ({ title: t("insert_income"), headerRight: () => <MenuButton navigation={navigation} /> })}
        />
        <Stack.Screen 
          name="UpdatePassword" 
          component={UpdatePasswordScreen} 
          options={({ route }) => ({ headerShown: true, title: t("reset_password") })}
        />
        <Stack.Screen 
          name="ExpensesView" 
          component={ExpensesScreen} 
          options={({ navigation }) => ({ title: t("expenses"), headerRight: () => <MenuButton navigation={navigation} /> })}
        />
        <Stack.Screen 
          name="IncomesView" 
          component={IncomesScreen} 
          options={({ navigation }) => ({ title: t("incomes"), headerRight: () => <MenuButton navigation={navigation} /> })}
        />
        <Stack.Screen 
          name="EditUser" 
          component={EditUser} 
          options={({ navigation }) => ({ 
            title: t("edit_profile"), 
            headerRight: () => <MenuButton navigation={navigation} /> 
          })}
        />
        <Stack.Screen 
          name="EditExpenses" 
          component={EditExpenseScreen} 
          options={{ presentation: "modal", title: t("edit_expense") }} 
        />
        <Stack.Screen 
          name="EditIncomes" 
          component={EditIncomeScreen} 
          options={{ presentation: "modal", title: t("edit_income") }} 
        />
      </Stack.Navigator>
      <Toast config={toastConfig} />
    </NavigationContainer>
  );
};

export default App;