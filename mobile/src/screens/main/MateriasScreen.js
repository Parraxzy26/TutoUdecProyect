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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { materiaService } from '../../services/api';
import { C } from '../../theme/colors';

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
    <TouchableOpacity style={styles.card} activeOpacity={0.9}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="book-open-variant" size={24} color={C.primary} />
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
        <ActivityIndicator size="large" color={C.primaryContainer} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <TouchableOpacity
          onPress={() =>
            navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home')
          }
          style={styles.backBtn}
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color={C.onSurface} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Materias</Text>
        <View style={{ width: 40 }} />
      </View>
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
    backgroundColor: C.surface,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  pageTitle: { fontSize: 20, fontWeight: '800', color: C.primary },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: C.surfaceContainerLowest,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: C.outlineVariant + '44',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: C.primary + '14',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: C.onSurface,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: C.onSurfaceVariant,
    marginBottom: 8,
  },
  stats: {
    fontSize: 13,
    color: C.primaryContainer,
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    color: C.onSurfaceVariant,
    marginTop: 50,
    fontSize: 16,
  },
});

export default MateriasScreen;
