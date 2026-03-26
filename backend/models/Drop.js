const mongoose = require('mongoose');

const dropSchema = new mongoose.Schema({
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
  title: {
    type: String,
    required: [true, 'Please add a title'],
    maxlength: 100,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  image: {
    type: String,
    default: '',
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  dropType: {
    type: String,
    enum: ['new_drop', 'limited_items', 'flash_sale', 'announcement'],
    default: 'new_drop',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  expiresAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Drop', dropSchema);
