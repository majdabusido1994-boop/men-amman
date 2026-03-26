const Product = require('../models/Product');
const Shop = require('../models/Shop');
const User = require('../models/User');

// POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) return res.status(400).json({ message: 'Create a shop first' });

    const product = await Product.create({
      ...req.body,
      shop: shop._id,
      seller: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const {
      category, search, minPrice, maxPrice,
      vibeTag, neighborhood, sort, page = 1, limit = 20,
      culturalTag, isDrop
    } = req.query;

    const query = { isAvailable: true };

    if (category) query.category = category;
    if (vibeTag) query.vibeTag = vibeTag;
    if (isDrop === 'true') query.isDrop = true;
    if (culturalTag) query.culturalTags = culturalTag;
    if (search) query.$text = { $search: search };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by neighborhood via shop
    let shopFilter = null;
    if (neighborhood) {
      const shopIds = await Shop.find({ neighborhood }).distinct('_id');
      query.shop = { $in: shopIds };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'popular') sortOption = { likesCount: -1 };
    if (sort === 'trending') sortOption = { viewCount: -1, likesCount: -1 };

    const products = await Product.find(query)
      .populate({
        path: 'shop',
        select: 'name profileImage neighborhood isVerified',
      })
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({ products, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/products/:id
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({
        path: 'shop',
        select: 'name profileImage neighborhood isVerified instagram whatsapp owner',
        populate: { path: 'owner', select: 'name avatar' },
      });

    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Increment view count
    product.viewCount += 1;
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/products/:id/like
exports.toggleLike = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const userId = req.user._id;
    const isLiked = product.likes.includes(userId);

    if (isLiked) {
      product.likes.pull(userId);
      product.likesCount = Math.max(0, product.likesCount - 1);
      await User.findByIdAndUpdate(userId, { $pull: { savedProducts: product._id } });
    } else {
      product.likes.push(userId);
      product.likesCount += 1;
      await User.findByIdAndUpdate(userId, { $addToSet: { savedProducts: product._id } });
    }

    await product.save();
    res.json({ isLiked: !isLiked, likesCount: product.likesCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/products/trending
exports.getTrending = async (req, res) => {
  try {
    const products = await Product.find({ isAvailable: true })
      .populate('shop', 'name profileImage isVerified')
      .sort({ likesCount: -1, viewCount: -1 })
      .limit(20);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/products/feed
exports.getFeed = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // Mix of recent, trending, and random
    const products = await Product.find({ isAvailable: true })
      .populate('shop', 'name profileImage isVerified neighborhood')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments({ isAvailable: true });
    res.json({ products, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
