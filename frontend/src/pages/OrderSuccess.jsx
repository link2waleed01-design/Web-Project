/**
 * Order Success Page
 */

import { Link } from 'react-router-dom';
import './OrderSuccess.css';

const OrderSuccess = () => {
    return (
        <div className="order-success-page">
            <div className="success-card">
                <span className="success-icon">✓</span>
                <h1>Order Placed Successfully!</h1>
                <p>Thank you for your purchase. Your order has been received and is being processed.</p>
                <p className="order-info">
                    You can view your order history in your profile page.
                </p>
                <div className="success-actions">
                    <Link to="/profile" className="btn btn-primary">
                        View Orders
                    </Link>
                    <Link to="/products" className="btn btn-outline">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
