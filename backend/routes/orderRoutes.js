/**
 * Order Routes
 * 
 * Routes for order management.
 * Customer routes: Preview, Confirm, Get own orders, Order history by email
 * Admin routes: Get all orders, Update order status
 */

const express = require('express');
const router = express.Router();

// Import controller functions
const {
    previewOrder,
    confirmOrder,
    getOrdersByEmail,
    getAllOrders,
    getUserOrders,
    getOrderById,
    updateOrderStatus
} = require('../controllers/orderController');

// Import middleware
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/roleAuth');
const { applyDiscount } = require('../middleware/applyDiscount');

/**
 * @route   POST /api/orders/my-orders
 * @desc    Get orders by email (Order History)
 * @access  Public
 * 
 * Request body:
 * {
 *   "email": "customer@example.com"
 * }
 */
router.post('/my-orders', getOrdersByEmail);

// Protected routes (require authentication)
router.use(protect);

/**
 * @route   POST /api/orders/preview
 * @desc    Preview order with discounts applied
 * @access  Private (authenticated users)
 * 
 * Request body:
 * {
 *   "products": [
 *     { "product": "productId1", "quantity": 2 },
 *     { "product": "productId2", "quantity": 1 }
 *   ],
 *   "couponCode": "SAVE10"  // optional
 * }
 */
router.post('/preview', applyDiscount, previewOrder);

/**
 * @route   POST /api/orders/confirm
 * @desc    Confirm and create order
 * @access  Private (authenticated users)
 * 
 * Request body:
 * {
 *   "products": [
 *     { "product": "productId1", "quantity": 2 },
 *     { "product": "productId2", "quantity": 1 }
 *   ],
 *   "couponCode": "SAVE10"  // optional
 * }
 */
router.post('/confirm', applyDiscount, confirmOrder);

/**
 * @route   GET /api/orders
 * @desc    Get all orders
 * @access  Private/Admin
 * 
 * Query parameters:
 * - status: Filter by status (Placed, Processing, Delivered, Cancelled)
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
 *   "status": "Processing"  // Placed, Processing, Delivered, or Cancelled
 * }
 * 
 * Status transitions:
 * - Placed → Processing or Cancelled
 * - Processing → Delivered or Cancelled
 * - Delivered/Cancelled → No further changes
 */
router.put('/:id', adminOnly, updateOrderStatus);

module.exports = router;
