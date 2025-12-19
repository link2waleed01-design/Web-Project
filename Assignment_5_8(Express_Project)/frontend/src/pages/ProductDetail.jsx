/**
 * Product Detail Page
 * 
 * Shows full product details with add to cart
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [addedToCart, setAddedToCart] = useState(false);

    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await productsAPI.getById(id);
                setProduct(response.data.data);
            } catch (err) {
                setError('Product not found');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product, quantity);
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        }
    };

    const handleQuantityChange = (delta) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
            setQuantity(newQuantity);
        }
    };

    if (loading) {
        return (
            <div className="product-detail-page">
                <div className="page-loading">
                    <LoadingSpinner size="large" text="Loading product..." />
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="product-detail-page">
                <div className="error-container">
                    <h2>Product Not Found</h2>
                    <p>The product you're looking for doesn't exist.</p>
                    <Link to="/products" className="btn btn-primary">
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    const images = product.images?.length > 0
        ? product.images
        : ['https://via.placeholder.com/600x600?text=No+Image'];

    return (
        <div className="product-detail-page">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="breadcrumb">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <Link to="/products">Products</Link>
                    <span>/</span>
                    <span>{product.title}</span>
                </nav>

                <div className="product-detail">
                    {/* Image Gallery */}
                    <div className="product-gallery">
                        <div className="main-image">
                            <img src={images[selectedImage]} alt={product.title} />
                        </div>
                        {images.length > 1 && (
                            <div className="image-thumbnails">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        className={`thumbnail ${index === selectedImage ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <img src={img} alt={`${product.title} ${index + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="product-info">
                        <span className="product-category">
                            {product.category?.name || 'Uncategorized'}
                        </span>

                        <h1 className="product-title">{product.title}</h1>

                        <div className="product-price">${product.price?.toFixed(2)}</div>

                        <div className="product-stock">
                            {product.stock > 0 ? (
                                <span className="in-stock">
                                    ✓ In Stock ({product.stock} available)
                                </span>
                            ) : (
                                <span className="out-of-stock">✗ Out of Stock</span>
                            )}
                        </div>

                        <div className="product-description">
                            <h3>Description</h3>
                            <p>{product.description || 'No description available.'}</p>
                        </div>

                        {/* Add to Cart Section */}
                        {product.stock > 0 && (
                            <div className="add-to-cart-section">
                                <div className="quantity-selector">
                                    <button
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span>{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={quantity >= product.stock}
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    className={`btn btn-primary btn-lg add-to-cart-btn ${addedToCart ? 'added' : ''}`}
                                    onClick={handleAddToCart}
                                >
                                    {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
                                </button>
                            </div>
                        )}

                        {/* Back Link */}
                        <Link to="/products" className="back-link">
                            ← Back to Products
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
