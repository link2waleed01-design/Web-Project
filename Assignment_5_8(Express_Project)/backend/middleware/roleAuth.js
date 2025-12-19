/**
 * Role-Based Authorization Middleware
 * 
 * This middleware restricts access to routes based on user roles.
 * It should be used AFTER the auth middleware (protect).
 */

/**
 * Authorize specific roles
 * 
 * Creates a middleware that only allows users with specified roles.
 * 
 * @param {...String} roles - Allowed roles (e.g., 'admin', 'customer')
 * @returns {Function} Express middleware function
 * 
 * @example
 * // Only allow admin users
 * router.get('/admin-only', protect, authorize('admin'), controller);
 * 
 * // Allow both admin and customer
 * router.get('/both', protect, authorize('admin', 'customer'), controller);
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        // Check if user exists (should be set by protect middleware)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, please login first'
            });
        }

        // Check if user's role is in the allowed roles
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`
            });
        }

        next();
    };
};

/**
 * Admin only middleware
 * 
 * Convenience middleware that only allows admin users.
 * Equivalent to authorize('admin').
 */
const adminOnly = (req, res, next) => {
    // Check if user exists
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, please login first'
        });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }

    next();
};

module.exports = { authorize, adminOnly };
