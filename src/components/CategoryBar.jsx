import React from 'react';
import { CATEGORIES } from '../data/mockData';
import { useApp } from '../context/AppContext';

export default function CategoryBar({ activeCategory, onSelectCategory }) {
  const { setActiveCategory } = useApp();

  const handleClick = (cat) => {
    const next = activeCategory === cat ? '' : cat;
    setActiveCategory(next);
    if (onSelectCategory) {
      onSelectCategory(next);
    }
  };

  return (
    <div className="category-bar-wrapper">
      <div className="container">
        <nav className="category-bar">
          <button
            className={`category-link ${!activeCategory ? 'active' : ''}`}
            onClick={() => handleClick('')}
          >
            All Services
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-link ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => handleClick(cat)}
            >
              {cat}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
