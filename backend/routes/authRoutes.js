const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, verifyOTP, resendOTP } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin, handleValidationErrors } = require('../utils/validators');

// Registration with OTP verification
router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

// Authentication
router.post('/login', validateLogin, handleValidationErrors, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
