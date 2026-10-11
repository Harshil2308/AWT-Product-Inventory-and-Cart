import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { initialProducts } from '../data/productsData';
import { useCart } from '../context/CartContext';
import './Home.css';

/**
 * Home Component
 * Main landing page showcasing key inventory metrics, featured items,
 * and quick-navigation hubs as outlined in the system architecture.
 */
const Home = () => {
  const navigate = useNavigate();
  const { addToCart, cartSummary } = useCart();

  // Pick top 4 featured products
  const featuredProducts = initialProducts.slice(0, 4);

  // Group by category to show category tiles
  const categories = [
    {
      name: 'Electronics',
      icon: '⚡',
      count: initialProducts.filter((p) => p.category === 'Electronics').length,
      desc: 'Laptops, Wireless Mice, Smartphones, and Audio'
    },
    {
      name: 'Furniture',
      icon: '🪑',
      count: initialProducts.filter((p) => p.category === 'Furniture').length,
      desc: 'Ergonomic Chairs, Modern Desks, and Bookcases'
    },
    {
      name: 'Stationery',
      icon: '📓',
      count: initialProducts.filter((p) => p.category === 'Stationery').length,
      desc: 'Premium Notebooks, Gel Pens, and Desk Organizers'
    }
  ];

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="home-container">
      {/* Hero Banner */}
      <section className="home-hero">
        <div className="hero-badge">⚡ ADVANCED WEB TECHNOLOGIES LAB</div>
        <h1 className="hero-heading">
          Product Inventory &amp; Shopping Cart System
        </h1>
        <p className="hero-subtext">
          A high-performance React application featuring real-time product search,
          dynamic category filtering, stock-aware cart management, and useMemo optimizations.
        </p>

        <div className="hero-cta-group">
          <Link to="/products" className="btn-hero-primary">
            Explore All Products →
          </Link>
          <Link to="/cart" className="btn-hero-secondary">
            View Cart ({cartSummary.totalItems})
          </Link>
        </div>

        {/* Live Metrics Row */}
        <div className="hero-metrics-grid">
          <div className="metric-card">
            <span className="metric-val">{initialProducts.length}</span>
            <span className="metric-lbl">Total Catalog Items</span>
          </div>
          <div className="metric-card">
            <span className="metric-val">3</span>
            <span className="metric-lbl">Product Categories</span>
          </div>
          <div className="metric-card">
            <span className="metric-val">
              {initialProducts.reduce((acc, p) => acc + p.quantity, 0)}
            </span>
            <span className="metric-lbl">Total Stock In-Hand</span>
          </div>
          <div className="metric-card highlight">
            <span className="metric-val">{cartSummary.totalItems}</span>
            <span className="metric-lbl">Items in Active Cart</span>
          </div>
        </div>
      </section>

      {/* Category Explorer */}
      <section className="home-categories-section">
        <div className="section-header">
          <h2>Browse By Category</h2>
          <p>Filter catalog items tailored to your specific workspace needs</p>
        </div>

        <div className="category-tiles-grid">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="category-tile"
              onClick={() => navigate('/products')}
            >
              <div className="cat-icon">{cat.icon}</div>
              <h3 className="cat-name">{cat.name}</h3>
              <p className="cat-desc">{cat.desc}</p>
              <div className="cat-footer">
                <span>{cat.count} Items Available</span>
                <span className="cat-arrow">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="home-featured-section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <p>Hand-picked top tier products from our current inventory</p>
        </div>

        <div className="featured-grid">
          {featuredProducts.map((product) => (
            <div key={product.id} className="featured-card">
              <div className="featured-img-wrap">
                <img src={product.image} alt={product.name} className="featured-img" />
                <span className="featured-category">{product.category}</span>
              </div>
              <div className="featured-content">
                <div className="featured-title-row">
                  <h3>{product.name}</h3>
                  <span className="featured-price">{formatINR(product.price)}</span>
                </div>
                <p className="featured-snippet">{product.description}</p>
                <div className="featured-actions">
                  <Link
                    to={`/product-details/${product.id}`}
                    className="btn-featured-details"
                  >
                    Details
                  </Link>
                  <button
                    type="button"
                    className="btn-featured-cart"
                    onClick={() => addToCart(product, 1)}
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
