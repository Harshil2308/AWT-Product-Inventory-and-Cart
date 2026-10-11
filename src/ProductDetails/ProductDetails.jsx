import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { initialProducts } from '../data/productsData';
import { useCart } from '../context/CartContext';
import './ProductDetails.css';

/**
 * ProductDetails Component
 * Displays comprehensive product specifications, stock info,
 * interactive quantity selection, and direct cart operations.
 */
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [selectedQty, setSelectedQty] = useState(1);

  // Locate the target product
  const product = initialProducts.find((p) => p.id === id);

  // Check how many of this item are already in the cart
  const cartItem = cartItems.find((item) => item.id === id);
  const inCartQty = cartItem ? cartItem.cartQuantity : 0;

  // Format currency
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Conditional Rendering: Product not found
  if (!product) {
    return (
      <div className="product-details-not-found">
        <div className="not-found-icon" aria-hidden="true">⚠️</div>
        <h2>Product Not Found</h2>
        <p>We could not find any product matching ID "{id}".</p>
        <button
          type="button"
          className="btn-back-home"
          onClick={() => navigate('/products')}
        >
          ← Return to Products
        </button>
      </div>
    );
  }

  const remainingStock = Math.max(0, product.quantity - inCartQty);
  const isOutOfStock = product.quantity <= 0;
  const isMaxInCart = inCartQty >= product.quantity;

  const handleIncrement = () => {
    if (selectedQty < remainingStock) {
      setSelectedQty((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (selectedQty > 1) {
      setSelectedQty((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, selectedQty);
    setSelectedQty(1);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedQty);
    navigate('/cart');
  };

  // Related products from the same category
  const relatedProducts = initialProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="product-details-container">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb" aria-label="Breadcrumb navigation">
        <Link to="/">Home</Link>
        <span className="separator">/</span>
        <Link to="/products">Products</Link>
        <span className="separator">/</span>
        <span className="breadcrumb-current">{product.name}</span>
      </nav>

      <div className="product-details-card">
        {/* Left Column: Visuals & Badges */}
        <div className="details-visual-col">
          <div className="details-image-frame">
            <img
              src={product.image}
              alt={product.name}
              className="details-main-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80';
              }}
            />
            <span className="details-category-pill">{product.category}</span>
          </div>

          <div className="stock-status-box">
            <span className="status-indicator-dot" />
            <div className="status-text">
              <strong>
                {isOutOfStock
                  ? 'Currently Out of Stock'
                  : `${product.quantity} Units in Inventory`}
              </strong>
              {inCartQty > 0 && (
                <span> ({inCartQty} currently in your cart)</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Information & Actions */}
        <div className="details-info-col">
          <div className="details-meta-top">
            <span className="details-id-tag">ID: {product.id}</span>
            <span className="details-rating">★ {product.rating || 4.8} / 5.0</span>
          </div>

          <h1 className="details-title">{product.name}</h1>

          <div className="details-price-badge">
            <span className="details-price">{formatINR(product.price)}</span>
            <span className="tax-inclusive">Inclusive of all taxes</span>
          </div>

          <p className="details-description">{product.description}</p>

          {/* Key Specifications List */}
          {product.specs && (
            <div className="details-specs-section">
              <h3>Key Specifications</h3>
              <ul className="specs-list">
                {product.specs.map((spec, idx) => (
                  <li key={idx}>
                    <span className="spec-bullet">✔</span> {spec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity Selector & Action Controls */}
          <div className="details-order-panel">
            {!isOutOfStock && !isMaxInCart ? (
              <div className="quantity-selector-group">
                <label className="qty-label">Purchase Quantity:</label>
                <div className="qty-input-controls">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={handleDecrement}
                    disabled={selectedQty <= 1}
                  >
                    -
                  </button>
                  <span className="qty-display">{selectedQty}</span>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={handleIncrement}
                    disabled={selectedQty >= remainingStock}
                  >
                    +
                  </button>
                </div>
                <span className="qty-available">
                  Max available: {remainingStock}
                </span>
              </div>
            ) : (
              <div className="max-stock-alert">
                {isOutOfStock
                  ? 'This item is currently sold out.'
                  : 'You already added all available units to your cart.'}
              </div>
            )}

            <div className="details-action-buttons">
              <button
                type="button"
                className="btn-details-add"
                onClick={handleAddToCart}
                disabled={isOutOfStock || isMaxInCart}
              >
                Add {selectedQty} to Cart
              </button>

              <button
                type="button"
                className="btn-details-buy"
                onClick={handleBuyNow}
                disabled={isOutOfStock || isMaxInCart}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <h2>Similar in {product.category}</h2>
          <div className="related-grid">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                className="related-card"
                onClick={() => navigate(`/product-details/${rel.id}`)}
              >
                <img src={rel.image} alt={rel.name} className="related-thumb" />
                <div className="related-info">
                  <h4>{rel.name}</h4>
                  <span className="related-price">{formatINR(rel.price)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
