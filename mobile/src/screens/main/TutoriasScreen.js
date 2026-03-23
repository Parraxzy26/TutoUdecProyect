import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tutoriaService } from '../../services/api';
import { C } from '../../theme/colors';

const AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDVcwn6s4nV1CHSNpmpipBJK0bu9UNLelccnDqAHqmn7QUlTePVc_DbrcM_JX2z9MgKGXvfnI2AzQG0IEvmbYFSUI6AfERimpAo9FkFyHLLAXKw0x7OBblhNYt4i2vJhIq_rZMEi3IPzG0MRpxEZBH7m-prN9iibsqFPtjwwEcTMUY_KfpEt5xgXYOU-KXKYE_q_W7YI7YUjPLUgCvD5qa5vaoPbh0MN5JNhYetwk78LyAkMZ9GzqGpSWEPAEnTSyP_w4l1KUi3KGw';

function listPayload(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results;
  return [];
}

const WEEK = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export default function TutoriasScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState(() => new Date());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await tutoriaService.getMisTutorias({ page_size: 60 });
      setItems(listPayload(data));
    } catch (e) {
      console.warn('Tutorias', e.message);
      setItems([]);
    } finally {
      setLoading(false);
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

  const daysWithEvents = useMemo(() => {
    const set = new Set();
    items.forEach((t) => {
      if (!t.fecha_inicio) return;
      const d = new Date(t.fecha_inicio);
      set.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    });
    return set;
  }, [items]);

  const calendarDays = useMemo(() => {
    const y = selected.getFullYear();
    const m = selected.getMonth();
    const first = new Date(y, m, 1);
    const startPad = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startPad; i++) cells.push({ type: 'pad', key: `p-${i}` });
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ type: 'day', d, key: `d-${d}` });
    }
    return cells;
  }, [selected]);

  const selectedKey = `${selected.getFullYear()}-${selected.getMonth()}-${selected.getDate()}`;
  const agenda = items.filter((t) => {
    if (!t.fecha_inicio) return false;
    const d = new Date(t.fecha_inicio);
    return (
      d.getFullYear() === selected.getFullYear() &&
      d.getMonth() === selected.getMonth() &&
      d.getDate() === selected.getDate()
    );
  });

  const monthLabel = selected.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={C.instGreen} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={{ uri: AVATAR }} style={styles.avatar} />
          <Text style={styles.brand}>TutoUdec</Text>
        </View>
        <TouchableOpacity hitSlop={12}>
          <MaterialCommunityIcons name="bell-outline" size={22} color={C.onSurface} />
        </TouchableOpacity>
      </View>

      <Text style={styles.kicker}>Agenda académica</Text>
      <Text style={styles.monthTitle}>{monthLabel}</Text>

      <View style={styles.calCard}>
        <View style={styles.weekRow}>
          {WEEK.map((w) => (
            <Text key={w} style={styles.weekCell}>
              {w}
            </Text>
          ))}
        </View>
        <View style={styles.grid}>
          {calendarDays.map((cell) => {
            if (cell.type === 'pad') {
              return <View key={cell.key} style={styles.cell} />;
            }
            const key = `${selected.getFullYear()}-${selected.getMonth()}-${cell.d}`;
            const has = daysWithEvents.has(key);
            const isSel = key === selectedKey;
            return (
              <TouchableOpacity
                key={cell.key}
                style={[styles.cell, isSel && styles.cellSel]}
                onPress={() => setSelected(new Date(selected.getFullYear(), selected.getMonth(), cell.d))}
              >
                <Text style={[styles.cellText, isSel && styles.cellTextSel]}>{cell.d}</Text>
                {has && !isSel ? <View style={styles.dot} /> : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.statsBanner}>
        <View>
          <Text style={styles.statsLbl}>Programadas este mes</Text>
          <Text style={styles.statsNum}>{items.length} sesiones</Text>
        </View>
        <View style={styles.statsIcon}>
          <MaterialCommunityIcons name="calendar-month" size={24} color={C.onPrimary} />
        </View>
      </View>

      <View style={styles.agendaHead}>
        <View>
          <Text style={styles.kickerSmall}>Próxima fecha</Text>
          <Text style={styles.agendaTitle}>
            {selected.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'short' })}
          </Text>
        </View>
        <TouchableOpacity style={styles.listBtn} onPress={() => navigation.navigate('Tutores')}>
          <Text style={styles.listBtnText}>Buscar tutores</Text>
          <MaterialCommunityIcons name="chevron-right" size={18} color={C.onSurface} />
        </TouchableOpacity>
      </View>

      {agenda.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No hay tutorías este día.</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Tutores')}>
            <Text style={styles.emptyCta}>Explorar tutores →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        agenda.map((t) => {
          const d = t.fecha_inicio ? new Date(t.fecha_inicio) : null;
          return (
            <View key={t.id} style={styles.agendaCard}>
              <View style={styles.timeBox}>
                <Text style={styles.timeTxt}>
                  {d ? d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : '—'}
                </Text>
                <Text style={styles.durTxt}>{t.duracion_minutos || 60} min</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.agendaName}>{t.materia_nombre || 'Tutoría'}</Text>
                <Text style={styles.agendaMeta}>
                  <MaterialCommunityIcons name="map-marker-outline" size={16} color={C.instGreen} />{' '}
                  {t.lugar || t.estado}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 8 }}>
                <Text style={styles.tutorTag}>{t.tutor_nombre || 'Tutor'}</Text>
                <TouchableOpacity style={styles.pillBtn}>
                  <Text style={styles.pillBtnText}>DETALLE</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Tutores')}>
        <MaterialCommunityIcons name="plus" size={28} color={C.onSecondaryContainer} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surface },
  content: { paddingBottom: 110, paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: C.surface },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 8 : 12,
    marginBottom: 12,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: C.instGreen },
  brand: { fontSize: 20, fontWeight: '800', color: C.instGreen },
  kicker: {
    fontSize: 11,
    fontWeight: '800',
    color: C.instGreen,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  monthTitle: { fontSize: 26, fontWeight: '800', color: '#333', marginBottom: 14 },
  calCard: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: C.outlineVariant + '33',
    marginBottom: 14,
  },
  weekRow: { flexDirection: 'row', marginBottom: 10 },
  weekCell: { flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '800', color: '#666', paddingVertical: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: '14.28%',
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  cellSel: {
    backgroundColor: C.instGreen,
    borderRadius: 999,
  },
  cellText: { fontSize: 13, fontWeight: '600', color: '#333' },
  cellTextSel: { color: '#fff', fontWeight: '800' },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: C.instGreen,
    position: 'absolute',
    bottom: 6,
  },
  statsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.primary + '12',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: C.primary + '22',
    marginBottom: 20,
  },
  statsLbl: { color: '#666', fontSize: 13 },
  statsNum: { fontSize: 22, fontWeight: '800', color: C.instGreen, marginTop: 4 },
  statsIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: C.instGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agendaHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  kickerSmall: { fontSize: 10, fontWeight: '800', color: C.instGreen, letterSpacing: 1 },
  agendaTitle: { fontSize: 18, fontWeight: '800', color: '#333', textTransform: 'capitalize' },
  listBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: C.surfaceContainerHigh,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  listBtnText: { fontSize: 12, fontWeight: '800', color: '#333' },
  emptyBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: C.outlineVariant + '88',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: { color: '#666', fontSize: 14 },
  emptyCta: { marginTop: 8, color: C.instGreen, fontWeight: '800', fontSize: 14 },
  agendaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.surfaceContainerLow,
    borderRadius: 24,
    padding: 14,
    marginBottom: 12,
  },
  timeBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: C.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeTxt: { fontSize: 11, fontWeight: '800', color: C.instGreen },
  durTxt: { fontSize: 8, fontWeight: '800', color: '#666', marginTop: 2 },
  agendaName: { fontSize: 16, fontWeight: '800', color: '#333' },
  agendaMeta: { marginTop: 4, fontSize: 12, color: '#666' },
  tutorTag: {
    fontSize: 10,
    fontWeight: '800',
    backgroundColor: C.primaryContainer,
    color: C.onPrimary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  pillBtn: {
    backgroundColor: C.instGreen,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  pillBtnText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 10,
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: C.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
});
