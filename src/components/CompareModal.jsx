import React from 'react';
import { X, Check } from 'lucide-react';
import { formatPrice } from '../data/mockData';

export default function CompareModal({ isOpen, onClose, gig, onSelectPackage }) {
  if (!isOpen || !gig) return null;

  const basePrice = gig.price;
  const packages = gig.packages || {
    basic: { name: 'Basic', price: basePrice, delivery: gig.deliveryTime || '3 days', revisions: gig.revisions || 'Unlimited', desc: 'Standard starter package' },
    standard: { name: 'Standard', price: Math.round(basePrice * 1.5), delivery: gig.deliveryTime || '4 days', revisions: 'Unlimited', desc: 'Enhanced delivery with source files' },
    premium: { name: 'Premium', price: Math.round(basePrice * 2.5), delivery: gig.deliveryTime || '6 days', revisions: 'Unlimited', desc: 'Full-service enterprise tier with VIP support' }
  };

  const handleSelect = (pkgKey) => {
    onSelectPackage(pkgKey);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card compare-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Compare Service Packages</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="compare-table">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Feature</th>
                <th style={{ width: '25%' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--dark)' }}>
                    {formatPrice(packages.basic.price)}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Basic</div>
                </th>
                <th style={{ width: '25%', background: '#f0fdf4' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>
                    {formatPrice(packages.standard.price)}
                  </div>
                  <div style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '700' }}>Standard ⭐ Popular</div>
                </th>
                <th style={{ width: '25%' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--dark)' }}>
                    {formatPrice(packages.premium.price)}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Premium</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Package Details</strong></td>
                <td>{packages.basic.desc}</td>
                <td style={{ background: '#f0fdf4' }}>{packages.standard.desc}</td>
                <td>{packages.premium.desc}</td>
              </tr>
              <tr>
                <td><strong>Delivery Time</strong></td>
                <td>{packages.basic.delivery}</td>
                <td style={{ background: '#f0fdf4' }}>{packages.standard.delivery}</td>
                <td>{packages.premium.delivery}</td>
              </tr>
              <tr>
                <td><strong>Revisions</strong></td>
                <td>{packages.basic.revisions}</td>
                <td style={{ background: '#f0fdf4' }}>{packages.standard.revisions}</td>
                <td>{packages.premium.revisions}</td>
              </tr>
              <tr>
                <td><strong>Source Files</strong></td>
                <td><Check size={16} color="var(--primary)" /></td>
                <td style={{ background: '#f0fdf4' }}><Check size={16} color="var(--primary)" /></td>
                <td><Check size={16} color="var(--primary)" /></td>
              </tr>
              <tr>
                <td><strong>Commercial License</strong></td>
                <td><Check size={16} color="var(--primary)" /></td>
                <td style={{ background: '#f0fdf4' }}><Check size={16} color="var(--primary)" /></td>
                <td><Check size={16} color="var(--primary)" /></td>
              </tr>
              <tr>
                <td><strong>VIP Priority Support</strong></td>
                <td style={{ color: 'var(--text-light)' }}>—</td>
                <td style={{ background: '#f0fdf4', color: 'var(--text-light)' }}>—</td>
                <td><Check size={16} color="var(--primary)" /></td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <button
                    className="btn-outline"
                    style={{ width: '100%', padding: '10px' }}
                    onClick={() => handleSelect('basic')}
                  >
                    Select Basic
                  </button>
                </td>
                <td style={{ background: '#f0fdf4' }}>
                  <button
                    className="btn-primary"
                    style={{ width: '100%', padding: '10px' }}
                    onClick={() => handleSelect('standard')}
                  >
                    Select Standard
                  </button>
                </td>
                <td>
                  <button
                    className="btn-outline"
                    style={{ width: '100%', padding: '10px' }}
                    onClick={() => handleSelect('premium')}
                  >
                    Select Premium
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
