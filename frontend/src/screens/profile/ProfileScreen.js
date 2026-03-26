import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Image,
  Alert, FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, NEIGHBORHOODS } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { shopAPI, productAPI, authAPI } from '../../api';
import ProductCard from '../../components/cards/ProductCard';
import GradientButton from '../../components/common/GradientButton';
import EmptyState from '../../components/common/EmptyState';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, refreshUser } = useAuth();
  const [myShop, setMyShop] = useState(null);
  const [myProducts, setMyProducts] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('saved'); // saved, shop, settings

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      await refreshUser();

      // Load saved products
      try {
        const { data } = await authAPI.getMe();
        setSavedProducts(data.savedProducts || []);
      } catch (e) {}

      // Load my shop if seller
      if (user?.role === 'seller') {
        try {
          const { data } = await shopAPI.getMyShop();
          setMyShop(data.shop);
          setMyProducts(data.products || []);
        } catch (e) {}
      }
    } catch (err) {
      console.log('Profile load error:', err);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View style={styles.header}>
          <View style={styles.profileTop}>
            <View style={styles.avatarWrap}>
              {user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitial}>
                    {user?.name?.charAt(0)?.toUpperCase() || '?'}
                  </Text>
                </View>
              )}
              <View style={[styles.roleBadge, user?.role === 'seller' ? styles.sellerBadge : styles.buyerBadge]}>
                <Ionicons
                  name={user?.role === 'seller' ? 'storefront' : 'bag-handle'}
                  size={12}
                  color={COLORS.white}
                />
              </View>
            </View>

            <Text style={styles.name}>{user?.name || 'User'}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            {user?.neighborhood && (
              <View style={styles.locationRow}>
                <Ionicons name="location" size={14} color={COLORS.terracotta} />
                <Text style={styles.neighborhood}>{user.neighborhood}</Text>
              </View>
            )}
          </View>

          {/* Quick stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{savedProducts.length}</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{user?.followingShops?.length || 0}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            {user?.role === 'seller' && (
              <>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNum}>{myProducts.length}</Text>
                  <Text style={styles.statLabel}>Products</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
            onPress={() => setActiveTab('saved')}
          >
            <Ionicons name="heart-outline" size={20}
              color={activeTab === 'saved' ? COLORS.terracotta : COLORS.warmGray} />
            <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>Saved</Text>
          </TouchableOpacity>

          {user?.role === 'seller' && (
            <TouchableOpacity
              style={[styles.tab, activeTab === 'shop' && styles.activeTab]}
              onPress={() => setActiveTab('shop')}
            >
              <Ionicons name="storefront-outline" size={20}
                color={activeTab === 'shop' ? COLORS.terracotta : COLORS.warmGray} />
              <Text style={[styles.tabText, activeTab === 'shop' && styles.activeTabText]}>My Shop</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
            onPress={() => setActiveTab('settings')}
          >
            <Ionicons name="settings-outline" size={20}
              color={activeTab === 'settings' ? COLORS.terracotta : COLORS.warmGray} />
            <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Tab content */}
        <View style={styles.tabContent}>
          {activeTab === 'saved' && (
            savedProducts.length > 0 ? (
              <View style={styles.productsGrid}>
                {savedProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onPress={() => navigation.navigate('ProductDetail', { productId: product._id })}
                    isLiked={true}
                  />
                ))}
              </View>
            ) : (
              <EmptyState icon="heart-outline" title="No saved items"
                subtitle="Like products to save them here" />
            )
          )}

          {activeTab === 'shop' && (
            <View>
              {myShop ? (
                <>
                  <TouchableOpacity
                    style={styles.myShopCard}
                    onPress={() => navigation.navigate('ShopProfile', { shopId: myShop._id })}
                  >
                    <Image source={{ uri: myShop.profileImage || 'https://via.placeholder.com/60' }}
                      style={styles.myShopImage} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.myShopName}>{myShop.name}</Text>
                      <Text style={styles.myShopCategory}>{myShop.category} - {myShop.neighborhood}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.warmGray} />
                  </TouchableOpacity>

                  <GradientButton
                    title="Add New Product"
                    onPress={() => navigation.navigate('AddProduct')}
                    icon={<Ionicons name="add" size={20} color={COLORS.white} />}
                    style={{ marginBottom: SPACING.xl }}
                  />

                  {myProducts.length > 0 ? (
                    <View style={styles.productsGrid}>
                      {myProducts.map((product) => (
                        <ProductCard
                          key={product._id}
                          product={product}
                          onPress={() => navigation.navigate('ProductDetail', { productId: product._id })}
                        />
                      ))}
                    </View>
                  ) : (
                    <EmptyState icon="cube-outline" title="No products yet"
                      subtitle="Add your first product to start selling" />
                  )}
                </>
              ) : (
                <View style={styles.noShop}>
                  <Ionicons name="storefront-outline" size={60} color={COLORS.sandDark} />
                  <Text style={styles.noShopTitle}>Create Your Shop</Text>
                  <Text style={styles.noShopDesc}>Open your digital storefront and start selling</Text>
                  <GradientButton
                    title="Create Shop"
                    onPress={() => navigation.navigate('CreateShop')}
                    style={{ marginTop: SPACING.xl }}
                  />
                </View>
              )}
            </View>
          )}

          {activeTab === 'settings' && (
            <View style={styles.settingsList}>
              {user?.role === 'buyer' && (
                <TouchableOpacity style={styles.settingItem}
                  onPress={() => navigation.navigate('CreateShop')}>
                  <Ionicons name="storefront-outline" size={22} color={COLORS.terracotta} />
                  <Text style={styles.settingText}>Become a Seller</Text>
                  <Ionicons name="chevron-forward" size={18} color={COLORS.warmGray} />
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="person-outline" size={22} color={COLORS.terracotta} />
                <Text style={styles.settingText}>Edit Profile</Text>
                <Ionicons name="chevron-forward" size={18} color={COLORS.warmGray} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="notifications-outline" size={22} color={COLORS.terracotta} />
                <Text style={styles.settingText}>Notifications</Text>
                <Ionicons name="chevron-forward" size={18} color={COLORS.warmGray} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="information-circle-outline" size={22} color={COLORS.terracotta} />
                <Text style={styles.settingText}>About Men Amman</Text>
                <Ionicons name="chevron-forward" size={18} color={COLORS.warmGray} />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.settingItem, styles.logoutItem]} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={22} color={COLORS.error} />
                <Text style={[styles.settingText, { color: COLORS.error }]}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 50, paddingBottom: SPACING.xl, backgroundColor: COLORS.white, ...SHADOWS.soft },
  profileTop: { alignItems: 'center', paddingHorizontal: SPACING.xl },
  avatarWrap: { position: 'relative', marginBottom: SPACING.md },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: COLORS.terracotta },
  avatarPlaceholder: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.sand,
    alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: COLORS.terracotta,
  },
  avatarInitial: { fontSize: 30, color: COLORS.terracotta, ...FONTS.bold },
  roleBadge: {
    position: 'absolute', bottom: 0, right: -2,
    width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: COLORS.white,
  },
  sellerBadge: { backgroundColor: COLORS.terracotta },
  buyerBadge: { backgroundColor: COLORS.olive },
  name: { fontSize: FONTS.sizes.xxl, color: COLORS.textPrimary, ...FONTS.bold },
  email: { fontSize: FONTS.sizes.sm, color: COLORS.warmGray, marginTop: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: SPACING.sm },
  neighborhood: { fontSize: FONTS.sizes.sm, color: COLORS.terracotta, ...FONTS.medium },
  statsRow: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    marginTop: SPACING.xl, marginHorizontal: SPACING.xl,
    backgroundColor: COLORS.sandLight, padding: SPACING.lg, borderRadius: RADIUS.lg,
  },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: FONTS.sizes.xl, color: COLORS.textPrimary, ...FONTS.bold },
  statLabel: { fontSize: FONTS.sizes.xs, color: COLORS.warmGray, marginTop: 4 },
  statDivider: { width: 1, height: 30, backgroundColor: COLORS.border },
  tabs: {
    flexDirection: 'row', backgroundColor: COLORS.white,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: SPACING.md, borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  activeTab: { borderBottomColor: COLORS.terracotta },
  tabText: { fontSize: FONTS.sizes.sm, color: COLORS.warmGray, ...FONTS.medium },
  activeTabText: { color: COLORS.terracotta },
  tabContent: { padding: SPACING.lg },
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  myShopCard: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.card, padding: SPACING.lg, borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg, ...SHADOWS.soft,
  },
  myShopImage: { width: 50, height: 50, borderRadius: RADIUS.md },
  myShopName: { fontSize: FONTS.sizes.md, color: COLORS.textPrimary, ...FONTS.semibold },
  myShopCategory: { fontSize: FONTS.sizes.xs, color: COLORS.warmGray, marginTop: 2 },
  noShop: { alignItems: 'center', paddingVertical: SPACING.xxxl, gap: SPACING.md },
  noShopTitle: { fontSize: FONTS.sizes.xl, color: COLORS.textPrimary, ...FONTS.bold },
  noShopDesc: { fontSize: FONTS.sizes.md, color: COLORS.warmGray, textAlign: 'center' },
  settingsList: { gap: 2 },
  settingItem: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.card, padding: SPACING.lg, borderRadius: RADIUS.md,
    marginBottom: SPACING.sm, ...SHADOWS.soft,
  },
  settingText: { flex: 1, fontSize: FONTS.sizes.md, color: COLORS.textPrimary, ...FONTS.medium },
  logoutItem: { marginTop: SPACING.xl, borderWidth: 1, borderColor: COLORS.error + '30' },
});

export default ProfileScreen;
