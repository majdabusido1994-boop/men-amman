import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import GradientButton from '../../components/common/GradientButton';
import Header from '../../components/common/Header';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    const result = await login(email.toLowerCase().trim(), password);
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
      <Header title="Welcome Back" titleAr="أهلاً وسهلاً" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <Text style={styles.subtitle}>Sign in to explore Amman's hidden gems</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

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
            placeholder="Enter your password"
            icon="lock-closed-outline"
            secureTextEntry
          />

          <GradientButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={{ marginTop: SPACING.lg }}
          />

          <TouchableOpacity
            style={styles.switchBtn}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.switchText}>
              Don't have an account? <Text style={styles.switchLink}>Sign Up</Text>
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
    justifyContent: 'center',
  },
  form: {
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.xxxl,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.warmGray,
    ...FONTS.regular,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
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

export default LoginScreen;
