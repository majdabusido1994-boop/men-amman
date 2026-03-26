import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, Image, StyleSheet, TouchableOpacity,
  Dimensions, ActivityIndicator, Linking, FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, CULTURAL_TAGS, VIBE_TAGS } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { productAPI, messageAPI } from '../../api';
import GradientButton from '../../components/common/GradientButton';
import CulturalTag from '../../components/common/CulturalTag';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const { data } = await productAPI.getById(productId);
      setProduct(data);
      setIsLiked(data.likes?.includes(user?._id));
    } catch (err) {
      console.log('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const { data } = await productAPI.toggleLike(productId);
      setIsLiked(data.isLiked);
    } catch (err) {
      console.log('Like error:', err);
    }
  };

  const handleMessage = async () => {
    try {
      const { data } = await messageAPI.createConversation({
        recipientId: product.shop.owner._id || product.shop.owner,
        productId: product._id,
        shopId: product.shop._id,
      });
      navigation.navigate('Chat', { conversation: data, product });
    } catch (err) {
      console.log('Message error:', err);
    }
  };

  const handleMakeOffer = async () => {
    try {
      const { data } = await messageAPI.createConversation({
        recipientId: product.shop.owner._id || product.shop.owner,
        productId: product._id,
        shopId: product.shop._id,
        isOffer: true,
      });
      navigation.navigate('Chat', { conversation: data, product, isOffer: true });
    } catch (err) {
      console.log('Offer error:', err);
    }
  };

  const handleCustomOrder = async () => {
    try {
      const { data } = await messageAPI.createConversation({
        recipientId: product.shop.owner._id || product.shop.owner,
        productId: product._id,
        shopId: product.shop._id,
        isCustomOrder: true,
      });
      navigation.navigate('Chat', { conversation: data, product, isCustomOrder: true });
    } catch (err) {
      console.log('Custom order error:', err);
    }
  };

  const openWhatsApp = () => {
    if (product?.shop?.whatsapp) {
      Linking.openURL(`https://wa.me/${product.shop.whatsapp.replace(/[^0-9]/g, '')}?text=Hi! I'm interested in "${product.name}" from Men Amman`);
    }
  };

  const openInstagram = () => {
    if (product?.shop?.instagram) {
      const handle = product.shop.instagram.replace('@', '');
      Linking.openURL(`https://instagram.com/${handle}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.terracotta} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Product not found</Text>
      </View>
    );
  }

  const vibeInfo = product.vibeTag ? VIBE_TAGS[product.vibeTag] : null;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image carousel */}
        <View style={styles.imageSection}>
          <FlatList
            data={product.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              setActiveImage(Math.round(e.nativeEvent.contentOffset.x / width));
            }}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.mainImage} />
            )}
            keyExtractor={(item, i) => i.toString()}
          />

          {/* Back button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>

          {/* Like button */}
          <TouchableOpacity style={styles.likeBtn} onPress={handleLike}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={26}
              color={isLiked ? COLORS.error : COLORS.white}
            />
          </TouchableOpacity>

          {/* Image dots */}
          {product.images.length > 1 && (
            <View style={styles.dots}>
              {product.images.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === activeImage && styles.activeDot]}
                />
              ))}
            </View>
          )}

          {/* Badges */}
          <View style={styles.badges}>
            {product.isDrop && (
              <View style={[styles.badge, { backgroundColor: COLORS.terracotta }]}>
                <Ionicons name="flame" size={12} color={COLORS.white} />
                <Text style={styles.badgeText}>NEW DROP</Text>
              </View>
            )}
            {product.isLimited && (
              <View style={[styles.badge, { backgroundColor: COLORS.gold }]}>
                <Text style={styles.badgeText}>LIMITED</Text>
              </View>
            )}
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          <View style={styles.nameRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{product.name}</Text>
              {product.nameAr ? <Text style={styles.nameAr}>{product.nameAr}</Text> : null}
            </View>
            <Text style={styles.price}>{product.price} JOD</Text>
          </View>

          {/* Rating */}
          {product.rating > 0 && (
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= product.rating ? 'star' : 'star-outline'}
                  size={18}
                  color={COLORS.gold}
                />
              ))}
              <Text style={styles.ratingText}>({product.ratingCount})</Text>
            </View>
          )}

          {/* Vibe tag */}
          {vibeInfo && (
            <View style={[styles.vibeTag, { backgroundColor: vibeInfo.color + '15' }]}>
              <Text style={styles.vibeEmoji}>{vibeInfo.emoji}</Text>
              <Text style={[styles.vibeText, { color: vibeInfo.color }]}>{product.vibeTag}</Text>
            </View>
          )}

          {/* Cultural tags */}
          {product.culturalTags?.length > 0 && (
            <View style={styles.culturalTags}>
              {product.culturalTags.map((tag) => {
                const tagInfo = CULTURAL_TAGS.find(t => t.id === tag);
                return <CulturalTag key={tag} tag={tag} emoji={tagInfo?.emoji} />;
              })}
            </View>
          )}

          {/* Description */}
          <Text style={styles.description}>{product.description}</Text>

          {/* Shop info */}
          <TouchableOpacity
            style={styles.shopCard}
            onPress={() => navigation.navigate('ShopProfile', { shopId: product.shop._id })}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: product.shop.profileImage || 'https://via.placeholder.com/60' }}
              style={styles.shopAvatar}
            />
            <View style={{ flex: 1 }}>
              <View style={styles.shopNameRow}>
                <Text style={styles.shopName}>{product.shop.name}</Text>
                {product.shop.isVerified && (
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.terracotta} />
                )}
              </View>
              <Text style={styles.shopNeighborhood}>{product.shop.neighborhood}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.warmGray} />
          </TouchableOpacity>

          {/* External links */}
          <View style={styles.externalLinks}>
            {product.shop.whatsapp && (
              <TouchableOpacity style={styles.externalBtn} onPress={openWhatsApp}>
                <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                <Text style={styles.externalText}>WhatsApp</Text>
              </TouchableOpacity>
            )}
            {product.shop.instagram && (
              <TouchableOpacity style={styles.externalBtn} onPress={openInstagram}>
                <Ionicons name="logo-instagram" size={20} color="#E4405F" />
                <Text style={styles.externalText}>Instagram</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="heart" size={16} color={COLORS.warmGray} />
              <Text style={styles.statText}>{product.likesCount || 0} likes</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="eye" size={16} color={COLORS.warmGray} />
              <Text style={styles.statText}>{product.viewCount || 0} views</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom action bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.messageBtn} onPress={handleMessage}>
          <Ionicons name="chatbubble-outline" size={22} color={COLORS.terracotta} />
        </TouchableOpacity>

        {product.allowOffers && (
          <TouchableOpacity style={styles.offerBtn} onPress={handleMakeOffer}>
            <Text style={styles.offerBtnText}>Make an Offer</Text>
          </TouchableOpacity>
        )}

        {product.allowCustomOrders && (
          <GradientButton
            title="Custom Order"
            onPress={handleCustomOrder}
            small
            style={{ flex: 1 }}
          />
        )}

        {!product.allowOffers && !product.allowCustomOrders && (
          <GradientButton
            title="Message Seller"
            onPress={handleMessage}
            style={{ flex: 1 }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background },
  imageSection: { position: 'relative' },
  mainImage: { width, height: width * 1.1 },
  backBtn: {
    position: 'absolute', top: 50, left: SPACING.lg,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center',
  },
  likeBtn: {
    position: 'absolute', top: 50, right: SPACING.lg,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center',
  },
  dots: {
    position: 'absolute', bottom: SPACING.lg,
    flexDirection: 'row', alignSelf: 'center', gap: 6,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
  activeDot: { backgroundColor: COLORS.white, width: 20 },
  badges: { position: 'absolute', bottom: SPACING.lg, left: SPACING.lg, flexDirection: 'row', gap: SPACING.sm },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.sm, gap: 4 },
  badgeText: { color: COLORS.white, fontSize: 10, ...FONTS.bold, letterSpacing: 1 },
  infoSection: { padding: SPACING.xl },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  name: { fontSize: FONTS.sizes.xxl, color: COLORS.textPrimary, ...FONTS.bold, flex: 1 },
  nameAr: { fontSize: FONTS.sizes.md, color: COLORS.warmGray, ...FONTS.regular, marginTop: 4 },
  price: { fontSize: FONTS.sizes.xxl, color: COLORS.terracotta, ...FONTS.bold },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: SPACING.md },
  ratingText: { fontSize: FONTS.sizes.sm, color: COLORS.warmGray, marginLeft: 4 },
  vibeTag: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: RADIUS.full, gap: 6, marginTop: SPACING.md,
  },
  vibeEmoji: { fontSize: 16 },
  vibeText: { fontSize: FONTS.sizes.sm, ...FONTS.medium },
  culturalTags: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.md },
  description: { fontSize: FONTS.sizes.md, color: COLORS.textPrimary, ...FONTS.regular, lineHeight: 24, marginTop: SPACING.xl },
  shopCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card,
    padding: SPACING.lg, borderRadius: RADIUS.lg, marginTop: SPACING.xl, gap: SPACING.md, ...SHADOWS.soft,
  },
  shopAvatar: { width: 48, height: 48, borderRadius: RADIUS.md },
  shopNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  shopName: { fontSize: FONTS.sizes.md, color: COLORS.textPrimary, ...FONTS.semibold },
  shopNeighborhood: { fontSize: FONTS.sizes.xs, color: COLORS.warmGray, ...FONTS.regular, marginTop: 2 },
  externalLinks: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.lg },
  externalBtn: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.card, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.full, ...SHADOWS.soft,
  },
  externalText: { fontSize: FONTS.sizes.sm, color: COLORS.textPrimary, ...FONTS.medium },
  statsRow: { flexDirection: 'row', gap: SPACING.xl, marginTop: SPACING.xl },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  statText: { fontSize: FONTS.sizes.sm, color: COLORS.warmGray },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.lg, paddingBottom: 34,
    backgroundColor: COLORS.white, ...SHADOWS.strong,
  },
  messageBtn: {
    width: 48, height: 48, borderRadius: RADIUS.md,
    borderWidth: 2, borderColor: COLORS.terracotta,
    alignItems: 'center', justifyContent: 'center',
  },
  offerBtn: {
    flex: 1, height: 48, borderRadius: RADIUS.xl,
    backgroundColor: COLORS.sand, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.terracotta,
  },
  offerBtnText: { fontSize: FONTS.sizes.md, color: COLORS.terracotta, ...FONTS.semibold },
});

export default ProductDetailScreen;
