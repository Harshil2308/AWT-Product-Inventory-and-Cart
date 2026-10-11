import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

/**
 * Cart Component
 * Handles cart item lists, quantity increments/decrements, item removal,
 * total calculation via useMemo, and interactive checkout form.
 */
const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartSummary } = useCart();

  // State for checkout modal and form
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'cod'
  });

  const [formErrors, setFormErrors] = useState({});

  // Currency formatter
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Memoized calculations specific to checkout breakdown
  const pricingDetails = useMemo(() => {
    return {
      subtotal: cartSummary.subtotal,
      discount: cartSummary.discount,
      deliveryFee: cartSummary.deliveryFee,
      finalTotal: cartSummary.finalTotal
    };
  }, [cartSummary]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();

    // Form validation
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Enter a valid email address';
    }
    if (!formData.address.trim()) errors.address = 'Delivery address is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Success flow
    const randomOrderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(randomOrderId);
    setOrderSuccess(true);
    setIsCheckingOut(false);
    clearCart();
  };

  return (
    <div className="cart-page-container">
      {/* Header */}
      <div className="cart-header">
        <h1 className="cart-title">Your Shopping Cart</h1>
        <p className="cart-subtitle">
          Review your chosen items, adjust quantities, or proceed to checkout.
        </p>
      </div>

      {/* Conditional Rendering: Cart is Empty */}
      {cartItems.length === 0 && !orderSuccess ? (
        <div className="cart-empty-view">
          <div className="empty-cart-art" aria-hidden="true">🛒</div>
          <h2>Your Cart is Currently Empty</h2>
          <p>Explore our wide selection of electronic devices, furniture, and stationery products.</p>
          <Link to="/products" className="btn-continue-shopping">
            Browse Product Store
          </Link>
        </div>
      ) : orderSuccess ? (
        /* Conditional Rendering: Order Success Confirmation */
        <div className="order-success-card">
          <div className="success-badge" aria-hidden="true">✓</div>
          <h2>Order Confirmed!</h2>
          <p className="success-tagline">Thank you for shopping with us, {formData.fullName}!</p>
          <div className="order-receipt-box">
            <div className="receipt-row">
              <span>Order Reference:</span>
              <strong>{orderId}</strong>
            </div>
            <div className="receipt-row">
              <span>Total Paid:</span>
              <strong className="receipt-total">{formatINR(pricingDetails.finalTotal)}</strong>
            </div>
            <div className="receipt-row">
              <span>Delivery Address:</span>
              <span>{formData.address}</span>
            </div>
            <div className="receipt-row">
              <span>Payment Mode:</span>
              <span>{formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
            </div>
          </div>

          <div className="success-actions">
            <Link to="/products" className="btn-continue-shopping">
              Continue Shopping
            </Link>
            <Link to="/" className="btn-return-home">
              Go to Home
            </Link>
          </div>
        </div>
      ) : (
        /* Cart Items & Summary Grid */
        <div className="cart-content-grid">
          {/* Left Column: Cart Items List */}
          <div className="cart-items-column">
            <div className="cart-items-header-bar">
              <span>Product Details</span>
              <span>Quantity</span>
              <span>Subtotal</span>
              <span>Action</span>
            </div>

            <div className="cart-items-list">
              {cartItems.map((item) => {
                const itemTotal = item.price * item.cartQuantity;
                const canIncrease = item.cartQuantity < item.quantity;

                return (
                  <div key={item.id} className="cart-item-row">
                    {/* Item Information */}
                    <div className="cart-item-info">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-item-thumb"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="cart-item-text">
                        <Link to={`/product-details/${item.id}`} className="cart-item-name">
                          {item.name}
                        </Link>
                        <span className="cart-item-category">{item.category}</span>
                        <span className="cart-item-unit-price">
                          Unit: {formatINR(item.price)}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="cart-quantity-controls">
                      <button
                        type="button"
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}
                        title="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="cart-qty-val">{item.cartQuantity}</span>
                      <button
                        type="button"
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                        disabled={!canIncrease}
                        title={canIncrease ? 'Increase quantity' : 'Max stock reached'}
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="cart-item-subtotal">
                      {formatINR(itemTotal)}
                    </div>

                    {/* Remove Action */}
                    <div className="cart-item-remove-cell">
                      <button
                        type="button"
                        className="btn-remove-item"
                        onClick={() => removeFromCart(item.id)}
                        title="Remove product from cart"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-bottom-actions">
              <Link to="/products" className="btn-back-catalog">
                ← Add More Products
              </Link>
              <button
                type="button"
                className="btn-clear-cart"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout */}
          <div className="cart-summary-column">
            <div className="order-summary-card">
              <h2 className="summary-title">Order Summary</h2>

              <div className="summary-line">
                <span>Items Count:</span>
                <strong>{cartSummary.totalItems}</strong>
              </div>

              <div className="summary-line">
                <span>Subtotal:</span>
                <strong>{formatINR(cartSummary.subtotal)}</strong>
              </div>

              {cartSummary.discount > 0 && (
                <div className="summary-line discount-line">
                  <span>Special 5% Discount:</span>
                  <strong>-{formatINR(cartSummary.discount)}</strong>
                </div>
              )}

              <div className="summary-line">
                <span>Estimated Shipping:</span>
                <strong>
                  {cartSummary.deliveryFee === 0 ? (
                    <span className="free-shipping">FREE</span>
                  ) : (
                    formatINR(cartSummary.deliveryFee)
                  )}
                </strong>
              </div>

              <div className="summary-divider" />

              <div className="summary-total-line">
                <span>Total Amount:</span>
                <span className="summary-grand-total">
                  {formatINR(cartSummary.finalTotal)}
                </span>
              </div>

              <button
                type="button"
                className="btn-proceed-checkout"
                onClick={() => setIsCheckingOut(true)}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Form Modal */}
      {isCheckingOut && (
        <div className="checkout-modal-overlay" role="dialog" aria-modal="true">
          <div className="checkout-modal">
            <div className="modal-header">
              <h2>Complete Your Order</h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsCheckingOut(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="checkout-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Harsh Patel"
                  className={formErrors.fullName ? 'input-error' : ''}
                />
                {formErrors.fullName && <span className="error-text">{formErrors.fullName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  className={formErrors.email ? 'input-error' : ''}
                />
                {formErrors.email && <span className="error-text">{formErrors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Delivery Address *</label>
                <textarea
                  id="address"
                  name="address"
                  rows="3"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street, Landmark, City, Pincode"
                  className={formErrors.address ? 'input-error' : ''}
                />
                {formErrors.address && <span className="error-text">{formErrors.address}</span>}
              </div>

              <div className="form-group">
                <label>Payment Method</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                    />
                    <span>Cash on Delivery (COD)</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={formData.paymentMethod === 'online'}
                      onChange={handleInputChange}
                    />
                    <span>UPI / Credit & Debit Card</span>
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsCheckingOut(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-confirm-order">
                  Place Order ({formatINR(cartSummary.finalTotal)})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
