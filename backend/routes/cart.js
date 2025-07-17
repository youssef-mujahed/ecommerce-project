const express = require('express');
const router = express.Router();
const { 
  getCart,
  getGuestCart,
  addToCart,
  addToGuestCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cart');
const { protect } = require('../middleware/auth');

router.get('/', protect, getCart);

router.get('/guest/:sessionId', getGuestCart);

router.post('/', protect, addToCart);

router.post('/guest', addToGuestCart);

router.put('/:itemId', protect, updateCartItem);

router.delete('/:itemId', protect, removeFromCart);

router.delete('/', protect, clearCart);

module.exports = router; 