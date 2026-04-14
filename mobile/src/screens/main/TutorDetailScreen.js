import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { tutorService, tutoriaService } from '../../services/api';
import { C } from '../../theme/colors';

export default function TutorDetailScreen({ navigation, route }) {
  const { tutorId } = route.params || {};
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('2023-10-24'); // Mock for now
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    if (tutorId) {
      loadTutor();
    } else {
      // Fallback/Mock for testing if no ID
      setTutor({
        id: 1,
        usuario_nombre: 'Dr. Mateo Valdés',
        especialidad: 'Advanced Calculus',
        bio: 'Passionate about simplifying complex mathematical concepts. With over five years of academic mentorship at UDEC, I specialize in helping engineering students bridge the gap between theoretical physics and practical application.',
        calificacion: 4.9,
        total_tutorias: 1240,
        experiencia_anios: 5,
        certificaciones: ['UDEC Certified', 'Active Academic Staff'],
        idiomas: ['Spanish', 'English C1'],
      });
      setLoading(false);
    }
  }, [tutorId]);

  const loadTutor = async () => {
    try {
      const { data } = await tutorService.getById(tutorId);
      setTutor(data);
    } catch (e) {
      console.warn('Load tutor detail', e);
      Alert.alert('Error', 'No se pudo cargar el perfil del tutor.');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!selectedTime) {
      Alert.alert('Selection Required', 'Please select a time slot first.');
      return;
    }
    try {
      // Logic to book a session
      Alert.alert('Success', 'Tutorial session booked successfully!');
      navigation.navigate('Tutorias');
    } catch (e) {
      Alert.alert('Error', 'Could not book session.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.root, styles.center]}>
        <ActivityIndicator size="large" color={C.instGreen} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tutor Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.profileBox}>
            <View style={styles.profileImgPlaceholder}>
               <MaterialCommunityIcons name="account" size={120} color="#DDD" />
            </View>
            <View style={styles.ratingBadgeLarge}>
              <Text style={styles.ratingNumLarge}>{Number(tutor?.calificacion ?? 0).toFixed(1)}</Text>
              <MaterialCommunityIcons name="star" size={14} color="#333" />
            </View>
          </View>
          
          <View style={styles.infoAlignLeft}>
            <Text style={styles.roleKicker}>SENIOR TUTOR</Text>
            <Text style={styles.nameLarge}>{tutor?.usuario_nombre || 'Tutor'}</Text>
            
            <View style={styles.skillsRow}>
              <View style={styles.skillPillActive}><Text style={styles.skillTextActive}>{tutor?.especialidad || 'Mathematics'}</Text></View>
              <View style={styles.skillPill}><Text style={styles.skillText}>Linear Algebra</Text></View>
              <View style={styles.skillPill}><Text style={styles.skillText}>Physics II</Text></View>
            </View>

            <View style={styles.statsRowLarge}>
              <View style={styles.statLarge}>
                <Text style={styles.statNumLarge}>{tutor?.total_tutorias ?? 0}+</Text>
                <Text style={styles.statLblLarge}>SESSIONS</Text>
              </View>
              <View style={styles.statLarge}>
                <Text style={styles.statNumLarge}>98%</Text>
                <Text style={styles.statLblLarge}>SUCCESS RATE</Text>
              </View>
              <View style={styles.statLarge}>
                <Text style={styles.statNumLarge}>{tutor?.experiencia_anios ?? 0} yrs</Text>
                <Text style={styles.statLblLarge}>EXPERIENCE</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About Me</Text>
              <Text style={styles.bioLarge}>
                {tutor?.bio || 'No bio available.'}
              </Text>
            </View>

            <View style={styles.badgeSection}>
              <View style={styles.infoBadge}>
                <View style={styles.badgeIconBox}>
                  <MaterialCommunityIcons name="shield-check-outline" size={20} color="#34A853" />
                </View>
                <View>
                  <Text style={styles.badgeTitle}>UDEC Certified</Text>
                  <Text style={styles.badgeSub}>Active Academic Staff</Text>
                </View>
              </View>
              <View style={styles.infoBadge}>
                <View style={styles.badgeIconBox}>
                  <MaterialCommunityIcons name="earth" size={20} color="#34A853" />
                </View>
                <View>
                  <Text style={styles.badgeTitle}>Bilingual</Text>
                  <Text style={styles.badgeSub}>Spanish & English C1</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Availability</Text>
                <View style={styles.monthNav}>
                  <MaterialCommunityIcons name="chevron-left" size={20} color="#333" />
                  <MaterialCommunityIcons name="chevron-right" size={20} color="#333" />
                </View>
              </View>
              <Text style={styles.monthLabel}>OCTOBER 2023</Text>
              
              <View style={styles.calendarGrid}>
                <View style={styles.calRow}>
                  {['M','T','W','T','F','S','S'].map((d, i) => (
                    <Text key={i} style={styles.calDayText}>{d}</Text>
                  ))}
                </View>
                <View style={styles.calRow}>
                  {[28,29,30,1,2,3,4].map((d, i) => (
                    <View key={i} style={[styles.calDateBox, i === 4 && styles.calDateBoxActive]}>
                      <Text style={[styles.calDateText, i < 3 && styles.calDateTextMuted, i === 4 && styles.calDateTextActive]}>{d}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.calRow}>
                  {[5,6,7,8,9,10,11].map((d, i) => (
                    <View key={i} style={[styles.calDateBox, (i === 0 || i === 1) && styles.calDateBoxHighlight]}>
                      <Text style={styles.calDateText}>{d}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <Text style={styles.selectedDateText}>Selected: Tuesday, Oct 2</Text>
              <View style={styles.timeSlotsGrid}>
                {['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'].map((time) => (
                  <TouchableOpacity 
                    key={time}
                    style={selectedTime === time ? styles.timeSlotPillActive : styles.timeSlotPill}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Text style={selectedTime === time ? styles.timeSlotTextActive : styles.timeSlotText}>{time}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.infoBoxMuted}>
                <MaterialCommunityIcons name="information" size={18} color="#B8860B" />
                <Text style={styles.infoBoxText}>Session includes 15 min free follow-up chat.</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.bookBtnLarge} onPress={handleBook} activeOpacity={0.9}>
        <View style={styles.bookBtnTextContainer}>
          <Text style={styles.bookBtnKicker}>NEXT SESSION</Text>
          <Text style={styles.bookBtnMainText}>Book Tutorial</Text>
        </View>
        <View style={styles.bookBtnIconBox}>
          <MaterialCommunityIcons name="calendar-plus" size={24} color="#fff" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#34A853' },
  scroll: { flex: 1 },
  content: { paddingBottom: 120 },
  hero: { padding: 20 },
  profileBox: { width: '100%', height: 300, borderRadius: 32, backgroundColor: '#F0F0F0', marginBottom: 24, position: 'relative' },
  profileImgPlaceholder: { flex: 1, borderRadius: 32, justifyContent: 'center', alignItems: 'center' },
  ratingBadgeLarge: {
    position: 'absolute',
    right: 20,
    top: 150,
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  ratingNumLarge: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  infoAlignLeft: { alignItems: 'flex-start' },
  roleKicker: { fontSize: 10, fontWeight: 'bold', color: '#34A853', letterSpacing: 1 },
  nameLarge: { fontSize: 32, fontWeight: 'bold', color: '#333', marginTop: 8 },
  skillsRow: { flexDirection: 'row', gap: 8, marginTop: 16, flexWrap: 'wrap' },
  skillPill: { backgroundColor: '#F0F0F0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  skillPillActive: { backgroundColor: '#A5D6A7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  skillText: { fontSize: 12, fontWeight: '600', color: '#666' },
  skillTextActive: { fontSize: 12, fontWeight: '600', color: '#006D32' },
  statsRowLarge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 32,
    paddingVertical: 16,
  },
  statLarge: { alignItems: 'flex-start' },
  statNumLarge: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  statLblLarge: { fontSize: 8, color: '#999', marginTop: 4, fontWeight: 'bold' },
  section: { width: '100%', marginTop: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  bioLarge: { fontSize: 14, color: '#666', lineHeight: 22, marginBottom: 24 },
  badgeSection: { gap: 12, marginBottom: 24 },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 16,
    gap: 12,
  },
  badgeIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  badgeSub: { fontSize: 12, color: '#999' },
  monthNav: { flexDirection: 'row', gap: 16 },
  monthLabel: { fontSize: 12, fontWeight: 'bold', color: '#999', marginBottom: 16 },
  calendarGrid: { marginBottom: 20 },
  calRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  calDayText: { width: 40, textAlign: 'center', fontSize: 12, color: '#999', fontWeight: 'bold' },
  calDateBox: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  calDateBoxActive: { backgroundColor: '#34A853' },
  calDateBoxHighlight: { backgroundColor: '#E8F5E9' },
  calDateText: { fontSize: 14, color: '#333', fontWeight: '600' },
  calDateTextActive: { color: '#fff' },
  calDateTextMuted: { color: '#DDD' },
  selectedDateText: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  timeSlotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  timeSlotPill: { backgroundColor: '#F0F0F0', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16 },
  timeSlotPillActive: { backgroundColor: '#006D32', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16 },
  timeSlotText: { fontSize: 14, fontWeight: '600', color: '#666' },
  timeSlotTextActive: { fontSize: 14, fontWeight: '600', color: '#fff' },
  infoBoxMuted: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFF9E6', padding: 12, borderRadius: 12 },
  infoBoxText: { fontSize: 12, color: '#B8860B', flex: 1 },
  bookBtnLarge: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#006D32',
    height: 70,
    borderRadius: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  bookBtnTextContainer: { flex: 1 },
  bookBtnKicker: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 'bold' },
  bookBtnMainText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  bookBtnIconBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
});
