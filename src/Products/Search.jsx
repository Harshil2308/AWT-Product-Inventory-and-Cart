import React from 'react';
import './Search.css';

/**
 * Search Component
 * Handles real-time keyword search for product inventory
 */
const Search = ({ searchTerm, onSearchChange, onClearSearch }) => {
  return (
    <div className="search-container">
      <div className="search-label-group">
        <label htmlFor="product-search-input" className="search-label">
          Search Products
        </label>
        <span className="search-hint">Type name, specs, or keyword</span>
      </div>

      <div className="search-input-wrapper">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          id="product-search-input"
          type="text"
          className="search-input"
          placeholder="e.g. Laptop, Mouse, Chair..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          autoComplete="off"
        />
        {searchTerm && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={onClearSearch}
            title="Clear search"
            aria-label="Clear search input"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
