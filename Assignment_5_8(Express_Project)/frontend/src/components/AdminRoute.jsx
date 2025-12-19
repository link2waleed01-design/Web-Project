/**
 * Admin Route Component
 * 
 * Redirects non-admin users
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="page-loading">
                <LoadingSpinner size="large" text="Checking permissions..." />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!isAdmin) {
        // Redirect non-admin users to home
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
