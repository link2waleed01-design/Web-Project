/**
 * Admin Orders Management
 * 
 * Updated with status lifecycle (Placed → Processing → Delivered)
 */

import { useState, useEffect } from 'react';
import { ordersAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import './Admin.css';

// Status lifecycle - defines valid transitions
const STATUS_TRANSITIONS = {
    'Placed': ['Processing', 'Cancelled'],
    'Processing': ['Delivered', 'Cancelled'],
    'Delivered': [],
    'Cancelled': []
};

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);

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
        setUpdating(true);
        setError(null);
        try {
            await ordersAPI.updateStatus(orderId, newStatus);
            fetchOrders();
            setSelectedOrder(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update order status');
        } finally {
            setUpdating(false);
        }
    };

    const getNextStatuses = (currentStatus) => {
        return STATUS_TRANSITIONS[currentStatus] || [];
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
                    <option value="Placed">Placed</option>
                    <option value="Processing">Processing</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
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
                                            <small>{order.email || order.user?.email}</small>
                                        </div>
                                    </td>
                                    <td>
                                        {order.products.map((item, idx) => (
                                            <div key={idx} style={{ fontSize: '0.85rem' }}>
                                                {item.product?.title || 'Product'} x{item.quantity}
                                            </div>
                                        ))}
                                    </td>
                                    <td>
                                        <div>
                                            <strong>${order.totalPrice?.toFixed(2)}</strong>
                                            {order.couponCode && (
                                                <div style={{ fontSize: '0.75rem', color: '#388e3c' }}>
                                                    {order.couponCode} (-${order.discountAmount?.toFixed(2)})
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="btn btn-outline btn-sm"
                                                disabled={getNextStatuses(order.status).length === 0}
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
                            <p><strong>Email:</strong> {selectedOrder.email || selectedOrder.user?.email}</p>
                            <p><strong>Total:</strong> ${selectedOrder.totalPrice?.toFixed(2)}</p>
                            <p><strong>Current Status:</strong>
                                <span className={`status-badge ${getStatusClass(selectedOrder.status)}`} style={{ marginLeft: 8 }}>
                                    {selectedOrder.status}
                                </span>
                            </p>
                        </div>

                        {error && <p className="error-text">{error}</p>}

                        <div className="status-lifecycle">
                            <p className="lifecycle-label">Status Lifecycle:</p>
                            <div className="lifecycle-steps">
                                <span className={selectedOrder.status === 'Placed' ? 'active' : ''}>Placed</span>
                                <span className="arrow">→</span>
                                <span className={selectedOrder.status === 'Processing' ? 'active' : ''}>Processing</span>
                                <span className="arrow">→</span>
                                <span className={selectedOrder.status === 'Delivered' ? 'active' : ''}>Delivered</span>
                            </div>
                        </div>

                        <div className="status-buttons">
                            {getNextStatuses(selectedOrder.status).map(status => (
                                <button
                                    key={status}
                                    onClick={() => handleStatusUpdate(selectedOrder._id, status)}
                                    className={`btn ${status === 'Cancelled' ? 'btn-danger' : 'btn-primary'}`}
                                    disabled={updating}
                                >
                                    {updating ? 'Updating...' : `Mark as ${status}`}
                                </button>
                            ))}
                            {getNextStatuses(selectedOrder.status).length === 0 && (
                                <p className="final-status">This order has reached its final status.</p>
                            )}
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
                .error-text {
                    color: #ef5350;
                    margin-bottom: 1rem;
                }
                .status-lifecycle {
                    background: #f8f9fa;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1.5rem;
                }
                .lifecycle-label {
                    font-size: 0.85rem;
                    color: #636e72;
                    margin: 0 0 0.5rem;
                }
                .lifecycle-steps {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .lifecycle-steps span {
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.85rem;
                }
                .lifecycle-steps .active {
                    background: #285eaf;
                    color: white;
                    font-weight: 600;
                }
                .lifecycle-steps .arrow {
                    color: #adb5bd;
                }
                .status-buttons {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                }
                .final-status {
                    color: #636e72;
                    font-style: italic;
                }
                .status-badge.placed {
                    background: #fff3e0;
                    color: #f57c00;
                }
                .status-badge.processing {
                    background: #e3f2fd;
                    color: #1976d2;
                }
                .status-badge.delivered {
                    background: #e8f5e9;
                    color: #388e3c;
                }
                .status-badge.cancelled {
                    background: #ffebee;
                    color: #d32f2f;
                }
            `}</style>
        </div>
    );
};

export default AdminOrders;
