import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, RADIUS } from '../../theme';
import GradientButton from '../../components/common/GradientButton';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.sandLight, COLORS.sand, COLORS.sandDark]}
        style={styles.background}
      >
        {/* Decorative circles */}
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />

        <View style={styles.content}>
          {/* Logo area */}
          <View style={styles.logoArea}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>MA</Text>
            </View>
            <Text style={styles.appName}>Men Amman</Text>
            <Text style={styles.appNameAr}>من عمّان</Text>
            <Text style={styles.tagline}>Discover Local Creators</Text>
          </View>

          {/* Description */}
          <View style={styles.descArea}>
            <Text style={styles.desc}>
              Your digital street bazaar.{'\n'}
              Walk through the hidden streets of Amman{'\n'}
              and discover amazing local shops.
            </Text>
          </View>

          {/* Vibe icons */}
          <View style={styles.vibes}>
            <View style={styles.vibePill}><Text style={styles.vibeText}>☕ Cozy</Text></View>
            <View style={styles.vibePill}><Text style={styles.vibeText}>🎨 Handmade</Text></View>
            <View style={styles.vibePill}><Text style={styles.vibeText}>🍲 Home food</Text></View>
            <View style={styles.vibePill}><Text style={styles.vibeText}>🧢 Street</Text></View>
          </View>

          {/* Buttons */}
          <View style={styles.buttons}>
            <GradientButton
              title="Get Started"
              onPress={() => navigation.navigate('Register')}
            />
            <GradientButton
              title="I already have an account"
              variant="outline"
              onPress={() => navigation.navigate('Login')}
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  decorCircle1: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.terracotta,
    opacity: 0.08,
  },
  decorCircle2: {
    position: 'absolute',
    bottom: 100,
    left: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: COLORS.olive,
    opacity: 0.06,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.navy,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.gold,
    marginBottom: SPACING.lg,
  },
  logoText: {
    fontSize: 36,
    color: COLORS.gold,
    ...FONTS.bold,
    letterSpacing: 2,
  },
  appName: {
    fontSize: FONTS.sizes.hero,
    color: COLORS.navy,
    ...FONTS.bold,
  },
  appNameAr: {
    fontSize: FONTS.sizes.xl,
    color: COLORS.terracotta,
    ...FONTS.medium,
    marginTop: 4,
  },
  tagline: {
    fontSize: FONTS.sizes.md,
    color: COLORS.warmGray,
    ...FONTS.regular,
    marginTop: SPACING.sm,
  },
  descArea: {
    marginBottom: SPACING.xxl,
  },
  desc: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    ...FONTS.regular,
    textAlign: 'center',
    lineHeight: 24,
  },
  vibes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xxxl,
  },
  vibePill: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  vibeText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    ...FONTS.medium,
  },
  buttons: {
    width: '100%',
    gap: SPACING.md,
  },
});

export default WelcomeScreen;
