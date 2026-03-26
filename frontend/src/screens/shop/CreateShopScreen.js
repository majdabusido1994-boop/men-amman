import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, CATEGORIES, NEIGHBORHOODS, CULTURAL_TAGS } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { shopAPI } from '../../api';
import Input from '../../components/common/Input';
import GradientButton from '../../components/common/GradientButton';
import Header from '../../components/common/Header';
import CategoryPill from '../../components/common/CategoryPill';

const CreateShopScreen = ({ navigation }) => {
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', nameAr: '', description: '', category: '',
    neighborhood: 'Downtown', instagram: '', whatsapp: '',
    culturalTags: [],
  });

  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const toggleCulturalTag = (tagId) => {
    setForm(prev => ({
      ...prev,
      culturalTags: prev.culturalTags.includes(tagId)
        ? prev.culturalTags.filter(t => t !== tagId)
        : [...prev.culturalTags, tagId],
    }));
  };

  const handleCreate = async () => {
    if (!form.name || !form.description || !form.category) {
      Alert.alert('Missing Info', 'Please fill in shop name, description, and category');
      return;
    }
    setLoading(true);
    try {
      const { data } = await shopAPI.create(form);
      await refreshUser();
      Alert.alert('Shop Created!', 'Your shop is now live on Men Amman', [
        { text: 'View My Shop', onPress: () => navigation.replace('ShopProfile', { shopId: data._id }) },
      ]);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to create shop');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Create Your Shop" titleAr="أنشئ متجرك" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.subtitle}>Open your digital storefront in Amman's bazaar</Text>

        <Input label="Shop Name *" value={form.name} onChangeText={v => updateForm('name', v)}
          placeholder="e.g., Lina's Leather" icon="storefront-outline" />

        <Input label="Shop Name (Arabic)" value={form.nameAr} onChangeText={v => updateForm('nameAr', v)}
          placeholder="مثال: جلود لينا" />

        <Input label="Description *" value={form.description} onChangeText={v => updateForm('description', v)}
          placeholder="Tell people what makes your shop special..." multiline maxLength={500} />

        {/* Category */}
        <Text style={styles.fieldLabel}>Category *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.lg }}>
          {CATEGORIES.map(cat => (
            <CategoryPill key={cat.id} label={cat.label} icon={cat.icon}
              selected={form.category === cat.id} onPress={() => updateForm('category', cat.id)} />
          ))}
        </ScrollView>

        {/* Neighborhood */}
        <Text style={styles.fieldLabel}>Neighborhood</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.lg }}>
          {NEIGHBORHOODS.map(n => (
            <CategoryPill key={n} label={n}
              selected={form.neighborhood === n} onPress={() => updateForm('neighborhood', n)} />
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

        <Input label="Instagram Handle" value={form.instagram} onChangeText={v => updateForm('instagram', v)}
          placeholder="@yourshop" icon="logo-instagram" />

        <Input label="WhatsApp Number" value={form.whatsapp} onChangeText={v => updateForm('whatsapp', v)}
          placeholder="+962 79 000 0000" icon="logo-whatsapp" keyboardType="phone-pad" />

        <GradientButton title="Create Shop" onPress={handleCreate} loading={loading}
          style={{ marginTop: SPACING.xl, marginBottom: SPACING.xxxl }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl },
  subtitle: {
    fontSize: FONTS.sizes.md, color: COLORS.warmGray, ...FONTS.regular,
    textAlign: 'center', marginBottom: SPACING.xxl,
  },
  fieldLabel: {
    fontSize: FONTS.sizes.sm, color: COLORS.textPrimary, ...FONTS.medium, marginBottom: SPACING.sm,
  },
  tagsWrap: {
    flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.lg,
  },
});

export default CreateShopScreen;
