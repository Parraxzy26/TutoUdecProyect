import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from '../../components/AppHeader';
import { tutorService } from '../../services/api';
import { C } from '../../theme/colors';

const AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDEejO4pSWu1w_8uNMBI6ZJJsnoS3zuBgAnYOXP9z8A7tRg-rX-lAPTWwonxjtiEVgWXmxFJ7hIGPhH0HuC6XeA2GvTlyNzHUXszNB2br0wHj8lGYKUcf2fnwsM_I_oxFERjZT-pZvKfdszh9BmtI3vnW2ikhv4bL6AIklRomWHXkhqRFtNMh-lnJjAbennxCj_M6Lm7am_W24UjgrJY6VbM4Pr0caYWCq8RufJwrlTlBmKtE0gAx586JmQQOtfIQsm6oltra19LRM';

function listPayload(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results;
  return [];
}

export default function TutoresScreen({ navigation, route }) {
  const [query, setQuery] = useState(route.params?.initialQuery ?? '');
  const [tutores, setTutores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (route.params?.initialQuery != null) {
      setQuery(route.params.initialQuery);
    }
  }, [route.params?.initialQuery]);

  const fetchList = async (q) => {
    const params = { page_size: 40 };
    const term = String(q ?? '').trim();
    if (term) params.search = term;
    const { data } = await tutorService.getAll(params);
    return listPayload(data);
  };

  useEffect(() => {
    let alive = true;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const list = await fetchList(query);
        if (alive) setTutores(list);
      } catch (e) {
        if (alive) setTutores([]);
      } finally {
        if (alive) setLoading(false);
      }
    }, 320);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [query]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      setTutores(await fetchList(query));
    } catch {
      setTutores([]);
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <View style={styles.rel}>
          <View style={styles.photoPlaceholder}>
            <MaterialCommunityIcons name="account" size={40} color={C.primary} />
          </View>
          <View
            style={[
              styles.dot,
              { backgroundColor: item.disponible ? '#22C55E' : C.outline },
            ]}
          />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.usuario_nombre || 'Tutor'}</Text>
              <Text style={styles.spec}>{item.especialidad}</Text>
            </View>
            <View style={styles.ratingPill}>
              <MaterialCommunityIcons name="star" size={16} color={C.secondary} />
              <Text style={styles.ratingText}>
                {Number(item.calificacion ?? 0).toFixed(1)}
              </Text>
            </View>
          </View>
          <Text style={styles.bio} numberOfLines={2}>
            ${item.tarifa_por_hora}/h · {item.disponible ? 'Disponible' : 'No disponible'}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.cta} activeOpacity={0.9}>
        <Text style={styles.ctaText}>Ver perfil</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.root}>
      <AppHeader
        variant="home"
        avatarUri={AVATAR}
        onPressAvatar={() => navigation.navigate('Profile')}
        onPressBell={() => {}}
      />

      <Text style={styles.h2}>Busca tu tutor</Text>

      <View style={styles.searchWrap}>
        <MaterialCommunityIcons name="magnify" size={22} color={C.outline} style={{ marginLeft: 12 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Materia, nombre…"
          placeholderTextColor={C.outline}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
      </View>

      <View style={styles.chips}>
        <View style={styles.chipPrimary}>
          <Text style={styles.chipPrimaryText}>{query.trim() || 'Todos'}</Text>
          {query.trim() ? (
            <TouchableOpacity onPress={() => setQuery('')}>
              <MaterialCommunityIcons name="close" size={18} color={C.onPrimary} />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity style={styles.chipGhost} onPress={() => navigation.navigate('Materias')}>
          <MaterialCommunityIcons name="filter-variant" size={18} color={C.onSurfaceVariant} />
          <Text style={styles.chipGhostText}>Materias</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.countRow}>
        <Text style={styles.count}>{tutores.length} resultados</Text>
        <Text style={styles.sort}>API Django</Text>
      </View>

      {loading && tutores.length === 0 ? (
        <ActivityIndicator style={{ marginTop: 24 }} color={C.primary} />
      ) : (
        <FlatList
          data={tutores}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <Text style={styles.empty}>No hay tutores. Prueba otra búsqueda o revisa la API.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surface, paddingHorizontal: 20 },
  h2: { fontSize: 22, fontWeight: '800', color: C.onSurface, marginBottom: 12, marginTop: 4 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surfaceContainerHighest,
    borderRadius: 18,
    marginBottom: 12,
  },
  searchInput: { flex: 1, paddingVertical: 14, fontSize: 16, color: C.onSurface },
  chips: { flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' },
  chipPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: C.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  chipPrimaryText: { color: C.onPrimary, fontWeight: '600', fontSize: 14 },
  chipGhost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: C.surfaceContainerHigh,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  chipGhostText: { color: C.onSurfaceVariant, fontWeight: '600' },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  count: { fontSize: 11, fontWeight: '800', letterSpacing: 1, color: C.outline, textTransform: 'uppercase' },
  sort: { fontSize: 13, fontWeight: '600', color: C.primary },
  card: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: C.outlineVariant + '33',
  },
  cardRow: { flexDirection: 'row', gap: 14 },
  rel: { position: 'relative' },
  photoPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 18,
    backgroundColor: C.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: C.surfaceContainerLowest,
  },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  name: { fontSize: 18, fontWeight: '800', color: C.onSurface },
  spec: { marginTop: 2, fontSize: 14, fontWeight: '600', color: C.primary },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: C.secondaryContainer + '33',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ratingText: { fontWeight: '800', color: C.secondary, fontSize: 13 },
  bio: { marginTop: 8, fontSize: 13, color: C.onSurfaceVariant, lineHeight: 18 },
  cta: {
    marginTop: 14,
    backgroundColor: C.primary,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ctaText: { color: C.onPrimary, fontWeight: '800', fontSize: 14 },
  empty: { textAlign: 'center', color: C.onSurfaceVariant, marginTop: 32 },
});
