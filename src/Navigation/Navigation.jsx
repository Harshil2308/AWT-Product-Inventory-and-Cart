import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navigation.css';

/**
 * Navigation Bar Component
 * Provides responsive routing links, active link states,
 * live cart count badge, and contextual notifications.
 */
const Navigation = () => {
  const { cartSummary, notification } = useCart();

  return (
    <header className="navbar-wrapper">
      <nav className="navbar-container" aria-label="Main Navigation">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">📦</span>
          <div className="brand-text">
            <span className="brand-name">INVENTORY STORE</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="navbar-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Products
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) => `nav-link cart-nav-link ${isActive ? 'active' : ''}`}
          >
            <span>Cart</span>
            <span className={`cart-badge ${cartSummary.totalItems > 0 ? 'has-items' : ''}`}>
              {cartSummary.totalItems}
            </span>
          </NavLink>
        </div>
      </nav>

      {/* Toast Notification Bar */}
      {notification && (
        <div className={`toast-banner toast-${notification.type}`} role="alert">
          <span className="toast-icon">
            {notification.type === 'success' ? '✓' : notification.type === 'warning' ? '⚠' : 'ℹ'}
          </span>
          <span className="toast-text">{notification.message}</span>
        </div>
      )}
    </header>
  );
};

export default Navigation;
