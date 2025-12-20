/**
 * Checkout Page
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';
import './Checkout.css';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const shipping = cartTotal >= 50 ? 0 : 5;
    const total = cartTotal + shipping;

    const handlePlaceOrder = async () => {
        setLoading(true);
        setError('');

        try {
            // Prepare order data
            const orderData = {
                products: cartItems.map(item => ({
                    product: item._id,
                    quantity: item.quantity
                }))
            };

            await ordersAPI.create(orderData);
            clearCart();
            navigate('/order-success');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="checkout-page">
                <div className="container">
                    <div className="empty-checkout">
                        <h2>Your cart is empty</h2>
                        <p>Add some products before checking out.</p>
                        <Link to="/products" className="btn btn-primary">
                            Browse Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="container">
                <h1>Checkout</h1>

                <div className="checkout-layout">
                    {/* Order Summary */}
                    <div className="order-items">
                        <h2>Order Summary</h2>

                        {cartItems.map(item => (
                            <div key={item._id} className="checkout-item">
                                <img
                                    src={item.images?.[0] || 'https://via.placeholder.com/60'}
                                    alt={item.title}
                                />
                                <div className="item-info">
                                    <span className="item-name">{item.title}</span>
                                    <span className="item-qty">Qty: {item.quantity}</span>
                                </div>
                                <span className="item-total">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Payment Section */}
                    <div className="payment-section">
                        <h2>Payment Details</h2>

                        {error && <div className="error-alert">{error}</div>}

                        <div className="price-breakdown">
                            <div className="price-row">
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="price-row">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                            </div>
                            <div className="price-row total">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            className="btn btn-primary btn-block btn-lg"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
                        </button>

                        <p className="secure-note">
                            🔒 Your payment information is secure
                        </p>

                        <Link to="/cart" className="back-to-cart">
                            ← Back to Cart
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
