import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, FlatList, StyleSheet, RefreshControl,
  TouchableOpacity, Image, Dimensions, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, CATEGORIES } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { productAPI, shopAPI, dropAPI, storyAPI } from '../../api';
import ProductCard from '../../components/cards/ProductCard';
import ShopCard from '../../components/cards/ShopCard';
import StoryCircle from '../../components/cards/StoryCircle';
import DropCard from '../../components/cards/DropCard';
import SearchBar from '../../components/common/SearchBar';
import CategoryPill from '../../components/common/CategoryPill';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [feed, setFeed] = useState([]);
  const [trending, setTrending] = useState([]);
  const [featuredShops, setFeaturedShops] = useState([]);
  const [newShops, setNewShops] = useState([]);
  const [drops, setDrops] = useState([]);
  const [stories, setStories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;

      const [feedRes, trendingRes, featuredRes, newRes, dropsRes, storiesRes] = await Promise.allSettled([
        productAPI.getFeed(params),
        productAPI.getTrending(),
        shopAPI.getFeatured(),
        shopAPI.getNew(),
        dropAPI.getAll(),
        storyAPI.getAll(),
      ]);

      if (feedRes.status === 'fulfilled') setFeed(feedRes.value.data.products || []);
      if (trendingRes.status === 'fulfilled') setTrending(trendingRes.value.data || []);
      if (featuredRes.status === 'fulfilled') setFeaturedShops(featuredRes.value.data || []);
      if (newRes.status === 'fulfilled') setNewShops(newRes.value.data || []);
      if (dropsRes.status === 'fulfilled') setDrops(dropsRes.value.data || []);
      if (storiesRes.status === 'fulfilled') setStories(storiesRes.value.data || []);
    } catch (err) {
      console.log('Load error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadData(); }, [selectedCategory]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [selectedCategory]);

  const handleLike = async (productId) => {
    try {
      await productAPI.toggleLike(productId);
      loadData();
    } catch (err) {
      console.log('Like error:', err);
    }
  };

  const SectionHeader = ({ title, titleAr, onSeeAll }) => (
    <View style={styles.sectionHeader}>
      <View>
        <Text style={styles.sectionTitle}>{title}</Text>
        {titleAr && <Text style={styles.sectionTitleAr}>{titleAr}</Text>}
      </View>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.terracotta} />
        <Text style={styles.loadingText}>Loading the souq...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.terracotta} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient colors={[COLORS.terracotta, COLORS.terracottaDark]} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Marhaba{user?.name ? `, ${user.name.split(' ')[0]}` : ''} </Text>
              <Text style={styles.headerSubtitle}>Discover Amman's hidden gems</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
              style={styles.avatarBtn}
            >
              {user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.headerAvatar} />
              ) : (
                <View style={styles.headerAvatarPlaceholder}>
                  <Ionicons name="person" size={20} color={COLORS.terracotta} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search shops, products..."
            onSubmit={() => navigation.navigate('Search', { query: searchQuery })}
            onFilterPress={() => navigation.navigate('Search', { showFilters: true })}
            style={{ paddingHorizontal: 0, marginTop: SPACING.lg }}
          />
        </LinearGradient>

        {/* Stories */}
        {stories.length > 0 && (
          <View style={styles.storiesSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.lg }}>
              {stories.map((item) => (
                <StoryCircle
                  key={item.shop._id}
                  shop={item.shop}
                  hasStory={true}
                  onPress={() => navigation.navigate('ShopProfile', { shopId: item.shop._id })}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          <CategoryPill
            label="All"
            selected={!selectedCategory}
            onPress={() => setSelectedCategory(null)}
          />
          {CATEGORIES.map((cat) => (
            <CategoryPill
              key={cat.id}
              label={cat.label}
              icon={cat.icon}
              selected={selectedCategory === cat.id}
              onPress={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
            />
          ))}
        </ScrollView>

        {/* Drops */}
        {drops.length > 0 && (
          <View>
            <SectionHeader title="Fresh Drops" titleAr="جديد" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: SPACING.lg }}
            >
              {drops.map((drop) => (
                <DropCard
                  key={drop._id}
                  drop={drop}
                  onPress={() => navigation.navigate('ShopProfile', { shopId: drop.shop?._id })}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Featured Shops */}
        {featuredShops.length > 0 && (
          <View style={{ marginTop: SPACING.xl }}>
            <SectionHeader
              title="Featured Shops"
              titleAr="متاجر مميزة"
              onSeeAll={() => navigation.navigate('Search', { tab: 'shops' })}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: SPACING.lg }}
            >
              {featuredShops.map((shop) => (
                <ShopCard
                  key={shop._id}
                  shop={shop}
                  variant="featured"
                  onPress={() => navigation.navigate('ShopProfile', { shopId: shop._id })}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Trending Products */}
        {trending.length > 0 && (
          <View style={{ marginTop: SPACING.xl }}>
            <SectionHeader
              title="Trending Now"
              titleAr="رائج الآن"
              onSeeAll={() => navigation.navigate('Search', { sort: 'trending' })}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: SPACING.lg }}
            >
              {trending.slice(0, 6).map((product) => (
                <View key={product._id} style={{ width: (width - SPACING.lg * 3) / 2, marginRight: SPACING.md }}>
                  <ProductCard
                    product={product}
                    onPress={() => navigation.navigate('ProductDetail', { productId: product._id })}
                    onLike={() => handleLike(product._id)}
                    isLiked={product.likes?.includes(user?._id)}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* New Shops */}
        {newShops.length > 0 && (
          <View style={{ marginTop: SPACING.xl }}>
            <SectionHeader
              title="New on the Block"
              titleAr="متاجر جديدة"
              onSeeAll={() => navigation.navigate('Search', { tab: 'shops', sort: 'new' })}
            />
            <View style={{ paddingHorizontal: SPACING.lg }}>
              {newShops.slice(0, 3).map((shop) => (
                <ShopCard
                  key={shop._id}
                  shop={shop}
                  onPress={() => navigation.navigate('ShopProfile', { shopId: shop._id })}
                />
              ))}
            </View>
          </View>
        )}

        {/* Main Feed */}
        <View style={{ marginTop: SPACING.xl }}>
          <SectionHeader title="Explore" titleAr="استكشف" />
          <View style={styles.feedGrid}>
            {feed.map((product) => (
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
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    gap: SPACING.md,
  },
  loadingText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.warmGray,
    ...FONTS.medium,
  },
  header: {
    paddingTop: 50,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: FONTS.sizes.xxl,
    color: COLORS.white,
    ...FONTS.bold,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255,255,255,0.8)',
    ...FONTS.regular,
    marginTop: 4,
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  headerAvatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storiesSection: {
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoriesScroll: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xl,
    color: COLORS.textPrimary,
    ...FONTS.bold,
  },
  sectionTitleAr: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.warmGray,
    ...FONTS.regular,
    marginTop: 2,
  },
  seeAll: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.terracotta,
    ...FONTS.semibold,
  },
  feedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
  },
});

export default HomeScreen;
