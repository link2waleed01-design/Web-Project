/**
 * Admin Orders Management
 */

import { useState, useEffect } from 'react';
import { ordersAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import './Admin.css';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, [filter]);

    const fetchOrders = async () => {
        try {
            const params = filter ? { status: filter } : {};
            const response = await ordersAPI.getAll(params);
            setOrders(response.data.data);
        } catch (err) {
            console.error('Failed to load orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await ordersAPI.updateStatus(orderId, newStatus);
            fetchOrders();
            setSelectedOrder(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update order status');
        }
    };

    if (loading) {
        return (
            <div className="admin-page">
                <LoadingSpinner size="large" text="Loading orders..." />
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="admin-subpage-header">
                <h1>Orders Management</h1>
                <select
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <div className="admin-content">
                {orders.length === 0 ? (
                    <p className="no-data">No orders found.</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Products</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td>#{order._id.slice(-8).toUpperCase()}</td>
                                    <td>
                                        <div>
                                            <strong>{order.user?.name || 'N/A'}</strong>
                                            <br />
                                            <small>{order.user?.email}</small>
                                        </div>
                                    </td>
                                    <td>
                                        {order.products.map((item, idx) => (
                                            <div key={idx} style={{ fontSize: '0.85rem' }}>
                                                {item.product?.title || 'Product'} x{item.quantity}
                                            </div>
                                        ))}
                                    </td>
                                    <td><strong>${order.totalPrice?.toFixed(2)}</strong></td>
                                    <td>
                                        <span className={`status-badge ${order.status}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="btn btn-outline btn-sm"
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Status Update Modal */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Update Order Status</h2>
                            <button className="modal-close" onClick={() => setSelectedOrder(null)}>×</button>
                        </div>

                        <div className="order-detail">
                            <p><strong>Order:</strong> #{selectedOrder._id.slice(-8).toUpperCase()}</p>
                            <p><strong>Customer:</strong> {selectedOrder.user?.name}</p>
                            <p><strong>Total:</strong> ${selectedOrder.totalPrice?.toFixed(2)}</p>
                            <p><strong>Current Status:</strong>
                                <span className={`status-badge ${selectedOrder.status}`} style={{ marginLeft: 8 }}>
                                    {selectedOrder.status}
                                </span>
                            </p>
                        </div>

                        <div className="status-buttons">
                            <button
                                onClick={() => handleStatusUpdate(selectedOrder._id, 'pending')}
                                className="btn btn-outline"
                                disabled={selectedOrder.status === 'pending'}
                            >
                                Mark Pending
                            </button>
                            <button
                                onClick={() => handleStatusUpdate(selectedOrder._id, 'completed')}
                                className="btn btn-primary"
                                disabled={selectedOrder.status === 'completed'}
                            >
                                Mark Completed
                            </button>
                            <button
                                onClick={() => handleStatusUpdate(selectedOrder._id, 'cancelled')}
                                className="btn btn-danger"
                                disabled={selectedOrder.status === 'cancelled'}
                            >
                                Mark Cancelled
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .filter-select {
                    padding: 0.5rem 1rem;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    background: white;
                    font-size: 1rem;
                }
                .order-detail {
                    margin-bottom: 1.5rem;
                }
                .order-detail p {
                    margin: 0.5rem 0;
                }
                .status-buttons {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                }
            `}</style>
        </div>
    );
};

export default AdminOrders;
