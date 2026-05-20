import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { tutorService, materiaService, tutoriaService } from '../../services/api';

export default function CreateTutoriaScreen({ navigation }) {
  const [materias, setMaterias] = useState([]);
  const [tutores, setTutores] = useState([]);
  const [selectedMateria, setSelectedMateria] = useState('');
  const [selectedMateriaName, setSelectedMateriaName] = useState('');
  const [selectedTutor, setSelectedTutor] = useState('');
  const [selectedTutorName, setSelectedTutorName] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [duracion, setDuracion] = useState('60');
  const [lugar, setLugar] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [showMateriaModal, setShowMateriaModal] = useState(false);
  const [showTutorModal, setShowTutorModal] = useState(false);
  const [showDuracionModal, setShowDuracionModal] = useState(false);

  const duracionOptions = ['30', '45', '60', '90', '120'];

  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [materiasRes, tutoresRes] = await Promise.all([
        materiaService.getAll({ page_size: 100 }),
        tutorService.getAll({ page_size: 100 }),
      ]);
      
      const materiasList = materiasRes.data.results || materiasRes.data || [];
      const tutoresList = tutoresRes.data.results || tutoresRes.data || [];
      
      setMaterias(Array.isArray(materiasList) ? materiasList : []);
      setTutores(Array.isArray(tutoresList) ? tutoresList : []);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setLoadingData(false);
    }
  };

  const handleCreate = async () => {
    if (!selectedMateria || !selectedTutor || !fecha || !hora || !lugar) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const fechaHoraInicio = `${fecha}T${hora}`;
      
      const data = {
        materia: selectedMateria,
        tutor: selectedTutor,
        estudiante: user?.id,
        fecha_inicio: fechaHoraInicio,
        duracion_minutos: parseInt(duracion),
        lugar: lugar,
      };
      
      console.log('Datos a enviar:', data);
      
      const response = await tutoriaService.create(data);
      console.log('Respuesta exitosa:', response.data);

      Alert.alert('Éxito', 'Tutoría creada exitosamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error creating tutoria:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'No se pudo crear la tutoría. Por favor intenta nuevamente.';
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else {
          const errors = Object.entries(error.response.data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('\n');
          if (errors) {
            errorMessage = errors;
          }
        }
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#34A853" />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#34A853" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crear Tutoría</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.form}>
          {/* Materia Selector */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>MATERIA</Text>
            <TouchableOpacity
              style={styles.inputWrapper}
              onPress={() => setShowMateriaModal(true)}
            >
              <Text style={selectedMateriaName ? styles.input : styles.placeholderText}>
                {selectedMateriaName || 'Selecciona una materia'}
              </Text>
              <MaterialCommunityIcons name="chevron-down" size={20} color="#999" />
            </TouchableOpacity>

            <Modal
              visible={showMateriaModal}
              transparent
              animationType="slide"
              onRequestClose={() => setShowMateriaModal(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowMateriaModal(false)}
              >
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Selecciona una materia</Text>
                    <TouchableOpacity onPress={() => setShowMateriaModal(false)}>
                      <MaterialCommunityIcons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={materias}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.modalItem}
                        onPress={() => {
                          setSelectedMateria(item.id);
                          setSelectedMateriaName(item.nombre);
                          setShowMateriaModal(false);
                        }}
                      >
                        <Text style={styles.modalItemText}>{item.nombre}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          </View>

          {/* Tutor Selector */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>TUTOR</Text>
            <TouchableOpacity
              style={styles.inputWrapper}
              onPress={() => setShowTutorModal(true)}
            >
              <Text style={selectedTutorName ? styles.input : styles.placeholderText}>
                {selectedTutorName || 'Selecciona un tutor'}
              </Text>
              <MaterialCommunityIcons name="chevron-down" size={20} color="#999" />
            </TouchableOpacity>

            <Modal
              visible={showTutorModal}
              transparent
              animationType="slide"
              onRequestClose={() => setShowTutorModal(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowTutorModal(false)}
              >
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Selecciona un tutor</Text>
                    <TouchableOpacity onPress={() => setShowTutorModal(false)}>
                      <MaterialCommunityIcons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={tutores}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.modalItem}
                        onPress={() => {
                          setSelectedTutor(item.id);
                          setSelectedTutorName(`${item.usuario_nombre || 'Tutor'} - ${item.especialidad || 'General'}`);
                          setShowTutorModal(false);
                        }}
                      >
                        <Text style={styles.modalItemText}>
                          {`${item.usuario_nombre || 'Tutor'} - ${item.especialidad || 'General'}`}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          </View>

          {/* Fecha Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>FECHA</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD (ej: 2024-05-25)"
                placeholderTextColor="#999"
                value={fecha}
                onChangeText={setFecha}
              />
            </View>
          </View>

          {/* Hora Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>HORA</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="HH:MM (ej: 14:30)"
                placeholderTextColor="#999"
                value={hora}
                onChangeText={setHora}
              />
            </View>
          </View>

          {/* Duración Selector */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>DURACIÓN (minutos)</Text>
            <TouchableOpacity
              style={styles.inputWrapper}
              onPress={() => setShowDuracionModal(true)}
            >
              <Text style={styles.input}>{duracion} minutos</Text>
              <MaterialCommunityIcons name="chevron-down" size={20} color="#999" />
            </TouchableOpacity>

            <Modal
              visible={showDuracionModal}
              transparent
              animationType="slide"
              onRequestClose={() => setShowDuracionModal(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setShowDuracionModal(false)}
              >
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Selecciona la duración</Text>
                    <TouchableOpacity onPress={() => setShowDuracionModal(false)}>
                      <MaterialCommunityIcons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={duracionOptions}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.modalItem}
                        onPress={() => {
                          setDuracion(item);
                          setShowDuracionModal(false);
                        }}
                      >
                        <Text style={styles.modalItemText}>{item} minutos</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          </View>

          {/* Lugar Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>LUGAR</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Salón, biblioteca, link de Zoom, etc."
                placeholderTextColor="#999"
                value={lugar}
                onChangeText={setLugar}
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleCreate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Crear Tutoría</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#666' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  scroll: { flex: 1 },
  content: { padding: 24 },
  form: { width: '100%' },
  inputContainer: { marginBottom: 24 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#666', marginBottom: 8, letterSpacing: 1 },
  inputWrapper: {
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    paddingHorizontal: 16,
    height: 56,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  input: { fontSize: 16, color: '#333', flex: 1 },
  placeholderText: { fontSize: 16, color: '#999', flex: 1 },
  button: {
    backgroundColor: '#34A853',
    borderRadius: 30,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#34A853',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '60%' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  modalItem: { padding: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  modalItemText: { fontSize: 16, color: '#333' },
});
