import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, Image, StyleSheet, TouchableOpacity,
  Dimensions, ActivityIndicator, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, CULTURAL_TAGS } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { shopAPI, productAPI } from '../../api';
import ProductCard from '../../components/cards/ProductCard';
import GradientButton from '../../components/common/GradientButton';
import CulturalTag from '../../components/common/CulturalTag';

const { width } = Dimensions.get('window');

const ShopProfileScreen = ({ route, navigation }) => {
  const { shopId } = route.params;
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => { loadShop(); }, [shopId]);

  const loadShop = async () => {
    try {
      const { data } = await shopAPI.getById(shopId);
      setShop(data.shop);
      setProducts(data.products || []);
      setIsFollowing(data.shop.followers?.includes(user?._id));
    } catch (err) {
      console.log('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      const { data } = await shopAPI.toggleFollow(shopId);
      setIsFollowing(data.isFollowing);
      setShop(prev => ({ ...prev, followersCount: data.followersCount }));
    } catch (err) {
      console.log('Follow error:', err);
    }
  };

  const handleLike = async (productId) => {
    try {
      await productAPI.toggleLike(productId);
      loadShop();
    } catch (err) {
      console.log('Like error:', err);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.terracotta} />
      </View>
    );
  }

  if (!shop) return null;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover + Profile */}
        <View style={styles.coverSection}>
          <Image
            source={{ uri: shop.coverImage || shop.profileImage || 'https://via.placeholder.com/800' }}
            style={styles.coverImage}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={styles.coverOverlay}
          />

          {/* Back & Options */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.topBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.topBtn}>
              <Ionicons name="ellipsis-horizontal" size={22} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Profile avatar */}
          <View style={styles.profileSection}>
            <Image
              source={{ uri: shop.profileImage || 'https://via.placeholder.com/120' }}
              style={styles.profileImage}
            />
          </View>
        </View>

        {/* Shop Info */}
        <View style={styles.infoSection}>
          <View style={styles.nameRow}>
            <Text style={styles.shopName}>{shop.name}</Text>
            {shop.isVerified && (
              <Ionicons name="checkmark-circle" size={20} color={COLORS.terracotta} />
            )}
          </View>
          {shop.nameAr ? <Text style={styles.shopNameAr}>{shop.nameAr}</Text> : null}

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={14} color={COLORS.warmGray} />
              <Text style={styles.metaText}>{shop.neighborhood}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="pricetag-outline" size={14} color={COLORS.warmGray} />
              <Text style={styles.metaText}>{shop.category}</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{shop.followersCount || 0}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{products.length}</Text>
              <Text style={styles.statLabel}>Products</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{shop.rating > 0 ? shop.rating : '-'}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>

          {/* Follow + Message buttons */}
          <View style={styles.actionsRow}>
            <GradientButton
              title={isFollowing ? 'Following' : 'Follow'}
              onPress={handleFollow}
              variant={isFollowing ? 'outline' : 'primary'}
              small
              style={{ flex: 1 }}
            />
            <TouchableOpacity
              style={styles.msgButton}
              onPress={() => navigation.navigate('Chat', {
                conversation: null,
                recipientId: shop.owner?._id || shop.owner,
                shopId: shop._id,
              })}
            >
              <Ionicons name="chatbubble-outline" size={20} color={COLORS.terracotta} />
            </TouchableOpacity>
          </View>

          {/* Description */}
          <Text style={styles.description}>{shop.description}</Text>

          {/* Cultural tags */}
          {shop.culturalTags?.length > 0 && (
            <View style={styles.culturalTags}>
              {shop.culturalTags.map((tag) => {
                const tagInfo = CULTURAL_TAGS.find(t => t.id === tag);
                return <CulturalTag key={tag} tag={tag} emoji={tagInfo?.emoji} />;
              })}
            </View>
          )}

          {/* Social links */}
          <View style={styles.socialLinks}>
            {shop.instagram && (
              <TouchableOpacity
                style={styles.socialBtn}
                onPress={() => Linking.openURL(`https://instagram.com/${shop.instagram.replace('@', '')}`)}
              >
                <Ionicons name="logo-instagram" size={18} color="#E4405F" />
                <Text style={styles.socialText}>{shop.instagram}</Text>
              </TouchableOpacity>
            )}
            {shop.whatsapp && (
              <TouchableOpacity
                style={styles.socialBtn}
                onPress={() => Linking.openURL(`https://wa.me/${shop.whatsapp.replace(/[^0-9]/g, '')}`)}
              >
                <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
                <Text style={styles.socialText}>WhatsApp</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Products grid */}
        <View style={styles.productsSection}>
          <Text style={styles.productsTitle}>Products ({products.length})</Text>
          <View style={styles.productsGrid}>
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onPress={() => navigation.navigate('ProductDetail', { productId: product._id })}
                onLike={() => handleLike(product._id)}
                isLiked={product.likes?.includes(user?._id)}
              />
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background },
  coverSection: { position: 'relative', height: 240 },
  coverImage: { width: '100%', height: '100%' },
  coverOverlay: { ...StyleSheet.absoluteFillObject },
  topBar: {
    position: 'absolute', top: 50, left: SPACING.lg, right: SPACING.lg,
    flexDirection: 'row', justifyContent: 'space-between',
  },
  topBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center',
  },
  profileSection: {
    position: 'absolute', bottom: -40, alignSelf: 'center',
  },
  profileImage: {
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 3, borderColor: COLORS.white, ...SHADOWS.medium,
  },
  infoSection: { paddingTop: 50, paddingHorizontal: SPACING.xl, alignItems: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  shopName: { fontSize: FONTS.sizes.xxl, color: COLORS.textPrimary, ...FONTS.bold },
  shopNameAr: { fontSize: FONTS.sizes.md, color: COLORS.warmGray, ...FONTS.regular, marginTop: 4 },
  metaRow: { flexDirection: 'row', gap: SPACING.lg, marginTop: SPACING.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: FONTS.sizes.sm, color: COLORS.warmGray, ...FONTS.regular },
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.card, padding: SPACING.lg, borderRadius: RADIUS.lg,
    marginTop: SPACING.xl, ...SHADOWS.soft, width: '100%', justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: FONTS.sizes.xl, color: COLORS.textPrimary, ...FONTS.bold },
  statLabel: { fontSize: FONTS.sizes.xs, color: COLORS.warmGray, ...FONTS.regular, marginTop: 4 },
  statDivider: { width: 1, height: 30, backgroundColor: COLORS.border },
  actionsRow: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.lg, width: '100%' },
  msgButton: {
    width: 48, height: 48, borderRadius: RADIUS.md,
    borderWidth: 2, borderColor: COLORS.terracotta,
    alignItems: 'center', justifyContent: 'center',
  },
  description: {
    fontSize: FONTS.sizes.md, color: COLORS.textPrimary, ...FONTS.regular,
    lineHeight: 24, marginTop: SPACING.xl, textAlign: 'center',
  },
  culturalTags: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.lg, justifyContent: 'center' },
  socialLinks: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.lg },
  socialBtn: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.card, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.full, ...SHADOWS.soft,
  },
  socialText: { fontSize: FONTS.sizes.sm, color: COLORS.textPrimary, ...FONTS.medium },
  productsSection: { paddingHorizontal: SPACING.lg, marginTop: SPACING.xxl },
  productsTitle: { fontSize: FONTS.sizes.xl, color: COLORS.textPrimary, ...FONTS.bold, marginBottom: SPACING.lg },
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});

export default ShopProfileScreen;
