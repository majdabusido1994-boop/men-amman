import React from 'react';
import { View, Text } from 'react-native';
import { COLORS } from '../theme';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { user, loading } = useAuth();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background }}>
      <Text style={{ color: COLORS.terracotta, fontSize: 20 }}>
        {loading ? 'Loading...' : user ? 'Logged in' : 'Not logged in'}
      </Text>
    </View>
  );
};

export default Navigation;
