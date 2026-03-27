/**
 * Cabecera global de marca (logo horizontal) con respeto a safe area en iOS/Android.
 * Exporta helpers de tamaño para login y tabs.
 */
import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LOGO_HORIZONTAL from '../assets/tutoudec-logo-horizontal.png';
import { C } from '../theme/colors';

const { width: SCREEN_W } = Dimensions.get('window');

/** Logo cabecera: main (tabs) vs compact (subpantallas con atrás) */
export function getHeaderLogoSize(variant = 'main') {
  const maxW = Math.min(SCREEN_W - 40, 280);
  if (variant === 'compact') {
    const w = Math.max(118, maxW * 0.5);
    return { width: w, height: Math.max(30, w * 0.28) };
  }
  const w = Math.max(150, maxW * 0.66);
  return { width: w, height: Math.max(34, w * 0.28) };
}

/**
 * Logo de login en modo "hero".
 * Se limita el ancho máximo para evitar distorsión en tablets y
 * se mantiene una altura proporcional al recurso horizontal.
 */
export function getLoginBrandLogoSize() {
  const sw = Dimensions.get('window').width;
  const w = Math.min(sw - 12, 400);
  return { width: w, height: Math.max(64, Math.round(w * 0.42)) };
}

/**
 * Cabecera con zona segura: evita que el notch / barra de estado tape avatar o logo.
 * @param {'home'|'stack'} variant - home: avatar | logo | campana; stack: atrás | logo | opcional derecha
 */
export default function AppHeader({
  variant = 'home',
  onPressAvatar,
  onPressBell,
  avatarUri,
  right,
  left,
  logoSize,
}) {
  const insets = useSafeAreaInsets();
  // Decisión técnica: centralizamos escalado para que todas las pantallas
  // compartan la misma lógica visual y no dupliquen "magic numbers".
  const size = logoSize || getHeaderLogoSize(variant === 'stack' ? 'compact' : 'main');
  const padTop = insets.top + 4;

  const bell = (
    <TouchableOpacity
      onPress={onPressBell}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      style={styles.sideSlot}
    >
      <MaterialCommunityIcons name="bell-outline" size={22} color={C.onSurface} />
    </TouchableOpacity>
  );
  const rightHome = right !== undefined ? right : bell;

  if (variant === 'stack') {
    return (
      <View style={[styles.bar, { paddingTop: padTop }]}>
        <View style={styles.sideSlot}>{left}</View>
        <View style={styles.logoCenter}>
          <Image source={LOGO_HORIZONTAL} style={size} resizeMode="contain" />
        </View>
        <View style={styles.sideSlot}>{right ?? <View />}</View>
      </View>
    );
  }

  return (
    <View style={[styles.bar, { paddingTop: padTop }]}>
      <Pressable onPress={onPressAvatar} style={styles.sideSlot}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <MaterialCommunityIcons name="account" size={20} color={C.primary} />
          </View>
        )}
      </Pressable>
      <View style={styles.logoCenter}>
        <Image source={LOGO_HORIZONTAL} style={size} resizeMode="contain" />
      </View>
      {rightHome}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 8,
    minHeight: 44,
  },
  sideSlot: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: C.primaryContainer,
  },
  avatarPlaceholder: {
    backgroundColor: C.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
