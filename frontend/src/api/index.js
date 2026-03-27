import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  'https://men-amman-api.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Auto-attach token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Shops
export const shopAPI = {
  getAll: (params) => api.get('/shops', { params }),
  getById: (id) => api.get(`/shops/${id}`),
  create: (data) => api.post('/shops', data),
  update: (id, data) => api.put(`/shops/${id}`, data),
  getMyShop: () => api.get('/shops/my/shop'),
  toggleFollow: (id) => api.post(`/shops/${id}/follow`),
  getFeatured: () => api.get('/shops/featured'),
  getNew: () => api.get('/shops/new'),
  getNearby: (params) => api.get('/shops/nearby', { params }),
};

// Products
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  toggleLike: (id) => api.post(`/products/${id}/like`),
  getTrending: () => api.get('/products/trending'),
  getFeed: (params) => api.get('/products/feed', { params }),
};

// Messages
export const messageAPI = {
  createConversation: (data) => api.post('/messages/conversation', data),
  getConversations: () => api.get('/messages/conversations'),
  sendMessage: (data) => api.post('/messages', data),
  getMessages: (conversationId, params) => api.get(`/messages/${conversationId}`, { params }),
  respondToOffer: (conversationId, data) => api.put(`/messages/offer/${conversationId}`, data),
};

// Drops
export const dropAPI = {
  getAll: () => api.get('/drops'),
  create: (data) => api.post('/drops', data),
  getByShop: (shopId) => api.get(`/drops/shop/${shopId}`),
  delete: (id) => api.delete(`/drops/${id}`),
};

// Stories
export const storyAPI = {
  getAll: () => api.get('/stories'),
  create: (data) => api.post('/stories', data),
  view: (id) => api.post(`/stories/${id}/view`),
};

// Ratings
export const ratingAPI = {
  create: (data) => api.post('/ratings', data),
  getShopRatings: (shopId) => api.get(`/ratings/shop/${shopId}`),
  getProductRatings: (productId) => api.get(`/ratings/product/${productId}`),
};

export default api;
