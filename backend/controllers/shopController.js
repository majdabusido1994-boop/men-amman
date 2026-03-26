const Shop = require('../models/Shop');
const Product = require('../models/Product');
const User = require('../models/User');

// POST /api/shops
exports.createShop = async (req, res) => {
  try {
    const existingShop = await Shop.findOne({ owner: req.user._id });
    if (existingShop) {
      return res.status(400).json({ message: 'You already have a shop' });
    }

    const shop = await Shop.create({
      ...req.body,
      owner: req.user._id,
    });

    // Update user role to seller
    await User.findByIdAndUpdate(req.user._id, { role: 'seller' });

    res.status(201).json(shop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/shops
exports.getShops = async (req, res) => {
  try {
    const { category, neighborhood, search, sort, page = 1, limit = 20 } = req.query;
    const query = { isActive: true };

    if (category) query.category = category;
    if (neighborhood) query.neighborhood = neighborhood;
    if (search) {
      query.$text = { $search: search };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'popular') sortOption = { followersCount: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const shops = await Shop.find(query)
      .populate('owner', 'name avatar')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Shop.countDocuments(query);

    res.json({ shops, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/shops/:id
exports.getShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id)
      .populate('owner', 'name avatar email');

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    const products = await Product.find({ shop: shop._id, isAvailable: true })
      .sort({ createdAt: -1 });

    res.json({ shop, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/shops/:id
exports.updateShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    if (shop.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/shops/my/shop
exports.getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) return res.status(404).json({ message: 'You do not have a shop yet' });

    const products = await Product.find({ shop: shop._id }).sort({ createdAt: -1 });
    res.json({ shop, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/shops/:id/follow
exports.toggleFollow = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    const userId = req.user._id;
    const isFollowing = shop.followers.includes(userId);

    if (isFollowing) {
      shop.followers.pull(userId);
      shop.followersCount = Math.max(0, shop.followersCount - 1);
      await User.findByIdAndUpdate(userId, { $pull: { followingShops: shop._id } });
    } else {
      shop.followers.push(userId);
      shop.followersCount += 1;
      await User.findByIdAndUpdate(userId, { $addToSet: { followingShops: shop._id } });
    }

    await shop.save();
    res.json({ isFollowing: !isFollowing, followersCount: shop.followersCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/shops/nearby
exports.getNearbyShops = async (req, res) => {
  try {
    const { lng = 35.9106, lat = 31.9539, maxDistance = 5000 } = req.query;

    const shops = await Shop.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(maxDistance),
        },
      },
      isActive: true,
    }).populate('owner', 'name avatar').limit(20);

    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/shops/featured
exports.getFeaturedShops = async (req, res) => {
  try {
    const shops = await Shop.find({ isActive: true, isVerified: true })
      .populate('owner', 'name avatar')
      .sort({ followersCount: -1 })
      .limit(10);
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/shops/new
exports.getNewShops = async (req, res) => {
  try {
    const shops = await Shop.find({ isActive: true })
      .populate('owner', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
