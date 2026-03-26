import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../../theme';

const Header = ({ title, titleAr, onBack, rightIcon, onRightPress, transparent }) => {
  return (
    <View style={[styles.header, transparent && styles.transparent]}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={transparent ? COLORS.white : COLORS.textPrimary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.backBtn} />
      )}

      <View style={styles.titleWrap}>
        <Text style={[styles.title, transparent && { color: COLORS.white }]}>{title}</Text>
        {titleAr && <Text style={[styles.titleAr, transparent && { color: COLORS.white }]}>{titleAr}</Text>}
      </View>

      {rightIcon ? (
        <TouchableOpacity onPress={onRightPress} style={styles.rightBtn}>
          <Ionicons name={rightIcon} size={24} color={transparent ? COLORS.white : COLORS.textPrimary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.rightBtn} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
  },
  transparent: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textPrimary,
    ...FONTS.bold,
  },
  titleAr: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.warmGray,
    ...FONTS.regular,
    marginTop: 2,
  },
  rightBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Header;
