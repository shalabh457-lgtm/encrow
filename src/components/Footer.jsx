import React from 'react';
import { CATEGORIES } from '../data/mockData';
import { ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ navigate }) {
  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
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
            <p>
              The verified freelance services & digital talent marketplace protected by multi-signature escrow. Work with confidence, pay with safety.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '16px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                fontSize: '0.8rem',
                fontWeight: '700'
              }}
            >
              <ShieldCheck size={16} />
              <span>100% Escrow Fund Protection Guaranteed</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="footer-col-title">Top Categories</h4>
            <ul className="footer-links">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('gigs', { cat });
                    }}
                  >
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* More Categories */}
          <div>
            <h4 className="footer-col-title">More Services</h4>
            <ul className="footer-links">
              {CATEGORIES.slice(5).map((cat) => (
                <li key={cat}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('gigs', { cat });
                    }}
                  >
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community & Platform */}
          <div>
            <h4 className="footer-col-title">Platform</h4>
            <ul className="footer-links">
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('orders');
                  }}
                >
                  Escrow Orders
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('add-gig');
                  }}
                >
                  Become a Seller
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('gigs');
                  }}
                >
                  Explore Marketplace
                </a>
              </li>
              <li>
                <a href="#trust-features">How Escrow Works</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} Trust+ Inc. (Encrow). All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Built with precision in</span>
            <span style={{ color: 'var(--primary)', fontWeight: '700' }}>React JS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
