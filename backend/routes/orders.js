const express = require('express');
const router = express.Router();
const { 
  getOrders, 
  getOrder, 
  createOrder, 
  updateOrder 
} = require('../controllers/orders');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getOrders);

router.get('/:id', protect, getOrder);

router.post('/', protect, createOrder);

router.put('/:id', protect, authorize('admin'), updateOrder);

module.exports = router; 