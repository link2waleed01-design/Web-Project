/**
 * Protected Route Component
 * 
 * Redirects unauthenticated users to login
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="page-loading">
                <LoadingSpinner size="large" text="Checking authentication..." />
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login, saving the attempted location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
