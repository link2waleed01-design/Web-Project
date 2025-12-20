/**
 * My Orders Page
 * 
 * Allows customers to view their order history by email.
 */

import { useState } from 'react';
import { ordersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './MyOrders.css';

const MyOrders = () => {
    const [email, setEmail] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setError('Please enter an email address');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await ordersAPI.getByEmail(email.trim());
            setOrders(response.data.data);
            setSearched(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusClass = (status) => {
        const statusMap = {
            'Placed': 'placed',
            'Processing': 'processing',
            'Delivered': 'delivered',
            'Cancelled': 'cancelled'
        };
        return statusMap[status] || 'pending';
    };

    return (
        <div className="my-orders-page">
            <div className="page-header">
                <h1>Order History</h1>
                <p>Enter your email to view your orders</p>
            </div>

            <div className="orders-container">
                {/* Search Form */}
                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-input-group">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Searching...' : 'View Orders'}
                        </button>
                    </div>
                    {error && <p className="error-text">{error}</p>}
                </form>

                {/* Results */}
                {loading ? (
                    <LoadingSpinner size="large" text="Fetching orders..." />
                ) : searched && (
                    <div className="orders-results">
                        {orders.length === 0 ? (
                            <div className="no-orders">
                                <div className="no-orders-icon">📦</div>
                                <h3>No orders found</h3>
                                <p>No orders were found for {email}</p>
                            </div>
                        ) : (
                            <>
                                <h2>{orders.length} Order{orders.length !== 1 ? 's' : ''} Found</h2>
                                <div className="orders-list">
                                    {orders.map(order => (
                                        <div key={order._id} className="order-card">
                                            <div className="order-header">
                                                <div className="order-id">
                                                    <span className="label">Order ID</span>
                                                    <span className="value">#{order._id.slice(-8).toUpperCase()}</span>
                                                </div>
                                                <span className={`status-badge ${getStatusClass(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>

                                            <div className="order-details">
                                                <div className="detail">
                                                    <span className="label">Date</span>
                                                    <span className="value">{formatDate(order.createdAt)}</span>
                                                </div>
                                                <div className="detail">
                                                    <span className="label">Items</span>
                                                    <span className="value">{order.products.length} product{order.products.length !== 1 ? 's' : ''}</span>
                                                </div>
                                                <div className="detail">
                                                    <span className="label">Total</span>
                                                    <span className="value total">${order.totalPrice.toFixed(2)}</span>
                                                </div>
                                            </div>

                                            {order.couponCode && (
                                                <div className="order-coupon">
                                                    <span className="coupon-badge">
                                                        🎟️ {order.couponCode} applied (-${order.discountAmount.toFixed(2)})
                                                    </span>
                                                </div>
                                            )}

                                            <div className="order-items">
                                                {order.products.map((item, idx) => (
                                                    <div key={idx} className="order-item">
                                                        <span className="item-name">{item.product?.title || 'Product'}</span>
                                                        <span className="item-qty">×{item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
