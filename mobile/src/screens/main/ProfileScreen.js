import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBZh-HxbGUZQjAnOm0-jikGdE1LX9laJF-hPzVHXOf6aGe87XSwdyMeAYxDVNr2K2q2sYmT9frmS-8ANM0yxF85Nl46K3o2LOvK45wnOC0XuqBlB4dgZlnCFJAevtHXL1RBAYtinDpNM8-YvQIf91jHwg-iN-6Lhk8uGx9MiQ3tmMv_ChkZMPlplg5HHSD1ITHuVhRSwF0iSyV4PtPLlGYQjF6Hs6uNNB9bFf9uOsTz__jJDEjoRhyiORjlya8o0tU8NEzCCknrqEY';

export default function ProfileScreen({ navigation }) {
  const { user, appRole, signOut } = useAuth();
  const [editingProfile, setEditingProfile] = useState(false);
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [loading, setLoading] = useState(false);

  const name =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username || '—';

  const handleEditProfile = () => {
    if (editingProfile) {
      setLoading(true);
      setTimeout(() => {
        Alert.alert('Éxito', 'Perfil actualizado correctamente');
        setEditingProfile(false);
        setLoading(false);
      }, 1000);
    } else {
      setEditingProfile(true);
    }
  };

  const handleSecurityPassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handleNotifications = () => {
    Alert.alert('Notificaciones', 'Aquí podrías configurar tus preferencias de notificaciones');
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <TouchableOpacity onPress={signOut} style={styles.signOutBtn}>
          <MaterialCommunityIcons name="logout" size={24} color="#FF5252" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.profileBox}>
            <View style={styles.profileImgPlaceholder}>
               <MaterialCommunityIcons name="account" size={120} color="#DDD" />
            </View>
          </View>
          
          <View style={styles.infoCenter}>
            <Text style={styles.roleKicker}>{appRole?.toUpperCase() || 'USUARIO'}</Text>
            {editingProfile ? (
              <View style={styles.editNameContainer}>
                <TextInput
                  style={styles.editInput}
                  placeholder="Nombre"
                  placeholderTextColor="#999"
                  value={firstName}
                  onChangeText={setFirstName}
                />
                <TextInput
                  style={styles.editInput}
                  placeholder="Apellido"
                  placeholderTextColor="#999"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            ) : (
              <Text style={styles.nameLarge}>{name}</Text>
            )}
            <Text style={styles.emailText}>{user?.email || 'No email'}</Text>
          </View>

          <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
              <View style={styles.menuIconBox}>
                <MaterialCommunityIcons name="account-edit-outline" size={22} color="#34A853" />
              </View>
              <Text style={styles.menuText}>{editingProfile ? 'Guardar Cambios' : 'Editar Perfil'}</Text>
              {loading ? (
                <ActivityIndicator size="small" color="#34A853" />
              ) : (
                <MaterialCommunityIcons 
                  name={editingProfile ? "content-save" : "chevron-right"} 
                  size={24} 
                  color="#DDD" 
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleSecurityPassword}>
              <View style={[styles.menuIconBox, { backgroundColor: '#E3F2FD' }]}>
                <MaterialCommunityIcons name="shield-lock-outline" size={22} color="#2196F3" />
              </View>
              <Text style={styles.menuText}>Seguridad y Contraseña</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#DDD" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleNotifications}>
              <View style={[styles.menuIconBox, { backgroundColor: '#FFF3E0' }]}>
                <MaterialCommunityIcons name="bell-outline" size={22} color="#FF9800" />
              </View>
              <Text style={styles.menuText}>Notificaciones</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#DDD" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Chatbot')}>
              <View style={[styles.menuIconBox, { backgroundColor: '#F3E5F5' }]}>
                <MaterialCommunityIcons name="robot" size={22} color="#9C27B0" />
              </View>
              <Text style={styles.menuText}>Ayuda y Chatbot</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#DDD" />
            </TouchableOpacity>
          </View>

          {appRole === 'tutor' && (
            <TouchableOpacity 
              style={styles.statsCard}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.statsCardTitle}>Estadísticas del Tutor</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statVal}>12</Text>
                  <Text style={styles.statLbl}>Esta semana</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statVal}>4.8</Text>
                  <Text style={styles.statLbl}>Calificación</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statVal}>$120k</Text>
                  <Text style={styles.statLbl}>Ganancias</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#34A853' },
  signOutBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  scroll: { flex: 1 },
  content: { paddingBottom: 100 },
  hero: { padding: 20 },
  profileBox: { width: '100%', height: 200, borderRadius: 32, backgroundColor: '#F0F0F0', marginBottom: 24, overflow: 'hidden' },
  profileImgPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  infoCenter: { alignItems: 'center', marginBottom: 32 },
  roleKicker: { fontSize: 10, fontWeight: 'bold', color: '#34A853', letterSpacing: 1 },
  nameLarge: { fontSize: 28, fontWeight: 'bold', color: '#333', marginTop: 8 },
  editNameContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  editInput: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  emailText: { fontSize: 14, color: '#999', marginTop: 4 },
  menuSection: { gap: 16 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  menuIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: { flex: 1, fontSize: 16, fontWeight: '600', color: '#333' },
  statsCard: {
    marginTop: 32,
    backgroundColor: '#006D32',
    borderRadius: 24,
    padding: 24,
  },
  statsCardTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { alignItems: 'center' },
  statVal: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  statLbl: { color: 'rgba(255,255,255,0.6)', fontSize: 10, marginTop: 4, fontWeight: 'bold' },
});
