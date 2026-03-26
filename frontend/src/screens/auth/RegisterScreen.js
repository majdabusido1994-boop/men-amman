import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import GradientButton from '../../components/common/GradientButton';
import Header from '../../components/common/Header';

const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    const result = await register(name, email.toLowerCase().trim(), password, role);
    if (!result.success) {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header title="Join Men Amman" titleAr="انضم لمن عمان" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <Text style={styles.subtitle}>Start discovering local creators</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {/* Role Selection */}
          <Text style={styles.roleLabel}>I want to...</Text>
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleCard, role === 'buyer' && styles.roleActive]}
              onPress={() => setRole('buyer')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="bag-handle-outline"
                size={28}
                color={role === 'buyer' ? COLORS.terracotta : COLORS.warmGray}
              />
              <Text style={[styles.roleTitle, role === 'buyer' && styles.roleTitleActive]}>
                Discover & Shop
              </Text>
              <Text style={styles.roleDesc}>Browse local creators</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleCard, role === 'seller' && styles.roleActive]}
              onPress={() => setRole('seller')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="storefront-outline"
                size={28}
                color={role === 'seller' ? COLORS.terracotta : COLORS.warmGray}
              />
              <Text style={[styles.roleTitle, role === 'seller' && styles.roleTitleActive]}>
                Sell & Create
              </Text>
              <Text style={styles.roleDesc}>Open your own shop</Text>
            </TouchableOpacity>
          </View>

          <Input
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            icon="person-outline"
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            icon="mail-outline"
            keyboardType="email-address"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
            icon="lock-closed-outline"
            secureTextEntry
          />

          <GradientButton
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            style={{ marginTop: SPACING.lg }}
          />

          <TouchableOpacity
            style={styles.switchBtn}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.switchText}>
              Already have an account? <Text style={styles.switchLink}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flexGrow: 1,
  },
  form: {
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.xl,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.warmGray,
    ...FONTS.regular,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  error: {
    backgroundColor: '#FDE8E8',
    color: COLORS.error,
    padding: SPACING.md,
    borderRadius: 8,
    fontSize: FONTS.sizes.sm,
    ...FONTS.medium,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  roleLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    ...FONTS.semibold,
    marginBottom: SPACING.md,
  },
  roleRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  roleCard: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
    gap: SPACING.xs,
  },
  roleActive: {
    borderColor: COLORS.terracotta,
    backgroundColor: COLORS.sandLight,
  },
  roleTitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    ...FONTS.semibold,
    textAlign: 'center',
  },
  roleTitleActive: {
    color: COLORS.terracotta,
  },
  roleDesc: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.warmGray,
    ...FONTS.regular,
    textAlign: 'center',
  },
  switchBtn: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  switchText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.warmGray,
    ...FONTS.regular,
  },
  switchLink: {
    color: COLORS.terracotta,
    ...FONTS.semibold,
  },
});

export default RegisterScreen;
