/**
 * Profile Page
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './Profile.css';

const Profile = () => {
    const { user, logout } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await ordersAPI.getUserOrders(user._id);
                setOrders(response.data.data);
            } catch (err) {
                console.error('Failed to load orders:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user?._id) {
            fetchOrders();
        }
    }, [user]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'status-completed';
            case 'cancelled': return 'status-cancelled';
            default: return 'status-pending';
        }
    };

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-layout">
                    {/* User Info Card */}
                    <div className="profile-card">
                        <div className="profile-avatar">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <h2>{user?.name}</h2>
                        <p className="profile-email">{user?.email}</p>
                        <span className={`role-badge ${user?.role === 'admin' ? 'admin' : 'customer'}`}>
                            {user?.role}
                        </span>
                        <button onClick={logout} className="btn btn-outline btn-block">
                            Logout
                        </button>
                    </div>

                    {/* Orders Section */}
                    <div className="orders-section">
                        <h2>My Orders</h2>

                        {loading ? (
                            <LoadingSpinner text="Loading orders..." />
                        ) : orders.length === 0 ? (
                            <div className="no-orders">
                                <p>You haven't placed any orders yet.</p>
                            </div>
                        ) : (
                            <div className="orders-list">
                                {orders.map(order => (
                                    <div key={order._id} className="order-card">
                                        <div className="order-header">
                                            <span className="order-id">
                                                Order #{order._id.slice(-8).toUpperCase()}
                                            </span>
                                            <span className={`order-status ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="order-body">
                                            <div className="order-products">
                                                {order.products.map((item, idx) => (
                                                    <span key={idx} className="order-product">
                                                        {item.product?.title || 'Product'} x{item.quantity}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="order-footer">
                                            <span className="order-date">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="order-total">
                                                ${order.totalPrice?.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
