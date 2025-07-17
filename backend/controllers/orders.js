const Order = require('../models/Order');
const User = require('../models/User');
const { createNotification } = require('./notifications');

exports.getOrders = async (req, res) => {
  try {
    let orders;
    
    if (req.user.role === 'admin') {
      orders = await Order.find().populate('user').populate('products.product');
    } else {
      orders = await Order.find({ user: req.user.id }).populate('products.product');
    }
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user').populate('products.product');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure user owns order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const order = await Order.create({
      ...req.body,
      user: req.user.id
    });

    // Update user's order history
    const user = await User.findById(req.user.id);
    user.orderHistory.push({
      order: order._id,
      orderNumber: order.orderNumber,
      orderDate: order.createdAt,
      totalAmount: order.totalAmount,
      status: order.status
    });
    await user.save();

    // Create notification for admin
    await createNotification(
      'new-order',
      'New Order Received',
      `New order #${order.orderNumber} has been placed`,
      { orderId: order._id, userId: req.user.id }
    );

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const oldStatus = order.status;
    order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Create notification for order status change
    if (oldStatus !== order.status) {
      await createNotification(
        'order-status',
        'Order Status Updated',
        `Order #${order.orderNumber} status changed to ${order.status}`,
        { orderId: order._id, userId: order.user }
      );
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 