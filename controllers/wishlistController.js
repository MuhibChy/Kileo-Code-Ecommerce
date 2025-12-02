const Wishlist = require('../models/Wishlist');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = asyncHandler(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({ user: req.user.id })
    .populate('items.product', 'name price image slug');

  if (!wishlist) {
    return res.status(200).json({
      success: true,
      data: { items: [] }
    });
  }

  res.status(200).json({
    success: true,
    data: wishlist
  });
});

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
exports.addToWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;

  let wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user.id,
      items: [{ product: productId }]
    });
  } else {
    // Check if product already in wishlist
    const existingItem = wishlist.items.find(item =>
      item.product.toString() === productId
    );

    if (existingItem) {
      return next(new ErrorResponse('Product already in wishlist', 400));
    }

    wishlist.items.push({ product: productId });
    await wishlist.save();
  }

  res.status(201).json({
    success: true,
    data: wishlist
  });
});

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeFromWishlist = asyncHandler(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    return next(new ErrorResponse('Wishlist not found', 404));
  }

  // Filter out the item to remove
  wishlist.items = wishlist.items.filter(item =>
    item.product.toString() !== req.params.productId
  );

  await wishlist.save();

  res.status(200).json({
    success: true,
    data: wishlist
  });
});

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
exports.clearWishlist = asyncHandler(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    return next(new ErrorResponse('Wishlist not found', 404));
  }

  wishlist.items = [];
  await wishlist.save();

  res.status(200).json({
    success: true,
    data: wishlist
  });
});