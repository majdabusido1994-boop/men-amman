const Story = require('../models/Story');
const Shop = require('../models/Shop');

// POST /api/stories
exports.createStory = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) return res.status(400).json({ message: 'Create a shop first' });

    const story = await Story.create({
      shop: shop._id,
      seller: req.user._id,
      image: req.body.image,
      caption: req.body.caption || '',
    });

    res.status(201).json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/stories
exports.getStories = async (req, res) => {
  try {
    const stories = await Story.find({ expiresAt: { $gt: new Date() } })
      .populate('shop', 'name profileImage')
      .sort({ createdAt: -1 });

    // Group by shop
    const grouped = {};
    stories.forEach((story) => {
      const shopId = story.shop._id.toString();
      if (!grouped[shopId]) {
        grouped[shopId] = {
          shop: story.shop,
          stories: [],
        };
      }
      grouped[shopId].stories.push(story);
    });

    res.json(Object.values(grouped));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/stories/:id/view
exports.viewStory = async (req, res) => {
  try {
    await Story.findByIdAndUpdate(req.params.id, {
      $addToSet: { viewers: req.user._id },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
