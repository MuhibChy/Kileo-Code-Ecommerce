const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getPayouts,
  getPayout,
  createPayout,
  updatePayoutStatus,
  getVendorPayouts,
  getVendorBalance,
  processAutomaticPayouts
} = require('../controllers/payoutController');
const advancedResults = require('../middleware/advancedResults');
const Payout = require('../models/Payout');

// Public routes
router.get('/', protect, authorize('admin'), advancedResults(Payout), getPayouts);

// Private routes
router.use(protect);

router.get('/vendor', authorize('vendor'), getVendorPayouts);
router.get('/balance', authorize('vendor'), getVendorBalance);
router.post('/', authorize('vendor'), createPayout);
router.get('/:id', getPayout);

// Admin routes
router.put('/:id/status', authorize('admin'), updatePayoutStatus);
router.post('/auto-process', authorize('admin'), processAutomaticPayouts);

module.exports = router;