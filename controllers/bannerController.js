const Banner = require('../models/Banner');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all banners
// @route   GET /api/banners
// @access  Public
exports.getBanners = asyncHandler(async (req, res, next) => {
  const banners = await Banner.find({ isActive: true })
    .sort('position');

  res.status(200).json({
    success: true,
    count: banners.length,
    data: banners
  });
});

// @desc    Get single banner
// @route   GET /api/banners/:id
// @access  Public
exports.getBanner = asyncHandler(async (req, res, next) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    return next(new ErrorResponse(`Banner not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: banner
  });
});

// @desc    Create banner
// @route   POST /api/banners
// @access  Private/Admin
exports.createBanner = asyncHandler(async (req, res, next) => {
  req.body.createdBy = req.user.id;

  const banner = await Banner.create(req.body);

  res.status(201).json({
    success: true,
    data: banner
  });
});

// @desc    Update banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
exports.updateBanner = asyncHandler(async (req, res, next) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!banner) {
    return next(new ErrorResponse(`Banner not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: banner
  });
});

// @desc    Delete banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
exports.deleteBanner = asyncHandler(async (req, res, next) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    return next(new ErrorResponse(`Banner not found with id of ${req.params.id}`, 404));
  }

  await banner.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get banners by position
// @route   GET /api/banners/position/:position
// @access  Public
exports.getBannersByPosition = asyncHandler(async (req, res, next) => {
  const banners = await Banner.find({
    position: req.params.position,
    isActive: true
  }).sort('createdAt');

  res.status(200).json({
    success: true,
    count: banners.length,
    data: banners
  });
});