/**
 * Category Controller
 * 
 * Handles all category-related CRUD operations.
 * Public routes: getAll, getById
 * Admin routes: create, update, delete
 */

const Category = require('../models/Category');
const Product = require('../models/Product');

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single category by ID
 * @route   GET /api/categories/:id
 * @access  Public
 */
const getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create new category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        // Check if category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category with this name already exists'
            });
        }

        // Create category
        const category = await Category.create({
            name,
            description
        });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
const updateCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        // Check if category exists
        let category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // If name is being changed, check it doesn't conflict
        if (name && name !== category.name) {
            const existingCategory = await Category.findOne({ name });
            if (existingCategory) {
                return res.status(400).json({
                    success: false,
                    message: 'Category with this name already exists'
                });
            }
        }

        // Update category
        category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: category
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 * 
 * Note: Will fail if products are using this category
 */
const deleteCategory = async (req, res, next) => {
    try {
        // Check if category exists
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Check if any products are using this category
        const productsUsingCategory = await Product.countDocuments({ category: req.params.id });
        if (productsUsingCategory > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category. ${productsUsingCategory} product(s) are using this category.`
            });
        }

        // Delete category
        await Category.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
