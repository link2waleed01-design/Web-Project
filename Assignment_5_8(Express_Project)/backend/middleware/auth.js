/**
 * Authentication Middleware
 * 
 * This middleware verifies JWT tokens and protects routes.
 * It extracts the token from the Authorization header,
 * verifies it, and attaches the user to the request object.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes - Verify JWT token
 * 
 * Checks for a valid JWT token in the Authorization header.
 * If valid, attaches the user object to req.user.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const protect = async (req, res, next) => {
    let token;

    // Check if Authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from 'Bearer <token>'
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user to request (exclude password)
            req.user = await User.findById(decoded.id).select('-password');

            // Check if user still exists
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User no longer exists'
                });
            }

            next();
        } catch (error) {
            // Token verification failed
            console.error('Token verification error:', error.message);
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token invalid'
            });
        }
    }

    // No token provided
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token provided'
        });
    }
};

module.exports = { protect };
