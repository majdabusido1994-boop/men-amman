import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme';

const CulturalTag = ({ tag, emoji, small }) => {
  return (
    <View style={[styles.tag, small && styles.small]}>
      {emoji && <Text style={styles.emoji}>{emoji}</Text>}
      <Text style={[styles.text, small && styles.smallText]}>{tag}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.sand,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 1,
    borderRadius: RADIUS.full,
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  small: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  emoji: {
    fontSize: 12,
  },
  text: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.terracotta,
    ...FONTS.medium,
  },
  smallText: {
    fontSize: 10,
  },
});

export default CulturalTag;
