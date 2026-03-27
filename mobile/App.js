/**
 * Raíz de la app Expo: provee zona segura, sesión y navegación.
 */
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { C } from './src/theme/colors';

function AppBoot() {
  const { loading } = useAuth();
  // Mientras se lee AsyncStorage no se monta el navigator (evita flash de login).
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: C.surface,
        }}
      >
        <ActivityIndicator size="large" color={C.primaryContainer} />
      </View>
    );
  }
  return (
    <>
      <StatusBar style="dark" />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppBoot />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
