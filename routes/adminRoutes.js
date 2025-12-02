const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getAdminDashboard,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getAllVendors,
  approveVendor,
  rejectVendor,
  getAllProducts,
  getAllOrders,
  updateOrderStatus,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/adminController');
const advancedResults = require('../middleware/advancedResults');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');

// Private routes - Admin only
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getAdminDashboard);

// User management
router.get('/users', advancedResults(User), getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Vendor management
router.get('/vendors', advancedResults(Vendor), getAllVendors);
router.put('/vendors/:id/approve', approveVendor);
router.put('/vendors/:id/reject', rejectVendor);

// Product management
router.get('/products', advancedResults(Product), getAllProducts);

// Order management
router.get('/orders', advancedResults(Order), getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Category management
router.get('/categories', advancedResults(Category), getAllCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

module.exports = router;