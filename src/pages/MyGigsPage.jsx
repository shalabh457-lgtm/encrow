import React from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../data/mockData';
import { PlusCircle, Trash2, Eye, Briefcase, Star } from 'lucide-react';

export default function MyGigsPage({ navigate }) {
  const { gigs, currentUser, deleteGig, setAuthModalOpen, setAuthMode, quickDemoLogin } = useApp();

  if (!currentUser) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="empty-state">
          <div className="empty-state-icon">
            <Briefcase size={36} color="var(--primary)" />
          </div>
          <h2 className="empty-state-title">Sign In to Manage Your Gigs</h2>
          <p className="empty-state-text">
            Access your seller dashboard to manage listings, track buyer orders, and grow your freelance career.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              className="btn-primary"
              onClick={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
            >
              Sign In
            </button>
            <button
              className="btn-outline"
              onClick={() => quickDemoLogin('seller')}
            >
              Log in as Demo Seller
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Find user's gigs
  const myGigs = gigs.filter(
    (g) =>
      g.username?.toLowerCase() === currentUser.username?.toLowerCase() ||
      currentUser.username === 'demo_seller' // show sample seller gigs
  );

  return (
    <div style={{ padding: '40px 0 80px', background: 'var(--bg-main)' }}>
      <div className="container">
        {/* Header */}
        <div className="catalog-header" style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 className="catalog-title">Seller Dashboard • My Gigs</h1>
              <p className="catalog-subtitle">
                Manage your active listings, view performance, and publish new freelance offerings.
              </p>
            </div>
            <button
              className="btn-primary"
              onClick={() => navigate('add-gig')}
            >
              <PlusCircle size={18} />
              <span>Add New Gig</span>
            </button>
          </div>
        </div>

        {myGigs.length > 0 ? (
          <div
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table className="compare-table" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>Gig</th>
                    <th>Category</th>
                    <th>Base Price</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myGigs.map((gig) => {
                    const rating = !isNaN(gig.totalStars / gig.starNumber)
                      ? (gig.totalStars / gig.starNumber).toFixed(1)
                      : '5.0';

                    return (
                      <tr key={gig.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <img
                              src={gig.img || gig.cover}
                              alt={gig.title}
                              style={{ width: '64px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                            />
                            <div>
                              <div
                                style={{ fontWeight: '700', color: 'var(--dark)', cursor: 'pointer' }}
                                onClick={() => navigate('gig-detail', { id: gig.id })}
                              >
                                {gig.title}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Delivery: {gig.deliveryTime || '3 days'} • Revisions: {gig.revisions || 'Unlimited'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-primary">{gig.cat}</span>
                        </td>
                        <td>
                          <strong style={{ fontSize: '1rem', color: 'var(--dark)' }}>
                            {formatPrice(gig.price)}
                          </strong>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700', color: '#b45309' }}>
                            <Star size={14} fill="#f59e0b" color="#f59e0b" />
                            <span>{rating}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '400' }}>
                              ({gig.starNumber || 1})
                            </span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              className="btn-outline"
                              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                              onClick={() => navigate('gig-detail', { id: gig.id })}
                              title="Preview Gig"
                            >
                              <Eye size={15} />
                              <span>View</span>
                            </button>
                            <button
                              className="btn-outline"
                              style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'var(--border-light)' }}
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this gig?')) {
                                  deleteGig(gig.id);
                                }
                              }}
                              title="Delete Gig"
                            >
                              <Trash2 size={15} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Briefcase size={36} />
            </div>
            <h3 className="empty-state-title">You haven't posted any gigs yet</h3>
            <p className="empty-state-text">
              Reach thousands of buyers looking for verified talent. Create your first service listing today.
            </p>
            <button className="btn-primary" onClick={() => navigate('add-gig')}>
              <PlusCircle size={16} />
              <span>Create Your First Gig</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
