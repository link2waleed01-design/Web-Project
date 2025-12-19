/**
 * Products Page - Enhanced UX Design
 */

import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './Products.css';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoriesAPI.getAll();
                setCategories(response.data.data);
            } catch (err) {
                console.error('Failed to load categories:', err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = {};
                if (selectedCategory) params.category = selectedCategory;
                if (minPrice) params.minPrice = minPrice;
                if (maxPrice) params.maxPrice = maxPrice;

                const response = await productsAPI.getAll(params);
                let filtered = response.data.data;

                // Client-side search
                if (searchQuery) {
                    filtered = filtered.filter(p =>
                        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                }

                setProducts(filtered);
            } catch (err) {
                setError('Failed to load products');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory, minPrice, maxPrice, searchQuery]);

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        if (categoryId) {
            setSearchParams({ category: categoryId });
        } else {
            setSearchParams({});
        }
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setSearchQuery('');
        setMinPrice('');
        setMaxPrice('');
        setSearchParams({});
    };

    const hasActiveFilters = selectedCategory || searchQuery || minPrice || maxPrice;

    return (
        <div className="products-page">
            {/* Page Header */}
            <div className="page-header">
                <h1>Our Products</h1>
                <p>Discover our amazing collection of quality products</p>
            </div>

            <div className="products-container">
                {/* Filters Sidebar */}
                <aside className="filters-sidebar">
                    {/* Search */}
                    <div className="filter-section">
                        <h3>Search</h3>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    {/* Categories */}
                    <div className="filter-section">
                        <h3>Categories</h3>
                        <ul className="category-list">
                            <li>
                                <button
                                    className={`category-btn ${!selectedCategory ? 'active' : ''}`}
                                    onClick={() => handleCategoryChange('')}
                                >
                                    All Products
                                </button>
                            </li>
                            {categories.map(cat => (
                                <li key={cat._id}>
                                    <button
                                        className={`category-btn ${selectedCategory === cat._id ? 'active' : ''}`}
                                        onClick={() => handleCategoryChange(cat._id)}
                                    >
                                        {cat.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Price Range */}
                    <div className="filter-section">
                        <h3>Price Range</h3>
                        <div className="price-inputs">
                            <input
                                type="number"
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="price-input"
                            />
                            <span className="price-separator">—</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="price-input"
                            />
                        </div>
                    </div>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                        <button onClick={clearFilters} className="btn btn-outline btn-block">
                            Clear All Filters
                        </button>
                    )}
                </aside>

                {/* Products Grid */}
                <main className="products-main">
                    {!loading && !error && (
                        <p className="results-info">
                            Showing <strong>{products.length}</strong> {products.length === 1 ? 'product' : 'products'}
                            {selectedCategory && categories.find(c => c._id === selectedCategory) && (
                                <> in <strong>{categories.find(c => c._id === selectedCategory)?.name}</strong></>
                            )}
                        </p>
                    )}

                    {loading ? (
                        <div className="loading-container">
                            <LoadingSpinner size="large" text="Loading products..." />
                        </div>
                    ) : error ? (
                        <div className="error-message">
                            <p>{error}</p>
                            <button onClick={() => window.location.reload()} className="btn btn-primary">
                                Try Again
                            </button>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="empty-message">
                            <h3>No products found</h3>
                            <p>Try adjusting your filters or search query</p>
                            {hasActiveFilters && (
                                <button onClick={clearFilters} className="btn btn-primary">
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="products-grid">
                            {products.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Products;
