const Notification = require('../models/Notification');
const Order = require('../models/Order');
const Product = require('../models/Product');


exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ isActive: true })
      .sort('-createdAt')
      .limit(50);

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};


exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};


exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { isActive: true, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};


exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      isActive: true,
      isRead: false
    });

    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Helper function to create notifications
exports.createNotification = async (type, title, message, data = {}) => {
  try {
    await Notification.create({
      type,
      title,
      message,
      data
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}; 