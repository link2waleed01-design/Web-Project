/**
 * Admin Products Management
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import './Admin.css';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        images: ''
    });
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                productsAPI.getAll(),
                categoriesAPI.getAll()
            ]);
            setProducts(productsRes.data.data);
            setCategories(categoriesRes.data.data);
        } catch (err) {
            console.error('Failed to load data:', err);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                title: product.title,
                description: product.description || '',
                price: product.price,
                category: product.category?._id || '',
                stock: product.stock,
                images: product.images?.join(', ') || ''
            });
        } else {
            setEditingProduct(null);
            setFormData({
                title: '',
                description: '',
                price: '',
                category: categories[0]?._id || '',
                stock: '',
                images: ''
            });
        }
        setError('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const data = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                images: formData.images ? formData.images.split(',').map(s => s.trim()) : []
            };

            if (editingProduct) {
                await productsAPI.update(editingProduct._id, data);
            } else {
                await productsAPI.create(data);
            }

            closeModal();
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save product');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await productsAPI.delete(id);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete product');
        }
    };

    if (loading) {
        return (
            <div className="admin-page">
                <LoadingSpinner size="large" text="Loading products..." />
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="admin-subpage-header">
                <h1>Products Management</h1>
                <button onClick={() => openModal()} className="btn btn-primary">
                    + Add Product
                </button>
            </div>

            <div className="admin-content">
                {products.length === 0 ? (
                    <p className="no-data">No products found. Add your first product!</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id}>
                                    <td>
                                        <img
                                            src={product.images?.[0] || 'https://via.placeholder.com/50'}
                                            alt={product.title}
                                            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }}
                                        />
                                    </td>
                                    <td>{product.title}</td>
                                    <td>{product.category?.name || 'N/A'}</td>
                                    <td>${product.price?.toFixed(2)}</td>
                                    <td>{product.stock}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button
                                                onClick={() => openModal(product)}
                                                className="btn btn-outline btn-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="btn btn-danger btn-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
                            <button className="modal-close" onClick={closeModal}>×</button>
                        </div>

                        {error && <div className="error-alert">{error}</div>}

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            <div className="form-group">
                                <label>Category *</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    required
                                >
                                    <option value="">Select category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Price *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Stock *</label>
                                <input
                                    type="number"
                                    value={formData.stock}
                                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Image URLs (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.images}
                                    onChange={e => setFormData({ ...formData, images: e.target.value })}
                                    placeholder="https://example.com/image1.jpg, https://..."
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={closeModal} className="btn btn-outline">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : 'Save Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
