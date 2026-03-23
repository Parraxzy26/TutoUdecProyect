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
import { materiaService } from '../../services/api';

const MateriasScreen = ({ navigation }) => {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMaterias = async () => {
    try {
      const response = await materiaService.getAll();
      setMaterias(response.data.results || response.data);
    } catch (error) {
      console.error('Error loading materias:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMaterias();
    setRefreshing(false);
  };

  useEffect(() => {
    loadMaterias();
  }, []);

  const renderMateria = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>📚</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{item.nombre}</Text>
        {item.descripcion && (
          <Text style={styles.description} numberOfLines={2}>
            {item.descripcion}
          </Text>
        )}
        <Text style={styles.stats}>
          {item.total_tutorias || 0} tutorías • {item.tutores?.length || 0} tutores
        </Text>
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
        data={materias}
        renderItem={renderMateria}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No hay materias disponibles</Text>
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
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  stats: {
    fontSize: 13,
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

export default MateriasScreen;
