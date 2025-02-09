import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginForm from './assets/components/LoginForm';
// import MainPage from './assets/components/MainPage';

type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginForm} />
        {/* <Stack.Screen name="Main" component={MainPage} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
