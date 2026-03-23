import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { tutorService } from '../../services/api';

const TutoresScreen = ({ navigation }) => {
  const [tutores, setTutores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTutores = async () => {
    try {
      const response = await tutorService.getAll();
      setTutores(response.data.results || response.data);
    } catch (error) {
      console.error('Error loading tutores:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTutores();
    setRefreshing(false);
  };

  useEffect(() => {
    loadTutores();
  }, []);

  const renderTutor = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.usuario_nombre || 'Sin nombre'}</Text>
        <View style={[styles.badge, item.disponible ? styles.available : styles.unavailable]}>
          <Text style={styles.badgeText}>
            {item.disponible ? 'Disponible' : 'No disponible'}
          </Text>
        </View>
      </View>
      <Text style={styles.especialidad}>{item.especialidad}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.info}>⭐ {item.calificacion || 0}</Text>
        <Text style={styles.info}>💰 ${item.tarifa_por_hora || 0}/h</Text>
        <Text style={styles.info}>📚 {item.total_tutorias || 0} tutorías</Text>
      </View>
    </TouchableOpacity>
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
      <FlatList
        data={tutores}
        renderItem={renderTutor}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No hay tutores disponibles</Text>
        }
      />
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
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  available: {
    backgroundColor: '#4CAF50',
  },
  unavailable: {
    backgroundColor: '#f44336',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  especialidad: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  info: {
    fontSize: 14,
    color: '#4A90D9',
    fontWeight: '500',
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    marginTop: 50,
    fontSize: 16,
  },
});

export default TutoresScreen;
