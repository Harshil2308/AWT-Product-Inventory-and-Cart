import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navigation from './Navigation/Navigation';
import Home from './Home/Home';
import Products from './Products/Products';
import ProductDetails from './ProductDetails/ProductDetails';
import Cart from './Cart/Cart';
import './App.css';

/**
 * Root Application Component
 * Configures React Router routes matching the required page hierarchy:
 * Home -> Products (Product List, Search, Category Filter) -> Product Details -> Cart
 */
function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navigation />

          <main className="main-content">
            <Routes>
              {/* Home Page */}
              <Route path="/" element={<Home />} />

              {/* Products Page (includes Product List, Search, Category Filter) */}
              <Route path="/products" element={<Products />} />

              {/* Product Details Page */}
              <Route path="/product-details/:id" element={<ProductDetails />} />
              <Route path="/products/:id" element={<ProductDetails />} />

              {/* Cart Page */}
              <Route path="/cart" element={<Cart />} />

              {/* Fallback to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <footer className="app-footer">
            <div className="footer-content">
              <div className="footer-left">
                <strong>Product Inventory &amp; Shopping Cart System</strong>
                <p>Built with React ES6, JSX, Props, Hooks &amp; React Router</p>
              </div>
              <div className="footer-right">
                <span className="footer-tech">React + Vite + useMemo</span>
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
