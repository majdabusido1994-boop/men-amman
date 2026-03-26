import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, Image, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { messageAPI } from '../../api';
import EmptyState from '../../components/common/EmptyState';

const ConversationsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadConversations = async () => {
    try {
      const { data } = await messageAPI.getConversations();
      setConversations(data);
    } catch (err) {
      console.log('Load error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { loadConversations(); }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadConversations();
  }, []);

  const getOtherUser = (participants) => {
    return participants?.find(p => p._id !== user?._id) || {};
  };

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return `${Math.floor(diff / 86400000)}d`;
  };

  const renderConversation = ({ item }) => {
    const other = getOtherUser(item.participants);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Chat', { conversation: item })}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: other.avatar || 'https://via.placeholder.com/60' }}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{other.name || 'User'}</Text>
            <Text style={styles.time}>{formatTime(item.lastMessage?.createdAt)}</Text>
          </View>

          {/* Product context */}
          {item.product && (
            <View style={styles.productContext}>
              <Image source={{ uri: item.product.images?.[0] || 'https://via.placeholder.com/30' }} style={styles.productThumb} />
              <Text style={styles.productName} numberOfLines={1}>{item.product.name}</Text>
            </View>
          )}

          {/* Offer badge */}
          {item.isOffer && (
            <View style={[styles.typeBadge, { backgroundColor: COLORS.gold + '20' }]}>
              <Ionicons name="hand-left" size={12} color={COLORS.gold} />
              <Text style={[styles.typeBadgeText, { color: COLORS.gold }]}>
                Offer: {item.offerAmount} JOD — {item.offerStatus || 'pending'}
              </Text>
            </View>
          )}

          {item.isCustomOrder && (
            <View style={[styles.typeBadge, { backgroundColor: COLORS.olive + '20' }]}>
              <Ionicons name="construct" size={12} color={COLORS.olive} />
              <Text style={[styles.typeBadgeText, { color: COLORS.olive }]}>Custom Order</Text>
            </View>
          )}

          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage?.text || 'No messages yet'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.titleAr}>الرسائل</Text>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={item => item._id}
        renderItem={renderConversation}
        contentContainerStyle={{ padding: SPACING.lg, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.terracotta} />}
        ListEmptyComponent={
          <EmptyState
            icon="chatbubbles-outline"
            title="No conversations yet"
            subtitle="Start a conversation by messaging a seller"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 50, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, backgroundColor: COLORS.white, ...SHADOWS.soft },
  title: { fontSize: FONTS.sizes.xxl, color: COLORS.textPrimary, ...FONTS.bold },
  titleAr: { fontSize: FONTS.sizes.sm, color: COLORS.warmGray, marginTop: 2 },
  card: {
    flexDirection: 'row', backgroundColor: COLORS.card, padding: SPACING.md,
    borderRadius: RADIUS.lg, marginBottom: SPACING.md, ...SHADOWS.soft, gap: SPACING.md,
  },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: FONTS.sizes.md, color: COLORS.textPrimary, ...FONTS.semibold, flex: 1 },
  time: { fontSize: FONTS.sizes.xs, color: COLORS.warmGray },
  productContext: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  productThumb: { width: 20, height: 20, borderRadius: 4 },
  productName: { fontSize: FONTS.sizes.xs, color: COLORS.warmGray, ...FONTS.regular },
  typeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.sm, marginTop: 4, alignSelf: 'flex-start' },
  typeBadgeText: { fontSize: 11, ...FONTS.medium },
  lastMessage: { fontSize: FONTS.sizes.sm, color: COLORS.warmGray, ...FONTS.regular, marginTop: 4 },
});

export default ConversationsScreen;
