/**
 * Admin Categories Management
 */

import { useState, useEffect } from 'react';
import { categoriesAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import './Admin.css';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await categoriesAPI.getAll();
            setCategories(response.data.data);
        } catch (err) {
            console.error('Failed to load categories:', err);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, description: category.description || '' });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', description: '' });
        }
        setError('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCategory(null);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            if (editingCategory) {
                await categoriesAPI.update(editingCategory._id, formData);
            } else {
                await categoriesAPI.create(formData);
            }
            closeModal();
            fetchCategories();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save category');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            await categoriesAPI.delete(id);
            fetchCategories();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete category');
        }
    };

    if (loading) {
        return (
            <div className="admin-page">
                <LoadingSpinner size="large" text="Loading categories..." />
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="admin-subpage-header">
                <h1>Categories Management</h1>
                <button onClick={() => openModal()} className="btn btn-primary">
                    + Add Category
                </button>
            </div>

            <div className="admin-content">
                {categories.length === 0 ? (
                    <p className="no-data">No categories found. Add your first category!</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(category => (
                                <tr key={category._id}>
                                    <td><strong>{category.name}</strong></td>
                                    <td>{category.description || '—'}</td>
                                    <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button
                                                onClick={() => openModal(category)}
                                                className="btn btn-outline btn-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category._id)}
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
                            <h2>{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
                            <button className="modal-close" onClick={closeModal}>×</button>
                        </div>

                        {error && <div className="error-alert">{error}</div>}

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
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

                            <div className="modal-actions">
                                <button type="button" onClick={closeModal} className="btn btn-outline">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : 'Save Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
