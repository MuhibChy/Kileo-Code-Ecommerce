const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('paypal-rest-sdk');
const razorpay = require('razorpay');
const Order = require('../models/Order');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// Configure PayPal
paypal.configure({
  mode: 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
});

// Configure Razorpay
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Process Stripe payment
// @route   POST /api/payments/stripe
// @access  Private
exports.processStripePayment = asyncHandler(async (req, res, next) => {
  const { amount, currency, paymentMethodId, orderId } = req.body;

  try {
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: currency || 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      metadata: { orderId }
    });

    if (paymentIntent.status === 'succeeded') {
      // Update order payment status
      const order = await Order.findById(orderId);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: paymentIntent.id,
          status: paymentIntent.status,
          update_time: new Date().toISOString(),
          email_address: paymentIntent.receipt_email
        };
        await order.save();
      }

      res.status(200).json({
        success: true,
        data: paymentIntent
      });
    } else {
      return next(new ErrorResponse('Payment not completed', 400));
    }
  } catch (error) {
    return next(new ErrorResponse(error.message, 400));
  }
});

// @desc    Create PayPal payment
// @route   POST /api/payments/paypal
// @access  Private
exports.createPayPalPayment = asyncHandler(async (req, res, next) => {
  const { amount, currency, orderId } = req.body;

  const create_payment_json = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal'
    },
    redirect_urls: {
      return_url: `${process.env.FRONTEND_URL}/payment-success?orderId=${orderId}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`
    },
    transactions: [{
      item_list: {
        items: [{
          name: 'Order Payment',
          sku: 'order',
          price: amount,
          currency: currency || 'USD',
          quantity: 1
        }]
      },
      amount: {
        currency: currency || 'USD',
        total: amount
      },
      description: 'Payment for order'
    }]
  };

  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      return next(new ErrorResponse(error.message, 400));
    } else {
      res.status(200).json({
        success: true,
        data: payment
      });
    }
  });
});

// @desc    Execute PayPal payment
// @route   POST /api/payments/paypal/execute
// @access  Private
exports.executePayPalPayment = asyncHandler(async (req, res, next) => {
  const { paymentId, PayerID, orderId } = req.body;

  const execute_payment_json = {
    payer_id: PayerID,
    transactions: [{
      amount: {
        currency: 'USD',
        total: req.body.amount
      }
    }]
  };

  paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
    if (error) {
      return next(new ErrorResponse(error.message, 400));
    } else {
      // Update order payment status
      const order = await Order.findById(orderId);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: payment.id,
          status: payment.state,
          update_time: new Date().toISOString(),
          email_address: payment.payer.payer_info.email
        };
        await order.save();
      }

      res.status(200).json({
        success: true,
        data: payment
      });
    }
  });
});

// @desc    Create Razorpay order
// @route   POST /api/payments/razorpay
// @access  Private
exports.createRazorpayOrder = asyncHandler(async (req, res, next) => {
  const { amount, currency, orderId } = req.body;

  const options = {
    amount: amount * 100, // Convert to paise
    currency: currency || 'INR',
    receipt: orderId
  };

  try {
    const razorpayOrder = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      data: razorpayOrder
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 400));
  }
});

// @desc    Verify Razorpay payment
// @route   POST /api/payments/razorpay/verify
// @access  Private
exports.verifyRazorpayPayment = asyncHandler(async (req, res, next) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

  const crypto = require('crypto');
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(razorpayOrderId + '|' + razorpayPaymentId)
    .digest('hex');

  if (generatedSignature === razorpaySignature) {
    // Update order payment status
    const order = await Order.findById(orderId);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: razorpayPaymentId,
        status: 'captured',
        update_time: new Date().toISOString(),
        email_address: req.user.email
      };
      await order.save();
    }

    res.status(200).json({
      success: true,
      data: 'Payment verified successfully'
    });
  } else {
    return next(new ErrorResponse('Payment verification failed', 400));
  }
});

// @desc    Process Cash on Delivery
// @route   POST /api/payments/cod
// @access  Private
exports.processCOD = asyncHandler(async (req, res, next) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${orderId}`, 404));
  }

  // For COD, we just mark the order as created but not paid
  // Payment will be confirmed upon delivery
  order.paymentMethod = 'cash_on_delivery';
  await order.save();

  res.status(200).json({
    success: true,
    data: 'Cash on Delivery order created successfully'
  });
});