import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from '../../components/AppHeader';
import { useAuth } from '../../context/AuthContext';
import { C } from '../../theme/colors';

const AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCCEvmKFCLTc2Y0VRZUCdfYjZnnHdpA90U6C85shBJFBpv3dJKrUseVEIHOikLz97uPm8SihDqPCU-SG6NSO32_JDiS_ko8LcNUGiBx4Yp3r5DwpIlvVsvs7v8_HB6AuwRNtL_lWYNIuk1CMJw44paqd0WAXhy2l0WYTCTn1mUItGknqrhMtfJtw3k6FSsPnDjvoEuNPP0HVVvzzRTfoMWmIGYBq_fK7m_OitSa5_-FCrDS8SnzlXlWn1fmUEqcqc_W-ETVHmUaFq8';

export default function TutorHomeScreen({ navigation }) {
  const { user } = useAuth();
  const name = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username;

  return (
    <View style={styles.root}>
      <AppHeader
        variant="home"
        avatarUri={AVATAR}
        onPressAvatar={() => navigation.navigate('Profile')}
        onPressBell={() => {}}
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <View style={styles.heroRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.kicker}>Panel tutor</Text>
          <Text style={styles.h1}>
            Hola, <Text style={styles.h1Accent}>{name}</Text>
          </Text>
          <Text style={styles.sub}>Gestiona tu disponibilidad y sesiones desde la app.</Text>
        </View>
      </View>

      <View style={styles.bento}>
        <View style={[styles.statCard, styles.statMuted]}>
          <MaterialCommunityIcons name="school-outline" size={28} color={C.primary} />
          <Text style={styles.statNum}>—</Text>
          <Text style={styles.statLbl}>Estudiantes (API)</Text>
        </View>
        <View style={[styles.statCard, styles.statPrimary]}>
          <MaterialCommunityIcons name="timer-outline" size={28} color={C.onPrimary} />
          <Text style={[styles.statNum, { color: C.onPrimary }]}>—</Text>
          <Text style={[styles.statLbl, { color: C.onPrimaryContainer }]}>Horas docentes</Text>
        </View>
        <View style={[styles.statCard, styles.statMuted]}>
          <MaterialCommunityIcons name="star" size={28} color={C.secondary} />
          <Text style={styles.statNum}>—</Text>
          <Text style={styles.statLbl}>Calificación</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Acciones</Text>
      <TouchableOpacity
        style={styles.action}
        onPress={() => navigation.navigate('Tutorias')}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name="calendar-month" size={22} color={C.primary} />
        <Text style={styles.actionText}>Ver agenda / tutorías</Text>
        <MaterialCommunityIcons name="chevron-right" size={22} color={C.outline} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.action}
        onPress={() => navigation.navigate('Tutores')}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name="account-search" size={22} color={C.primary} />
        <Text style={styles.actionText}>Explorar red de tutores</Text>
        <MaterialCommunityIcons name="chevron-right" size={22} color={C.outline} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.helpCard} activeOpacity={0.9}>
        <Text style={styles.helpTitle}>Centro de ayuda tutor</Text>
        <Text style={styles.helpBody}>
          Recursos pedagógicos y soporte (contenido de ejemplo; enlaza luego a web o API).
        </Text>
        <View style={styles.helpCta}>
          <Text style={styles.helpCtaText}>Saber más</Text>
          <MaterialCommunityIcons name="arrow-right" size={18} color={C.onPrimary} />
        </View>
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surface },
  scroll: { flex: 1 },
  content: { paddingBottom: 100, paddingHorizontal: 20 },
  heroRow: { marginBottom: 16 },
  kicker: { fontSize: 12, fontWeight: '700', color: C.primary, textTransform: 'uppercase', marginBottom: 4 },
  h1: { fontSize: 26, fontWeight: '800', color: C.onSurface, letterSpacing: -0.5 },
  h1Accent: { color: C.primary },
  sub: { marginTop: 6, color: C.onSurfaceVariant, fontSize: 14, lineHeight: 20 },
  bento: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  statCard: {
    flexGrow: 1,
    minWidth: '30%',
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  statMuted: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: C.outlineVariant + '44',
  },
  statPrimary: { backgroundColor: C.primary },
  statNum: { fontSize: 28, fontWeight: '800', color: C.onSurface },
  statLbl: { fontSize: 13, color: C.onSurfaceVariant, fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 10, color: C.onSurface },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surfaceContainerLowest,
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: C.outlineVariant + '33',
  },
  actionText: { flex: 1, fontSize: 15, fontWeight: '600', color: C.onSurface },
  helpCard: {
    marginTop: 16,
    backgroundColor: C.primary,
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
  },
  helpTitle: { fontSize: 22, fontWeight: '800', color: C.onPrimary, marginBottom: 8 },
  helpBody: { color: C.onPrimaryContainer, fontSize: 14, lineHeight: 20, maxWidth: 320 },
  helpCta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16 },
  helpCtaText: { color: C.onPrimary, fontWeight: '800', fontSize: 14 },
});
