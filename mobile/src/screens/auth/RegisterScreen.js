import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LOGO_H from '../../assets/tutoudec-logo-horizontal.png';
import { useAuth } from '../../context/AuthContext';
import { C } from '../../theme/colors';
import DecorativeBackground from '../../components/DecorativeBackground';

function buildUsernameFromEmail(email) {
  const local = String(email).split('@')[0] || 'usuario';
  const safe = local.replace(/[^a-zA-Z0-9._-]/g, '');
  const base = safe.length >= 3 ? safe : 'usuario';
  return `${base}${Math.floor(100 + Math.random() * 899)}`;
}

function splitFullName(fullName) {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first_name: '', last_name: '' };
  if (parts.length === 1) return { first_name: parts[0], last_name: '' };
  return { first_name: parts[0], last_name: parts.slice(1).join(' ') };
}

export default function RegisterScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [role, setRole] = useState('estudiante');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password || !passwordConfirm) {
      Alert.alert('Datos incompletos', 'Completa nombre, correo y contraseñas.');
      return;
    }
    if (password !== passwordConfirm) {
      Alert.alert('Contraseñas', 'Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Contraseña', 'Mínimo 6 caracteres.');
      return;
    }

    const { first_name, last_name } = splitFullName(fullName);
    const username = buildUsernameFromEmail(email);

    setLoading(true);
    const result = await signUp(
      {
        username,
        email: email.trim().toLowerCase(),
        first_name,
        last_name,
        password,
        password_confirm: passwordConfirm,
      },
      { appRole: role }
    );
    setLoading(false);

    if (!result.success) {
      Alert.alert('No se pudo registrar', result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <DecorativeBackground />
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()} hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={C.primary} />
        </Pressable>
        <Image source={LOGO_H} style={styles.topLogo} resizeMode="contain" />
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.h2}>Crear cuenta</Text>
        <Text style={styles.lead}>
          Únete a la comunidad académica. El usuario se genera a partir de tu correo.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Nombre completo</Text>
          <TextInput
            style={styles.inputPlain}
            placeholder="Ej. Juan Pérez"
            placeholderTextColor={C.outline}
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.inputPlain}
            placeholder="usuario@ucundinamarca.edu.co"
            placeholderTextColor={C.outline}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.inputPlain}
            placeholder="••••••••"
            placeholderTextColor={C.outline}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.label}>Confirmar contraseña</Text>
          <TextInput
            style={styles.inputPlain}
            placeholder="••••••••"
            placeholderTextColor={C.outline}
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            secureTextEntry
          />

          <Text style={styles.label}>Tipo de usuario</Text>
          <View style={styles.segment}>
            <TouchableOpacity
              style={[styles.segmentItem, role === 'estudiante' && styles.segmentActive]}
              onPress={() => setRole('estudiante')}
            >
              <Text style={[styles.segmentText, role === 'estudiante' && styles.segmentTextActive]}>
                Estudiante
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segmentItem, role === 'tutor' && styles.segmentActive]}
              onPress={() => setRole('tutor')}
            >
              <Text style={[styles.segmentText, role === 'tutor' && styles.segmentTextActive]}>
                Tutor
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.9}
          >
            {loading ? (
              <ActivityIndicator color={C.onPrimary} />
            ) : (
              <Text style={styles.primaryBtnText}>Registrarse</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.muted}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkBold}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surface },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  topLogo: { width: 150, height: 40, maxWidth: '58%' },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { padding: 16, paddingTop: 8, paddingBottom: 48 },
  h2: {
    fontSize: 28,
    fontWeight: '800',
    color: C.onSurface,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  lead: { color: C.onSurfaceVariant, fontSize: 15, lineHeight: 22, marginBottom: 20 },
  card: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 18,
    padding: 22,
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 16 },
    shadowRadius: 32,
    elevation: 4,
  },
  label: {
    marginTop: 14,
    marginBottom: 6,
    marginLeft: 2,
    fontSize: 11,
    fontWeight: '700',
    color: C.onSurfaceVariant,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  inputPlain: {
    backgroundColor: C.surfaceContainerHighest,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: C.onSurface,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: C.surfaceContainerHigh,
    borderRadius: 14,
    padding: 4,
    marginTop: 6,
    gap: 4,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: C.surfaceContainerLowest,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: { fontSize: 14, fontWeight: '600', color: C.tertiary },
  segmentTextActive: { color: C.primary },
  primaryBtn: {
    backgroundColor: C.primaryContainer,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 22,
  },
  primaryBtnText: { color: C.onPrimary, fontSize: 16, fontWeight: '800' },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
  },
  muted: { color: C.onSurfaceVariant, fontSize: 14 },
  linkBold: { color: C.secondary, fontWeight: '800', fontSize: 14 },
});
