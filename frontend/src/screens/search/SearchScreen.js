import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal,
  FlatList, ActivityIndicator, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, CATEGORIES, NEIGHBORHOODS, VIBE_TAGS } from '../../theme';
import { productAPI, shopAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../../components/common/SearchBar';
import ProductCard from '../../components/cards/ProductCard';
import ShopCard from '../../components/cards/ShopCard';
import CategoryPill from '../../components/common/CategoryPill';
import GradientButton from '../../components/common/GradientButton';
import EmptyState from '../../components/common/EmptyState';

const { width } = Dimensions.get('window');

const SearchScreen = ({ route, navigation }) => {
  const { user } = useAuth();
  const [query, setQuery] = useState(route.params?.query || '');
  const [tab, setTab] = useState(route.params?.tab || 'products');
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(route.params?.showFilters || false);

  // Filters
  const [category, setCategory] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [vibeTag, setVibeTag] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState(route.params?.sort || '');

  useEffect(() => {
    if (query || category || neighborhood || vibeTag) {
      handleSearch();
    }
  }, [tab, sort]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (tab === 'products') {
        const params = { search: query, category, neighborhood, vibeTag, minPrice, maxPrice, sort };
        const { data } = await productAPI.getAll(params);
        setProducts(data.products || []);
      } else {
        const params = { search: query, category, neighborhood, sort };
        const { data } = await shopAPI.getAll(params);
        setShops(data.shops || []);
      }
    } catch (err) {
      console.log('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (productId) => {
    try {
      await productAPI.toggleLike(productId);
      handleSearch();
    } catch (err) {
      console.log(err);
    }
  };

  const clearFilters = () => {
    setCategory(''); setNeighborhood(''); setVibeTag('');
    setMinPrice(''); setMaxPrice(''); setSort('');
  };

  return (
    <View style={styles.container}>
      {/* Search header */}
      <View style={styles.header}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder={tab === 'products' ? 'Search products...' : 'Search shops...'}
          onSubmit={handleSearch}
          onFilterPress={() => setShowFilters(true)}
        />

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, tab === 'products' && styles.activeTab]}
            onPress={() => setTab('products')}
          >
            <Text style={[styles.tabText, tab === 'products' && styles.activeTabText]}>Products</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'shops' && styles.activeTab]}
            onPress={() => setTab('shops')}
          >
            <Text style={[styles.tabText, tab === 'shops' && styles.activeTabText]}>Shops</Text>
          </TouchableOpacity>
        </View>

        {/* Quick category scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickFilters}>
          {CATEGORIES.map(cat => (
            <CategoryPill key={cat.id} label={cat.label} icon={cat.icon} small
              selected={category === cat.id}
              onPress={() => { setCategory(category === cat.id ? '' : cat.id); setTimeout(handleSearch, 100); }} />
          ))}
        </ScrollView>
      </View>

      {/* Results */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.terracotta} />
        </View>
      ) : tab === 'products' ? (
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          ListEmptyComponent={<EmptyState icon="search-outline" title="No products found" subtitle="Try a different search or filter" />}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
              onLike={() => handleLike(item._id)}
              isLiked={item.likes?.includes(user?._id)}
            />
          )}
        />
      ) : (
        <FlatList
          data={shops}
          keyExtractor={item => item._id}
          contentContainerStyle={{ padding: SPACING.lg }}
          ListEmptyComponent={<EmptyState icon="storefront-outline" title="No shops found" subtitle="Try a different search" />}
          renderItem={({ item }) => (
            <ShopCard shop={item} onPress={() => navigation.navigate('ShopProfile', { shopId: item._id })} />
          )}
        />
      )}

      {/* Filter Modal */}
      <Modal visible={showFilters} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <Text style={styles.filterLabel}>Neighborhood</Text>
              <View style={styles.filterWrap}>
                {NEIGHBORHOODS.map(n => (
                  <CategoryPill key={n} label={n} small
                    selected={neighborhood === n}
                    onPress={() => setNeighborhood(neighborhood === n ? '' : n)} />
                ))}
              </View>

              <Text style={styles.filterLabel}>Vibe</Text>
              <View style={styles.filterWrap}>
                {Object.entries(VIBE_TAGS).map(([key, val]) => (
                  <CategoryPill key={key} label={key} emoji={val.emoji} small
                    selected={vibeTag === key}
                    onPress={() => setVibeTag(vibeTag === key ? '' : key)} />
                ))}
              </View>

              <Text style={styles.filterLabel}>Sort By</Text>
              <View style={styles.filterWrap}>
                {[
                  { id: '', label: 'Newest' },
                  { id: 'popular', label: 'Popular' },
                  { id: 'price_asc', label: 'Price: Low' },
                  { id: 'price_desc', label: 'Price: High' },
                ].map(s => (
                  <CategoryPill key={s.id} label={s.label} small
                    selected={sort === s.id} onPress={() => setSort(s.id)} />
                ))}
              </View>

              <View style={styles.filterActions}>
                <TouchableOpacity onPress={clearFilters}>
                  <Text style={styles.clearText}>Clear All</Text>
                </TouchableOpacity>
                <GradientButton title="Apply Filters" small
                  onPress={() => { setShowFilters(false); handleSearch(); }} />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 50, backgroundColor: COLORS.white, ...SHADOWS.soft },
  tabs: { flexDirection: 'row', marginTop: SPACING.md, paddingHorizontal: SPACING.lg },
  tab: { flex: 1, alignItems: 'center', paddingVertical: SPACING.md, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: COLORS.terracotta },
  tabText: { fontSize: FONTS.sizes.md, color: COLORS.warmGray, ...FONTS.medium },
  activeTabText: { color: COLORS.terracotta, ...FONTS.semibold },
  quickFilters: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  grid: { padding: SPACING.lg },
  modalOverlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: COLORS.white, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl, maxHeight: '80%',
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xl },
  modalTitle: { fontSize: FONTS.sizes.xl, color: COLORS.textPrimary, ...FONTS.bold },
  filterLabel: { fontSize: FONTS.sizes.md, color: COLORS.textPrimary, ...FONTS.semibold, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  filterWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  filterActions: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: SPACING.xxl, paddingBottom: SPACING.xl,
  },
  clearText: { fontSize: FONTS.sizes.md, color: COLORS.terracotta, ...FONTS.medium },
});

export default SearchScreen;
