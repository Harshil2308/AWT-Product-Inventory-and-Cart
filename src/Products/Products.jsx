import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Search from './Search';
import CategoryFilter from './CategoryFilter';
import ProductList from './ProductList';
import { initialProducts } from '../data/productsData';
import { useCart } from '../context/CartContext';
import './Products.css';

/**
 * Products Component (Main Products Page)
 * Coordinates Search, CategoryFilter, ProductList, and Live Cart Summary
 * Uses React useMemo to optimize filtering computations and category lists.
 */
const Products = () => {
  const navigate = useNavigate();
  const { cartSummary } = useCart();

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Derive unique categories and product counts using useMemo
  const { categories, categoryCounts } = useMemo(() => {
    const counts = { All: initialProducts.length };
    const categorySet = new Set();

    initialProducts.forEach((prod) => {
      categorySet.add(prod.category);
      counts[prod.category] = (counts[prod.category] || 0) + 1;
    });

    return {
      categories: Array.from(categorySet),
      categoryCounts: counts
    };
  }, []);

  // Filter products using React useMemo for optimal performance
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
  };

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="products-page">
      {/* Page Header / Store Banner */}
      <header className="products-store-header">
        <div className="header-divider">------------------------------------------------</div>
        <h1 className="store-title">PRODUCT STORE</h1>
        <div className="header-divider">------------------------------------------------</div>
        <p className="store-tagline">
          Browse our curated catalog, filter by category, and manage your inventory with ease.
        </p>
      </header>

      {/* Filter and Search Bar Section */}
      <section className="products-filters-section" aria-label="Product Search and Filters">
        <div className="filters-grid">
          <Search
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onClearSearch={() => setSearchTerm('')}
          />

          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categoryCounts={categoryCounts}
          />
        </div>
      </section>

      {/* Product List Section */}
      <section className="products-content-section" aria-label="Product Catalog">
        <ProductList
          products={filteredProducts}
          onResetFilters={handleResetFilters}
        />
      </section>

      {/* Live Cart Bar matching wireframe specifications */}
      <section className="products-cart-bar" aria-label="Cart Summary Bar">
        <div className="header-divider">------------------------------------------------</div>
        <div className="cart-bar-inner">
          <div className="cart-bar-info">
            <span className="cart-bar-items">
              Cart: <strong>{cartSummary.totalItems} {cartSummary.totalItems === 1 ? 'Item' : 'Items'}</strong>
            </span>
            <span className="cart-bar-total">
              Total: <strong>{formatINR(cartSummary.finalTotal)}</strong>
            </span>
          </div>

          <button
            type="button"
            className="btn-checkout-bar"
            onClick={() => navigate('/cart')}
            disabled={cartSummary.totalItems === 0}
          >
            [Checkout]
          </button>
        </div>
      </section>
    </div>
  );
};

export default Products;
