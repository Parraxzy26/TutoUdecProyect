/**
 * Navegación principal: stack Auth vs Main (tabs).
 * La pestaña "Materias" está oculta en la barra pero accesible por navegación.
 */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { C } from '../theme/colors';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

import HomeScreen from '../screens/main/HomeScreen';
import TutorHomeScreen from '../screens/main/TutorHomeScreen';
import TutoresScreen from '../screens/main/TutoresScreen';
import TutorDetailScreen from '../screens/main/TutorDetailScreen';
import MateriasScreen from '../screens/main/MateriasScreen';
import TutoriasScreen from '../screens/main/TutoriasScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabScreen(props) {
  const { appRole } = useAuth();
  // Misma pestaña "Inicio", distinto panel según rol guardado localmente.
  const Cmp = appRole === 'tutor' ? TutorHomeScreen : HomeScreen;
  return <Cmp {...props} />;
}

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

import { View, StyleSheet } from 'react-native';

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#fff',
      tabBarInactiveTintColor: '#999',
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopWidth: 0,
        height: 70,
        paddingBottom: 10,
        paddingTop: 10,
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        borderRadius: 25,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeTabScreen}
      options={{
        tabBarIcon: ({ color, focused }) => (
          <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
            <MaterialCommunityIcons name="home" size={24} color={color} />
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Tutores"
      component={TutoresScreen}
      options={{
        tabBarIcon: ({ color, focused }) => (
          <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
            <MaterialCommunityIcons name="magnify" size={24} color={color} />
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Tutorias"
      component={TutoriasScreen}
      options={{
        tabBarIcon: ({ color, focused }) => (
          <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
            <MaterialCommunityIcons name="calendar" size={24} color={color} />
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color, focused }) => (
          <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
            <MaterialCommunityIcons name="account" size={24} color={color} />
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Materias"
      component={MateriasScreen}
      options={{
        tabBarButton: () => null,
      }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconActive: {
    backgroundColor: '#34A853',
    shadowColor: '#34A853',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});

const AppNavigator = () => {
  const { signed, loading } = useAuth();
  if (loading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {signed ? (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen name="TutorDetail" component={TutorDetailScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
