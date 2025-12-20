/**
 * Order Model
 * 
 * Defines the schema for order documents in MongoDB.
 * Orders contain references to users and products with quantities.
 * Supports order status lifecycle and coupon discounts.
 */

const mongoose = require('mongoose');

/**
 * Order Item Sub-Schema
 * 
 * Defines the structure for individual items within an order.
 * @property {ObjectId} product - Reference to Product model
 * @property {Number} quantity - Quantity of the product ordered
 * @property {Number} price - Price at time of order
 */
const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    price: {
        type: Number,
        required: true
    }
}, { _id: false }); // Don't create _id for subdocuments

/**
 * Order Schema Definition
 * 
 * @property {ObjectId} user - Reference to User model (required)
 * @property {String} email - Customer email for order lookup
 * @property {Array} products - Array of order items (product + quantity + price)
 * @property {Number} subtotal - Total before discount
 * @property {String} couponCode - Applied coupon code
 * @property {Number} discountAmount - Discount amount applied
 * @property {Number} totalPrice - Final total after discount
 * @property {String} status - Order status lifecycle
 * @property {Date} createdAt - Timestamp of order creation
 */
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Order must belong to a user']
    },
    email: {
        type: String,
        required: [true, 'Order must have an email']
    },
    products: {
        type: [orderItemSchema],
        required: [true, 'Order must contain at least one product'],
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'Order must contain at least one product'
        }
    },
    subtotal: {
        type: Number,
        required: true,
        min: [0, 'Subtotal cannot be negative']
    },
    couponCode: {
        type: String,
        default: null
    },
    discountAmount: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        required: [true, 'Please provide total price'],
        min: [0, 'Total price cannot be negative']
    },
    status: {
        type: String,
        enum: {
            values: ['Placed', 'Processing', 'Delivered', 'Cancelled'],
            message: 'Status must be: Placed, Processing, Delivered, or Cancelled'
        },
        default: 'Placed'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

/**
 * Pre-find middleware to populate user and product details
 * This automatically populates references when querying orders
 */
orderSchema.pre(/^find/, function () {
    this.populate({
        path: 'user',
        select: 'name email'
    }).populate({
        path: 'products.product',
        select: 'title price images'
    });
});

module.exports = mongoose.model('Order', orderSchema);
