const Vendor = require('../models/Vendor');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all vendors
// @route   GET /api/vendors
// @access  Public
exports.getVendors = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single vendor
// @route   GET /api/vendors/:id
// @access  Public
exports.getVendor = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findById(req.params.id).populate('user');

  if (!vendor) {
    return next(new ErrorResponse(`Vendor not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: vendor
  });
});

// @desc    Create vendor
// @route   POST /api/vendors
// @access  Private/Admin
exports.createVendor = asyncHandler(async (req, res, next) => {
  // Check if user already has a vendor account
  const existingVendor = await Vendor.findOne({ user: req.user.id });

  if (existingVendor) {
    return next(new ErrorResponse('User already has a vendor account', 400));
  }

  // Create vendor
  const vendor = await Vendor.create({
    user: req.user.id,
    ...req.body
  });

  res.status(201).json({
    success: true,
    data: vendor
  });
});

// @desc    Update vendor
// @route   PUT /api/vendors/:id
// @access  Private/Vendor or Admin
exports.updateVendor = asyncHandler(async (req, res, next) => {
  let vendor = await Vendor.findById(req.params.id);

  if (!vendor) {
    return next(new ErrorResponse(`Vendor not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is vendor owner or admin
  if (vendor.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this vendor', 401));
  }

  vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: vendor
  });
});

// @desc    Delete vendor
// @route   DELETE /api/vendors/:id
// @access  Private/Admin
exports.deleteVendor = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findById(req.params.id);

  if (!vendor) {
    return next(new ErrorResponse(`Vendor not found with id of ${req.params.id}`, 404));
  }

  await vendor.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Approve vendor
// @route   PUT /api/vendors/:id/approve
// @access  Private/Admin
exports.approveVendor = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findById(req.params.id);

  if (!vendor) {
    return next(new ErrorResponse(`Vendor not found with id of ${req.params.id}`, 404));
  }

  vendor.isApproved = true;
  vendor.approvalStatus = 'approved';

  await vendor.save();

  res.status(200).json({
    success: true,
    data: vendor
  });
});

// @desc    Reject vendor
// @route   PUT /api/vendors/:id/reject
// @access  Private/Admin
exports.rejectVendor = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findById(req.params.id);

  if (!vendor) {
    return next(new ErrorResponse(`Vendor not found with id of ${req.params.id}`, 404));
  }

  vendor.isApproved = false;
  vendor.approvalStatus = 'rejected';

  await vendor.save();

  res.status(200).json({
    success: true,
    data: vendor
  });
});

// @desc    Get vendor dashboard stats
// @route   GET /api/vendors/dashboard
// @access  Private/Vendor
exports.getVendorDashboard = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findOne({ user: req.user.id });

  if (!vendor) {
    return next(new ErrorResponse('Vendor not found', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      totalSales: vendor.totalSales,
      totalOrders: vendor.totalOrders,
      balance: vendor.balance,
      rating: vendor.rating
    }
  });
});