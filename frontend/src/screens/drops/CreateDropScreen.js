import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS } from '../../theme';
import { dropAPI, shopAPI } from '../../api';
import Input from '../../components/common/Input';
import GradientButton from '../../components/common/GradientButton';
import Header from '../../components/common/Header';
import CategoryPill from '../../components/common/CategoryPill';

const DROP_TYPES = [
  { id: 'new_drop', label: 'New Drop', icon: 'flame-outline' },
  { id: 'limited_items', label: 'Limited Items', icon: 'diamond-outline' },
  { id: 'flash_sale', label: 'Flash Sale', icon: 'flash-outline' },
  { id: 'announcement', label: 'Announcement', icon: 'megaphone-outline' },
];

const CreateDropScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    dropType: 'new_drop',
    image: '',
  });

  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleCreate = async () => {
    if (!form.title) {
      Alert.alert('Missing Info', 'Please add a title for your drop');
      return;
    }
    setLoading(true);
    try {
      await dropAPI.create(form);
      Alert.alert('Drop Posted!', 'Your followers will see this', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to create drop');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Post a Drop" titleAr="إعلان جديد" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.subtitle}>Announce something exciting to your followers</Text>

        {/* Drop Type */}
        <Text style={styles.label}>Drop Type</Text>
        <View style={styles.typesWrap}>
          {DROP_TYPES.map(type => (
            <CategoryPill
              key={type.id}
              label={type.label}
              icon={type.icon}
              selected={form.dropType === type.id}
              onPress={() => updateForm('dropType', type.id)}
            />
          ))}
        </View>

        <Input
          label="Title *"
          value={form.title}
          onChangeText={v => updateForm('title', v)}
          placeholder="e.g., New Collection Just Dropped!"
          icon="megaphone-outline"
        />

        <Input
          label="Description"
          value={form.description}
          onChangeText={v => updateForm('description', v)}
          placeholder="Tell your followers what's new..."
          multiline
          maxLength={500}
        />

        <Input
          label="Image URL (optional)"
          value={form.image}
          onChangeText={v => updateForm('image', v)}
          placeholder="https://..."
          icon="image-outline"
        />

        <GradientButton
          title="Post Drop"
          onPress={handleCreate}
          loading={loading}
          icon={<Ionicons name="flame" size={20} color={COLORS.white} />}
          style={{ marginTop: SPACING.xl }}
        />
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
  label: {
    fontSize: FONTS.sizes.sm, color: COLORS.textPrimary, ...FONTS.medium, marginBottom: SPACING.sm,
  },
  typesWrap: {
    flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.xl,
  },
});

export default CreateDropScreen;
