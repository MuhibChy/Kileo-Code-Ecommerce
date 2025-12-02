const Coupon = require('../models/Coupon');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
exports.getCoupons = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single coupon
// @route   GET /api/coupons/:id
// @access  Private/Admin
exports.getCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return next(new ErrorResponse(`Coupon not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: coupon
  });
});

// @desc    Create coupon
// @route   POST /api/coupons
// @access  Private/Admin
exports.createCoupon = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user.id;

  const coupon = await Coupon.create(req.body);

  res.status(201).json({
    success: true,
    data: coupon
  });
});

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
exports.updateCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!coupon) {
    return next(new ErrorResponse(`Coupon not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: coupon
  });
});

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
exports.deleteCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return next(new ErrorResponse(`Coupon not found with id of ${req.params.id}`, 404));
  }

  await coupon.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Validate coupon
// @route   POST /api/coupons/validate
// @access  Public
exports.validateCoupon = asyncHandler(async (req, res, next) => {
  const { code, orderAmount } = req.body;

  const coupon = await Coupon.findOne({ code });

  if (!coupon) {
    return next(new ErrorResponse('Invalid coupon code', 404));
  }

  if (!coupon.isActive) {
    return next(new ErrorResponse('Coupon is not active', 400));
  }

  if (new Date() < coupon.startDate || new Date() > coupon.endDate) {
    return next(new ErrorResponse('Coupon is not valid for current date', 400));
  }

  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return next(new ErrorResponse('Coupon usage limit reached', 400));
  }

  if (orderAmount < coupon.minOrderAmount) {
    return next(new ErrorResponse(`Minimum order amount is ${coupon.minOrderAmount}`, 400));
  }

  res.status(200).json({
    success: true,
    data: {
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscountAmount: coupon.maxDiscountAmount
    }
  });
});

// @desc    Apply coupon to order
// @route   POST /api/coupons/apply
// @access  Private
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const { code, orderAmount } = req.body;

  const coupon = await Coupon.findOne({ code });

  if (!coupon) {
    return next(new ErrorResponse('Invalid coupon code', 404));
  }

  // Validate coupon
  const validationResponse = await validateCoupon({ body: { code, orderAmount } }, res, next);

  if (!validationResponse.success) {
    return validationResponse;
  }

  // Increment usage count
  coupon.usageCount += 1;
  await coupon.save();

  res.status(200).json({
    success: true,
    data: {
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscountAmount: coupon.maxDiscountAmount,
      finalAmount: calculateFinalAmount(orderAmount, coupon)
    }
  });
});

const calculateFinalAmount = (orderAmount, coupon) => {
  let discountAmount;

  if (coupon.discountType === 'percentage') {
    discountAmount = (orderAmount * coupon.discountValue) / 100;
    if (coupon.maxDiscountAmount) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
    }
  } else {
    discountAmount = coupon.discountValue;
  }

  return orderAmount - discountAmount;
};