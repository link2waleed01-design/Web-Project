/**
 * Admin Users Management
 */

import { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import './Admin.css';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await usersAPI.getAll();
            setUsers(response.data.data);
        } catch (err) {
            console.error('Failed to load users:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-page">
                <LoadingSpinner size="large" text="Loading users..." />
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="admin-subpage-header">
                <h1>Users Management</h1>
                <span className="user-count">{users.length} users</span>
            </div>

            <div className="admin-content">
                {users.length === 0 ? (
                    <p className="no-data">No users found.</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>
                                        <div className="user-info">
                                            <span className="user-avatar">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </span>
                                            <strong>{user.name}</strong>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`role-badge ${user.role}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <style>{`
                .user-count {
                    background: #f5f5f5;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    color: #757575;
                }
                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .user-avatar {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #7cb342, #689f38);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                }
                .role-badge {
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: capitalize;
                }
                .role-badge.admin {
                    background: #ffc107;
                    color: #1a1a2e;
                }
                .role-badge.customer {
                    background: #e3f2fd;
                    color: #1976d2;
                }
            `}</style>
        </div>
    );
};

export default AdminUsers;
