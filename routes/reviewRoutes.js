const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  approveReview,
  getUserReviews
} = require('../controllers/reviewController');

// Public routes
router.get('/:productId', getReviews);
router.get('/:id', getReview);
router.get('/user/:userId', getUserReviews);

// Private routes
router.use(protect);

router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

// Admin routes
router.put('/:id/approve', authorize('admin'), approveReview);

module.exports = router;