import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { C } from '../theme/colors';

const AppHeader = ({ variant = 'default', title, avatarUri, onPressAvatar, onPressBell }) => {
  return (
    <View style={styles.header}>
      {variant === 'home' ? (
        <>
          <TouchableOpacity onPress={onPressAvatar}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            </View>
          </TouchableOpacity>
          <Image 
            source={require('../assets/tutoudec-logo-horizontal.png')} 
            style={styles.logo} 
            resizeMode="contain" 
          />
          <TouchableOpacity onPress={onPressBell}>
            <MaterialCommunityIcons name="bell-outline" size={24} color={C.onSurface} />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>{title}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: C.surface,
  },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: C.primary,
    padding: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  logo: {
    width: 120,
    height: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: C.onSurface,
  },
});

export default AppHeader;
