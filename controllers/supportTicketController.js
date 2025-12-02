const SupportTicket = require('../models/SupportTicket');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all support tickets
// @route   GET /api/support-tickets
// @access  Private/Admin
exports.getSupportTickets = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single support ticket
// @route   GET /api/support-tickets/:id
// @access  Private
exports.getSupportTicket = asyncHandler(async (req, res, next) => {
  const ticket = await SupportTicket.findById(req.params.id)
    .populate('user', 'name email')
    .populate('assignedTo', 'name email')
    .populate('replies.user', 'name email');

  if (!ticket) {
    return next(new ErrorResponse(`Support ticket not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is ticket owner or admin
  if (ticket.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to access this ticket', 401));
  }

  res.status(200).json({
    success: true,
    data: ticket
  });
});

// @desc    Create support ticket
// @route   POST /api/support-tickets
// @access  Private
exports.createSupportTicket = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const ticket = await SupportTicket.create(req.body);

  res.status(201).json({
    success: true,
    data: ticket
  });
});

// @desc    Update support ticket
// @route   PUT /api/support-tickets/:id
// @access  Private/Admin
exports.updateSupportTicket = asyncHandler(async (req, res, next) => {
  const ticket = await SupportTicket.findById(req.params.id);

  if (!ticket) {
    return next(new ErrorResponse(`Support ticket not found with id of ${req.params.id}`, 404));
  }

  // Only admin can update certain fields
  if (req.user.role !== 'admin') {
    delete req.body.status;
    delete req.body.assignedTo;
    delete req.body.priority;
  }

  const updatedTicket = await SupportTicket.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: updatedTicket
  });
});

// @desc    Add reply to support ticket
// @route   POST /api/support-tickets/:id/reply
// @access  Private
exports.addReply = asyncHandler(async (req, res, next) => {
  const ticket = await SupportTicket.findById(req.params.id);

  if (!ticket) {
    return next(new ErrorResponse(`Support ticket not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is ticket owner or admin or assigned agent
  if (
    ticket.user.toString() !== req.user.id &&
    req.user.role !== 'admin' &&
    ticket.assignedTo?.toString() !== req.user.id
  ) {
    return next(new ErrorResponse('Not authorized to reply to this ticket', 401));
  }

  const reply = {
    user: req.user.id,
    message: req.body.message
  };

  ticket.replies.push(reply);
  ticket.updatedAt = Date.now();

  // If user is replying and not admin, mark as pending
  if (req.user.role !== 'admin') {
    ticket.status = 'pending';
  }

  await ticket.save();

  res.status(200).json({
    success: true,
    data: ticket
  });
});

// @desc    Get user support tickets
// @route   GET /api/support-tickets/mine
// @access  Private
exports.getMySupportTickets = asyncHandler(async (req, res, next) => {
  const tickets = await SupportTicket.find({ user: req.user.id })
    .sort('-createdAt')
    .populate('assignedTo', 'name email');

  res.status(200).json({
    success: true,
    count: tickets.length,
    data: tickets
  });
});

// @desc    Close support ticket
// @route   PUT /api/support-tickets/:id/close
// @access  Private
exports.closeSupportTicket = asyncHandler(async (req, res, next) => {
  const ticket = await SupportTicket.findById(req.params.id);

  if (!ticket) {
    return next(new ErrorResponse(`Support ticket not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is ticket owner or admin
  if (ticket.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to close this ticket', 401));
  }

  ticket.status = 'closed';
  await ticket.save();

  res.status(200).json({
    success: true,
    data: ticket
  });
});

// @desc    Assign support ticket to agent
// @route   PUT /api/support-tickets/:id/assign
// @access  Private/Admin
exports.assignSupportTicket = asyncHandler(async (req, res, next) => {
  const ticket = await SupportTicket.findById(req.params.id);

  if (!ticket) {
    return next(new ErrorResponse(`Support ticket not found with id of ${req.params.id}`, 404));
  }

  ticket.assignedTo = req.body.agentId;
  ticket.status = 'pending';
  await ticket.save();

  res.status(200).json({
    success: true,
    data: ticket
  });
});