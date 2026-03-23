import React from 'react';
import { View, StyleSheet } from 'react-native';
import { C } from '../theme/colors';

export default function DecorativeBackground() {
  return (
    <>
      <View style={[styles.blob, styles.topRight]} pointerEvents="none" />
      <View style={[styles.blob, styles.bottomLeft]} pointerEvents="none" />
    </>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.35,
  },
  topRight: {
    width: 280,
    height: 280,
    top: -80,
    right: -80,
    backgroundColor: C.primary,
  },
  bottomLeft: {
    width: 220,
    height: 220,
    bottom: -40,
    left: -40,
    backgroundColor: C.secondaryContainer,
  },
});
