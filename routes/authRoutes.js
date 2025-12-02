const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getMe, forgotPassword, resetPassword, verifyEmail } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// User routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.post('/verifyemail', verifyEmail);

// Social login routes (to be implemented)
router.post('/google', (req, res) => {
  res.status(501).json({ message: 'Google login not implemented yet' });
});

router.post('/facebook', (req, res) => {
  res.status(501).json({ message: 'Facebook login not implemented yet' });
});

module.exports = router;