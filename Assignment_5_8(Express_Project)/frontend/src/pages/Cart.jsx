/**
 * Cart Page - Enhanced Design
 */

import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="page-header">
                    <h1>Shopping Cart</h1>
                </div>
                <div className="cart-container">
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added any items to your cart yet.</p>
                        <Link to="/products" className="btn btn-primary btn-lg">
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="page-header">
                <h1>Shopping Cart</h1>
                <p>{cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart</p>
            </div>

            <div className="cart-container">
                <div className="cart-content">
                    {/* Cart Items */}
                    <div className="cart-items">
                        <div className="cart-items-header">
                            <span>Product</span>
                            <span>Price</span>
                            <span>Quantity</span>
                            <span>Total</span>
                            <span></span>
                        </div>

                        {cartItems.map(item => (
                            <div key={item._id} className="cart-item">
                                <div className="item-product">
                                    <img
                                        src={item.images?.[0] || 'https://via.placeholder.com/80'}
                                        alt={item.title}
                                        className="item-image"
                                    />
                                    <div className="item-details">
                                        <Link to={`/products/${item._id}`} className="item-title">
                                            {item.title}
                                        </Link>
                                        {item.category?.name && (
                                            <span className="item-category">{item.category.name}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="item-price">
                                    ${item.price?.toFixed(2)}
                                </div>

                                <div className="item-quantity">
                                    <div className="quantity-controls">
                                        <button
                                            className="qty-btn"
                                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            −
                                        </button>
                                        <span className="quantity">{item.quantity}</span>
                                        <button
                                            className="qty-btn"
                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="item-total">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>

                                <button
                                    className="remove-btn"
                                    onClick={() => removeFromCart(item._id)}
                                    title="Remove item"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Cart Summary */}
                    <div className="cart-summary">
                        <h2>Order Summary</h2>

                        <div className="summary-details">
                            <div className="summary-row">
                                <span>Subtotal ({cartCount} items)</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span className="free-shipping">FREE</span>
                            </div>
                            <div className="summary-row">
                                <span>Tax</span>
                                <span>Calculated at checkout</span>
                            </div>
                        </div>

                        <div className="summary-total">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>

                        <Link to="/checkout" className="btn btn-primary checkout-btn">
                            Proceed to Checkout
                        </Link>

                        <button onClick={clearCart} className="btn clear-cart-btn">
                            Clear Cart
                        </button>

                        <Link to="/products" className="continue-shopping">
                            ← Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
