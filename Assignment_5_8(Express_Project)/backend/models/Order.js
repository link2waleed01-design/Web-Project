/**
 * Order Model
 * 
 * Defines the schema for order documents in MongoDB.
 * Orders contain references to users and products with quantities.
 */

const mongoose = require('mongoose');

/**
 * Order Item Sub-Schema
 * 
 * Defines the structure for individual items within an order.
 * @property {ObjectId} product - Reference to Product model
 * @property {Number} quantity - Quantity of the product ordered
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
    }
}, { _id: false }); // Don't create _id for subdocuments

/**
 * Order Schema Definition
 * 
 * @property {ObjectId} user - Reference to User model (required)
 * @property {Array} products - Array of order items (product + quantity)
 * @property {Number} totalPrice - Total order price
 * @property {String} status - Order status: 'pending', 'completed', or 'cancelled'
 * @property {Date} createdAt - Timestamp of order creation
 */
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Order must belong to a user']
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
    totalPrice: {
        type: Number,
        required: [true, 'Please provide total price'],
        min: [0, 'Total price cannot be negative']
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'completed', 'cancelled'],
            message: 'Status must be: pending, completed, or cancelled'
        },
        default: 'pending'
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
orderSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name email'
    }).populate({
        path: 'products.product',
        select: 'title price'
    });
    next();
});

module.exports = mongoose.model('Order', orderSchema);
