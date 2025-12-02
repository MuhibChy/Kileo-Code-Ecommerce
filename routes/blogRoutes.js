const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  unlikeBlog,
  getFeaturedBlogs,
  getBlogsByCategory
} = require('../controllers/blogController');

// Public routes
router.get('/', getBlogs);
router.get('/:id', getBlog);
router.get('/featured', getFeaturedBlogs);
router.get('/category/:category', getBlogsByCategory);

// Private routes
router.use(protect);

router.post('/:id/like', likeBlog);
router.delete('/:id/like', unlikeBlog);

// Admin routes
router.use(authorize('admin'));

router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

module.exports = router;