/**
 * Order Controller
 * 
 * Handles all order-related operations.
 * Customer routes: previewOrder, confirmOrder, getOrdersByEmail, getUserOrders
 * Admin routes: getAllOrders, updateOrderStatus
 */

const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { calculateDiscount } = require('../middleware/applyDiscount');

/**
 * @desc    Preview order before confirming
 * @route   POST /api/orders/preview
 * @access  Private (authenticated users)
 * 
 * @param {Array} req.body.products - Array of { product: productId, quantity: number }
 * @param {String} req.body.couponCode - Optional coupon code
 */
const previewOrder = async (req, res, next) => {
    try {
        const { products } = req.body;

        // Validate products array
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide at least one product'
            });
        }

        // Calculate prices and validate products
        let subtotal = 0;
        const orderItems = [];

        for (const item of products) {
            if (!item.product || !item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: 'Each product must have a product ID and quantity'
                });
            }

            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product with ID ${item.product} not found`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.title}. Available: ${product.stock}`
                });
            }

            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;

            orderItems.push({
                product: {
                    _id: product._id,
                    title: product.title,
                    price: product.price,
                    images: product.images
                },
                quantity: item.quantity,
                price: product.price,
                itemTotal
            });
        }

        // Apply discount if provided
        let discountAmount = 0;
        let couponInfo = null;

        if (req.discount && req.discount.applied) {
            discountAmount = calculateDiscount(subtotal, req.discount.percentage);
            couponInfo = {
                code: req.discount.code,
                percentage: req.discount.percentage,
                savings: discountAmount
            };
        } else if (req.discount && req.discount.invalidCode) {
            couponInfo = {
                code: req.discount.invalidCode,
                valid: false,
                message: 'Invalid coupon code'
            };
        }

        const totalPrice = subtotal - discountAmount;

        res.status(200).json({
            success: true,
            data: {
                items: orderItems,
                subtotal,
                coupon: couponInfo,
                discountAmount,
                totalPrice
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Confirm and create order
 * @route   POST /api/orders/confirm
 * @access  Private (authenticated users)
 * 
 * @param {Array} req.body.products - Array of { product: productId, quantity: number }
 * @param {String} req.body.couponCode - Optional coupon code
 */
const confirmOrder = async (req, res, next) => {
    try {
        const { products } = req.body;

        // Validate products array
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide at least one product'
            });
        }

        // Calculate total price and validate products
        let subtotal = 0;
        const orderProducts = [];

        for (const item of products) {
            if (!item.product || !item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: 'Each product must have a product ID and quantity'
                });
            }

            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product with ID ${item.product} not found`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.title}. Available: ${product.stock}`
                });
            }

            orderProducts.push({
                product: item.product,
                quantity: item.quantity,
                price: product.price
            });
            subtotal += product.price * item.quantity;

            // Decrease product stock
            product.stock -= item.quantity;
            await product.save();
        }

        // Apply discount
        let discountAmount = 0;
        let couponCode = null;

        if (req.discount && req.discount.applied) {
            discountAmount = calculateDiscount(subtotal, req.discount.percentage);
            couponCode = req.discount.code;
        }

        const totalPrice = subtotal - discountAmount;

        // Create order with status "Placed"
        const order = await Order.create({
            user: req.user._id,
            email: req.user.email,
            products: orderProducts,
            subtotal,
            couponCode,
            discountAmount,
            totalPrice,
            status: 'Placed'
        });

        // Populate order details for response
        await order.populate([
            { path: 'user', select: 'name email' },
            { path: 'products.product', select: 'title price images' }
        ]);

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: order
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get orders by email (Order History)
 * @route   POST /api/orders/my-orders
 * @access  Public
 * 
 * @param {String} req.body.email - Customer email
 */
const getOrdersByEmail = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email address'
            });
        }

        const orders = await Order.find({ email: email.toLowerCase() })
            .populate('products.product', 'title price images')
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
 * @desc    Get all orders (Admin only)
 * @route   GET /api/orders
 * @access  Private/Admin
 * 
 * Supports query parameters:
 * - status: Filter by order status
 */
const getAllOrders = async (req, res, next) => {
    try {
        let query = {};

        if (req.query.status) {
            query.status = req.query.status;
        }

        const orders = await Order.find(query)
            .populate('user', 'name email')
            .populate('products.product', 'title price images')
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

        if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view these orders'
            });
        }

        const orders = await Order.find({ user: userId })
            .populate('user', 'name email')
            .populate('products.product', 'title price images')
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
            .populate('products.product', 'title price images');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

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
 * Valid status transitions
 * Each status maps to allowed next statuses
 */
const STATUS_TRANSITIONS = {
    'Placed': ['Processing', 'Cancelled'],
    'Processing': ['Delivered', 'Cancelled'],
    'Delivered': [],  // Final state, no further transitions
    'Cancelled': []   // Final state, no further transitions
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id
 * @access  Private/Admin
 * 
 * Enforces sequential status transitions:
 * Placed → Processing → Delivered
 * Any → Cancelled
 */
const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        // Validate status
        const validStatuses = ['Placed', 'Processing', 'Delivered', 'Cancelled'];
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

        // Check if transition is valid
        const currentStatus = order.status;
        const allowedTransitions = STATUS_TRANSITIONS[currentStatus] || [];

        if (!allowedTransitions.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Cannot change status from '${currentStatus}' to '${status}'. Allowed: ${allowedTransitions.join(', ') || 'none'}`
            });
        }

        // If cancelling, restore stock
        if (status === 'Cancelled') {
            for (const item of order.products) {
                const product = await Product.findById(item.product._id || item.product);
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
            { path: 'products.product', select: 'title price images' }
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
    previewOrder,
    confirmOrder,
    getOrdersByEmail,
    getAllOrders,
    getUserOrders,
    getOrderById,
    updateOrderStatus
};
