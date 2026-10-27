import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import GigCard from '../components/GigCard';
import { Search, Filter, RotateCcw, Frown, ChevronRight, X } from 'lucide-react';

export default function GigsPage({ routeParams, navigate }) {
  const { gigs, favorites, activeCategory, setActiveCategory, searchQuery, setSearchQuery } = useApp();

  // Route params take precedence if passed
  const initialCat = routeParams?.cat ?? activeCategory ?? '';
  const initialSearch = routeParams?.search ?? searchQuery ?? '';
  const isFavOnly = !!routeParams?.favOnly;

  const [category, setCategory] = useState(initialCat);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [appliedBudget, setAppliedBudget] = useState({ min: 0, max: Infinity });
  const [sortBy, setSortBy] = useState('featured');

  // Synchronize when routeParams or global context updates
  useEffect(() => {
    if (routeParams?.search !== undefined) {
      setSearchTerm(routeParams.search);
    }
  }, [routeParams?.search]);

  useEffect(() => {
    if (routeParams?.cat !== undefined) {
      setCategory(routeParams.cat);
    }
  }, [routeParams?.cat]);

  // Filter logic
  const filteredGigs = useMemo(() => {
    let result = [...gigs];

    if (isFavOnly) {
      result = result.filter((g) => favorites.includes(g.id));
    }

    if (category) {
      result = result.filter((g) => g.cat?.toLowerCase() === category.toLowerCase());
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        (g) =>
          g.title?.toLowerCase().includes(q) ||
          g.description?.toLowerCase().includes(q) ||
          g.cat?.toLowerCase().includes(q) ||
          g.username?.toLowerCase().includes(q)
      );
    }

    // Budget range
    result = result.filter(
      (g) => g.price >= appliedBudget.min && g.price <= appliedBudget.max
    );

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => {
        const rA = a.totalStars / a.starNumber || 0;
        const rB = b.totalStars / b.starNumber || 0;
        return rB - rA;
      });
    } else if (sortBy === 'reviews') {
      result.sort((a, b) => (b.starNumber || 0) - (a.starNumber || 0));
    }

    return result;
  }, [gigs, category, searchTerm, appliedBudget, sortBy, isFavOnly, favorites]);

  const handleApplyBudget = () => {
    const min = minPrice !== '' ? Number(minPrice) : 0;
    const max = maxPrice !== '' ? Number(maxPrice) : Infinity;

    if (min > max) {
      alert('Minimum budget cannot exceed maximum budget!');
      return;
    }

    setAppliedBudget({ min, max });
  };

  const handleClearBudget = () => {
    setMinPrice('');
    setMaxPrice('');
    setAppliedBudget({ min: 0, max: Infinity });
  };

  const resetAllFilters = () => {
    setCategory('');
    setActiveCategory('');
    setSearchTerm('');
    setSearchQuery('');
    handleClearBudget();
    setSortBy('featured');
    if (isFavOnly) {
      navigate('gigs');
    }
  };

  // Dynamic titles matching original
  const pageTitle = isFavOnly
    ? 'Saved Favorites'
    : category || (searchTerm ? `Results for "${searchTerm}"` : 'All Gigs & Services');

  const pageSubtitle = isFavOnly
    ? 'All the services you have bookmarked for quick access'
    : category
    ? `Find top freelance experts in ${category} to help scale your business`
    : searchTerm
    ? `Explore verified freelance services matching "${searchTerm}"`
    : 'Find high-quality freelance services and talent with guaranteed escrow protection';

  return (
    <div className="catalog-page">
      <div className="container">
        {/* Header with Breadcrumb */}
        <div className="catalog-header">
          <div className="catalog-breadcrumb">
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('home'); }}>
              Home
            </a>
            <ChevronRight size={14} />
            <a href="#" onClick={(e) => { e.preventDefault(); resetAllFilters(); }}>
              Gigs
            </a>
            {category && (
              <>
                <ChevronRight size={14} />
                <span>{category}</span>
              </>
            )}
          </div>

          <h1 className="catalog-title">{pageTitle}</h1>
          <p className="catalog-subtitle">{pageSubtitle}</p>
        </div>

        {/* Toolbar & Filters */}
        <div className="catalog-toolbar">
          {/* Left: Category pills & Search */}
          <div className="filter-group">
            {/* Inline Search Box */}
            <div className="catalog-search-box" style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-full)', padding: '0 12px', height: '38px', gap: '8px' }}>
              <Search size={14} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search in gigs & skills..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSearchQuery(e.target.value);
                }}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: '180px', color: 'var(--text-main)' }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSearchQuery('');
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <select
              className="sort-select"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setActiveCategory(e.target.value);
              }}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Budget Box */}
            <div className="budget-filter-box">
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                Budget (₹):
              </span>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span style={{ color: 'var(--text-muted)' }}>–</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
              <button className="filter-btn-apply" onClick={handleApplyBudget}>
                Apply
              </button>
              {(minPrice || maxPrice || appliedBudget.min > 0 || appliedBudget.max < Infinity) && (
                <button className="filter-btn-clear" onClick={handleClearBudget}>
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Right: Results Count & Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              <strong>{filteredGigs.length}</strong> services available
            </span>

            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Sort: Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
            </select>
          </div>
        </div>

        {/* Gigs List */}
        {filteredGigs.length > 0 ? (
          <div className="gigs-grid">
            {filteredGigs.map((gig) => (
              <GigCard
                key={gig.id}
                gig={gig}
                onSelectGig={(id) => navigate('gig-detail', { id })}
                onSelectUser={(user) => navigate('profile', { user })}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Frown size={36} />
            </div>
            <h3 className="empty-state-title">No gigs found</h3>
            <p className="empty-state-text">
              We couldn't find any services matching your active filters. Try broadening your budget or clearing keywords.
            </p>
            <button className="btn-primary" onClick={resetAllFilters}>
              <RotateCcw size={16} />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
