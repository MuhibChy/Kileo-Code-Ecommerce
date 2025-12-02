const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getVendorOrders
} = require('../controllers/orderController');
const advancedResults = require('../middleware/advancedResults');
const Order = require('../models/Order');

// Public routes
router.get('/', protect, authorize('admin'), advancedResults(Order), getOrders);

// Private routes
router.use(protect);

router.post('/', createOrder);
router.get('/mine', getMyOrders);
router.get('/vendor', authorize('vendor'), getVendorOrders);
router.get('/:id', getOrder);
router.put('/:id/status', updateOrderStatus);
router.put('/:id/pay', updateOrderToPaid);
router.put('/:id/deliver', authorize('admin'), updateOrderToDelivered);

module.exports = router;