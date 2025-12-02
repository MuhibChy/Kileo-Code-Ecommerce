const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  createNotification,
  sendOrderNotification,
  sendPayoutNotification
} = require('../controllers/notificationController');

// Private routes
router.use(protect);

router.get('/', getNotifications);
router.get('/unread', getUnreadCount);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);

// Admin routes
router.post('/', authorize('admin'), createNotification);
router.post('/order', sendOrderNotification);
router.post('/payout', sendPayoutNotification);

module.exports = router;