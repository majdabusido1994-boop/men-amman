const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please add a shop name'],
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
    maxlength: 500,
  },
  profileImage: {
    type: String,
    default: '',
  },
  coverImage: {
    type: String,
    default: '',
  },
  instagram: {
    type: String,
    default: '',
  },
  whatsapp: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    enum: ['Fashion', 'Food', 'Handmade', 'Art', 'Services', 'Other'],
    required: [true, 'Please select a category'],
  },
  neighborhood: {
    type: String,
    enum: [
      'Jabal Amman', 'Sweifieh', 'Abdoun', 'Rainbow Street',
      'Jabal Al-Weibdeh', 'Shmeisani', 'Dabouq', 'Khalda',
      'Tla Al-Ali', 'Um Uthaina', 'Marj Al-Hamam', 'Tabarbour',
      'Al-Jubeiha', 'Downtown', 'Other'
    ],
    default: 'Downtown',
  },
  culturalTags: [{
    type: String,
    enum: ['Made in Amman', 'From my home', 'Support local', 'Handcrafted', 'Family recipe', 'Street art'],
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  followersCount: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
  },
  ratingCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [35.9106, 31.9539] }, // Amman center
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

shopSchema.index({ location: '2dsphere' });
shopSchema.index({ name: 'text', description: 'text' });

shopSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'shop',
  justOne: false,
});

module.exports = mongoose.model('Shop', shopSchema);
