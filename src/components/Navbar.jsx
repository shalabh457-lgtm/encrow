import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Wallet,
  Heart,
  ShoppingBag,
  PlusCircle,
  Briefcase,
  LogOut,
  User,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

export default function Navbar({ currentRoute, navigate, isHero = false }) {
  const {
    currentUser,
    logout,
    favorites,
    orders,
    setWalletModalOpen,
    setAuthModalOpen,
    setAuthMode,
    quickDemoLogin,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [localSearch, setLocalSearch] = useState(searchQuery || '');

  // Keep local search input synchronized with global search query
  useEffect(() => {
    setLocalSearch(searchQuery || '');
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = localSearch.trim();
    setSearchQuery(query);
    navigate('gigs', query ? { search: query } : {});
  };

  const isTransparent = isHero && !scrolled;

  return (
    <header className={`navbar-wrapper ${isHero ? 'transparent-hero' : ''} ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-main">
          {/* Left: Brand & Mobile Menu */}
          <div className="nav-left">
            <button
              className="nav-link-btn"
              style={{ padding: 6, display: 'none' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('home');
              }}
              className="brand-logo"
            >
              <span>Trust+</span>
              <span className="dot">.</span>
            </a>

            <div className="brand-escrow-badge" title="All payments secured by Trust+ Escrow">
              <ShieldCheck size={13} />
              <span>Escrow Protected</span>
            </div>
          </div>

          {/* Center: Search (Visible on non-hero or when scrolled) */}
          {(!isHero || scrolled) && (
            <form onSubmit={handleSearchSubmit} className="navbar-search-compact">
              <input
                type="text"
                placeholder="Search gigs, services, skills..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
              <button type="submit">
                <Search size={16} />
              </button>
            </form>
          )}

          {/* Right Actions */}
          <div className="nav-right">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('gigs');
              }}
              className="nav-link-btn"
            >
              Explore Gigs
            </a>

            {currentUser ? (
              <>
                {/* Wallet Balance Pill */}
                <div
                  className="wallet-pill"
                  onClick={() => setWalletModalOpen(true)}
                  title="Click to Top Up Wallet"
                >
                  <Wallet size={16} />
                  <span>₹{(currentUser.walletBalance || 0).toLocaleString('en-IN')}</span>
                  <span className="add-icon">+</span>
                </div>

                {/* Orders Shortcut */}
                <button
                  className="nav-link-btn"
                  onClick={() => navigate('orders')}
                  title="My Orders & Escrow"
                  style={{ position: 'relative' }}
                >
                  <ShoppingBag size={18} />
                  {orders.length > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        background: 'var(--primary)',
                        color: 'white',
                        fontSize: '0.65rem',
                        fontWeight: '800',
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {orders.length}
                    </span>
                  )}
                </button>

                {/* Favorites Shortcut */}
                <button
                  className="nav-link-btn"
                  onClick={() => navigate('gigs', { favOnly: true })}
                  title="Saved Favorites"
                  style={{ position: 'relative' }}
                >
                  <Heart
                    size={18}
                    fill={favorites.length > 0 ? '#ef4444' : 'none'}
                    color={favorites.length > 0 ? '#ef4444' : 'currentColor'}
                  />
                  {favorites.length > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        background: '#ef4444',
                        color: 'white',
                        fontSize: '0.65rem',
                        fontWeight: '800',
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {favorites.length}
                    </span>
                  )}
                </button>

                {/* User Dropdown */}
                <div className="user-menu-wrapper" ref={dropdownRef}>
                  <button
                    className="user-avatar-btn"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <div className="user-avatar-placeholder">
                      {currentUser.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="user-name-text">{currentUser.username}</span>
                    <ChevronDown size={14} color="#64748b" />
                  </button>

                  {dropdownOpen && (
                    <div className="dropdown-menu">
                      <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-light)' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--dark)' }}>
                          {currentUser.username}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {currentUser.isSeller ? '🌟 Verified Seller' : 'Client Account'}
                        </div>
                      </div>

                      {currentUser.isSeller && (
                        <>
                          <a
                            href="#"
                            className="dropdown-item"
                            onClick={(e) => {
                              e.preventDefault();
                              setDropdownOpen(false);
                              navigate('my-gigs');
                            }}
                          >
                            <Briefcase size={16} />
                            <span>My Gigs</span>
                          </a>
                          <a
                            href="#"
                            className="dropdown-item"
                            onClick={(e) => {
                              e.preventDefault();
                              setDropdownOpen(false);
                              navigate('add-gig');
                            }}
                          >
                            <PlusCircle size={16} />
                            <span>Add New Gig</span>
                          </a>
                        </>
                      )}

                      <a
                        href="#"
                        className="dropdown-item"
                        onClick={(e) => {
                          e.preventDefault();
                          setDropdownOpen(false);
                          navigate('profile', { user: currentUser.username });
                        }}
                      >
                        <User size={16} />
                        <span>My Profile</span>
                      </a>

                      <a
                        href="#"
                        className="dropdown-item"
                        onClick={(e) => {
                          e.preventDefault();
                          setDropdownOpen(false);
                          navigate('orders');
                        }}
                      >
                        <ShoppingBag size={16} />
                        <span>Orders & Escrow</span>
                      </a>

                      <a
                        href="#"
                        className="dropdown-item"
                        onClick={(e) => {
                          e.preventDefault();
                          setDropdownOpen(false);
                          setWalletModalOpen(true);
                        }}
                      >
                        <Wallet size={16} />
                        <span>Top Up Wallet</span>
                      </a>

                      <div className="dropdown-divider" />

                      <a
                        href="#"
                        className="dropdown-item"
                        style={{ color: 'var(--danger)' }}
                        onClick={(e) => {
                          e.preventDefault();
                          setDropdownOpen(false);
                          logout();
                        }}
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </a>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  className="nav-link-btn"
                  onClick={() => {
                    setAuthMode('login');
                    setAuthModalOpen(true);
                  }}
                >
                  Sign In
                </button>

                <button
                  className="btn-primary"
                  onClick={() => {
                    setAuthMode('register');
                    setAuthModalOpen(true);
                  }}
                >
                  Join
                </button>

                {/* Instant Demo Switcher for Evaluation */}
                <button
                  className="nav-link-btn"
                  style={{
                    fontSize: '0.8rem',
                    color: isTransparent ? '#6ee7b7' : 'var(--primary)',
                    border: '1px dashed currentColor',
                    padding: '4px 10px',
                    borderRadius: '20px'
                  }}
                  onClick={() => quickDemoLogin('buyer')}
                  title="Click to sign in with instant demo account"
                >
                  <Sparkles size={13} />
                  Demo User
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
