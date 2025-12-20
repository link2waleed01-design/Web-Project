/**
 * Home Page - BeEnergy Theme
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './Home.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    productsAPI.getAll(),
                    categoriesAPI.getAll()
                ]);
                setProducts(productsRes.data.data.slice(0, 6));
                setCategories(categoriesRes.data.data.slice(0, 3));
            } catch (err) {
                console.error('Failed to load data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <img
                    src="./windy.jpg"
                    alt="Hero Banner"
                    className="hero-image"
                />
                <div className="hero-content">
                    <h1 className="hero-title">
                        We deliver<br />power for you
                    </h1>
                    <p className="hero-subtitle">
                        Discover amazing products at<br />
                        incredible prices with fast delivery
                    </p>
                    <div className="hero-cta">
                        <Link to="/products" className="read-more">
                            Check out our products
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="categories-section">
                <div className="categories-grid">
                    {loading ? (
                        <LoadingSpinner text="Loading categories..." />
                    ) : categories.length === 0 ? (
                        <>
                            {/* Default placeholder categories */}
                            <div className="category-card">
                                <div className="category-header">
                                    <h2>Electronics</h2>
                                    <h3>Latest gadgets</h3>
                                </div>
                                <img
                                    src="https://themes.muffingroup.com/be/energy/wp-content/uploads/2014/12/home_energy_box_1.jpg"
                                    alt="Electronics"
                                />
                                <p>Discover the latest in technology with our premium electronics collection.</p>
                                <Link to="/products" className="read-more">Read more</Link>
                            </div>
                            <div className="category-card">
                                <div className="category-header">
                                    <h2>Fashion</h2>
                                    <h3>Trending styles</h3>
                                </div>
                                <img
                                    src="https://themes.muffingroup.com/be/energy/wp-content/uploads/2014/12/home_energy_box_2.jpg"
                                    alt="Fashion"
                                />
                                <p>Stay stylish with our curated fashion collection for every occasion.</p>
                                <Link to="/products" className="read-more">Read more</Link>
                            </div>
                            <div className="category-card">
                                <div className="category-header">
                                    <h2>Home & Living</h2>
                                    <h3>Quality products</h3>
                                </div>
                                <img
                                    src="https://themes.muffingroup.com/be/energy/wp-content/uploads/2014/12/home_energy_box_3.jpg"
                                    alt="Home"
                                />
                                <p>Transform your living space with our premium home products.</p>
                                <Link to="/products" className="read-more">Read more</Link>
                            </div>
                        </>
                    ) : (
                        categories.map(cat => (
                            <div key={cat._id} className="category-card">
                                <div className="category-header">
                                    <h2>{cat.name}</h2>
                                    <h3>Quality products</h3>
                                </div>
                                <img
                                    // src={`https://themes.muffingroup.com/be/energy/wp-content/uploads/2014/12/home_energy_box_${(categories.indexOf(cat) % 3) + 1}.jpg`}
                                    src={cat.image}
                                    alt={cat.name}
                                />
                                <p>{cat.description || 'Explore our amazing collection of products in this category.'}</p>
                                <Link to={`/products?category=${cat._id}`} className="read-more">Read more</Link>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Welcome Section */}
            <section className="welcome-section">
                <div className="welcome-container">
                    <img
                        src="https://themes.muffingroup.com/be/energy/wp-content/uploads/2014/12/home_energy_welcome.jpg"
                        alt="Welcome"
                        className="welcome-image"
                    />
                    <div className="welcome-content">
                        <h2 className="section-title">Welcome to EnergyShop</h2>
                        <h3 className="section-subtitle">Your trusted online store</h3>
                        <p className="welcome-text">
                            We deliver quality products right to your doorstep. With our wide selection
                            of categories and competitive prices, shopping has never been easier.
                        </p>
                        <p className="welcome-details">
                            Browse through our extensive catalog, add items to your cart, and
                            checkout securely. We offer fast shipping and excellent customer service
                            to ensure your satisfaction with every purchase.
                        </p>
                        <Link to="/products" className="read-more">Browse Products</Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="features-row">
                    {/* For Customers */}
                    <div className="feature-column customer">
                        <h2>For Customers</h2>
                        <div className="feature-list">
                            <div className="feature-item">
                                <div className="feature-text">
                                    <h4>Easy Checkout</h4>
                                    <p>Simple and secure payment process with multiple payment options.</p>
                                </div>
                                <div className="feature-icon">🛒</div>
                            </div>
                            <div className="feature-item">
                                <div className="feature-text">
                                    <h4>Fast Delivery</h4>
                                    <p>Quick and reliable shipping to your doorstep within days.</p>
                                </div>
                                <div className="feature-icon">🚚</div>
                            </div>
                            <div className="feature-item">
                                <div className="feature-text">
                                    <h4>Order Tracking</h4>
                                    <p>Track your orders in real-time from purchase to delivery.</p>
                                </div>
                                <div className="feature-icon">📦</div>
                            </div>
                        </div>
                        <Link to="/register" className="btn btn-primary">Start Now</Link>
                    </div>

                    {/* For Business */}
                    <div className="feature-column business">
                        <h2>For Business</h2>
                        <div className="feature-list reverse">
                            <div className="feature-item">
                                <div className="feature-icon">📊</div>
                                <div className="feature-text left">
                                    <h4>Admin Dashboard</h4>
                                    <p>Comprehensive dashboard to manage your products and orders.</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">📱</div>
                                <div className="feature-text left">
                                    <h4>Inventory Control</h4>
                                    <p>Track stock levels and manage your product catalog easily.</p>
                                </div>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">📈</div>
                                <div className="feature-text left">
                                    <h4>Sales Analytics</h4>
                                    <p>View revenue reports and order statistics at a glance.</p>
                                </div>
                            </div>
                        </div>
                        <Link to="/admin" className="btn btn-primary">Start Now</Link>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="products-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Featured Products</h2>
                        <h3 className="section-subtitle">Check out our latest arrivals</h3>
                    </div>

                    {loading ? (
                        <LoadingSpinner size="large" text="Loading products..." />
                    ) : products.length === 0 ? (
                        <div className="empty-products">
                            <p>No products available yet.</p>
                            <p className="hint">Add some products in the admin panel!</p>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {products.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}

                    <div className="section-footer">
                        <Link to="/products" className="btn btn-primary btn-lg">
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
