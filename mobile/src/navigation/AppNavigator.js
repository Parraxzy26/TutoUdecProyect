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

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: C.primaryContainer,
      tabBarInactiveTintColor: C.tertiary,
      tabBarStyle: {
        backgroundColor: 'rgba(251,249,248,0.96)',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: 62,
        paddingBottom: 8,
        paddingTop: 6,
        borderTopWidth: 0,
        elevation: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: -4 },
      },
      tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeTabScreen}
      options={{
        title: 'Inicio',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home-variant-outline" size={size - 2} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Tutores"
      component={TutoresScreen}
      options={{
        title: 'Buscar',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="magnify" size={size - 2} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Tutorias"
      component={TutoriasScreen}
      options={{
        title: 'Agenda',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="calendar-month" size={size - 2} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: 'Perfil',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="account-outline" size={size - 2} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Materias"
      component={MateriasScreen}
      options={{
        title: 'Materias',
        tabBarButton: () => null,
        tabBarItemStyle: { height: 0, width: 0, overflow: 'hidden' },
      }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { signed, loading } = useAuth();
  if (loading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {signed ? (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
