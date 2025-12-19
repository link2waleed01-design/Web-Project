/**
 * Authentication Context
 * 
 * Provides auth state and functions throughout the app
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on mount
    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                try {
                    const response = await authAPI.getMe();
                    setUser(response.data.data);
                } catch (error) {
                    // Token invalid, clear it
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        initAuth();
    }, [token]);

    // Login function
    const login = async (email, password) => {
        const response = await authAPI.login({ email, password });
        const { token: newToken, data } = response.data;

        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(data));
        setToken(newToken);
        setUser(data);

        return data;
    };

    // Register function
    const register = async (name, email, password) => {
        const response = await authAPI.register({ name, email, password });
        const { token: newToken, data } = response.data;

        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(data));
        setToken(newToken);
        setUser(data);

        return data;
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    // Check if user is admin
    const isAdmin = user?.role === 'admin';

    // Check if user is authenticated
    const isAuthenticated = !!token && !!user;

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
