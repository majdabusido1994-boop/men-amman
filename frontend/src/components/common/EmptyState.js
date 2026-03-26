import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../../theme';

const EmptyState = ({ icon, title, subtitle }) => (
  <View style={styles.container}>
    <Ionicons name={icon || 'leaf-outline'} size={60} color={COLORS.sandDark} />
    <Text style={styles.title}>{title || 'Nothing here yet'}</Text>
    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxxl,
    gap: SPACING.md,
  },
  title: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.warmGray,
    ...FONTS.semibold,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    ...FONTS.regular,
    textAlign: 'center',
  },
});

export default EmptyState;
