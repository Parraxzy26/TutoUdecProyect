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
  Image,
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { C } from '../../theme/colors';
import DecorativeBackground from '../../components/DecorativeBackground';

const LOGO_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB1jbmQneEXSySHL1Ttnanoc29N-wKzF-5pK5TlXl4J-yYObxL-IRB9lnG99-EBMUEFlGQUBpBhBzNC_ew77EpXzPFl-nxlDNTmwQIlM7iw0fru9TLu3im2iVB9gNxPL6aa5lMLip639WEnSxO96qBiCrYLsr64Sc0K4VUrK8nGriUjwG-XTwQX3F0YcPVhIKcJ9oMFHAL6sKah8cZRQrUeYQE2-ZDGi48ZTi4sHsHv0yE6f3EHLX_COMN6rJQk7W3HP64_4jlhWZ0';

export default function LoginScreen({ navigation }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!identifier.trim() || !password) {
      Alert.alert('Datos incompletos', 'Ingresa usuario o correo y contraseña.');
      return;
    }
    setLoading(true);
    const result = await signIn(identifier.trim(), password);
    setLoading(false);
    if (!result.success) {
      Alert.alert('No se pudo iniciar sesión', result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <DecorativeBackground />
      <View style={styles.topBar}>
        {navigation.canGoBack() ? (
          <Pressable
            style={styles.iconBtn}
            onPress={() => navigation.goBack()}
            hitSlop={12}
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color={C.tertiary} />
          </Pressable>
        ) : (
          <View style={{ width: 40 }} />
        )}
        <Text style={styles.brandTop}>TutoUdec</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.logoGlow} />
          <View style={styles.logoBox}>
            <Image source={{ uri: LOGO_URI }} style={styles.logoImg} resizeMode="contain" />
          </View>
          <Text style={styles.title}>TutoUdec</Text>
          <Text style={styles.tagline}>
            Tu red de tutorías académicas de excelencia
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Usuario o correo</Text>
          <View style={styles.inputWrap}>
            <MaterialCommunityIcons
              name="account-outline"
              size={20}
              color={C.outline}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="nombre@ucundinamarca.edu.co"
              placeholderTextColor={C.outline}
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
          </View>

          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputWrap}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={20}
              color={C.outline}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, styles.inputWithToggle]}
              placeholder="••••••••"
              placeholderTextColor={C.outline}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
            />
            <Pressable onPress={() => setShowPass((v) => !v)} style={styles.togglePass}>
              <MaterialCommunityIcons
                name={showPass ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color={C.tertiary}
              />
            </Pressable>
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.9}
          >
            {loading ? (
              <ActivityIndicator color={C.onPrimary} />
            ) : (
              <Text style={styles.primaryBtnText}>Iniciar sesión</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.linkSecondary}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.muted}>¿No tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkBold}>Crear cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.surface,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTop: {
    fontSize: 18,
    fontWeight: '800',
    color: C.primary,
    letterSpacing: -0.5,
  },
  scroll: {
    paddingHorizontal: 28,
    paddingBottom: 40,
    paddingTop: 8,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: C.primary,
    opacity: 0.08,
    top: 8,
  },
  logoBox: {
    width: 88,
    height: 88,
    borderRadius: 16,
    backgroundColor: C.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: C.outlineVariant + '33',
    marginBottom: 16,
  },
  logoImg: { width: 68, height: 68 },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: C.primary,
    letterSpacing: -1,
  },
  tagline: {
    marginTop: 6,
    fontSize: 14,
    color: C.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },
  form: { gap: 6 },
  label: {
    marginTop: 10,
    marginLeft: 6,
    fontSize: 11,
    fontWeight: '700',
    color: C.onSurfaceVariant,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surfaceContainerHighest,
    borderRadius: 14,
    marginTop: 6,
  },
  inputIcon: { marginLeft: 14 },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    fontSize: 16,
    color: C.onSurface,
  },
  inputWithToggle: { paddingRight: 4 },
  togglePass: { padding: 12 },
  primaryBtn: {
    backgroundColor: C.primaryContainer,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: C.primary,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 4,
  },
  primaryBtnDisabled: { opacity: 0.7 },
  primaryBtnText: {
    color: C.onPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  linkRow: { alignItems: 'center', marginTop: 20 },
  linkSecondary: {
    color: C.secondary,
    fontWeight: '600',
    fontSize: 15,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    flexWrap: 'wrap',
  },
  muted: { color: C.onSurfaceVariant, fontSize: 14 },
  linkBold: {
    color: C.secondary,
    fontWeight: '800',
    fontSize: 14,
  },
});
