const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
  getBannersByPosition
} = require('../controllers/bannerController');

// Public routes
router.get('/', getBanners);
router.get('/:id', getBanner);
router.get('/position/:position', getBannersByPosition);

// Private routes - Admin only
router.use(protect);
router.use(authorize('admin'));

router.post('/', createBanner);
router.put('/:id', updateBanner);
router.delete('/:id', deleteBanner);

module.exports = router;