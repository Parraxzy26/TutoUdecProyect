import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main Screens
import HomeScreen from '../screens/main/HomeScreen';
import TutoresScreen from '../screens/main/TutoresScreen';
import MateriasScreen from '../screens/main/MateriasScreen';
import TutoriasScreen from '../screens/main/TutoriasScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Navigator
const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        switch (route.name) {
          case 'Home':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Tutores':
            iconName = focused ? 'people' : 'people-outline';
            break;
          case 'Materias':
            iconName = focused ? 'book' : 'book-outline';
            break;
          case 'Tutorias':
            iconName = focused ? 'calendar' : 'calendar-outline';
            break;
          case 'Profile':
            iconName = focused ? 'person' : 'person-outline';
            break;
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#4A90D9',
      tabBarInactiveTintColor: 'gray',
      headerShown: true,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
    <Tab.Screen name="Tutores" component={TutoresScreen} options={{ title: 'Tutores' }} />
    <Tab.Screen name="Materias" component={MateriasScreen} options={{ title: 'Materias' }} />
    <Tab.Screen name="Tutorias" component={TutoriasScreen} options={{ title: 'Mis Tutorías' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
  </Tab.Navigator>
);

// Root Navigator
const AppNavigator = () => {
  const { signed, loading } = useAuth();

  if (loading) {
    return null; // O un splash screen
  }

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
