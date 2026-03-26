const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// POST /api/messages/conversation
exports.createConversation = async (req, res) => {
  try {
    const { recipientId, productId, shopId, isOffer, offerAmount, isCustomOrder } = req.body;

    // Check if conversation exists
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, recipientId] },
      ...(productId && { product: productId }),
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, recipientId],
        product: productId || null,
        shop: shopId || null,
        isOffer: isOffer || false,
        offerAmount: offerAmount || null,
        offerStatus: isOffer ? 'pending' : '',
        isCustomOrder: isCustomOrder || false,
      });
    }

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/messages/conversations
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate('participants', 'name avatar')
      .populate('product', 'name images price')
      .populate('shop', 'name profileImage')
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/messages
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, text, image, messageType } = req.body;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not part of this conversation' });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      text,
      image: image || '',
      messageType: messageType || 'text',
    });

    // Update last message
    conversation.lastMessage = {
      text,
      sender: req.user._id,
      createdAt: new Date(),
    };
    await conversation.save();

    const populated = await Message.findById(message._id).populate('sender', 'name avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/messages/:conversationId
exports.getMessages = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const messages = await Message.find({ conversation: req.params.conversationId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Mark messages as read
    await Message.updateMany(
      {
        conversation: req.params.conversationId,
        sender: { $ne: req.user._id },
        isRead: false,
      },
      { isRead: true }
    );

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/messages/offer/:conversationId
exports.respondToOffer = async (req, res) => {
  try {
    const { status, counterAmount } = req.body; // accepted, rejected, countered
    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    conversation.offerStatus = status;
    if (status === 'countered' && counterAmount) {
      conversation.offerAmount = counterAmount;
    }
    await conversation.save();

    // Create system message
    const statusText = status === 'accepted' ? 'Offer accepted!' :
      status === 'rejected' ? 'Offer declined.' :
        `Counter offer: ${counterAmount} JOD`;

    await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      text: statusText,
      messageType: 'system',
    });

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
