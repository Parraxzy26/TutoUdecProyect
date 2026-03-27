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
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { C } from '../../theme/colors';
import DecorativeBackground from '../../components/DecorativeBackground';
import LOGO_H from '../../assets/tutoudec-logo-horizontal.png';
import { getLoginBrandLogoSize } from '../../components/AppHeader';

export default function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { height: winH } = useWindowDimensions();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const brandLogo = getLoginBrandLogoSize();
  /** Zona superior: usa ~26–36% de la pantalla para marca sin desperdiciar el resto */
  const brandMinHeight = Math.round(
    Math.min(Math.max(winH * 0.28, 150), winH * 0.38)
  );

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
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 6 : 0}
    >
      <DecorativeBackground />
      {/* Solo navegación; el logo (incluye textos) va en la zona central */}
      <View style={[styles.topBar, { paddingTop: insets.top + 6 }]}>
        {navigation.canGoBack() ? (
          <Pressable
            style={styles.iconBtn}
            onPress={() => navigation.goBack()}
            hitSlop={12}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={C.tertiary} />
          </Pressable>
        ) : (
          <View style={styles.topBarPad} />
        )}
        <View style={styles.topBarPad} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: Math.max(insets.bottom, 10) + 20,
            minHeight: winH - insets.top - insets.bottom - 52,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={[styles.brandBlock, { minHeight: brandMinHeight }]}>
          <Image source={LOGO_H} style={brandLogo} resizeMode="contain" />
        </View>

        <View style={styles.form}>
          <Text style={[styles.label, styles.labelFirst]}>Usuario o correo</Text>
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
    paddingHorizontal: 8,
    paddingBottom: 4,
    zIndex: 1,
  },
  topBarPad: { width: 44, height: 40 },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  brandBlock: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    flexShrink: 0,
  },
  label: {
    marginTop: 12,
    marginLeft: 4,
    fontSize: 11,
    fontWeight: '700',
    color: C.onSurfaceVariant,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  labelFirst: { marginTop: 0 },
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
    paddingVertical: 15,
    paddingHorizontal: 12,
    fontSize: 16,
    color: C.onSurface,
  },
  inputWithToggle: { paddingRight: 4 },
  togglePass: { padding: 12 },
  primaryBtn: {
    backgroundColor: C.primaryContainer,
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 18,
    shadowColor: C.primary,
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },
  primaryBtnDisabled: { opacity: 0.7 },
  primaryBtnText: {
    color: C.onPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  linkRow: { alignItems: 'center', marginTop: 16 },
  linkSecondary: {
    color: C.secondary,
    fontWeight: '600',
    fontSize: 15,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    paddingBottom: 6,
    flexWrap: 'wrap',
  },
  muted: { color: C.onSurfaceVariant, fontSize: 14 },
  linkBold: {
    color: C.secondary,
    fontWeight: '800',
    fontSize: 14,
  },
});
