const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: 100,
  },
  nameAr: {
    type: String,
    trim: true,
    default: '',
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: 1000,
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: 0,
  },
  currency: {
    type: String,
    default: 'JOD',
  },
  images: [{
    type: String,
  }],
  video: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    enum: ['Fashion', 'Food', 'Handmade', 'Art', 'Services', 'Other'],
    required: true,
  },
  vibeTag: {
    type: String,
    enum: ['', 'Cozy', 'Streetwear', 'Handmade', 'Home food', 'Vintage', 'Modern', 'Traditional'],
    default: '',
  },
  culturalTags: [{
    type: String,
    enum: ['Made in Amman', 'From my home', 'Support local', 'Handcrafted', 'Family recipe', 'Street art'],
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  likesCount: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  ratingCount: {
    type: Number,
    default: 0,
  },
  allowOffers: {
    type: Boolean,
    default: false,
  },
  allowCustomOrders: {
    type: Boolean,
    default: false,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  isDrop: {
    type: Boolean,
    default: false,
  },
  isLimited: {
    type: Boolean,
    default: false,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
