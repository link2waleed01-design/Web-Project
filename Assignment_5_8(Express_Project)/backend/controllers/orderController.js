/**
 * Order Controller
 * 
 * Handles all order-related operations.
 * Customer routes: createOrder, getUserOrders
 * Admin routes: getAllOrders, updateOrderStatus
 */

const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private (authenticated users)
 * 
 * @param {Array} req.body.products - Array of { product: productId, quantity: number }
 */
const createOrder = async (req, res, next) => {
    try {
        const { products } = req.body;

        // Validate products array
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide at least one product'
            });
        }

        // Calculate total price and validate products exist
        let totalPrice = 0;
        const orderProducts = [];

        for (const item of products) {
            // Validate each item has product and quantity
            if (!item.product || !item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: 'Each product must have a product ID and quantity'
                });
            }

            // Find product and check if it exists
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product with ID ${item.product} not found`
                });
            }

            // Check stock availability
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.title}. Available: ${product.stock}`
                });
            }

            // Add to order products and calculate price
            orderProducts.push({
                product: item.product,
                quantity: item.quantity
            });
            totalPrice += product.price * item.quantity;

            // Decrease product stock
            product.stock -= item.quantity;
            await product.save();
        }

        // Create order
        const order = await Order.create({
            user: req.user._id,
            products: orderProducts,
            totalPrice
        });

        // Populate order details for response
        await order.populate([
            { path: 'user', select: 'name email' },
            { path: 'products.product', select: 'title price' }
        ]);

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: order
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all orders (Admin only)
 * @route   GET /api/orders
 * @access  Private/Admin
 * 
 * Supports query parameters:
 * - status: Filter by order status
 */
const getAllOrders = async (req, res, next) => {
    try {
        // Build query
        let query = {};

        // Filter by status if provided
        if (req.query.status) {
            query.status = req.query.status;
        }

        const orders = await Order.find(query)
            .populate('user', 'name email')
            .populate('products.product', 'title price')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get orders for a specific user
 * @route   GET /api/orders/user/:userId
 * @access  Private (user can see own orders, admin can see all)
 */
const getUserOrders = async (req, res, next) => {
    try {
        const { userId } = req.params;

        // Check if user is authorized (own orders or admin)
        if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view these orders'
            });
        }

        const orders = await Order.find({ user: userId })
            .populate('user', 'name email')
            .populate('products.product', 'title price')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single order by ID
 * @route   GET /api/orders/:id
 * @access  Private (owner or admin)
 */
const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('products.product', 'title price');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user is authorized (own order or admin)
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id
 * @access  Private/Admin
 */
const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        // Validate status
        const validStatuses = ['pending', 'completed', 'cancelled'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Status must be one of: ${validStatuses.join(', ')}`
            });
        }

        // Find order
        let order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // If cancelling, restore stock
        if (status === 'cancelled' && order.status !== 'cancelled') {
            for (const item of order.products) {
                const product = await Product.findById(item.product);
                if (product) {
                    product.stock += item.quantity;
                    await product.save();
                }
            }
        }

        // Update order status
        order.status = status;
        await order.save();

        // Populate for response
        await order.populate([
            { path: 'user', select: 'name email' },
            { path: 'products.product', select: 'title price' }
        ]);

        res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getUserOrders,
    getOrderById,
    updateOrderStatus
};
