import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../theme';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

const TestScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background }}>
    <Text style={{ color: COLORS.terracotta, fontSize: 20 }}>Stack works!</Text>
  </View>
);

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Test" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
