/**
 * Order Routes
 * 
 * Authenticated routes for order management.
 * Customer routes: Create order, Get own orders
 * Admin routes: Get all orders, Update order status
 */

const express = require('express');
const router = express.Router();

// Import controller functions
const {
    createOrder,
    getAllOrders,
    getUserOrders,
    getOrderById,
    updateOrderStatus
} = require('../controllers/orderController');

// Import middleware
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/roleAuth');

// All routes require authentication
router.use(protect);

/**
 * @route   POST /api/orders
 * @desc    Create new order
 * @access  Private (authenticated users)
 * 
 * Request body:
 * {
 *   "products": [
 *     { "product": "productId1", "quantity": 2 },
 *     { "product": "productId2", "quantity": 1 }
 *   ]
 * }
 */
router.post('/', createOrder);

/**
 * @route   GET /api/orders
 * @desc    Get all orders
 * @access  Private/Admin
 * 
 * Query parameters:
 * - status: Filter by status (pending, completed, cancelled)
 */
router.get('/', adminOnly, getAllOrders);

/**
 * @route   GET /api/orders/user/:userId
 * @desc    Get orders for a specific user
 * @access  Private (user can see own orders, admin can see all)
 */
router.get('/user/:userId', getUserOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Get single order by ID
 * @access  Private (owner or admin)
 */
router.get('/:id', getOrderById);

/**
 * @route   PUT /api/orders/:id
 * @desc    Update order status
 * @access  Private/Admin
 * 
 * Request body:
 * {
 *   "status": "completed" // pending, completed, or cancelled
 * }
 */
router.put('/:id', adminOnly, updateOrderStatus);

module.exports = router;
