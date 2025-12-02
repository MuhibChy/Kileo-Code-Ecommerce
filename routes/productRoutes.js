const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByVendor,
  getFeaturedProducts,
  searchProducts
} = require('../controllers/productController');
const advancedResults = require('../middleware/advancedResults');
const Product = require('../models/Product');

// Public routes
router.get('/', advancedResults(Product, [
  { path: 'vendor', select: 'storeName rating' },
  { path: 'category', select: 'name' }
]), getProducts);
router.get('/:id', getProduct);
router.get('/search', searchProducts);
router.get('/featured', getFeaturedProducts);
router.get('/vendor/:vendorId', getProductsByVendor);

// Private routes
router.use(protect);

router.post('/', authorize('vendor', 'admin'), createProduct);
router.put('/:id', authorize('vendor', 'admin'), updateProduct);
router.delete('/:id', authorize('vendor', 'admin'), deleteProduct);

module.exports = router;