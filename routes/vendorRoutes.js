const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getVendors,
  getVendor,
  createVendor,
  updateVendor,
  deleteVendor,
  approveVendor,
  rejectVendor,
  getVendorDashboard
} = require('../controllers/vendorController');
const advancedResults = require('../middleware/advancedResults');
const Vendor = require('../models/Vendor');

// Public routes
router.get('/', advancedResults(Vendor), getVendors);
router.get('/:id', getVendor);

// Private routes
router.use(protect);

router.post('/', authorize('vendor', 'admin'), createVendor);
router.put('/:id', authorize('vendor', 'admin'), updateVendor);
router.delete('/:id', authorize('admin'), deleteVendor);

// Admin routes
router.put('/:id/approve', authorize('admin'), approveVendor);
router.put('/:id/reject', authorize('admin'), rejectVendor);

// Vendor dashboard
router.get('/dashboard', authorize('vendor'), getVendorDashboard);

module.exports = router;