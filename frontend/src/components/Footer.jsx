/**
 * Footer Component - BeEnergy Theme
 */

import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            {/* Top Section */}
            <div className="footer-top">
                <h2>Want to know more about EnergyShop?</h2>
                <h3>Contact us at support@energyshop.com or find us on:</h3>
            </div>

            {/* Middle Section */}
            <div className="footer-middle">
                <div className="footer-section">
                    <h4>About us</h4>
                    <p>
                        EnergyShop delivers quality products right to your doorstep.
                        We offer a wide selection of categories at competitive prices,
                        with fast shipping and excellent customer service. Shop with
                        confidence knowing your satisfaction is our priority.
                    </p>
                </div>

                <div className="footer-section">
                    <h4>Our Services</h4>
                    <ul>
                        <li>Wide product selection</li>
                        <li>Secure checkout process</li>
                        <li>Fast and reliable shipping</li>
                        <li>24/7 Customer support</li>
                    </ul>
                </div>

                <div className="footer-section with-logo">
                    <img
                        src="https://themes.muffingroup.com/be/energy/wp-content/uploads/2014/12/home_energy_logo_footer.png"
                        alt="EnergyShop Logo"
                        className="footer-logo"
                    />
                    <div>
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/products">Products</Link></li>
                            <li><Link to="/cart">Cart</Link></li>
                            <li><Link to="/login">Login</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} EnergyShop | All Rights Reserved | Powered by React</p>
            </div>
        </footer>
    );
};

export default Footer;
