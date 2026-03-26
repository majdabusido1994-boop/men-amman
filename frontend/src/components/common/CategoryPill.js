import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme';

const CategoryPill = ({ label, icon, selected, onPress, emoji, small }) => {
  return (
    <TouchableOpacity
      style={[styles.pill, selected && styles.selected, small && styles.small]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {emoji ? (
        <Text style={styles.emoji}>{emoji}</Text>
      ) : icon ? (
        <Ionicons
          name={icon}
          size={small ? 14 : 18}
          color={selected ? COLORS.white : COLORS.terracotta}
        />
      ) : null}
      <Text style={[
        styles.label,
        selected && styles.selectedLabel,
        small && styles.smallLabel,
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.sand,
    marginRight: SPACING.sm,
    gap: 6,
  },
  small: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
  },
  selected: {
    backgroundColor: COLORS.terracotta,
  },
  emoji: {
    fontSize: 16,
  },
  label: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    ...FONTS.medium,
  },
  selectedLabel: {
    color: COLORS.white,
  },
  smallLabel: {
    fontSize: FONTS.sizes.xs,
  },
});

export default CategoryPill;
