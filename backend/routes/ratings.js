const express = require('express');
const router = express.Router();
const { createRating, getShopRatings, getProductRatings } = require('../controllers/ratingController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createRating);
router.get('/shop/:shopId', getShopRatings);
router.get('/product/:productId', getProductRatings);

module.exports = router;
