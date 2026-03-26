// Men Amman Design System
// Inspired by Amman street culture — warm, artistic, alive

export const COLORS = {
  // Primary palette — Amman earth tones
  terracotta: '#B5654A',
  terracottaDark: '#8B4432',
  terracottaLight: '#D4896E',
  dustyOrange: '#D4845A',
  sand: '#F5E6D0',
  sandLight: '#FFF8F0',
  sandDark: '#E8D5B7',
  olive: '#6B7B4C',
  oliveLight: '#8A9B6A',
  oliveDark: '#4A5A34',

  // Brand accents (from logo)
  navy: '#1B2A4A',
  gold: '#C5A555',
  goldLight: '#D4B978',

  // Sunset gradients
  sunsetStart: '#D4845A',
  sunsetMid: '#B5654A',
  sunsetEnd: '#8B4432',

  // Neutrals
  white: '#FFFFFF',
  offWhite: '#FFF8F0',
  cream: '#F5E6D0',
  warmGray: '#9B8B7A',
  darkBrown: '#3D2B1F',
  charcoal: '#2A2A2A',
  black: '#1A1A1A',

  // Semantic
  success: '#6B7B4C',
  error: '#C44B3F',
  warning: '#D4845A',
  info: '#5A8BB5',

  // UI
  background: '#FFF8F0',
  card: '#FFFFFF',
  cardShadow: 'rgba(61, 43, 31, 0.08)',
  border: '#E8D5B7',
  textPrimary: '#3D2B1F',
  textSecondary: '#9B8B7A',
  textLight: '#C4B5A5',
  inputBg: '#F5E6D0',
  overlay: 'rgba(26, 26, 26, 0.5)',
};

export const GRADIENTS = {
  sunset: [COLORS.dustyOrange, COLORS.terracotta, COLORS.terracottaDark],
  warmFade: [COLORS.sandLight, COLORS.sand],
  gold: [COLORS.goldLight, COLORS.gold],
  olive: [COLORS.oliveLight, COLORS.olive],
  header: [COLORS.terracotta, COLORS.terracottaDark],
};

export const FONTS = {
  regular: { fontFamily: 'System', fontWeight: '400' },
  medium: { fontFamily: 'System', fontWeight: '500' },
  semibold: { fontFamily: 'System', fontWeight: '600' },
  bold: { fontFamily: 'System', fontWeight: '700' },
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 26,
    hero: 34,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
};

export const RADIUS = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
};

export const SHADOWS = {
  soft: {
    shadowColor: COLORS.darkBrown,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.darkBrown,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  strong: {
    shadowColor: COLORS.darkBrown,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
};

// Cultural vibe tag config
export const VIBE_TAGS = {
  'Cozy': { emoji: '☕', color: COLORS.terracotta },
  'Streetwear': { emoji: '🧢', color: COLORS.navy },
  'Handmade': { emoji: '🎨', color: COLORS.olive },
  'Home food': { emoji: '🍲', color: COLORS.dustyOrange },
  'Vintage': { emoji: '✨', color: COLORS.gold },
  'Modern': { emoji: '💎', color: COLORS.info },
  'Traditional': { emoji: '🏛️', color: COLORS.terracottaDark },
};

export const CATEGORIES = [
  { id: 'Fashion', label: 'Fashion', labelAr: 'أزياء', icon: 'shirt-outline' },
  { id: 'Food', label: 'Food', labelAr: 'طعام', icon: 'restaurant-outline' },
  { id: 'Handmade', label: 'Handmade', labelAr: 'يدوي', icon: 'color-palette-outline' },
  { id: 'Art', label: 'Art', labelAr: 'فن', icon: 'brush-outline' },
  { id: 'Services', label: 'Services', labelAr: 'خدمات', icon: 'construct-outline' },
  { id: 'Other', label: 'Other', labelAr: 'أخرى', icon: 'grid-outline' },
];

export const NEIGHBORHOODS = [
  'Jabal Amman', 'Sweifieh', 'Abdoun', 'Rainbow Street',
  'Jabal Al-Weibdeh', 'Shmeisani', 'Dabouq', 'Khalda',
  'Tla Al-Ali', 'Um Uthaina', 'Marj Al-Hamam', 'Tabarbour',
  'Al-Jubeiha', 'Downtown', 'Other',
];

export const CULTURAL_TAGS = [
  { id: 'Made in Amman', emoji: '🏙️' },
  { id: 'From my home', emoji: '🏠' },
  { id: 'Support local', emoji: '❤️' },
  { id: 'Handcrafted', emoji: '✋' },
  { id: 'Family recipe', emoji: '👨‍👩‍👧' },
  { id: 'Street art', emoji: '🎨' },
];
