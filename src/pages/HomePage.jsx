import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { HERO_IMAGES, CATEGORIES } from '../data/mockData';
import GigCard from '../components/GigCard';
import {
  Search,
  ShieldCheck,
  Zap,
  CheckCircle,
  Headphones,
  ArrowRight,
  Sparkles,
  Lock,
  Layers,
  Award
} from 'lucide-react';

export default function HomePage({ navigate }) {
  const { gigs, setSearchQuery, setActiveCategory } = useApp();

  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);
  const [heroSearch, setHeroSearch] = useState('');
  const [featuredCatFilter, setFeaturedCatFilter] = useState('All');

  // Slideshow timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIdx((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      setSearchQuery(heroSearch.trim());
      navigate('gigs', { search: heroSearch.trim() });
    }
  };

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    navigate('gigs', { search: tag });
  };

  // Filter featured gigs
  const filteredFeatured = gigs
    .filter((g) => (featuredCatFilter === 'All' ? true : g.cat === featuredCatFilter))
    .slice(0, 8);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-container">
          <img
            src={HERO_IMAGES[currentHeroIdx]}
            alt="Hero Background"
            className="hero-bg-img"
          />
          <div className="hero-overlay-gradient" />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-content">
            <div className="hero-badge">
              <ShieldCheck size={16} />
              <span>GUARANTEED ESCROW MARKETPLACE</span>
            </div>

            <h1 className="hero-title">
              Find the perfect <em>freelance</em> services for your business
            </h1>

            {/* Search Box */}
            <form onSubmit={handleSearchSubmit} className="hero-search-box">
              <input
                type="text"
                placeholder="Try 'building mobile app' or 'logo design'..."
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
              />
              <button type="submit" className="hero-search-btn">
                <Search size={18} />
                <span>Search</span>
              </button>
            </form>

            {/* Popular Tags */}
            <div className="hero-tags">
              <span className="hero-tags-label">Popular:</span>
              {['Website Design', 'WordPress', 'Logo Design', 'AI Services'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="hero-tag-chip"
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Escrow Value Proposition Banner */}
      <section className="trust-banner-section" id="trust-features">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <div className="trust-icon-box green">
                <ShieldCheck size={26} />
              </div>
              <div>
                <h3 className="trust-title">Trust+ Escrow Guarantee</h3>
                <p className="trust-desc">
                  Funds are secured in a smart escrow vault and only released once you review and approve the delivery.
                </p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-box blue">
                <Zap size={26} />
              </div>
              <div>
                <h3 className="trust-title">Quality Work Done Fast</h3>
                <p className="trust-desc">
                  Filter by budget, delivery days, and seller ratings. Hire top freelancers in under 3 minutes.
                </p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-box purple">
                <Award size={26} />
              </div>
              <div>
                <h3 className="trust-title">Verified Talent</h3>
                <p className="trust-desc">
                  Every seller undergoes portfolio validation with transparent ratings and client reviews.
                </p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-box gold">
                <Headphones size={26} />
              </div>
              <div>
                <h3 className="trust-title">24/7 Dispute Concierge</h3>
                <p className="trust-desc">
                  Dedicated mediation specialists available around the clock to protect both buyers and sellers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Popular Categories Grid */}
      <section style={{ padding: '64px 0 32px', background: 'var(--bg-main)' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Explore Popular Categories</h2>
              <p className="section-subtitle">
                Browse our most sought-after specialized services
              </p>
            </div>
            <button
              className="section-link"
              onClick={() => navigate('gigs')}
            >
              <span>View All Categories</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px'
            }}
          >
            {CATEGORIES.map((cat, idx) => (
              <div
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  navigate('gigs', { cat });
                }}
                style={{
                  background: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px 20px',
                  border: '1px solid var(--border-light)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Layers size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--dark)' }}>
                    {cat}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {gigs.filter((g) => g.cat === cat).length}+ services available
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section style={{ padding: '48px 0 72px' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Popular Services</h2>
              <p className="section-subtitle">
                Most ordered and highest-rated gigs this month
              </p>
            </div>
            <button
              className="section-link"
              onClick={() => navigate('gigs')}
            >
              <span>View All Gigs ({gigs.length})</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Category Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '16px',
              marginBottom: '20px'
            }}
          >
            {['All', ...CATEGORIES.slice(0, 5)].map((cat) => (
              <button
                key={cat}
                className={`order-tab-pill ${featuredCatFilter === cat ? 'active' : ''}`}
                onClick={() => setFeaturedCatFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gigs Grid */}
          <div className="gigs-grid">
            {filteredFeatured.map((gig) => (
              <GigCard
                key={gig.id}
                gig={gig}
                onSelectGig={(id) => navigate('gig-detail', { id })}
                onSelectUser={(user) => navigate('profile', { user })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How Escrow Works Visual Showcase */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          padding: '80px 0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#6ee7b7',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: '700',
                marginBottom: '16px'
              }}
            >
              <Lock size={14} />
              <span>THE TRUST+ ESCROW PROTOCOL</span>
            </span>
            <h2 className="font-display" style={{ fontSize: '2.4rem', fontWeight: '800', lineHeight: 1.2 }}>
              How your funds stay 100% protected
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '12px' }}>
              Unlike traditional marketplaces where you pay upfront and hope for the best, Trust+ locks your payment until you verify every requirement.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px'
            }}
          >
            {[
              {
                step: '01',
                title: 'Order & Lock Funds',
                desc: 'Select a gig and package. Your payment is placed into the secure Trust+ Escrow Vault.'
              },
              {
                step: '02',
                title: 'Freelancer Delivers',
                desc: 'The seller completes the work according to agreed specifications and uploads deliverables.'
              },
              {
                step: '03',
                title: 'Review & Request Changes',
                desc: 'Inspect the files. If anything is missing, request revisions without paying extra.'
              },
              {
                step: '04',
                title: 'Release & Complete',
                desc: 'Only when you are 100% satisfied, you release the funds to the seller. True peace of mind.'
              }
            ].map((item) => (
              <div
                key={item.step}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <div
                  style={{
                    fontSize: '2rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: '800',
                    color: 'var(--primary)',
                    marginBottom: '12px'
                  }}
                >
                  {item.step}
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '8px' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section style={{ padding: '80px 0', background: 'var(--bg-main)' }}>
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: 'var(--radius-xl)',
              padding: '60px 48px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '32px',
              boxShadow: '0 20px 40px rgba(16, 185, 129, 0.25)'
            }}
          >
            <div style={{ maxWidth: '560px' }}>
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  letterSpacing: '0.05em'
                }}
              >
                EARN ON YOUR OWN TERMS
              </span>
              <h2
                className="font-display"
                style={{ fontSize: '2.4rem', fontWeight: '800', margin: '14px 0 10px' }}
              >
                Have a skill? Start selling on Trust+
              </h2>
              <p style={{ fontSize: '1rem', opacity: 0.95, lineHeight: 1.5 }}>
                Join thousands of verified freelancers getting paid safely and on time with zero chargeback risk.
              </p>
            </div>

            <div>
              <button
                className="btn-primary"
                style={{
                  background: '#ffffff',
                  color: '#059669',
                  padding: '16px 36px',
                  fontSize: '1.05rem',
                  fontWeight: '800'
                }}
                onClick={() => navigate('add-gig')}
              >
                <span>Publish a Gig Today</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
