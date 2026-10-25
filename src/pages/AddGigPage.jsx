import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import GigCard from '../components/GigCard';
import { PlusCircle, Image, Sparkles, ShieldCheck } from 'lucide-react';

export default function AddGigPage({ navigate }) {
  const { currentUser, addGig, setAuthModalOpen, setAuthMode, quickDemoLogin } = useApp();

  const [title, setTitle] = useState('');
  const [cat, setCat] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState('3500');
  const [deliveryTime, setDeliveryTime] = useState('3 days');
  const [revisions, setRevisions] = useState('Unlimited');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [imgUrl, setImgUrl] = useState('https://picsum.photos/seed/newgig/800/400');

  const [loading, setLoading] = useState(false);

  if (!currentUser) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="empty-state">
          <div className="empty-state-icon">
            <PlusCircle size={36} color="var(--primary)" />
          </div>
          <h2 className="empty-state-title">Sign In to Publish a Gig</h2>
          <p className="empty-state-text">
            Join Trust+ as a verified seller to publish services and receive safe escrow payouts.
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !price) return;

    setLoading(true);
    setTimeout(() => {
      const created = addGig({
        title: title.startsWith('I will') ? title : `I will ${title}`,
        cat: cat,
        price: Number(price),
        deliveryTime: deliveryTime,
        revisions: revisions,
        description: shortDesc || title,
        fullDesc: fullDesc || shortDesc || title,
        img: imgUrl,
        userImg: `https://i.pravatar.cc/150?u=${currentUser.username}`,
        country: currentUser.country || 'India',
        packages: {
          basic: { name: 'Basic', price: Number(price), delivery: deliveryTime, revisions: revisions, desc: shortDesc || title },
          standard: { name: 'Standard', price: Math.round(Number(price) * 1.5), delivery: '4 days', revisions: 'Unlimited', desc: 'Enhanced delivery with source files' },
          premium: { name: 'Premium', price: Math.round(Number(price) * 2.5), delivery: '7 days', revisions: 'Unlimited', desc: 'Full commercial package with VIP support' }
        }
      });
      setLoading(false);
      navigate('gig-detail', { id: created.id });
    }, 600);
  };

  const previewGig = {
    id: 'preview',
    username: currentUser.username,
    userImg: `https://i.pravatar.cc/150?u=${currentUser.username}`,
    rate: 'Seller Level 1',
    title: title || 'I will design a modern bespoke solution for your brand',
    cat: cat,
    price: Number(price) || 3500,
    deliveryTime: deliveryTime,
    img: imgUrl,
    starNumber: 1,
    totalStars: 5
  };

  return (
    <div style={{ padding: '40px 0 80px', background: 'var(--bg-main)' }}>
      <div className="container">
        {/* Header */}
        <div className="catalog-header" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 className="catalog-title">Create & Publish a New Gig</h1>
              <p className="catalog-subtitle">
                Fill in the details below. All buyer orders on your gig will be protected by Trust+ Escrow.
              </p>
            </div>
            <div className="badge badge-primary">
              <ShieldCheck size={16} />
              <span>Escrow Protected Vendor</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', alignItems: 'start' }}>
          {/* Left Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '36px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div className="form-group">
              <label className="form-label">Gig Title</label>
              <input
                type="text"
                required
                placeholder="e.g. design a stunning high-converting website"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Tip: Will automatically be formatted as "I will [your title]".
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Starting Price (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="3500"
                  className="form-input"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Delivery Timeline</label>
                <select
                  className="form-select"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                >
                  <option value="1 day">1 day (Express)</option>
                  <option value="2 days">2 days</option>
                  <option value="3 days">3 days</option>
                  <option value="5 days">5 days</option>
                  <option value="7 days">7 days</option>
                  <option value="14 days">14 days</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Revisions</label>
                <select
                  className="form-select"
                  value={revisions}
                  onChange={(e) => setRevisions(e.target.value)}
                >
                  <option value="Unlimited">Unlimited Revisions</option>
                  <option value="3">3 Revisions</option>
                  <option value="5">5 Revisions</option>
                  <option value="1">1 Revision</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Cover Image URL</label>
              <input
                type="url"
                required
                className="form-input"
                placeholder="https://..."
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quick Presets:</span>
                {[
                  { label: 'Design', url: 'https://picsum.photos/seed/design/800/400' },
                  { label: 'Code', url: 'https://picsum.photos/seed/code/800/400' },
                  { label: 'Marketing', url: 'https://picsum.photos/seed/marketing/800/400' }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'underline' }}
                    onClick={() => setImgUrl(preset.url)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Short Summary Description</label>
              <textarea
                rows={2}
                placeholder="Brief summary shown on cards and package preview..."
                className="form-textarea"
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Description</label>
              <textarea
                rows={5}
                placeholder="Explain the process, your experience, and what deliverables the buyer will receive..."
                className="form-textarea"
                value={fullDesc}
                onChange={(e) => setFullDesc(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
              style={{ marginTop: '16px' }}
            >
              <Sparkles size={18} />
              <span>{loading ? 'Publishing...' : 'Publish Gig Now'}</span>
            </button>
          </form>

          {/* Right: Live Preview Card */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--dark)', marginBottom: '16px' }}>
              Live Card Preview
            </h3>
            <GigCard gig={previewGig} />
            <div
              style={{
                marginTop: '20px',
                padding: '16px',
                background: '#ffffff',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5
              }}
            >
              <div style={{ fontWeight: '700', color: 'var(--dark)', marginBottom: '4px' }}>
                💡 Escrow Seller Protection:
              </div>
              When clients order this gig, their payment is locked in Escrow. Once you submit the work and the buyer approves, your payment is deposited directly into your Trust+ wallet balance!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
