import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../data/mockData';
import CompareModal from '../components/CompareModal';
import OrderModal from '../components/OrderModal';
import {
  Star,
  Clock,
  RotateCcw,
  Check,
  ShieldCheck,
  ChevronRight,
  User,
  Heart,
  Share2,
  MessageSquare,
  Award,
  Globe
} from 'lucide-react';

export default function GigDetailPage({ routeParams, navigate }) {
  const { gigs, favorites, toggleFavorite, addToast } = useApp();

  const gigId = routeParams?.id;
  const gig = gigs.find((g) => g.id === gigId) || gigs[0];

  const [activePackageKey, setActivePackageKey] = useState('basic');
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  if (!gig) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Gig not found</h2>
        <button className="btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('gigs')}>
          Browse All Gigs
        </button>
      </div>
    );
  }

  const isFav = favorites.includes(gig.id);
  const rating = !isNaN(gig.totalStars / gig.starNumber)
    ? (gig.totalStars / gig.starNumber).toFixed(1)
    : '5.0';

  // Packages definition
  const basePrice = gig.price;
  const baseDelivery = gig.deliveryTime || '3 days';
  const baseRevisions = gig.revisions || 'Unlimited';

  const packages = gig.packages || {
    basic: {
      name: 'Basic',
      price: basePrice,
      delivery: baseDelivery,
      revisions: baseRevisions,
      desc: 'Standard starter package with essential deliverables and source files.'
    },
    standard: {
      name: 'Standard',
      price: Math.round(basePrice * 1.5),
      delivery: '4 days',
      revisions: 'Unlimited',
      desc: 'Most popular! Includes complete source assets, priority turnaround, and revisions.'
    },
    premium: {
      name: 'Premium',
      price: Math.round(basePrice * 2.5),
      delivery: '6 days',
      revisions: 'Unlimited',
      desc: 'Enterprise tier: complete commercial suite, VIP expedited turnaround, and 24/7 dedicated support.'
    }
  };

  const activePackage = packages[activePackageKey] || packages.basic;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Gig link copied to clipboard! 📋');
  };

  return (
    <div className="gig-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="catalog-breadcrumb" style={{ marginBottom: '20px' }}>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('home'); }}>
            Home
          </a>
          <ChevronRight size={14} />
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('gigs', { cat: gig.cat });
            }}
          >
            {gig.cat}
          </a>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-main)', fontWeight: '600', maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {gig.title}
          </span>
        </div>

        <div className="gig-detail-layout">
          {/* Main Left Content */}
          <div className="gig-detail-main">
            {/* Header info */}
            <div className="gig-detail-header">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="badge badge-primary">{gig.cat}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn-outline"
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    onClick={handleShare}
                  >
                    <Share2 size={15} />
                    <span>Share</span>
                  </button>
                  <button
                    className={`btn-outline ${isFav ? 'active' : ''}`}
                    style={{ padding: '6px 12px', fontSize: '0.8rem', color: isFav ? '#ef4444' : undefined }}
                    onClick={() => toggleFavorite(gig.id)}
                  >
                    <Heart size={15} fill={isFav ? '#ef4444' : 'none'} />
                    <span>{isFav ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              </div>

              <h1>{gig.title}</h1>

              <div className="gig-detail-author-row">
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                  onClick={() => navigate('profile', { user: gig.username })}
                >
                  <img
                    src={gig.userImg || `https://i.pravatar.cc/150?u=${gig.username}`}
                    alt={gig.username}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--dark)' }}>
                      {gig.username}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {gig.rate || 'Top Rated Seller'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', fontWeight: '700', color: '#b45309' }}>
                  <Star size={16} fill="#f59e0b" color="#f59e0b" />
                  <span>{rating}</span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: '400', fontSize: '0.85rem' }}>
                    ({gig.starNumber || 45} reviews)
                  </span>
                </div>

                <div className="badge badge-blue">
                  <Award size={13} />
                  <span>Verified Escrow Vendor</span>
                </div>
              </div>
            </div>

            {/* Main Showcase Image */}
            <img
              src={gig.img || gig.cover}
              alt={gig.title}
              className="gig-main-cover"
            />

            {/* About This Gig */}
            <div className="gig-detail-section">
              <h3 className="gig-section-title">About This Gig</h3>
              <div className="gig-desc-body">
                <p style={{ marginBottom: '16px' }}>
                  {gig.fullDesc || gig.description}
                </p>
                <h4 style={{ fontWeight: '700', color: 'var(--dark)', margin: '16px 0 8px' }}>
                  What you will receive:
                </h4>
                <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
                  <li>Custom, bespoke design tailored directly to your brand voice</li>
                  <li>Full commercial use license & ownership rights</li>
                  <li>Ready-to-use production files & editable source files</li>
                  <li>Fast turnaround with prompt communication and milestone updates</li>
                  <li>Protected by Trust+ multi-signature escrow protocol</li>
                </ul>
              </div>
            </div>

            {/* About The Seller Card */}
            <div className="gig-detail-section">
              <h3 className="gig-section-title">About The Seller</h3>
              <div className="seller-profile-card">
                <img
                  src={gig.userImg || `https://i.pravatar.cc/150?u=${gig.username}`}
                  alt={gig.username}
                  className="seller-avatar-large"
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--dark)' }}>
                      {gig.username}
                    </h4>
                    <span className="badge badge-gold">{gig.rate || 'Top Rated'}</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '8px 0 16px', lineHeight: 1.5 }}>
                    Professional digital creator with 6+ years of verified industry experience delivering premium creative and technical solutions.
                  </p>
                  <button
                    className="btn-outline"
                    onClick={() => navigate('profile', { user: gig.username })}
                  >
                    <User size={15} />
                    <span>View Full Profile & Gigs</span>
                  </button>
                </div>
              </div>

              {/* Seller stats */}
              <div className="seller-stats-grid">
                <div className="seller-stat-item">
                  <div className="seller-stat-label">From</div>
                  <div className="seller-stat-value">{gig.country || 'India'}</div>
                </div>
                <div className="seller-stat-item">
                  <div className="seller-stat-label">Member Since</div>
                  <div className="seller-stat-value">Nov 2021</div>
                </div>
                <div className="seller-stat-item">
                  <div className="seller-stat-label">Avg. Response Time</div>
                  <div className="seller-stat-value">1 hour</div>
                </div>
                <div className="seller-stat-item">
                  <div className="seller-stat-label">Languages</div>
                  <div className="seller-stat-value">English, Hindi</div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="gig-detail-section">
              <h3 className="gig-section-title">Client Reviews</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  {
                    name: 'Alex Robertson',
                    country: 'United States',
                    rating: 5,
                    date: '2 weeks ago',
                    comment:
                      'Outstanding work! Exceeded all expectations. The communication was flawless and delivery was 2 days ahead of schedule. The escrow protection gave me total confidence.'
                  },
                  {
                    name: 'Sarah Chen',
                    country: 'Singapore',
                    rating: 5,
                    date: '1 month ago',
                    comment:
                      'Extremely professional. Understood the brand guidelines immediately and delivered pixel-perfect assets. Will definitely order the premium package again!'
                  }
                ].map((rev, idx) => (
                  <div
                    key={idx}
                    style={{
                      paddingBottom: '20px',
                      borderBottom: idx === 0 ? '1px solid var(--border-light)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="user-avatar-placeholder" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                          {rev.name[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--dark)' }}>
                            {rev.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {rev.country} • {rev.date}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar Right */}
          <div className="gig-order-sidebar">
            <div className="order-box">
              {/* Package selector tabs */}
              <div className="package-tabs">
                {['basic', 'standard', 'premium'].map((pkgKey) => (
                  <button
                    key={pkgKey}
                    className={`package-tab-btn ${activePackageKey === pkgKey ? 'active' : ''}`}
                    onClick={() => setActivePackageKey(pkgKey)}
                  >
                    {packages[pkgKey].name}
                  </button>
                ))}
              </div>

              <div className="order-box-body">
                <div className="order-price-row">
                  <div className="order-price-title">{activePackage.name} Package</div>
                  <div className="order-price-amount">{formatPrice(activePackage.price)}</div>
                </div>

                <p className="order-pkg-desc">{activePackage.desc}</p>

                <div className="order-meta-info">
                  <span>
                    <Clock size={16} color="var(--primary)" />
                    {activePackage.delivery} Delivery
                  </span>
                  <span>
                    <RotateCcw size={16} color="var(--primary)" />
                    {activePackage.revisions} Revisions
                  </span>
                </div>

                <ul className="order-features-list">
                  <li>
                    <Check size={16} />
                    <span>Commercial Use License</span>
                  </li>
                  <li>
                    <Check size={16} />
                    <span>High Resolution Source Files</span>
                  </li>
                  <li>
                    <Check size={16} />
                    <span>100% Milestone Escrow Protection</span>
                  </li>
                </ul>

                <button
                  className="btn-order-now"
                  onClick={() => setOrderModalOpen(true)}
                >
                  <ShieldCheck size={18} />
                  <span>Order Now ({formatPrice(activePackage.price)})</span>
                </button>

                <button
                  className="btn-compare-packages"
                  onClick={() => setCompareModalOpen(true)}
                >
                  Compare Packages
                </button>
              </div>
            </div>

            {/* Escrow Guarantee Highlight */}
            <div className="escrow-guarantee-card">
              <ShieldCheck size={24} />
              <div>
                <div className="escrow-guarantee-title">Trust+ Escrow Protection</div>
                <div className="escrow-guarantee-text">
                  Your funds are secured until you inspect and approve the completed work. 100% money-back guarantee if deliverables are not fulfilled.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CompareModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        gig={gig}
        onSelectPackage={(pkgKey) => setActivePackageKey(pkgKey)}
      />

      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        gig={gig}
        packageType={activePackage.name}
        packageInfo={activePackage}
        onSuccess={() => navigate('orders')}
      />
    </div>
  );
}
