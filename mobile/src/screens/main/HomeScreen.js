import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { tutorService, materiaService, tutoriaService } from '../../services/api';

const HomeScreen = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState({
    totalTutores: 0,
    totalMaterias: 0,
    misTutorias: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    try {
      const [tutoresRes, materiasRes, tutoriasRes] = await Promise.all([
        tutorService.getAll(),
        materiaService.getAll(),
        tutoriaService.getMisTutorias(),
      ]);

      setStats({
        totalTutores: tutoresRes.data.count || tutoresRes.data.length || 0,
        totalMaterias: materiasRes.data.count || materiasRes.data.length || 0,
        misTutorias: tutoriasRes.data.count || tutoriasRes.data.length || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.welcome}>¡Hola, {user?.first_name || user?.username}!</Text>
        <Text style={styles.subtitle}>Bienvenido a TutoUdec</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalTutores}</Text>
          <Text style={styles.statLabel}>Tutores</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalMaterias}</Text>
          <Text style={styles.statLabel}>Materias</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.misTutorias}</Text>
          <Text style={styles.statLabel}>Mis Tutorías</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Tutores')}
        >
          <Text style={styles.actionText}>🔍 Buscar Tutores</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Materias')}
        >
          <Text style={styles.actionText}>📚 Ver Materias</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Tutorias')}
        >
          <Text style={styles.actionText}>📅 Mis Tutorías</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4A90D9',
    padding: 30,
    paddingTop: 50,
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e0e0',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: -30,
    paddingHorizontal: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90D9',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  section: {
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#ff6b6b',
    margin: 20,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
