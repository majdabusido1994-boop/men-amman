import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '../../theme';

const SearchBar = ({ value, onChangeText, placeholder, onSubmit, onFilterPress, style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={20} color={COLORS.warmGray} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder || 'Search Men Amman...'}
          placeholderTextColor={COLORS.textLight}
          returnKeyType="search"
          onSubmitEditing={onSubmit}
        />
      </View>
      {onFilterPress && (
        <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress} activeOpacity={0.7}>
          <Ionicons name="options-outline" size={20} color={COLORS.white} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.sand,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    gap: SPACING.sm,
    ...SHADOWS.soft,
  },
  input: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    ...FONTS.regular,
  },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.soft,
  },
});

export default SearchBar;
