/**
 * Product Routes
 * 
 * Public routes: GET all products, GET single product
 * Admin routes: POST, PUT, DELETE products
 */

const express = require('express');
const router = express.Router();

// Import controller functions
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

// Import middleware
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/roleAuth');

/**
 * @route   GET /api/products
 * @desc    Get all products (with optional filters)
 * @access  Public
 * 
 * Query parameters:
 * - category: Filter by category ID
 * - minPrice: Minimum price
 * - maxPrice: Maximum price
 * - search: Search in title
 */
router.get('/', getAllProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
router.get('/:id', getProductById);

/**
 * @route   POST /api/products
 * @desc    Create new product
 * @access  Private/Admin
 * 
 * Request body:
 * {
 *   "title": "Product Name",
 *   "description": "Product description",
 *   "price": 99.99,
 *   "category": "categoryId",
 *   "images": ["url1", "url2"],
 *   "stock": 100
 * }
 */
router.post('/', protect, adminOnly, createProduct);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Private/Admin
 */
router.put('/:id', protect, adminOnly, updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Private/Admin
 */
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
