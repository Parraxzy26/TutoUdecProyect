import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { tutoriaService } from '../../services/api';

const TutoriasScreen = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const { data } = await tutoriaService.getMisTutorias({ page_size: 50 });
      const list = data.results ?? data;
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(
        e.response?.data?.detail || 'No se pudieron cargar tus tutorías'
      );
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

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>{item.materia_nombre || 'Materia'}</Text>
        <Text style={styles.badge}>{item.estado}</Text>
      </View>
      <Text style={styles.meta}>Tutor: {item.tutor_nombre || '—'}</Text>
      <Text style={styles.date}>
        {item.fecha_inicio
          ? new Date(item.fecha_inicio).toLocaleString('es-CO')
          : ''}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4A90D9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>No tienes tutorías registradas</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  badge: {
    fontSize: 12,
    textTransform: 'capitalize',
    backgroundColor: '#E3F2FD',
    color: '#1565C0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  meta: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: '#888',
  },
  error: {
    color: '#c62828',
    padding: 16,
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    marginTop: 50,
    fontSize: 16,
  },
});

export default TutoriasScreen;
