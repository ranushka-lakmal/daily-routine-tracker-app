import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initDB } from './src/db/sqlite';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import BottomNavigation from './src/components/BottomNavigation';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    initDB(); // initialize SQLite when app starts
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        {/* Authentication screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* Main navigation with bottom tabs */}
        <Stack.Screen name="Main" component={BottomNavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
