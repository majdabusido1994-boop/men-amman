import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../../theme';

const GradientButton = ({
  title, onPress, loading, disabled, style, textStyle,
  variant = 'primary', icon, small,
}) => {
  if (variant === 'outline') {
    return (
      <TouchableOpacity
        style={[styles.outline, small && styles.small, disabled && styles.disabled, style]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
      >
        {icon}
        <Text style={[styles.outlineText, small && styles.smallText, textStyle]}>{title}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[disabled && styles.disabled, style]}
    >
      <LinearGradient
        colors={[COLORS.terracotta, COLORS.terracottaDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, small && styles.small]}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <>
            {icon}
            <Text style={[styles.text, small && styles.smallText, textStyle]}>{title}</Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: RADIUS.xl,
    gap: 8,
    ...SHADOWS.medium,
  },
  small: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  text: {
    color: COLORS.white,
    fontSize: FONTS.sizes.lg,
    ...FONTS.semibold,
  },
  smallText: {
    fontSize: FONTS.sizes.sm,
  },
  outline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: RADIUS.xl,
    borderWidth: 2,
    borderColor: COLORS.terracotta,
    gap: 8,
  },
  outlineText: {
    color: COLORS.terracotta,
    fontSize: FONTS.sizes.lg,
    ...FONTS.semibold,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default GradientButton;
