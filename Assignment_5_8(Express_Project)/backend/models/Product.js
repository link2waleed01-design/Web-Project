/**
 * Product Model
 * 
 * Defines the schema for product documents in MongoDB.
 * Products have a reference to a Category for organization.
 */

const mongoose = require('mongoose');

/**
 * Product Schema Definition
 * 
 * @property {String} title - Product title (required)
 * @property {String} description - Product description
 * @property {Number} price - Product price (required)
 * @property {ObjectId} category - Reference to Category model
 * @property {Array} images - Array of image URLs
 * @property {Number} stock - Available stock quantity (default: 0)
 * @property {Date} createdAt - Timestamp of product creation
 */
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a product title'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please provide a product price'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please provide a product category']
    },
    images: {
        type: [String], // Array of image URLs
        default: []
    },
    stock: {
        type: Number,
        default: 0,
        min: [0, 'Stock cannot be negative']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

/**
 * Virtual field to check if product is in stock
 */
productSchema.virtual('inStock').get(function () {
    return this.stock > 0;
});

// Enable virtuals in JSON output
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
