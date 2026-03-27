import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from '../../components/AppHeader';
import { useAuth } from '../../context/AuthContext';
import { C } from '../../theme/colors';

const AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBZh-HxbGUZQjAnOm0-jikGdE1LX9laJF-hPzVHXOf6aGe87XSwdyMeAYxDVNr2K2q2sYmT9frmS-8ANM0yxF85Nl46K3o2LOvK45wnOC0XuqBlB4dgZlnCFJAevtHXL1RBAYtinDpNM8-YvQIf91jHwg-iN-6Lhk8uGx9MiQ3tmMv_ChkZMPlplg5HHSD1ITHuVhRSwF0iSyV4PtPLlGYQjF6Hs6uNNB9bFf9uOsTz__jJDEjoRhyiORjlya8o0tU8NEzCCknrqEY';

export default function ProfileScreen({ navigation }) {
  const { user, appRole, signOut } = useAuth();
  const name =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username || '—';

  return (
    <View style={styles.root}>
      <AppHeader
        variant="stack"
        left={
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Home')}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={C.onSurface} />
          </TouchableOpacity>
        }
        right={
          <TouchableOpacity hitSlop={12}>
            <Image source={{ uri: AVATAR }} style={styles.miniAvatar} />
          </TouchableOpacity>
        }
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Image source={{ uri: AVATAR }} style={styles.coverImg} />
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingNum}>UDEC</Text>
          <MaterialCommunityIcons name="school" size={14} color={C.onSecondaryContainer} />
        </View>
      </View>

      <Text style={styles.role}>{appRole === 'tutor' ? 'Tutor' : 'Estudiante'}</Text>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{user?.email || ''}</Text>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statNum}>—</Text>
          <Text style={styles.statLbl}>Sesiones</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNum}>—</Text>
          <Text style={styles.statLbl}>Horas</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNum}>—</Text>
          <Text style={styles.statLbl}>Logros</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.rowBtn} onPress={() => navigation.navigate('Tutorias')}>
        <MaterialCommunityIcons name="calendar-check" size={22} color={C.primary} />
        <Text style={styles.rowBtnText}>Mis tutorías</Text>
        <MaterialCommunityIcons name="chevron-right" size={22} color={C.outline} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.rowBtn} onPress={() => navigation.navigate('Materias')}>
        <MaterialCommunityIcons name="book-multiple" size={22} color={C.primary} />
        <Text style={styles.rowBtnText}>Materias</Text>
        <MaterialCommunityIcons name="chevron-right" size={22} color={C.outline} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.logout} onPress={signOut} activeOpacity={0.9}>
        <MaterialCommunityIcons name="logout" size={20} color={C.onPrimary} />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surface },
  scroll: { flex: 1 },
  content: { paddingBottom: 100 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  miniAvatar: { width: 36, height: 36, borderRadius: 18 },
  hero: { alignSelf: 'center', marginTop: 8 },
  coverImg: {
    width: 160,
    height: 200,
    borderRadius: 32,
    backgroundColor: C.surfaceContainerHigh,
  },
  ratingBadge: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    backgroundColor: C.secondaryContainer,
    padding: 12,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: C.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingNum: { fontWeight: '800', color: C.onSecondaryContainer, fontSize: 12 },
  role: {
    marginTop: 28,
    marginHorizontal: 24,
    fontSize: 11,
    fontWeight: '800',
    color: C.primary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  name: {
    marginHorizontal: 24,
    fontSize: 32,
    fontWeight: '800',
    color: C.onSurface,
    letterSpacing: -0.5,
  },
  email: { marginHorizontal: 24, marginTop: 6, color: C.onSurfaceVariant, fontSize: 14 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: C.outlineVariant + '55',
  },
  stat: { alignItems: 'center' },
  statNum: { fontSize: 22, fontWeight: '800', color: C.onSurface },
  statLbl: { fontSize: 11, color: C.onSurfaceVariant, marginTop: 4, textTransform: 'uppercase' },
  rowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    padding: 16,
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: C.outlineVariant + '33',
  },
  rowBtnText: { flex: 1, fontSize: 15, fontWeight: '700', color: C.onSurface },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 28,
    backgroundColor: C.error,
    padding: 16,
    borderRadius: 16,
  },
  logoutText: { color: C.onPrimary, fontSize: 16, fontWeight: '800' },
});
