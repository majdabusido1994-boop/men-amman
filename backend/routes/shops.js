const express = require('express');
const router = express.Router();
const {
  createShop, getShops, getShop, updateShop, getMyShop,
  toggleFollow, getNearbyShops, getFeaturedShops, getNewShops,
} = require('../controllers/shopController');
const { protect, sellerOnly } = require('../middleware/auth');

router.get('/featured', getFeaturedShops);
router.get('/new', getNewShops);
router.get('/nearby', getNearbyShops);
router.get('/my/shop', protect, getMyShop);
router.route('/').get(getShops).post(protect, createShop);
router.route('/:id').get(getShop).put(protect, updateShop);
router.post('/:id/follow', protect, toggleFollow);

module.exports = router;
