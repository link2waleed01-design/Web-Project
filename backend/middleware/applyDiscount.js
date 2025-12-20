/**
 * Apply Discount Middleware
 * 
 * Middleware to apply coupon discounts to orders.
 * Checks for couponCode in body or query and applies discounts.
 */

/**
 * Valid coupon codes and their discount percentages
 */
const VALID_COUPONS = {
    'SAVE10': 10,    // 10% discount
    'SAVE20': 20,    // 20% discount
    'SAVE15': 15     // 15% discount
};

/**
 * Apply discount middleware
 * 
 * Checks for couponCode in request body or query.
 * If valid, attaches discount info to req.discount
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const applyDiscount = (req, res, next) => {
    // Get coupon code from body or query
    const couponCode = req.body.couponCode || req.query.couponCode;

    // Default discount info
    req.discount = {
        applied: false,
        code: null,
        percentage: 0,
        amount: 0
    };

    if (couponCode) {
        const upperCode = couponCode.toUpperCase();

        if (VALID_COUPONS[upperCode]) {
            req.discount = {
                applied: true,
                code: upperCode,
                percentage: VALID_COUPONS[upperCode],
                amount: 0  // Will be calculated in controller
            };
        } else {
            // Invalid coupon - add warning but continue
            req.discount.invalidCode = couponCode;
        }
    }

    next();
};

/**
 * Calculate discount amount
 * 
 * Helper function to calculate discount based on subtotal
 * @param {Number} subtotal - Order subtotal
 * @param {Number} percentage - Discount percentage
 * @returns {Number} Discount amount
 */
const calculateDiscount = (subtotal, percentage) => {
    return Math.round((subtotal * percentage / 100) * 100) / 100;
};

module.exports = {
    applyDiscount,
    calculateDiscount,
    VALID_COUPONS
};
