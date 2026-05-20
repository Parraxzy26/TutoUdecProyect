import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { C } from '../../theme/colors';
import api from '../../services/api';

export default function ChangePasswordScreen({ navigation }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleChangePassword() {
    if (!oldPassword.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu contraseña actual');
      return;
    }
    if (!newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos de nueva contraseña');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las nuevas contraseñas no coinciden');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (oldPassword === newPassword) {
      Alert.alert('Error', 'La nueva contraseña no puede ser igual a la actual');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/change_password/', {
        old_password: oldPassword.trim(),
        new_password: newPassword.trim(),
        confirm_password: confirmPassword.trim(),
      });
      Alert.alert(
        'Contraseña cambiada',
        'Tu contraseña ha sido cambiada exitosamente.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (e) {
      Alert.alert('Error', e.response?.data?.detail || 'No se pudo cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#34A853" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Cambiar Contraseña</Text>
          <Text style={styles.subtitle}>
            Ingresa tu contraseña actual y la nueva que deseas usar.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>CONTRASEÑA ACTUAL</Text>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="lock-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu contraseña actual"
                placeholderTextColor="#999"
                value={oldPassword}
                onChangeText={setOldPassword}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>NUEVA CONTRASEÑA</Text>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="lock-plus-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#999"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>CONFIRMAR NUEVA CONTRASEÑA</Text>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons name="lock-check-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Repite tu nueva contraseña"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleChangePassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.buttonRow}>
                <Text style={styles.buttonText}>Cambiar Contraseña</Text>
                <MaterialCommunityIcons name="check" size={20} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.dashedBorder}>
            <Text style={styles.backText}>Volver al perfil</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 48,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#34A853',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#34A853',
    borderRadius: 30,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#34A853',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  backButton: {
    marginTop: 48,
    alignItems: 'center',
  },
  dashedBorder: {
    borderWidth: 1,
    borderColor: '#34A853',
    borderStyle: 'dashed',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  backText: {
    color: '#34A853',
    fontSize: 14,
    fontWeight: '600',
  },
});
