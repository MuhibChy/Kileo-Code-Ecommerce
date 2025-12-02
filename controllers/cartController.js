const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id })
    .populate('items.product', 'name price image slug vendor')
    .populate('items.vendor', 'storeName');

  if (!cart) {
    return res.status(200).json({
      success: true,
      data: { items: [], coupon: null }
    });
  }

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity, variant } = req.body;

  // Check if product exists and get vendor
  const product = await Product.findById(productId).populate('vendor');

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${productId}`, 404));
  }

  if (product.quantity < quantity) {
    return next(new ErrorResponse(`Not enough stock for product ${product.name}`, 400));
  }

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: [{
        product: productId,
        vendor: product.vendor._id,
        quantity,
        price: product.price,
        variant
      }]
    });
  } else {
    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(item =>
      item.product.toString() === productId &&
      item.variant === variant
    );

    if (existingItemIndex >= 0) {
      // Update quantity if product already in cart
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        product: productId,
        vendor: product.vendor._id,
        quantity,
        price: product.price,
        variant
      });
    }

    await cart.save();
  }

  res.status(201).json({
    success: true,
    data: cart
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const { quantity, variant } = req.body;

  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  // Find the item in cart
  const itemIndex = cart.items.findIndex(item =>
    item.product.toString() === req.params.productId &&
    item.variant === variant
  );

  if (itemIndex < 0) {
    return next(new ErrorResponse('Item not found in cart', 404));
  }

  // Check product stock
  const product = await Product.findById(req.params.productId);

  if (product.quantity < quantity) {
    return next(new ErrorResponse(`Not enough stock for product ${product.name}`, 400));
  }

  // Update quantity
  cart.items[itemIndex].quantity = quantity;
  await cart.save();

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
exports.removeFromCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  // Filter out the item to remove
  cart.items = cart.items.filter(item =>
    item.product.toString() !== req.params.productId ||
    item.variant !== req.query.variant
  );

  await cart.save();

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  cart.items = [];
  cart.coupon = null;
  await cart.save();

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Apply coupon to cart
// @route   POST /api/cart/coupon
// @access  Private
exports.applyCouponToCart = asyncHandler(async (req, res, next) => {
  const { code } = req.body;
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  // Validate coupon (this would be implemented in coupon controller)
  // For now, we'll just set the coupon data
  cart.coupon = {
    code,
    discountType: 'percentage',
    discountValue: 10,
    maxDiscountAmount: 50
  };

  await cart.save();

  res.status(200).json({
    success: true,
    data: cart
  });
});

// @desc    Remove coupon from cart
// @route   DELETE /api/cart/coupon
// @access  Private
exports.removeCouponFromCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  cart.coupon = null;
  await cart.save();

  res.status(200).json({
    success: true,
    data: cart
  });
});