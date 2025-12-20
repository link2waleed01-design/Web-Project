/**
 * Category Routes
 * 
 * Public routes: GET all categories, GET single category
 * Admin routes: POST, PUT, DELETE categories
 */

const express = require('express');
const router = express.Router();

// Import controller functions
const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');

// Import middleware
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/roleAuth');

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', getAllCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    Get single category by ID
 * @access  Public
 */
router.get('/:id', getCategoryById);

/**
 * @route   POST /api/categories
 * @desc    Create new category
 * @access  Private/Admin
 * 
 * Request body:
 * {
 *   "name": "Electronics",
 *   "description": "Electronic devices and gadgets"
 * }
 */
router.post('/', protect, adminOnly, createCategory);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update category
 * @access  Private/Admin
 */
router.put('/:id', protect, adminOnly, updateCategory);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category
 * @access  Private/Admin
 * 
 * Note: Cannot delete if products are using this category
 */
router.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = router;
