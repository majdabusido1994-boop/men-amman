import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS } from '../theme';
import { useAuth } from '../context/AuthContext';

// Auth Screens — stubbed
import { Text as RNText2 } from 'react-native';
const WelcomeScreen = () => <View><RNText2>Welcome</RNText2></View>;
const LoginScreen = () => <View><RNText2>Login</RNText2></View>;
const RegisterScreen = () => <View><RNText2>Register</RNText2></View>;

// Main Screens — temporarily stubbed to find web crash
import { Text as RNText } from 'react-native';
const HomeScreen = () => <View><RNText>Home</RNText></View>;
const SearchScreen = () => <View><RNText>Search</RNText></View>;
const ConversationsScreen = () => <View><RNText>Messages</RNText></View>;
const ProfileScreen = () => <View><RNText>Profile</RNText></View>;
const ProductDetailScreen = () => <View><RNText>Product</RNText></View>;
const ShopProfileScreen = () => <View><RNText>Shop</RNText></View>;
const CreateShopScreen = () => <View><RNText>Create Shop</RNText></View>;
const AddProductScreen = () => <View><RNText>Add Product</RNText></View>;
const ChatScreen = () => <View><RNText>Chat</RNText></View>;
const CreateDropScreen = () => <View><RNText>Drop</RNText></View>;

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = { headerShown: false };

// Custom tab bar icon
const TabIcon = ({ name, focused, color }) => (
  <View style={[styles.tabIconWrap, focused && styles.tabIconActive]}>
    <Ionicons name={name} size={24} color={color} />
  </View>
);

// Bottom Tab Navigator
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.terracotta,
        tabBarInactiveTintColor: COLORS.warmGray,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'search' : 'search-outline'} focused={focused} color={color} />
          ),
          tabBarLabel: 'Discover',
        }}
      />
      <Tab.Screen
        name="Messages"
        component={ConversationsScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'chatbubbles' : 'chatbubbles-outline'} focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// App Stack (authenticated)
const AppStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen name="MainTabs" component={MainTabs} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    <Stack.Screen name="ShopProfile" component={ShopProfileScreen} />
    <Stack.Screen name="CreateShop" component={CreateShopScreen} />
    <Stack.Screen name="AddProduct" component={AddProductScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
    <Stack.Screen name="CreateDrop" component={CreateDropScreen} />
  </Stack.Navigator>
);

const Navigation = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <Ionicons name="leaf" size={60} color={COLORS.terracotta} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopWidth: 0,
    height: 85,
    paddingTop: 8,
    paddingBottom: 25,
    ...SHADOWS.strong,
  },
  tabLabel: {
    fontSize: 11,
    ...FONTS.medium,
    marginTop: 2,
  },
  tabIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 32,
    borderRadius: 16,
  },
  tabIconActive: {
    backgroundColor: COLORS.terracotta + '15',
  },
});

export default Navigation;
