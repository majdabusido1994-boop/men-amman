import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING } from '../../theme';

const StoryCircle = ({ shop, hasStory, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      {hasStory ? (
        <LinearGradient
          colors={[COLORS.dustyOrange, COLORS.terracotta, COLORS.terracottaDark]}
          style={styles.ring}
        >
          <View style={styles.innerRing}>
            <Image
              source={{ uri: shop.profileImage || 'https://via.placeholder.com/80' }}
              style={styles.avatar}
            />
          </View>
        </LinearGradient>
      ) : (
        <View style={styles.noStoryRing}>
          <Image
            source={{ uri: shop.profileImage || 'https://via.placeholder.com/80' }}
            style={styles.avatar}
          />
        </View>
      )}
      <Text style={styles.name} numberOfLines={1}>{shop.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: SPACING.md,
    width: 74,
  },
  ring: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  noStoryRing: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  name: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textPrimary,
    ...FONTS.medium,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});

export default StoryCircle;
