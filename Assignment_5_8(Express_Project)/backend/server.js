/**
 * E-commerce Backend Server
 * 
 * Main entry point for the application.
 * Configures Express, connects to MongoDB, and starts the server.
 */

// Load environment variables FIRST (must be before other imports)
require('dotenv').config();

// Import dependencies
const express = require('express');
const cors = require('cors');

// Import database configuration
const connectDB = require('./config/db');

// Import error handler middleware
const { errorHandler } = require('./middleware/errorHandler');

// Import route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Initialize Express app
const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// Enable CORS for all origins (configure for production)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'E-commerce API is running',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            products: '/api/products',
            categories: '/api/categories',
            orders: '/api/orders'
        }
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);

// 404 handler for undefined routes
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Global error handler (must be last middleware)
app.use(errorHandler);

// ============================================
// SERVER STARTUP
// ============================================

const PORT = process.env.PORT || 5000;

/**
 * Start the server
 * 
 * 1. Connect to MongoDB
 * 2. Start listening on configured port
 */
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Start Express server
        app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
            console.log(`API available at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});
