import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '../../theme';

const DropCard = ({ drop, onPress }) => {
  const typeLabels = {
    new_drop: 'NEW DROP',
    limited_items: 'LIMITED',
    flash_sale: 'FLASH SALE',
    announcement: 'NEWS',
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image
        source={{ uri: drop.image || drop.products?.[0]?.images?.[0] || 'https://via.placeholder.com/300' }}
        style={styles.image}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.overlay}
      >
        <View style={styles.badge}>
          <Ionicons name="flame" size={12} color={COLORS.white} />
          <Text style={styles.badgeText}>{typeLabels[drop.dropType] || 'DROP'}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>{drop.title}</Text>
        <View style={styles.shopRow}>
          <Image
            source={{ uri: drop.shop?.profileImage || 'https://via.placeholder.com/40' }}
            style={styles.shopAvatar}
          />
          <Text style={styles.shopName}>{drop.shop?.name}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 200,
    height: 260,
    borderRadius: RADIUS.lg,
    marginRight: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: SPACING.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.terracotta,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    gap: 4,
    marginBottom: SPACING.sm,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    ...FONTS.bold,
    letterSpacing: 1,
  },
  title: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    ...FONTS.bold,
    marginBottom: SPACING.sm,
  },
  shopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  shopAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  shopName: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: FONTS.sizes.xs,
    ...FONTS.medium,
  },
});

export default DropCard;
