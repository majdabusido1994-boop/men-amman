const Drop = require('../models/Drop');
const Shop = require('../models/Shop');

// POST /api/drops
exports.createDrop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) return res.status(400).json({ message: 'Create a shop first' });

    const drop = await Drop.create({
      ...req.body,
      shop: shop._id,
      seller: req.user._id,
    });

    res.status(201).json(drop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/drops
exports.getDrops = async (req, res) => {
  try {
    const drops = await Drop.find({ isActive: true })
      .populate('shop', 'name profileImage isVerified')
      .populate('products', 'name images price')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(drops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/drops/shop/:shopId
exports.getShopDrops = async (req, res) => {
  try {
    const drops = await Drop.find({ shop: req.params.shopId, isActive: true })
      .populate('products', 'name images price')
      .sort({ createdAt: -1 });
    res.json(drops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/drops/:id
exports.deleteDrop = async (req, res) => {
  try {
    const drop = await Drop.findById(req.params.id);
    if (!drop) return res.status(404).json({ message: 'Drop not found' });
    if (drop.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await drop.deleteOne();
    res.json({ message: 'Drop removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
