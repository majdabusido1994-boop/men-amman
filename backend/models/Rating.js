const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    maxlength: 500,
    default: '',
  },
}, {
  timestamps: true,
});

ratingSchema.index({ user: 1, product: 1 }, { unique: true, sparse: true });
ratingSchema.index({ user: 1, shop: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Rating', ratingSchema);
