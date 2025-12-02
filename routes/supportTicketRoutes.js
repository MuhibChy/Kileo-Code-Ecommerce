const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getSupportTickets,
  getSupportTicket,
  createSupportTicket,
  updateSupportTicket,
  addReply,
  getMySupportTickets,
  closeSupportTicket,
  assignSupportTicket
} = require('../controllers/supportTicketController');
const advancedResults = require('../middleware/advancedResults');
const SupportTicket = require('../models/SupportTicket');

// Public routes
router.get('/', protect, authorize('admin'), advancedResults(SupportTicket), getSupportTickets);

// Private routes
router.use(protect);

router.post('/', createSupportTicket);
router.get('/mine', getMySupportTickets);
router.get('/:id', getSupportTicket);
router.put('/:id', updateSupportTicket);
router.post('/:id/reply', addReply);
router.put('/:id/close', closeSupportTicket);

// Admin routes
router.put('/:id/assign', authorize('admin'), assignSupportTicket);

module.exports = router;