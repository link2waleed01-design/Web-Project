/**
 * Admin Dashboard
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, categoriesAPI, ordersAPI, usersAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import './Admin.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        products: 0,
        categories: 0,
        orders: 0,
        users: 0,
        pendingOrders: 0,
        totalRevenue: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [productsRes, categoriesRes, ordersRes, usersRes] = await Promise.all([
                    productsAPI.getAll(),
                    categoriesAPI.getAll(),
                    ordersAPI.getAll(),
                    usersAPI.getAll()
                ]);

                const orders = ordersRes.data.data;
                const pendingOrders = orders.filter(o => o.status === 'pending').length;
                const totalRevenue = orders
                    .filter(o => o.status === 'completed')
                    .reduce((sum, o) => sum + o.totalPrice, 0);

                setStats({
                    products: productsRes.data.count,
                    categories: categoriesRes.data.count,
                    orders: orders.length,
                    users: usersRes.data.count,
                    pendingOrders,
                    totalRevenue
                });

                setRecentOrders(orders.slice(0, 5));
            } catch (err) {
                console.error('Failed to load stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="admin-page">
                <LoadingSpinner size="large" text="Loading dashboard..." />
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Welcome to the admin panel</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-icon">📦</span>
                    <div className="stat-info">
                        <span className="stat-value">{stats.products}</span>
                        <span className="stat-label">Products</span>
                    </div>
                    <Link to="/admin/products" className="stat-link">Manage →</Link>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">📁</span>
                    <div className="stat-info">
                        <span className="stat-value">{stats.categories}</span>
                        <span className="stat-label">Categories</span>
                    </div>
                    <Link to="/admin/categories" className="stat-link">Manage →</Link>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">🛒</span>
                    <div className="stat-info">
                        <span className="stat-value">{stats.orders}</span>
                        <span className="stat-label">Total Orders</span>
                    </div>
                    <Link to="/admin/orders" className="stat-link">View →</Link>
                </div>
                <div className="stat-card">
                    <span className="stat-icon">👥</span>
                    <div className="stat-info">
                        <span className="stat-value">{stats.users}</span>
                        <span className="stat-label">Users</span>
                    </div>
                    <Link to="/admin/users" className="stat-link">View →</Link>
                </div>
            </div>

            {/* Additional Stats */}
            <div className="additional-stats">
                <div className="highlight-card pending">
                    <span className="highlight-value">{stats.pendingOrders}</span>
                    <span className="highlight-label">Pending Orders</span>
                </div>
                <div className="highlight-card revenue">
                    <span className="highlight-value">${stats.totalRevenue.toFixed(2)}</span>
                    <span className="highlight-label">Total Revenue</span>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="recent-section">
                <div className="section-header">
                    <h2>Recent Orders</h2>
                    <Link to="/admin/orders">View All →</Link>
                </div>
                {recentOrders.length === 0 ? (
                    <p className="no-data">No orders yet</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map(order => (
                                <tr key={order._id}>
                                    <td>#{order._id.slice(-8).toUpperCase()}</td>
                                    <td>{order.user?.name || 'N/A'}</td>
                                    <td>${order.totalPrice?.toFixed(2)}</td>
                                    <td>
                                        <span className={`status-badge ${order.status}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <Link to="/admin/products" className="action-card">
                        <span>➕</span>
                        <span>Add Product</span>
                    </Link>
                    <Link to="/admin/categories" className="action-card">
                        <span>📁</span>
                        <span>Add Category</span>
                    </Link>
                    <Link to="/admin/orders" className="action-card">
                        <span>📋</span>
                        <span>View Orders</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
