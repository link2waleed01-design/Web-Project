/**
 * Product Controller
 * 
 * Handles all product-related CRUD operations.
 * Public routes: getAll, getById
 * Admin routes: create, update, delete
 */

const Product = require('../models/Product');
const Category = require('../models/Category');

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 * 
 * Supports query parameters for filtering:
 * - category: Filter by category ID
 * - minPrice: Minimum price filter
 * - maxPrice: Maximum price filter
 * - search: Search in title
 */
const getAllProducts = async (req, res, next) => {
    try {
        // Build query object for filtering
        let query = {};

        // Filter by category
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Filter by price range
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
        }

        // Search by title (case-insensitive)
        if (req.query.search) {
            query.title = { $regex: req.query.search, $options: 'i' };
        }

        // Execute query with category population
        const products = await Product.find(query)
            .populate('category', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name description');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res, next) => {
    try {
        const { title, description, price, category, images, stock } = req.body;

        // Verify category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Create product
        const product = await Product.create({
            title,
            description,
            price,
            category,
            images: images || [],
            stock: stock || 0
        });

        // Populate category for response
        await product.populate('category', 'name');

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res, next) => {
    try {
        const { title, description, price, category, images, stock } = req.body;

        // Find product first
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // If category is being updated, verify it exists
        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found'
                });
            }
        }

        // Update product
        product = await Product.findByIdAndUpdate(
            req.params.id,
            { title, description, price, category, images, stock },
            { new: true, runValidators: true }
        ).populate('category', 'name');

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
