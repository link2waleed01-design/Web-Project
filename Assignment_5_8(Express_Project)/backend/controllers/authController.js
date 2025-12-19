/**
 * Authentication Controller
 * 
 * Handles user registration and login.
 * Returns JWT tokens for authenticated users.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generate JWT Token
 * 
 * Creates a signed JWT token for the given user ID.
 * 
 * @param {String} id - User's MongoDB ObjectId
 * @returns {String} Signed JWT token
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 * 
 * @param {Object} req.body - User registration data
 * @param {String} req.body.name - User's name
 * @param {String} req.body.email - User's email
 * @param {String} req.body.password - User's password
 * @param {String} [req.body.role] - User's role (optional)
 */
const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create new user (password will be hashed by pre-save middleware)
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'customer' // Default to customer if not specified
        });

        // Generate token
        const token = generateToken(user._id);

        // Send response (exclude password)
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error registering user'
        });
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 * 
 * @param {Object} req.body - User login credentials
 * @param {String} req.body.email - User's email
 * @param {String} req.body.password - User's password
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user by email (include password for comparison)
        const user = await User.findOne({ email }).select('+password');

        // Check if user exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if password matches
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Send response (exclude password)
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
    try {
        // req.user is set by protect middleware
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getMe
};
