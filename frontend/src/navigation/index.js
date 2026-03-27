import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../theme';
import { useAuth } from '../context/AuthContext';

import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

const Stack = createNativeStackNavigator();

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error: error.toString() + '\n' + (error.stack || '') };
  }
  render() {
    if (this.state.error) {
      return (
        <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>
          <Text style={{ color: 'red', fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
            CRASH ERROR:
          </Text>
          <Text style={{ color: '#333', fontSize: 12, fontFamily: 'monospace' }}>
            {this.state.error}
          </Text>
        </ScrollView>
      );
    }
    return this.props.children;
  }
}

const Navigation = () => {
  const { loading } = useAuth();
  if (loading) return <View style={{ flex: 1, backgroundColor: 'red' }}><Text style={{ color: 'white', fontSize: 24, padding: 40 }}>LOADING...</Text></View>;
  return (
    <ErrorBoundary>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
};

export default Navigation;
