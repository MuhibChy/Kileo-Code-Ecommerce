const Payout = require('../models/Payout');
const Vendor = require('../models/Vendor');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all payouts
// @route   GET /api/payouts
// @access  Private/Admin
exports.getPayouts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single payout
// @route   GET /api/payouts/:id
// @access  Private/Admin or Vendor
exports.getPayout = asyncHandler(async (req, res, next) => {
  const payout = await Payout.findById(req.params.id)
    .populate('vendor', 'storeName email');

  if (!payout) {
    return next(new ErrorResponse(`Payout not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is payout owner or admin
  if (payout.vendor.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to access this payout', 401));
  }

  res.status(200).json({
    success: true,
    data: payout
  });
});

// @desc    Create payout request
// @route   POST /api/payouts
// @access  Private/Vendor
exports.createPayout = asyncHandler(async (req, res, next) => {
  // Check if user is a vendor
  const vendor = await Vendor.findOne({ user: req.user.id });

  if (!vendor) {
    return next(new ErrorResponse('Only vendors can request payouts', 401));
  }

  if (vendor.balance <= 0) {
    return next(new ErrorResponse('Insufficient balance for payout', 400));
  }

  // Create payout request
  const payout = await Payout.create({
    vendor: vendor._id,
    amount: req.body.amount || vendor.balance,
    paymentMethod: vendor.payoutMethod,
    paymentDetails: vendor.payoutDetails,
    status: 'pending'
  });

  // Update vendor balance
  vendor.balance -= payout.amount;
  await vendor.save();

  res.status(201).json({
    success: true,
    data: payout
  });
});

// @desc    Update payout status
// @route   PUT /api/payouts/:id/status
// @access  Private/Admin
exports.updatePayoutStatus = asyncHandler(async (req, res, next) => {
  const payout = await Payout.findById(req.params.id);

  if (!payout) {
    return next(new ErrorResponse(`Payout not found with id of ${req.params.id}`, 404));
  }

  payout.status = req.body.status;
  payout.updatedAt = Date.now();

  if (req.body.status === 'completed') {
    payout.completedAt = Date.now();
  }

  await payout.save();

  res.status(200).json({
    success: true,
    data: payout
  });
});

// @desc    Get vendor payouts
// @route   GET /api/payouts/vendor
// @access  Private/Vendor
exports.getVendorPayouts = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findOne({ user: req.user.id });

  if (!vendor) {
    return next(new ErrorResponse('Vendor not found', 404));
  }

  const payouts = await Payout.find({ vendor: vendor._id })
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: payouts.length,
    data: payouts
  });
});

// @desc    Get vendor payout balance
// @route   GET /api/payouts/balance
// @access  Private/Vendor
exports.getVendorBalance = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findOne({ user: req.user.id });

  if (!vendor) {
    return next(new ErrorResponse('Vendor not found', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      currentBalance: vendor.balance,
      totalEarnings: vendor.totalSales,
      pendingPayouts: await Payout.countDocuments({
        vendor: vendor._id,
        status: 'pending'
      })
    }
  });
});

// @desc    Process automatic payouts (cron job)
// @route   POST /api/payouts/auto-process
// @access  Private/Admin
exports.processAutomaticPayouts = asyncHandler(async (req, res, next) => {
  // This would typically be run as a cron job
  const vendors = await Vendor.find({
    balance: { $gt: 0 },
    isApproved: true
  });

  const processedPayouts = [];

  for (const vendor of vendors) {
    if (vendor.balance >= 100) { // Minimum payout threshold
      const payout = await Payout.create({
        vendor: vendor._id,
        amount: vendor.balance,
        paymentMethod: vendor.payoutMethod,
        paymentDetails: vendor.payoutDetails,
        status: 'processing'
      });

      vendor.balance = 0;
      await vendor.save();

      processedPayouts.push(payout);
    }
  }

  res.status(200).json({
    success: true,
    count: processedPayouts.length,
    data: processedPayouts
  });
});