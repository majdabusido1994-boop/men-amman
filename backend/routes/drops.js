const express = require('express');
const router = express.Router();
const { createDrop, getDrops, getShopDrops, deleteDrop } = require('../controllers/dropController');
const { protect, sellerOnly } = require('../middleware/auth');

router.route('/').get(getDrops).post(protect, sellerOnly, createDrop);
router.get('/shop/:shopId', getShopDrops);
router.delete('/:id', protect, deleteDrop);

module.exports = router;
