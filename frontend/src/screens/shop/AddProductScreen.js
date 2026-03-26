import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, CATEGORIES, CULTURAL_TAGS, VIBE_TAGS } from '../../theme';
import { productAPI } from '../../api';
import Input from '../../components/common/Input';
import GradientButton from '../../components/common/GradientButton';
import Header from '../../components/common/Header';
import CategoryPill from '../../components/common/CategoryPill';

const AddProductScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    name: '', nameAr: '', description: '', price: '',
    category: '', vibeTag: '', culturalTags: [],
    allowOffers: false, allowCustomOrders: false,
    isDrop: false, isLimited: false,
  });

  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const toggleField = (key) => setForm(prev => ({ ...prev, [key]: !prev[key] }));

  const toggleCulturalTag = (tagId) => {
    setForm(prev => ({
      ...prev,
      culturalTags: prev.culturalTags.includes(tagId)
        ? prev.culturalTags.filter(t => t !== tagId)
        : [...prev.culturalTags, tagId],
    }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages(prev => [...prev, ...result.assets.map(a => a.uri)].slice(0, 5));
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (!form.name || !form.description || !form.price || !form.category) {
      Alert.alert('Missing Info', 'Please fill in name, description, price, and category');
      return;
    }

    setLoading(true);
    try {
      const productData = {
        ...form,
        price: parseFloat(form.price),
        images: images.length > 0 ? images : ['https://via.placeholder.com/400'],
      };

      await productAPI.create(productData);
      Alert.alert('Product Added!', 'Your product is now live', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Add Product" titleAr="أضف منتج" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Images */}
        <Text style={styles.fieldLabel}>Photos (up to 5)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.lg }}>
          <TouchableOpacity style={styles.addImageBtn} onPress={pickImage}>
            <Ionicons name="camera-outline" size={28} color={COLORS.terracotta} />
            <Text style={styles.addImageText}>Add Photo</Text>
          </TouchableOpacity>
          {images.map((uri, i) => (
            <View key={i} style={styles.imageThumb}>
              <Image source={{ uri }} style={styles.thumbImage} />
              <TouchableOpacity style={styles.removeBtn} onPress={() => removeImage(i)}>
                <Ionicons name="close" size={16} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <Input label="Product Name *" value={form.name} onChangeText={v => updateForm('name', v)}
          placeholder="e.g., Classic Tote Bag" />

        <Input label="Product Name (Arabic)" value={form.nameAr} onChangeText={v => updateForm('nameAr', v)}
          placeholder="مثال: حقيبة توت كلاسيكية" />

        <Input label="Description *" value={form.description} onChangeText={v => updateForm('description', v)}
          placeholder="Describe your product..." multiline maxLength={1000} />

        <Input label="Price (JOD) *" value={form.price} onChangeText={v => updateForm('price', v)}
          placeholder="0.00" keyboardType="numeric" icon="cash-outline" />

        {/* Category */}
        <Text style={styles.fieldLabel}>Category *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.lg }}>
          {CATEGORIES.map(cat => (
            <CategoryPill key={cat.id} label={cat.label} icon={cat.icon}
              selected={form.category === cat.id} onPress={() => updateForm('category', cat.id)} />
          ))}
        </ScrollView>

        {/* Vibe Tag */}
        <Text style={styles.fieldLabel}>Vibe</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.lg }}>
          {Object.entries(VIBE_TAGS).map(([key, val]) => (
            <CategoryPill key={key} label={key} emoji={val.emoji}
              selected={form.vibeTag === key} onPress={() => updateForm('vibeTag', form.vibeTag === key ? '' : key)} />
          ))}
        </ScrollView>

        {/* Cultural Tags */}
        <Text style={styles.fieldLabel}>Cultural Tags</Text>
        <View style={styles.tagsWrap}>
          {CULTURAL_TAGS.map(tag => (
            <CategoryPill key={tag.id} label={tag.id} emoji={tag.emoji}
              selected={form.culturalTags.includes(tag.id)}
              onPress={() => toggleCulturalTag(tag.id)} small />
          ))}
        </View>

        {/* Toggles */}
        <Text style={styles.fieldLabel}>Options</Text>
        <View style={styles.togglesWrap}>
          {[
            { key: 'allowOffers', label: 'Allow Offers', icon: 'hand-left-outline' },
            { key: 'allowCustomOrders', label: 'Custom Orders', icon: 'construct-outline' },
            { key: 'isDrop', label: 'New Drop', icon: 'flame-outline' },
            { key: 'isLimited', label: 'Limited Edition', icon: 'diamond-outline' },
          ].map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.toggleBtn, form[opt.key] && styles.toggleActive]}
              onPress={() => toggleField(opt.key)}
            >
              <Ionicons name={opt.icon} size={18}
                color={form[opt.key] ? COLORS.white : COLORS.terracotta} />
              <Text style={[styles.toggleText, form[opt.key] && styles.toggleTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <GradientButton title="Add Product" onPress={handleCreate} loading={loading}
          style={{ marginTop: SPACING.xl, marginBottom: SPACING.xxxl }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl },
  fieldLabel: {
    fontSize: FONTS.sizes.sm, color: COLORS.textPrimary, ...FONTS.medium, marginBottom: SPACING.sm,
  },
  addImageBtn: {
    width: 100, height: 100, borderRadius: RADIUS.lg,
    borderWidth: 2, borderColor: COLORS.terracotta, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md, gap: 4,
  },
  addImageText: { fontSize: FONTS.sizes.xs, color: COLORS.terracotta, ...FONTS.medium },
  imageThumb: { position: 'relative', marginRight: SPACING.md },
  thumbImage: { width: 100, height: 100, borderRadius: RADIUS.lg },
  removeBtn: {
    position: 'absolute', top: -6, right: -6,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: COLORS.error, alignItems: 'center', justifyContent: 'center',
  },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  togglesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg },
  toggleBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full, backgroundColor: COLORS.sand, borderWidth: 1, borderColor: COLORS.border,
  },
  toggleActive: { backgroundColor: COLORS.terracotta, borderColor: COLORS.terracotta },
  toggleText: { fontSize: FONTS.sizes.xs, color: COLORS.terracotta, ...FONTS.medium },
  toggleTextActive: { color: COLORS.white },
});

export default AddProductScreen;
