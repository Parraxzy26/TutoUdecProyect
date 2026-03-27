import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from '../../components/AppHeader';
import { useAuth } from '../../context/AuthContext';
import { tutorService, materiaService, tutoriaService } from '../../services/api';
import { C } from '../../theme/colors';

const STUDENT_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDVcwn6s4nV1CHSNpmpipBJK0bu9UNLelccnDqAHqmn7QUlTePVc_DbrcM_JX2z9MgKGXvfnI2AzQG0IEvmbYFSUI6AfERimpAo9FkFyHLLAXKw0x7OBblhNYt4i2vJhIq_rZMEi3IPzG0MRpxEZBH7m-prN9iibsqFPtjwwEcTMUY_KfpEt5xgXYOU-KXKYE_q_W7YI7YUjPLUgCvD5qa5vaoPbh0MN5JNhYetwk78LyAkMZ9GzqGpSWEPAEnTSyP_w4l1KUi3KGw';

function listPayload(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results;
  return [];
}

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username || 'Estudiante';

  const [search, setSearch] = useState('');
  const [materias, setMaterias] = useState([]);
  const [tutores, setTutores] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [mr, tr, tu] = await Promise.all([
        materiaService.getAll({ page_size: 10 }),
        tutorService.getAll({ page_size: 8 }),
        tutoriaService.getMisTutorias({ page_size: 20 }),
      ]);
      setMaterias(listPayload(mr.data));
      setTutores(listPayload(tr.data));
      const tList = listPayload(tu.data);
      const sorted = [...tList].sort(
        (a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio)
      );
      setUpcoming(sorted.slice(0, 3));
    } catch (e) {
      console.warn('Home load', e.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const learningData = materias.slice(0, 5);

  return (
    <View style={styles.root}>
      <AppHeader
        variant="home"
        avatarUri={STUDENT_AVATAR}
        onPressAvatar={() => navigation.navigate('Profile')}
        onPressBell={() => {}}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.welcomeRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.welcomeKicker}>Bienvenido,</Text>
          <Text style={styles.welcomeName}>{displayName}!</Text>
        </View>
      </View>

      <View style={styles.searchWrap}>
        <MaterialCommunityIcons name="magnify" size={22} color={C.outline} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar materias o tutores…"
          placeholderTextColor={C.outline}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          onSubmitEditing={() => {
            navigation.navigate('Tutores', { initialQuery: search });
          }}
        />
      </View>

      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Tu ruta de aprendizaje</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Materias')}>
          <Text style={styles.link}>Ver todo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={learningData}
        keyExtractor={(item) => String(item.id)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 8 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[
              styles.pathCard,
              index === 0 && styles.pathCardActive,
              { marginRight: 12 },
            ]}
            onPress={() => navigation.navigate('Materias')}
            activeOpacity={0.9}
          >
            <View style={styles.pathCardTop}>
              <View style={[styles.pathIcon, index === 0 && styles.pathIconActive]}>
                <MaterialCommunityIcons
                  name="book-open-variant"
                  size={22}
                  color={index === 0 ? C.onPrimary : C.primary}
                />
              </View>
              {index === 0 ? (
                <View style={styles.badgeActive}>
                  <Text style={styles.badgeActiveText}>ACTIVA</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.pathTitle, index === 0 && styles.pathTitleOnPrimary]} numberOfLines={2}>
              {item.nombre}
            </Text>
            <Text style={[styles.pathSub, index === 0 && styles.pathSubOnPrimary]}>
              {item.total_tutorias ?? 0} tutorías
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyHint}>Carga materias desde el backend o revisa la conexión.</Text>
        }
      />

      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Próximas tutorías</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Tutorias')}>
          <Text style={styles.link}>Calendario</Text>
        </TouchableOpacity>
      </View>

      {upcoming.length === 0 ? (
        <Text style={styles.emptyHint}>No tienes sesiones próximas. Explora tutores.</Text>
      ) : (
        upcoming.map((t) => {
          const d = t.fecha_inicio ? new Date(t.fecha_inicio) : null;
          const mes = d
            ? d.toLocaleDateString('es-CO', { month: 'short' }).toUpperCase()
            : '—';
          const dia = d ? d.getDate() : '—';
          return (
            <TouchableOpacity
              key={t.id}
              style={styles.sessionRow}
              onPress={() => navigation.navigate('Tutorias')}
              activeOpacity={0.85}
            >
              <View style={styles.sessionDate}>
                <Text style={styles.sessionMes}>{mes}</Text>
                <Text style={styles.sessionDia}>{dia}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sessionTitle}>{t.materia_nombre || 'Tutoría'}</Text>
                <Text style={styles.sessionMeta}>
                  <MaterialCommunityIcons name="clock-outline" size={14} color={C.tertiary} />{' '}
                  {d ? d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : ''}{' '}
                  · {t.estado}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 6 }}>
                <Text style={styles.tutorChip}>{t.tutor_nombre || 'Tutor'}</Text>
                <View style={styles.smallBtn}>
                  <Text style={styles.smallBtnText}>DETALLE</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })
      )}

      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Tutores destacados</Text>
      </View>
      {tutores.slice(0, 2).map((tutor) => (
        <TouchableOpacity
          key={tutor.id}
          style={styles.tutorCard}
          onPress={() => navigation.navigate('Tutores')}
          activeOpacity={0.9}
        >
          <View style={styles.tutorCardInner}>
            <View style={styles.tutorAvatar}>
              <MaterialCommunityIcons name="account" size={28} color={C.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.tutorName}>{tutor.usuario_nombre || 'Tutor'}</Text>
              <Text style={styles.tutorSpec}>{tutor.especialidad}</Text>
              <View style={styles.starRow}>
                <MaterialCommunityIcons name="star" size={16} color={C.secondary} />
                <Text style={styles.starText}>
                  {Number(tutor.calificacion ?? 0).toFixed(1)} · ${tutor.tarifa_por_hora}/h
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.tutorCta} onPress={() => navigation.navigate('Tutores')}>
            <Text style={styles.tutorCtaText}>Ver perfil</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Tutores')} activeOpacity={0.9}>
        <MaterialCommunityIcons name="plus" size={28} color={C.onSecondaryContainer} />
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surface },
  scroll: { flex: 1 },
  content: { paddingBottom: 110, paddingHorizontal: 20 },
  welcomeRow: { marginBottom: 10 },
  welcomeKicker: { fontSize: 12, fontWeight: '600', color: C.primary, textTransform: 'uppercase' },
  welcomeName: { fontSize: 24, fontWeight: '800', color: C.onSurface, letterSpacing: -0.5 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surfaceContainerHighest,
    borderRadius: 999,
    paddingHorizontal: 14,
    marginBottom: 22,
  },
  searchIcon: { marginRight: 4 },
  searchInput: { flex: 1, paddingVertical: 14, fontSize: 15, color: C.onSurface },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: C.onSurface },
  link: { fontSize: 14, fontWeight: '700', color: C.primary },
  pathCard: {
    width: 260,
    minHeight: 140,
    borderRadius: 24,
    padding: 18,
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: C.outlineVariant + '44',
    justifyContent: 'space-between',
  },
  pathCardActive: {
    backgroundColor: C.primaryContainer,
    borderColor: 'transparent',
  },
  pathCardTop: { flexDirection: 'row', justifyContent: 'space-between' },
  pathIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: C.primary + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pathIconActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
  badgeActive: {
    backgroundColor: C.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeActiveText: { fontSize: 9, fontWeight: '800', color: C.onSecondaryContainer },
  pathTitle: { fontSize: 18, fontWeight: '800', color: C.onSurface, marginTop: 8 },
  pathTitleOnPrimary: { color: C.onPrimary },
  pathSub: { fontSize: 13, color: C.tertiary, marginTop: 4 },
  pathSubOnPrimary: { color: C.onPrimaryContainer, opacity: 0.9 },
  emptyHint: { color: C.onSurfaceVariant, fontSize: 14, marginBottom: 12 },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.surfaceContainerLow,
    borderRadius: 24,
    padding: 14,
    marginBottom: 10,
  },
  sessionDate: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: C.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionMes: { fontSize: 10, fontWeight: '800', color: C.primary },
  sessionDia: { fontSize: 18, fontWeight: '800', color: C.onSurface },
  sessionTitle: { fontSize: 16, fontWeight: '800', color: C.onSurface },
  sessionMeta: { marginTop: 4, fontSize: 12, color: C.tertiary },
  tutorChip: {
    fontSize: 10,
    fontWeight: '800',
    backgroundColor: C.primaryContainer,
    color: C.onPrimary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  smallBtn: {
    backgroundColor: C.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  smallBtnText: { color: C.onPrimary, fontSize: 10, fontWeight: '800' },
  tutorCard: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 2,
  },
  tutorCardInner: { flexDirection: 'row', gap: 12 },
  tutorAvatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: C.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tutorName: { fontSize: 16, fontWeight: '800', color: C.onSurface },
  tutorSpec: { fontSize: 13, color: C.primary, fontWeight: '600', marginTop: 2 },
  starRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  starText: { fontSize: 13, fontWeight: '700', color: C.secondary },
  tutorCta: {
    marginTop: 12,
    alignSelf: 'flex-end',
    backgroundColor: C.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  tutorCtaText: { color: C.onPrimary, fontWeight: '800', fontSize: 12 },
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: C.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
});
