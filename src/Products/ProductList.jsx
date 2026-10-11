import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductList.css';

/**
 * ProductList Component
 * Displays filtered list of products with conditional rendering,
 * stock badges, image preview, View Details navigation, and Add to Cart action.
 */
const ProductList = ({ products, onResetFilters }) => {
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  // Helper to check how many units of this product are already in cart
  const getItemCartQuantity = (productId) => {
    const item = cartItems.find((i) => i.id === productId);
    return item ? item.cartQuantity : 0;
  };

  // Format currency in INR
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Conditional Rendering: Empty State when no products match filters
  if (!products || products.length === 0) {
    return (
      <div className="product-list-empty">
        <div className="empty-icon" aria-hidden="true">📦</div>
        <h3>No Products Found</h3>
        <p>We couldn't find any products matching your current search or category filter.</p>
        <button
          type="button"
          className="btn-reset-filters"
          onClick={onResetFilters}
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="product-list-wrapper">
      <div className="product-list-controls">
        <div className="results-count">
          Showing <span>{products.length}</span> {products.length === 1 ? 'item' : 'items'}
        </div>
        <div className="view-mode-toggle" role="group" aria-label="Display View Mode">
          <button
            type="button"
            className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Card Grid View"
          >
            🔲 Grid View
          </button>
          <button
            type="button"
            className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Inventory Table View"
          >
            📄 Table View
          </button>
        </div>
      </div>

      {/* Grid Mode */}
      {viewMode === 'grid' ? (
        <div className="products-grid">
          {products.map((product) => {
            const inCartQty = getItemCartQuantity(product.id);
            const isOutOfStock = product.quantity <= 0;
            const isLowStock = product.quantity > 0 && product.quantity <= 10;
            const isMaxInCart = inCartQty >= product.quantity;

            return (
              <div key={product.id} className="product-card">
                <div className="product-card-image-wrap">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-card-img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  <span className="product-badge category-tag">{product.category}</span>
                  <span className="product-id-tag">{product.id}</span>

                  {/* Conditional Stock Badges */}
                  {isOutOfStock && <span className="stock-badge out-of-stock">Out of Stock</span>}
                  {isLowStock && !isOutOfStock && (
                    <span className="stock-badge low-stock">Only {product.quantity} left</span>
                  )}
                </div>

                <div className="product-card-body">
                  <div className="product-header">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-rating">★ {product.rating || 4.5}</div>
                  </div>

                  <p className="product-desc-snippet">{product.description}</p>

                  <div className="product-inventory-info">
                    <span className="stock-label">
                      Inventory Stock: <strong>{product.quantity} units</strong>
                    </span>
                    {inCartQty > 0 && (
                      <span className="in-cart-indicator">
                        In Cart: <strong>{inCartQty}</strong>
                      </span>
                    )}
                  </div>

                  <div className="product-price-row">
                    <span className="product-price">{formatINR(product.price)}</span>
                  </div>

                  {/* Actions matching Example wireframe [View Details] [Add to Cart] */}
                  <div className="product-card-actions">
                    <Link
                      to={`/product-details/${product.id}`}
                      className="btn-view-details"
                    >
                      View Details
                    </Link>
                    <button
                      type="button"
                      className="btn-add-cart"
                      onClick={() => addToCart(product, 1)}
                      disabled={isOutOfStock || isMaxInCart}
                    >
                      {isOutOfStock
                        ? 'Out of Stock'
                        : isMaxInCart
                        ? 'Max in Cart'
                        : inCartQty > 0
                        ? `Add More (${inCartQty})`
                        : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table / Inventory View Mode */
        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock Qty</th>
                <th>In Cart</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const inCartQty = getItemCartQuantity(product.id);
                const isOutOfStock = product.quantity <= 0;
                const isMaxInCart = inCartQty >= product.quantity;

                return (
                  <tr key={product.id}>
                    <td>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="table-thumb"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                    </td>
                    <td>
                      <code className="table-id">{product.id}</code>
                    </td>
                    <td className="table-product-name">
                      <strong>{product.name}</strong>
                    </td>
                    <td>
                      <span className="table-category">{product.category}</span>
                    </td>
                    <td className="table-price">{formatINR(product.price)}</td>
                    <td>
                      <span className={`table-stock ${isOutOfStock ? 'out' : product.quantity <= 10 ? 'low' : 'ok'}`}>
                        {product.quantity}
                      </span>
                    </td>
                    <td>{inCartQty > 0 ? <span className="table-in-cart">{inCartQty}</span> : '-'}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="table-btn-details"
                          onClick={() => navigate(`/product-details/${product.id}`)}
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          className="table-btn-cart"
                          onClick={() => addToCart(product, 1)}
                          disabled={isOutOfStock || isMaxInCart}
                        >
                          {isOutOfStock ? 'Empty' : '+ Cart'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductList;
