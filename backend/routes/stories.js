const express = require('express');
const router = express.Router();
const { createStory, getStories, viewStory } = require('../controllers/storyController');
const { protect, sellerOnly } = require('../middleware/auth');

router.route('/').get(getStories).post(protect, sellerOnly, createStory);
router.post('/:id/view', protect, viewStory);

module.exports = router;
