/**
 * Navbar Component - BeEnergy Theme
 */

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <img
                        src="https://themes.muffingroup.com/be/energy/wp-content/uploads/2014/12/retina-energy.png"
                        alt="EnergyShop"
                        className="logo-image"
                    />
                </Link>

                {/* Navigation Links */}
                <div className="navbar-links">
                    <Link to="/" className="nav-link active">Home</Link>
                    <Link to="/products" className="nav-link">Products</Link>
                    {isAuthenticated && (
                        <Link to="/profile" className="nav-link">My Orders</Link>
                    )}
                    {isAdmin && (
                        <Link to="/admin" className="nav-link">Admin</Link>
                    )}
                </div>

                {/* Right Section */}
                <div className="navbar-right">
                    {/* Cart */}
                    <Link to="/cart" className="cart-link">
                        🛒
                        {cartCount > 0 && (
                            <span className="cart-badge">{cartCount}</span>
                        )}
                    </Link>

                    {/* Auth Links */}
                    {isAuthenticated ? (
                        <div className="user-menu">
                            <span className="user-name">{user?.name}</span>
                            <button onClick={handleLogout} className="nav-btn logout-btn">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="auth-links">
                            <Link to="/login" className="nav-btn login-btn">
                                Login
                            </Link>
                            <Link to="/register" className="nav-btn signup-btn">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
