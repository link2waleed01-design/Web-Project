/**
 * ProductCard Component - Enhanced UX Design
 * BeEnergy Theme
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from './Toast';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { showToast } = useToast();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (product.stock > 0 && !isAdding) {
            setIsAdding(true);
            addToCart(product);
            showToast(`${product.title} added to cart!`, 'success');

            // Reset button state after animation
            setTimeout(() => setIsAdding(false), 600);
        }
    };

    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;

    return (
        <div className="product-card">
            <Link to={`/products/${product._id}`} className="product-link">
                {/* Image Container */}
                <div className="product-image-container">
                    <img
                        src={product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'}
                        alt={product.title}
                        className="product-image"
                    />

                    {/* Overlay on Hover */}
                    <div className="product-overlay">
                        <span className="view-details">View Details</span>
                    </div>

                    {/* Badges */}
                    {isOutOfStock && (
                        <span className="badge badge-out">Out of Stock</span>
                    )}
                    {isLowStock && (
                        <span className="badge badge-low">Only {product.stock} left</span>
                    )}
                </div>

                {/* Product Info */}
                <div className="product-info">
                    {product.category?.name && (
                        <span className="product-category">{product.category.name}</span>
                    )}
                    <h3 className="product-title">{product.title}</h3>

                    {product.description && (
                        <p className="product-description">
                            {product.description.length > 80
                                ? product.description.substring(0, 80) + '...'
                                : product.description}
                        </p>
                    )}
                </div>
            </Link>

            {/* Footer with Price and Cart */}
            <div className="product-footer">
                <div className="price-section">
                    <span className="current-price">${product.price?.toFixed(2)}</span>
                </div>

                <button
                    className={`add-to-cart-btn ${isOutOfStock ? 'disabled' : ''} ${isAdding ? 'adding' : ''}`}
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isAdding}
                >
                    {isAdding ? '✓ Added!' : isOutOfStock ? 'Sold Out' : '+ Add to Cart'}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
