/**
 * Category Model
 * 
 * Defines the schema for category documents in MongoDB.
 * Categories are used to organize products.
 */

const mongoose = require('mongoose');

/**
 * Category Schema Definition
 * 
 * @property {String} name - Category name (required, unique)
 * @property {String} description - Category description
 * @property {Date} createdAt - Timestamp of category creation
 */
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a category name'],
        unique: true,
        trim: true,
        maxlength: [100, 'Category name cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Category', categorySchema);
