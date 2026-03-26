const express = require('express');
const router = express.Router();
const {
  createConversation, getConversations, sendMessage,
  getMessages, respondToOffer,
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/conversation', createConversation);
router.get('/conversations', getConversations);
router.post('/', sendMessage);
router.get('/:conversationId', getMessages);
router.put('/offer/:conversationId', respondToOffer);

module.exports = router;
