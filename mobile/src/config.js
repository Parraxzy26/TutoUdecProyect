import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * URL base de la API Django.
 * - Prioridad: EXPO_PUBLIC_API_URL (app.config / .env)
 * - En desarrollo con Expo Go, usa la IP del host (tu PC) automáticamente
 * - Emulador Android: 10.0.2.2
 */
function resolveHost() {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return null;
  }
  const uri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost;
  if (uri) {
    const host = String(uri).split(':')[0];
    if (host) return host;
  }
  if (Platform.OS === 'android') {
    return '10.0.2.2';
  }
  return '127.0.0.1';
}

export function getApiBaseUrl() {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '');
  }
  const host = resolveHost();
  return `http://${host}:8000/api`;
}
