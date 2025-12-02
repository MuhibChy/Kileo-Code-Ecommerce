const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  processStripePayment,
  createPayPalPayment,
  executePayPalPayment,
  createRazorpayOrder,
  verifyRazorpayPayment,
  processCOD
} = require('../controllers/paymentController');

// Private routes
router.use(protect);

router.post('/stripe', processStripePayment);
router.post('/paypal', createPayPalPayment);
router.post('/paypal/execute', executePayPalPayment);
router.post('/razorpay', createRazorpayOrder);
router.post('/razorpay/verify', verifyRazorpayPayment);
router.post('/cod', processCOD);

module.exports = router;