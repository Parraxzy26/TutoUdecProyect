import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * URL base de la API Django.
 * - Prioridad: EXPO_PUBLIC_API_URL (app.config / .env)
 * - En desarrollo con Expo Go, usa la IP del host (tu PC) automáticamente
 * - Emulador Android: 10.0.2.2
 */
const DEFAULT_LAN_HOST = '192.168.1.8';

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
    // En muchos casos (dispositivo físico) Expo no expone hostUri en runtime.
    // Usamos IP LAN por defecto del backend para evitar timeouts de login/registro.
    return DEFAULT_LAN_HOST;
  }
  return DEFAULT_LAN_HOST;
}

export function getApiBaseUrl() {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '');
  }
  const host = resolveHost();
  return `http://${host}:8000/api`;
}
