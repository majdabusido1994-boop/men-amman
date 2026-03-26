import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Image, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { messageAPI } from '../../api';

const ChatScreen = ({ route, navigation }) => {
  const { conversation: initialConv, product, isOffer, isCustomOrder, recipientId, shopId } = route.params || {};
  const { user } = useAuth();
  const [conversation, setConversation] = useState(initialConv);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    if (conversation) {
      loadMessages();
    } else if (recipientId) {
      createConversation();
    }
  }, []);

  const createConversation = async () => {
    try {
      const { data } = await messageAPI.createConversation({
        recipientId,
        shopId,
        isOffer,
        isCustomOrder,
      });
      setConversation(data);
    } catch (err) {
      console.log('Create conv error:', err);
    }
  };

  const loadMessages = async () => {
    try {
      const { data } = await messageAPI.getMessages(conversation._id);
      setMessages(data);
    } catch (err) {
      console.log('Load messages error:', err);
    }
  };

  const sendMessage = async () => {
    if (!text.trim() && !offerAmount) return;
    if (!conversation) return;

    try {
      let messageText = text.trim();
      let messageType = 'text';

      if (isOffer && offerAmount) {
        messageText = `I'd like to make an offer: ${offerAmount} JOD for ${product?.name || 'this item'}`;
        messageType = 'offer';
      }
      if (isCustomOrder && !messages.length) {
        messageText = `Hi! I'd like to request a custom order. ${messageText}`;
        messageType = 'custom_order';
      }

      const { data } = await messageAPI.sendMessage({
        conversationId: conversation._id,
        text: messageText,
        messageType,
      });

      setMessages(prev => [...prev, data]);
      setText('');
      setOfferAmount('');
    } catch (err) {
      console.log('Send error:', err);
    }
  };

  const getOtherUser = () => {
    if (!conversation?.participants) return {};
    return conversation.participants.find(p => (p._id || p) !== user?._id) || {};
  };

  const otherUser = getOtherUser();

  const renderMessage = ({ item }) => {
    const isMine = (item.sender?._id || item.sender) === user?._id;

    return (
      <View style={[styles.msgRow, isMine && styles.msgRowMine]}>
        {!isMine && (
          <Image
            source={{ uri: item.sender?.avatar || 'https://via.placeholder.com/40' }}
            style={styles.msgAvatar}
          />
        )}
        <View style={[
          styles.bubble,
          isMine ? styles.bubbleMine : styles.bubbleOther,
          item.messageType === 'system' && styles.bubbleSystem,
          item.messageType === 'offer' && styles.bubbleOffer,
        ]}>
          <Text style={[
            styles.msgText,
            isMine && styles.msgTextMine,
            item.messageType === 'system' && styles.msgTextSystem,
          ]}>
            {item.text}
          </Text>
          <Text style={[styles.msgTime, isMine && styles.msgTimeMine]}>
            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Image
          source={{ uri: otherUser.avatar || 'https://via.placeholder.com/40' }}
          style={styles.headerAvatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.headerName}>{otherUser.name || 'Chat'}</Text>
          {product && <Text style={styles.headerProduct} numberOfLines={1}>Re: {product.name}</Text>}
        </View>

        {/* WhatsApp redirect */}
        <TouchableOpacity
          style={styles.whatsappBtn}
          onPress={() => Linking.openURL('https://wa.me/')}
        >
          <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
        </TouchableOpacity>
      </View>

      {/* Product context card */}
      {product && messages.length === 0 && (
        <View style={styles.productCard}>
          <Image source={{ uri: product.images?.[0] || 'https://via.placeholder.com/60' }} style={styles.productImg} />
          <View style={{ flex: 1 }}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>{product.price} JOD</Text>
          </View>
        </View>
      )}

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListEmptyComponent={
          <View style={styles.emptyChat}>
            <Ionicons name="chatbubble-ellipses-outline" size={40} color={COLORS.sandDark} />
            <Text style={styles.emptyChatText}>
              {isOffer ? 'Make your offer below' : isCustomOrder ? 'Describe your custom order' : 'Start the conversation'}
            </Text>
          </View>
        }
      />

      {/* Offer input */}
      {isOffer && !messages.some(m => m.messageType === 'offer') && (
        <View style={styles.offerBar}>
          <Ionicons name="hand-left" size={16} color={COLORS.gold} />
          <Text style={styles.offerLabel}>Your Offer:</Text>
          <TextInput
            style={styles.offerInput}
            value={offerAmount}
            onChangeText={setOfferAmount}
            placeholder="0"
            keyboardType="numeric"
            placeholderTextColor={COLORS.textLight}
          />
          <Text style={styles.offerCurrency}>JOD</Text>
        </View>
      )}

      {/* Input bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder={isOffer ? 'Add a message with your offer...' : 'Type a message...'}
          placeholderTextColor={COLORS.textLight}
          multiline
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Ionicons name="send" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    paddingTop: 50, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md,
    backgroundColor: COLORS.white, ...SHADOWS.soft,
  },
  backBtn: { padding: 4 },
  headerAvatar: { width: 36, height: 36, borderRadius: 18 },
  headerName: { fontSize: FONTS.sizes.md, color: COLORS.textPrimary, ...FONTS.semibold },
  headerProduct: { fontSize: FONTS.sizes.xs, color: COLORS.warmGray },
  whatsappBtn: { padding: 8 },
  productCard: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    margin: SPACING.lg, padding: SPACING.md, backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg, ...SHADOWS.soft,
  },
  productImg: { width: 50, height: 50, borderRadius: RADIUS.sm },
  productName: { fontSize: FONTS.sizes.sm, color: COLORS.textPrimary, ...FONTS.medium },
  productPrice: { fontSize: FONTS.sizes.sm, color: COLORS.terracotta, ...FONTS.bold, marginTop: 2 },
  messagesList: { padding: SPACING.lg, flexGrow: 1 },
  emptyChat: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: SPACING.md },
  emptyChatText: { fontSize: FONTS.sizes.md, color: COLORS.warmGray },
  msgRow: { flexDirection: 'row', marginBottom: SPACING.md, alignItems: 'flex-end', gap: 8 },
  msgRowMine: { justifyContent: 'flex-end' },
  msgAvatar: { width: 28, height: 28, borderRadius: 14 },
  bubble: { maxWidth: '75%', padding: SPACING.md, borderRadius: RADIUS.lg },
  bubbleMine: { backgroundColor: COLORS.terracotta, borderBottomRightRadius: 4 },
  bubbleOther: { backgroundColor: COLORS.card, borderBottomLeftRadius: 4, ...SHADOWS.soft },
  bubbleSystem: { backgroundColor: COLORS.sand, alignSelf: 'center', borderRadius: RADIUS.full },
  bubbleOffer: { borderWidth: 1, borderColor: COLORS.gold },
  msgText: { fontSize: FONTS.sizes.md, color: COLORS.textPrimary, ...FONTS.regular, lineHeight: 22 },
  msgTextMine: { color: COLORS.white },
  msgTextSystem: { color: COLORS.warmGray, fontSize: FONTS.sizes.sm, textAlign: 'center' },
  msgTime: { fontSize: 10, color: COLORS.warmGray, marginTop: 4, alignSelf: 'flex-end' },
  msgTimeMine: { color: 'rgba(255,255,255,0.7)' },
  offerBar: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
    backgroundColor: COLORS.gold + '15', borderTopWidth: 1, borderTopColor: COLORS.gold + '30',
  },
  offerLabel: { fontSize: FONTS.sizes.sm, color: COLORS.gold, ...FONTS.semibold },
  offerInput: { fontSize: FONTS.sizes.lg, color: COLORS.textPrimary, ...FONTS.bold, minWidth: 50 },
  offerCurrency: { fontSize: FONTS.sizes.sm, color: COLORS.warmGray, ...FONTS.medium },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: SPACING.sm,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, paddingBottom: 34,
    backgroundColor: COLORS.white, ...SHADOWS.strong,
  },
  input: {
    flex: 1, backgroundColor: COLORS.inputBg, borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg, paddingVertical: 12, fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary, maxHeight: 100,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.terracotta, alignItems: 'center', justifyContent: 'center',
  },
});

export default ChatScreen;
