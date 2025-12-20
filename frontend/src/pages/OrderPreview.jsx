/**
 * Order Preview Page
 * 
 * Displays order preview before confirming.
 * Shows cart items, prices, coupon input, and confirm/back buttons.
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './OrderPreview.css';

const OrderPreview = () => {
    const navigate = useNavigate();
    const { cartItems, clearCart } = useCart();
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(false);
    const [error, setError] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);

    // Fetch preview on mount or when coupon changes
    const fetchPreview = async (coupon = null) => {
        if (cartItems.length === 0) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const products = cartItems.map(item => ({
                product: item._id,
                quantity: item.quantity
            }));

            const data = { products };
            if (coupon) {
                data.couponCode = coupon;
            }

            const response = await ordersAPI.preview(data);
            setPreview(response.data.data);

            if (response.data.data.coupon?.code && !response.data.data.coupon?.valid === false) {
                setCouponApplied(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load order preview');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPreview(couponApplied ? couponCode : null);
    }, [cartItems]);

    const handleApplyCoupon = () => {
        if (couponCode.trim()) {
            fetchPreview(couponCode.trim());
        }
    };

    const handleRemoveCoupon = () => {
        setCouponCode('');
        setCouponApplied(false);
        fetchPreview(null);
    };

    const handleConfirmOrder = async () => {
        setConfirming(true);
        setError(null);

        try {
            const products = cartItems.map(item => ({
                product: item._id,
                quantity: item.quantity
            }));

            const data = { products };
            if (couponApplied && couponCode) {
                data.couponCode = couponCode;
            }

            const response = await ordersAPI.confirm(data);
            clearCart();
            navigate('/order-success', { state: { order: response.data.data } });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order');
            setConfirming(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="order-preview-page">
                <div className="page-header">
                    <h1>Order Preview</h1>
                </div>
                <div className="preview-container">
                    <div className="empty-preview">
                        <div className="empty-icon">🛒</div>
                        <h2>Your cart is empty</h2>
                        <p>Add some products to preview your order.</p>
                        <Link to="/products" className="btn btn-primary">
                            Browse Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="order-preview-page">
            <div className="page-header">
                <h1>Order Preview</h1>
                <p>Review your order before confirming</p>
            </div>

            <div className="preview-container">
                {loading ? (
                    <LoadingSpinner size="large" text="Loading preview..." />
                ) : error ? (
                    <div className="error-message">
                        <p>{error}</p>
                        <button onClick={() => fetchPreview(couponApplied ? couponCode : null)} className="btn btn-primary">
                            Try Again
                        </button>
                    </div>
                ) : preview && (
                    <div className="preview-content">
                        {/* Order Items */}
                        <div className="preview-items">
                            <h2>Order Items</h2>
                            <div className="items-table">
                                <div className="table-header">
                                    <span>Product</span>
                                    <span>Price</span>
                                    <span>Qty</span>
                                    <span>Total</span>
                                </div>
                                {preview.items.map((item, index) => (
                                    <div key={index} className="table-row">
                                        <div className="item-info">
                                            <img
                                                src={item.product.images?.[0] || 'https://via.placeholder.com/60'}
                                                alt={item.product.title}
                                            />
                                            <span>{item.product.title}</span>
                                        </div>
                                        <span>${item.price.toFixed(2)}</span>
                                        <span>×{item.quantity}</span>
                                        <span className="item-total">${item.itemTotal.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="preview-summary">
                            <h2>Order Summary</h2>

                            {/* Coupon Input */}
                            <div className="coupon-section">
                                <h3>Have a coupon?</h3>
                                {couponApplied && preview.coupon?.code ? (
                                    <div className="coupon-applied">
                                        <span className="coupon-badge">
                                            {preview.coupon.code} - {preview.coupon.percentage}% OFF
                                        </span>
                                        <button onClick={handleRemoveCoupon} className="remove-coupon">
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className="coupon-input-group">
                                        <input
                                            type="text"
                                            placeholder="Enter coupon code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        />
                                        <button onClick={handleApplyCoupon} className="btn btn-secondary">
                                            Apply
                                        </button>
                                    </div>
                                )}
                                {preview.coupon?.valid === false && (
                                    <p className="coupon-error">{preview.coupon.message}</p>
                                )}
                            </div>

                            {/* Price Breakdown */}
                            <div className="price-breakdown">
                                <div className="price-row">
                                    <span>Subtotal</span>
                                    <span>${preview.subtotal.toFixed(2)}</span>
                                </div>
                                {preview.discountAmount > 0 && (
                                    <div className="price-row discount">
                                        <span>Discount ({preview.coupon?.percentage}%)</span>
                                        <span>-${preview.discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="price-row shipping">
                                    <span>Shipping</span>
                                    <span className="free">FREE</span>
                                </div>
                                <div className="price-row total">
                                    <span>Grand Total</span>
                                    <span>${preview.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="preview-actions">
                                <button
                                    onClick={handleConfirmOrder}
                                    className="btn btn-primary confirm-btn"
                                    disabled={confirming}
                                >
                                    {confirming ? 'Placing Order...' : 'Confirm Order'}
                                </button>
                                <Link to="/cart" className="btn btn-outline back-btn">
                                    ← Go Back to Cart
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderPreview;
