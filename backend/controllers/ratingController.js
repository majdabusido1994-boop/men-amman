const Rating = require('../models/Rating');
const Shop = require('../models/Shop');
const Product = require('../models/Product');

// POST /api/ratings
exports.createRating = async (req, res) => {
  try {
    const { shopId, productId, rating, comment } = req.body;

    const ratingData = {
      user: req.user._id,
      rating,
      comment: comment || '',
    };

    if (shopId) ratingData.shop = shopId;
    if (productId) ratingData.product = productId;

    const newRating = await Rating.create(ratingData);

    // Update average rating
    if (shopId) {
      const ratings = await Rating.find({ shop: shopId });
      const avg = ratings.reduce((a, r) => a + r.rating, 0) / ratings.length;
      await Shop.findByIdAndUpdate(shopId, { rating: avg.toFixed(1), ratingCount: ratings.length });
    }

    if (productId) {
      const ratings = await Rating.find({ product: productId });
      const avg = ratings.reduce((a, r) => a + r.rating, 0) / ratings.length;
      await Product.findByIdAndUpdate(productId, { rating: avg.toFixed(1), ratingCount: ratings.length });
    }

    res.status(201).json(newRating);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already rated this' });
    }
    res.status(500).json({ message: error.message });
  }
};

// GET /api/ratings/shop/:shopId
exports.getShopRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ shop: req.params.shopId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/ratings/product/:productId
exports.getProductRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
