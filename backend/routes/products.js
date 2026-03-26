const express = require('express');
const router = express.Router();
const {
  createProduct, getProducts, getProduct, updateProduct,
  deleteProduct, toggleLike, getTrending, getFeed,
} = require('../controllers/productController');
const { protect, sellerOnly } = require('../middleware/auth');

router.get('/trending', getTrending);
router.get('/feed', getFeed);
router.route('/').get(getProducts).post(protect, sellerOnly, createProduct);
router.route('/:id').get(getProduct).put(protect, updateProduct).delete(protect, deleteProduct);
router.post('/:id/like', protect, toggleLike);

module.exports = router;
