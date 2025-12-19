/**
 * Authentication Routes
 * 
 * Routes for user registration and login.
 * All routes are public (no authentication required).
 */

const express = require('express');
const router = express.Router();

// Import controller functions
const { register, login, getMe } = require('../controllers/authController');

// Import authentication middleware
const { protect } = require('../middleware/auth');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 * 
 * Request body:
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "password": "password123"
 * }
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 * 
 * Request body:
 * {
 *   "email": "john@example.com",
 *   "password": "password123"
 * }
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
router.get('/me', protect, getMe);

module.exports = router;
