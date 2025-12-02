const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  applyCoupon
} = require('../controllers/couponController');
const advancedResults = require('../middleware/advancedResults');
const Coupon = require('../models/Coupon');

// Public routes
router.post('/validate', validateCoupon);
router.post('/apply', protect, applyCoupon);

// Private routes - Admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/', advancedResults(Coupon), getCoupons);
router.get('/:id', getCoupon);
router.post('/', createCoupon);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

module.exports = router;