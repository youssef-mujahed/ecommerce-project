const express = require('express');
const router = express.Router();
const { 
  getNotifications, 
  markAsRead, 
  markAllAsRead, 
  getUnreadCount 
} = require('../controllers/notifications');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin'), getNotifications);

router.get('/unread-count', protect, authorize('admin'), getUnreadCount);

router.put('/:id/read', protect, authorize('admin'), markAsRead);

router.put('/read-all', protect, authorize('admin'), markAllAsRead);

module.exports = router; 