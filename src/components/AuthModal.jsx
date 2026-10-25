import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, User, Mail, Globe, Phone, FileText, CheckCircle2 } from 'lucide-react';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, authMode, setAuthMode, login, register, quickDemoLogin } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('India');
  const [phone, setPhone] = useState('');
  const [desc, setDesc] = useState('');
  const [isSeller, setIsSeller] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      const res = login(username, password);
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.message);
      }
    }, 500);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      const res = register({
        username,
        email,
        password,
        country,
        phone,
        desc,
        isSeller
      });
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.message);
      }
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={() => setAuthModalOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`package-tab-btn ${authMode === 'login' ? 'active' : ''}`}
              style={{ borderRadius: 'var(--radius-sm)', padding: '8px 16px' }}
              onClick={() => {
                setAuthMode('login');
                setErrorMsg('');
              }}
            >
              Sign In
            </button>
            <button
              className={`package-tab-btn ${authMode === 'register' ? 'active' : ''}`}
              style={{ borderRadius: 'var(--radius-sm)', padding: '8px 16px' }}
              onClick={() => {
                setAuthMode('register');
                setErrorMsg('');
              }}
            >
              Join Trust+
            </button>
          </div>

          <button className="modal-close-btn" onClick={() => setAuthModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              background: 'var(--danger-light)',
              color: 'var(--danger)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              marginBottom: '16px',
              fontWeight: '500'
            }}
          >
            {errorMsg}
          </div>
        )}

        {authMode === 'login' ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">Username or Email</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="e.g. demo_buyer or demo_seller"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <User
                  size={18}
                  style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock
                  size={18}
                  style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }}
                />
              </div>
            </div>

            <button type="submit" className="btn-submit" disabled={loading} style={{ marginTop: '12px' }}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            {/* Quick Demo Logins for instant evaluation */}
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '10px' }}>
                Quick 1-Click Demo Accounts:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-outline"
                  style={{ fontSize: '0.8rem', padding: '8px 10px' }}
                  onClick={() => quickDemoLogin('buyer')}
                >
                  ⚡ Buyer Demo
                </button>
                <button
                  type="button"
                  className="btn-outline"
                  style={{ fontSize: '0.8rem', padding: '8px 10px' }}
                  onClick={() => quickDemoLogin('seller')}
                >
                  ⭐ Seller Demo
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="Pick a unique username"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <User size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  placeholder="Create a password"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Country</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="e.g. India, USA, UK"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
                <Globe size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }} />
              </div>
            </div>

            {/* Seller Account Switch */}
            <div
              style={{
                background: 'var(--bg-subtle)',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '16px'
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--dark)' }}>
                  Activate Seller Account
                </span>
                <input
                  type="checkbox"
                  checked={isSeller}
                  onChange={(e) => setIsSeller(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </label>

              {isSeller && (
                <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Phone Number</label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      className="form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Seller Bio</label>
                    <textarea
                      rows={2}
                      placeholder="Brief summary of your expertise..."
                      className="form-textarea"
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8rem',
                color: '#15803d',
                marginBottom: '16px'
              }}
            >
              <CheckCircle2 size={16} />
              <span>Includes ₹10,000 starter credit in your Trust+ wallet!</span>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
