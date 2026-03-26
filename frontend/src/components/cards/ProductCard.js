import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '../../theme';
import CulturalTag from '../common/CulturalTag';
import { CULTURAL_TAGS } from '../../theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.lg * 3) / 2;

const ProductCard = ({ product, onPress, onLike, isLiked, compact }) => {
  const mainImage = product.images?.[0] || 'https://via.placeholder.com/300';
  const culturalEmoji = (tag) => CULTURAL_TAGS.find(t => t.id === tag)?.emoji || '';

  if (compact) {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={onPress} activeOpacity={0.8}>
        <Image source={{ uri: mainImage }} style={styles.compactImage} />
        <View style={styles.compactInfo}>
          <Text style={styles.compactName} numberOfLines={1}>{product.name}</Text>
          <Text style={styles.compactPrice}>{product.price} JOD</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: mainImage }} style={styles.image} />

        {/* Like button */}
        <TouchableOpacity
          style={styles.likeBtn}
          onPress={(e) => { e.stopPropagation(); onLike?.(); }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={20}
            color={isLiked ? COLORS.error : COLORS.white}
          />
        </TouchableOpacity>

        {/* Drop badge */}
        {product.isDrop && (
          <View style={styles.dropBadge}>
            <Text style={styles.dropText}>DROP</Text>
          </View>
        )}

        {/* Limited badge */}
        {product.isLimited && (
          <View style={styles.limitedBadge}>
            <Text style={styles.limitedText}>LIMITED</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        {product.nameAr ? (
          <Text style={styles.nameAr} numberOfLines={1}>{product.nameAr}</Text>
        ) : null}

        <View style={styles.priceRow}>
          <Text style={styles.price}>{product.price} JOD</Text>
          {product.shop?.isVerified && (
            <Ionicons name="checkmark-circle" size={14} color={COLORS.terracotta} />
          )}
        </View>

        {/* Shop name */}
        {product.shop?.name && (
          <Text style={styles.shopName} numberOfLines={1}>{product.shop.name}</Text>
        )}

        {/* Cultural tags */}
        {product.culturalTags?.length > 0 && (
          <View style={styles.tags}>
            {product.culturalTags.slice(0, 2).map((tag) => (
              <CulturalTag key={tag} tag={tag} emoji={culturalEmoji(tag)} small />
            ))}
          </View>
        )}

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Ionicons name="heart" size={12} color={COLORS.warmGray} />
            <Text style={styles.statText}>{product.likesCount || 0}</Text>
          </View>
          {product.rating > 0 && (
            <View style={styles.stat}>
              <Ionicons name="star" size={12} color={COLORS.gold} />
              <Text style={styles.statText}>{product.rating}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.soft,
    overflow: 'hidden',
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: CARD_WIDTH * 1.1,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
  },
  likeBtn: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: COLORS.terracotta,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  dropText: {
    color: COLORS.white,
    fontSize: 10,
    ...FONTS.bold,
    letterSpacing: 1,
  },
  limitedBadge: {
    position: 'absolute',
    bottom: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: COLORS.gold,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  limitedText: {
    color: COLORS.white,
    fontSize: 10,
    ...FONTS.bold,
    letterSpacing: 1,
  },
  info: {
    padding: SPACING.md,
  },
  name: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    ...FONTS.semibold,
  },
  nameAr: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.warmGray,
    ...FONTS.regular,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: SPACING.xs,
  },
  price: {
    fontSize: FONTS.sizes.md,
    color: COLORS.terracotta,
    ...FONTS.bold,
  },
  shopName: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.warmGray,
    ...FONTS.regular,
    marginTop: 4,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: SPACING.xs,
  },
  stats: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.warmGray,
    ...FONTS.regular,
  },
  // Compact variant
  compactCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    ...SHADOWS.soft,
    gap: SPACING.md,
  },
  compactImage: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.sm,
  },
  compactInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  compactName: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    ...FONTS.medium,
  },
  compactPrice: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.terracotta,
    ...FONTS.bold,
    marginTop: 4,
  },
});

export default ProductCard;
