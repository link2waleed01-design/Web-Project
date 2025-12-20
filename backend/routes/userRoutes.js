/**
 * User Routes
 * 
 * Admin-only routes for user management.
 * All routes require authentication and admin role.
 */

const express = require('express');
const router = express.Router();

// Import controller functions
const {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/userController');

// Import middleware
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/roleAuth');

// All routes below require authentication and admin role
router.use(protect);
router.use(adminOnly);

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private/Admin
 */
router.get('/', getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get single user by ID
 * @access  Private/Admin
 */
router.get('/:id', getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private/Admin
 */
router.put('/:id', updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private/Admin
 */
router.delete('/:id', deleteUser);

module.exports = router;
