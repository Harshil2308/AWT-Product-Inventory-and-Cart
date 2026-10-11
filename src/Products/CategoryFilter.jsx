import React, { Component } from 'react';
import './CategoryFilter.css';

/**
 * CategoryFilter Component (Implemented as React ES6 Class Component)
 * Demonstrates ES6 Class Component architecture, props, and event handling.
 */
class CategoryFilter extends Component {
  constructor(props) {
    super(props);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
  }

  handleCategoryChange(event) {
    const chosenCategory = event.target.value;
    if (this.props.onSelectCategory) {
      this.props.onSelectCategory(chosenCategory);
    }
  }

  render() {
    const { categories = [], selectedCategory = 'All', categoryCounts = {} } = this.props;

    return (
      <div className="category-filter-container">
        <div className="category-filter-header">
          <label htmlFor="category-select" className="category-filter-label">
            Category
          </label>
          <span className="category-indicator">
            Active: <strong>{selectedCategory}</strong>
          </span>
        </div>

        {/* Dropdown Selector as requested in Example wireframe [ All v ] */}
        <div className="category-select-wrapper">
          <select
            id="category-select"
            className="category-select"
            value={selectedCategory}
            onChange={this.handleCategoryChange}
          >
            <option value="All">All Categories ({categoryCounts['All'] || 0})</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category} ({categoryCounts[category] || 0})
              </option>
            ))}
          </select>
          <span className="select-arrow" aria-hidden="true">▼</span>
        </div>

        {/* Category Pill Badges for instant filtering */}
        <div className="category-pills">
          <button
            type="button"
            className={`category-pill ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => this.props.onSelectCategory('All')}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => this.props.onSelectCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    );
  }
}

export default CategoryFilter;
