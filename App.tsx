import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoginForm from "./assets/components/LoginForm";
import CreateForm from "./assets/components/CreateForm";
import ForgotPasswordScreen from "./assets/components/ForgotPassword";
import MainPage from "./assets/components/MainPage";
import ExpensesScreen from "./assets/components/ExpensesScreen";
import InsertExpensesScreen from "./assets/components/InsertExpensesScreen";
import IncomesScreen from "./assets/components/IncomesScreen";
import InsertIncomesScreen from "./assets/components/InsertIncomesScreen";
import MenuScreen from "./assets/components/Menu";
import UpdatePasswordScreen from "./assets/components/UpdatePassword";

type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  Main: undefined;
  Menu: undefined;
  UpdatePassword: { token: string };
  InsertExpenses: undefined;
  InsertIncomes: undefined;
};

type BottomTabParamList = {
  Home: undefined;
  Expenses: undefined;
  Incomes: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

// Navigatore per i tab
const MainTabs = ({ navigation }: any) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName: string = "home";
        if (route.name === "Expenses") iconName = "money-off";
        if (route.name === "Incomes") iconName = "attach-money";
        return <MaterialIcons name={iconName} size={size} color={color} />;
      },
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 15 }}
          onPress={() => navigation.navigate("Menu")}
        >
          <Icon name="menu" size={28} color="#3498DB" />
        </TouchableOpacity>
      ),
    })}
  >
    <Tab.Screen name="Home" component={MainPage} />
    <Tab.Screen name="Expenses" component={ExpensesScreen} />
    <Tab.Screen name="Incomes" component={IncomesScreen} />
  </Tab.Navigator>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("authToken");
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? "Main" : "Login"}>
        <Stack.Screen name="Login" component={LoginForm} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={CreateForm} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="InsertExpenses" component={InsertExpensesScreen} options={{ title: "Inserisci Spesa" }} />
        <Stack.Screen name="InsertIncomes" component={InsertIncomesScreen} options={{ title: "Inserisci Entrata" }} />
        <Stack.Screen
          name="UpdatePassword"
          component={UpdatePasswordScreen}
          options={({ route }) => ({
            headerShown: true,
            title: "Reset Password",
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
