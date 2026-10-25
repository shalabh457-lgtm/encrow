import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Wallet, X, CheckCircle, ShieldCheck } from 'lucide-react';

export default function WalletModal() {
  const { walletModalOpen, setWalletModalOpen, currentUser, topUpWallet } = useApp();
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(2000);
  const [loading, setLoading] = useState(false);

  if (!walletModalOpen) return null;

  const presets = [500, 1000, 2000, 5000, 10000];

  const handlePresetClick = (amt) => {
    setSelectedPreset(amt);
    setCustomAmount(amt.toString());
  };

  const handlePay = () => {
    const amount = Number(customAmount || selectedPreset);
    if (!amount || isNaN(amount) || amount <= 0) return;

    setLoading(true);
    setTimeout(() => {
      topUpWallet(amount);
      setLoading(false);
      setCustomAmount('');
    }, 700);
  };

  return (
    <div className="modal-overlay" onClick={() => setWalletModalOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <Wallet size={22} color="var(--primary)" />
            <span>Top Up Trust+ Wallet</span>
          </h2>
          <button
            className="modal-close-btn"
            onClick={() => setWalletModalOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Current Balance Banner */}
        <div
          style={{
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              CURRENT BALANCE
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--dark)' }}>
              ₹{(currentUser?.walletBalance || 0).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="badge badge-primary">
            <ShieldCheck size={14} />
            <span>Escrow Ready</span>
          </div>
        </div>

        {/* Presets */}
        <div className="form-group">
          <label className="form-label">Select Amount</label>
          <div className="wallet-presets-grid">
            {presets.map((amt) => (
              <button
                key={amt}
                type="button"
                className={`preset-btn ${selectedPreset === amt ? 'active' : ''}`}
                onClick={() => handlePresetClick(amt)}
              >
                ₹{amt.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div className="form-group">
          <label className="form-label">Or Custom Amount (₹)</label>
          <input
            type="number"
            className="form-input"
            placeholder="e.g. 3500"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedPreset(Number(e.target.value));
            }}
          />
        </div>

        {/* Security Note */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            marginBottom: '24px'
          }}
        >
          <CheckCircle size={15} color="var(--primary)" />
          <span>Instant mock UPI/card authorization. 100% simulated sandbox.</span>
        </div>

        <button
          className="btn-submit"
          onClick={handlePay}
          disabled={loading}
        >
          {loading ? (
            <span>Processing Payment...</span>
          ) : (
            <span>
              Proceed to Add ₹
              {(Number(customAmount || selectedPreset) || 0).toLocaleString('en-IN')}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
