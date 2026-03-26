import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '../../theme';

const ShopCard = ({ shop, onPress, variant = 'default' }) => {
  if (variant === 'featured') {
    return (
      <TouchableOpacity style={styles.featuredCard} onPress={onPress} activeOpacity={0.85}>
        <Image
          source={{ uri: shop.coverImage || shop.profileImage || 'https://via.placeholder.com/400' }}
          style={styles.featuredImage}
        />
        <View style={styles.featuredOverlay}>
          <View style={styles.featuredInfo}>
            <View style={styles.featuredHeader}>
              <Image
                source={{ uri: shop.profileImage || 'https://via.placeholder.com/100' }}
                style={styles.featuredAvatar}
              />
              <View style={{ flex: 1 }}>
                <View style={styles.nameRow}>
                  <Text style={styles.featuredName} numberOfLines={1}>{shop.name}</Text>
                  {shop.isVerified && (
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.gold} />
                  )}
                </View>
                <Text style={styles.featuredNeighborhood}>{shop.neighborhood}</Text>
              </View>
            </View>
            <View style={styles.featuredStats}>
              <Text style={styles.featuredFollowers}>
                {shop.followersCount || 0} followers
              </Text>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color={COLORS.gold} />
                <Text style={styles.ratingText}>{shop.rating || 'New'}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image
        source={{ uri: shop.profileImage || 'https://via.placeholder.com/100' }}
        style={styles.avatar}
      />
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{shop.name}</Text>
          {shop.isVerified && (
            <Ionicons name="checkmark-circle" size={14} color={COLORS.terracotta} />
          )}
        </View>
        {shop.nameAr ? <Text style={styles.nameAr}>{shop.nameAr}</Text> : null}
        <Text style={styles.neighborhood}>{shop.neighborhood}</Text>
        <View style={styles.statsRow}>
          <Text style={styles.category}>{shop.category}</Text>
          <Text style={styles.followers}>{shop.followersCount || 0} followers</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.soft,
    gap: SPACING.md,
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.lg,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    ...FONTS.semibold,
  },
  nameAr: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.warmGray,
    marginTop: 2,
  },
  neighborhood: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.warmGray,
    ...FONTS.regular,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: SPACING.xs,
  },
  category: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.terracotta,
    ...FONTS.medium,
    backgroundColor: COLORS.sand,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  followers: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.warmGray,
    ...FONTS.regular,
  },
  // Featured variant
  featuredCard: {
    width: 260,
    height: 180,
    borderRadius: RADIUS.lg,
    marginRight: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  featuredInfo: {
    padding: SPACING.md,
  },
  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  featuredAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  featuredName: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    ...FONTS.bold,
  },
  featuredNeighborhood: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FONTS.sizes.xs,
    ...FONTS.regular,
  },
  featuredStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  featuredFollowers: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FONTS.sizes.xs,
    ...FONTS.regular,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    gap: 4,
  },
  ratingText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.xs,
    ...FONTS.medium,
  },
});

export default ShopCard;
