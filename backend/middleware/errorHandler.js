/**
 * Error Handler Middleware
 * 
 * Global error handling middleware for consistent error responses.
 * Catches all errors and returns appropriate JSON responses.
 */

/**
 * Custom Error Class
 * 
 * Extends the built-in Error class with a statusCode property.
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Global Error Handler Middleware
 * 
 * Handles all errors passed to next() and returns JSON responses.
 * Differentiates between development and production error responses.
 * 
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
    // Default error properties
    let error = { ...err };
    error.message = err.message;

    // Log error for debugging (in development)
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', err);
    }

    // Mongoose Bad ObjectId Error
    if (err.name === 'CastError') {
        const message = `Resource not found with id: ${err.value}`;
        error = new AppError(message, 404);
    }

    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `Duplicate value entered for ${field} field`;
        error = new AppError(message, 400);
    }

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        const message = messages.join('. ');
        error = new AppError(message, 400);
    }

    // JWT Error
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token. Please log in again.';
        error = new AppError(message, 401);
    }

    // JWT Expired Error
    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired. Please log in again.';
        error = new AppError(message, 401);
    }

    // Send error response
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

/**
 * Async Handler Wrapper
 * 
 * Wraps async route handlers to catch errors and pass them to next().
 * Eliminates the need for try-catch blocks in every controller.
 * 
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 * 
 * @example
 * router.get('/users', asyncHandler(async (req, res) => {
 *     const users = await User.find();
 *     res.json(users);
 * }));
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { AppError, errorHandler, asyncHandler };
