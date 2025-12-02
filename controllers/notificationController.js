const Notification = require('../models/Notification');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = asyncHandler(async (req, res, next) => {
  const notifications = await Notification.find({ user: req.user.id })
    .sort('-createdAt')
    .limit(50);

  res.status(200).json({
    success: true,
    count: notifications.length,
    data: notifications
  });
});

// @desc    Get unread notifications count
// @route   GET /api/notifications/unread
// @access  Private
exports.getUnreadCount = asyncHandler(async (req, res, next) => {
  const count = await Notification.countDocuments({
    user: req.user.id,
    isRead: false
  });

  res.status(200).json({
    success: true,
    data: { count }
  });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is notification owner
  if (notification.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this notification', 401));
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({
    success: true,
    data: notification
  });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = asyncHandler(async (req, res, next) => {
  await Notification.updateMany(
    { user: req.user.id, isRead: false },
    { $set: { isRead: true } }
  );

  res.status(200).json({
    success: true,
    data: 'All notifications marked as read'
  });
});

// @desc    Create notification
// @route   POST /api/notifications
// @access  Private/Admin
exports.createNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.create(req.body);

  res.status(201).json({
    success: true,
    data: notification
  });
});

// @desc    Send order notification
// @route   POST /api/notifications/order
// @access  Private
exports.sendOrderNotification = asyncHandler(async (req, res, next) => {
  const { userId, orderId, message } = req.body;

  const notification = await Notification.create({
    user: userId,
    title: 'Order Update',
    message: message || 'Your order status has been updated',
    type: 'order',
    relatedId: orderId,
    relatedType: 'order'
  });

  res.status(201).json({
    success: true,
    data: notification
  });
});

// @desc    Send payout notification
// @route   POST /api/notifications/payout
// @access  Private
exports.sendPayoutNotification = asyncHandler(async (req, res, next) => {
  const { userId, payoutId, message } = req.body;

  const notification = await Notification.create({
    user: userId,
    title: 'Payout Update',
    message: message || 'Your payout status has been updated',
    type: 'payout',
    relatedId: payoutId,
    relatedType: 'payout'
  });

  res.status(201).json({
    success: true,
    data: notification
  });
});