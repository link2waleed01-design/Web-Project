/**
 * User Model
 * 
 * Defines the schema for user documents in MongoDB.
 * Includes password hashing using bcrypt before saving.
 * Supports role-based access control with 'customer' and 'admin' roles.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema Definition
 * 
 * @property {String} name - User's full name (required)
 * @property {String} email - User's email address (required, unique)
 * @property {String} password - User's hashed password (required)
 * @property {String} role - User's role: 'customer' or 'admin' (default: 'customer')
 * @property {Date} createdAt - Timestamp of user creation
 */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't include password in queries by default
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

/**
 * Pre-save middleware to hash password
 * 
 * Before saving a user document, this middleware checks if the password
 * field has been modified. If so, it hashes the password using bcrypt.
 * Note: In Mongoose 9, async middleware doesn't use next() callback
 */
userSchema.pre('save', async function () {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return;
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Method to compare entered password with hashed password
 * 
 * @param {String} enteredPassword - The password to compare
 * @returns {Boolean} True if passwords match, false otherwise
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
