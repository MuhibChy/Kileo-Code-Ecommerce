const Order = require('../models/Order');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private/User or Admin
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is order owner or admin
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to access this order', 401));
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Create order
// @route   POST /api/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  // Check if order items are valid
  for (const item of orderItems) {
    const product = await Product.findById(item.product);

    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${item.product}`, 404));
    }

    if (product.quantity < item.quantity) {
      return next(new ErrorResponse(`Not enough stock for product ${product.name}`, 400));
    }
  }

  // Create order
  const order = await Order.create({
    user: req.user.id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  });

  // Update product quantities
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    product.quantity -= item.quantity;
    await product.save();
  }

  res.status(201).json({
    success: true,
    data: order
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin or Vendor
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }

  // Check if user is authorized to update this order
  const isVendor = await Vendor.findOne({ user: req.user.id });
  const isOrderVendor = order.orderItems.some(item => item.vendor.toString() === isVendor?._id.toString());

  if (req.user.role !== 'admin' && !isOrderVendor) {
    return next(new ErrorResponse('Not authorized to update this order', 401));
  }

  order.orderStatus = req.body.status;
  await order.save();

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.email_address
  };

  await order.save();

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  await order.save();

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Get user orders
// @route   GET /api/orders/mine
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id })
    .sort('-createdAt')
    .populate('orderItems.product', 'name image');

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get vendor orders
// @route   GET /api/orders/vendor
// @access  Private/Vendor
exports.getVendorOrders = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findOne({ user: req.user.id });

  if (!vendor) {
    return next(new ErrorResponse('Vendor not found', 404));
  }

  const orders = await Order.find({ 'orderItems.vendor': vendor._id })
    .sort('-createdAt')
    .populate('user', 'name email');

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});