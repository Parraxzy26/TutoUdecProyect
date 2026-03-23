import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('@TutoUdec:token');
      const storedUser = await AsyncStorage.getItem('@TutoUdec:user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        api.defaults.headers.Authorization = `Bearer ${storedToken}`;
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (username, password) => {
    try {
      const response = await api.post('/auth/login/', {
        username,
        password,
      });

      const { access, refresh, user: userData } = response.data;

      await AsyncStorage.setItem('@TutoUdec:token', access);
      await AsyncStorage.setItem('@TutoUdec:refreshToken', refresh);
      await AsyncStorage.setItem('@TutoUdec:user', JSON.stringify(userData));

      setToken(access);
      setUser(userData);
      api.defaults.headers.Authorization = `Bearer ${access}`;

      return { success: true };
    } catch (error) {
      const d = error.response?.data;
      let msg =
        d?.detail ||
        (typeof d === 'object' && d !== null
          ? Object.values(d)
              .flat()
              .filter(Boolean)
              .join(' ')
          : null);
      if (!msg) msg = error.message || 'Error al iniciar sesión';
      return { success: false, error: msg };
    }
  };

  const signUp = async (userData) => {
    try {
      const response = await api.post('/auth/register/', userData);
      const { access, refresh, user: newUser } = response.data;

      await AsyncStorage.setItem('@TutoUdec:token', access);
      await AsyncStorage.setItem('@TutoUdec:refreshToken', refresh);
      await AsyncStorage.setItem('@TutoUdec:user', JSON.stringify(newUser));

      setToken(access);
      setUser(newUser);
      api.defaults.headers.Authorization = `Bearer ${access}`;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Error al registrarse',
      };
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('@TutoUdec:token');
    await AsyncStorage.removeItem('@TutoUdec:refreshToken');
    await AsyncStorage.removeItem('@TutoUdec:user');
    setToken(null);
    setUser(null);
    api.defaults.headers.Authorization = null;
  };

  return (
    <AuthContext.Provider value={{ 
      signed: !!user, 
      user, 
      token,
      loading, 
      signIn, 
      signUp, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
