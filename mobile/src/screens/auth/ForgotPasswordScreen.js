import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { C } from '../../theme/colors';
import DecorativeBackground from '../../components/DecorativeBackground';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const onSubmit = () => {
    if (!email.trim()) {
      Alert.alert('Correo requerido', 'Escribe el correo con el que te registraste.');
      return;
    }
    Alert.alert(
      'Recuperación',
      'Por ahora el backend no expone restablecimiento por correo. Contacta administración o crea una cuenta nueva. Pronto podremos enlazar este formulario a un endpoint.',
      [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
    );
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <DecorativeBackground />
      <View style={styles.topBar}>
        <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()} hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={C.tertiary} />
        </Pressable>
        <Text style={styles.brandTop}>TutoUdec</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <Text style={styles.h2}>Recuperar contraseña</Text>
        <Text style={styles.lead}>
          Ingresa tu correo para cuando activemos el envío de enlaces de recuperación.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Correo electrónico</Text>
          <View style={styles.inputWrap}>
            <MaterialCommunityIcons name="email-outline" size={20} color={C.outline} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="usuario@udec.edu.co"
              placeholderTextColor={C.outline}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity style={styles.primaryBtn} onPress={onSubmit} activeOpacity={0.9}>
            <Text style={styles.primaryBtnText}>Enviar enlace</Text>
            <MaterialCommunityIcons name="send" size={20} color={C.onPrimary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.backLink} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.backLinkText}>Volver al inicio de sesión</Text>
        </TouchableOpacity>
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
  },
  body: { padding: 24, paddingTop: 16 },
  h2: {
    fontSize: 28,
    fontWeight: '800',
    color: C.primary,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  lead: { color: C.onSurfaceVariant, fontSize: 15, lineHeight: 22, marginBottom: 24 },
  card: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 16,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: C.onSurfaceVariant,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 2,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surfaceContainerHighest,
    borderRadius: 14,
    marginBottom: 20,
  },
  inputIcon: { marginLeft: 14 },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    fontSize: 16,
    color: C.onSurface,
  },
  primaryBtn: {
    backgroundColor: C.primaryContainer,
    borderRadius: 999,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  primaryBtnText: { color: C.onPrimary, fontSize: 16, fontWeight: '800' },
  backLink: { marginTop: 28, alignItems: 'center' },
  backLinkText: { color: C.primary, fontWeight: '600', fontSize: 14 },
});
