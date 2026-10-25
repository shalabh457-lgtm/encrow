import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../data/mockData';
import { X, ShieldCheck, CheckCircle2, Clock, RotateCcw, AlertTriangle } from 'lucide-react';

export default function OrderModal({ isOpen, onClose, gig, packageInfo, packageType, onSuccess }) {
  const { currentUser, createOrder, setWalletModalOpen } = useApp();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');

  if (!isOpen || !gig || !packageInfo) return null;

  const price = packageInfo.price || gig.price;
  const userBalance = currentUser?.walletBalance || 0;
  const hasEnoughBalance = userBalance >= price;
  const balanceDifference = price - userBalance;

  const handleConfirmOrder = () => {
    setLoading(true);
    setTimeout(() => {
      const res = createOrder(gig, packageType, packageInfo);
      setLoading(false);
      if (res.success) {
        onClose();
        if (onSuccess) onSuccess(res.order);
      }
    }, 800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <ShieldCheck size={24} color="var(--primary)" />
            <span>Escrow Checkout</span>
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Gig Summary */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            padding: '16px',
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px'
          }}
        >
          <img
            src={gig.img || gig.cover}
            alt={gig.title}
            style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--dark)', lineClamp: 1 }}>
              {gig.title}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              By <strong>{gig.username}</strong> • {packageType} Tier
            </div>
          </div>
        </div>

        {/* Pricing Summary Breakdown */}
        <div
          style={{
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Package ({packageType})</span>
            <span style={{ fontWeight: '600' }}>{formatPrice(price)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} color="var(--primary)" />
              Escrow Protection Fee
            </span>
            <span style={{ color: 'var(--primary)', fontWeight: '600' }}>₹0 (Free)</span>
          </div>
          <div
            style={{
              borderTop: '1px solid var(--border-light)',
              paddingTop: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline'
            }}
          >
            <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--dark)' }}>Total Due</span>
            <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--dark)' }}>
              {formatPrice(price)}
            </span>
          </div>
        </div>

        {/* Wallet Balance State */}
        <div
          style={{
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            background: hasEnoughBalance ? '#f0fdf4' : '#fffbeb',
            border: `1px solid ${hasEnoughBalance ? '#bbf7d0' : '#fef3c7'}`,
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', color: hasEnoughBalance ? '#166534' : '#92400e', fontWeight: '600' }}>
              TRUST+ WALLET BALANCE
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: hasEnoughBalance ? '#15803d' : '#b45309' }}>
              {formatPrice(userBalance)}
            </div>
          </div>

          {!hasEnoughBalance && (
            <button
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              onClick={() => {
                onClose();
                setWalletModalOpen(true);
              }}
            >
              + Top Up ₹{balanceDifference.toLocaleString('en-IN')}
            </button>
          )}
        </div>

        {/* Delivery & Revisions details */}
        <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={16} color="var(--primary)" />
            {packageInfo.delivery} Delivery
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RotateCcw size={16} color="var(--primary)" />
            {packageInfo.revisions} Revisions
          </span>
        </div>

        {/* Escrow Guarantee Statement */}
        <div
          style={{
            background: 'var(--bg-subtle)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            lineHeight: 1.4,
            marginBottom: '24px',
            display: 'flex',
            gap: '10px'
          }}
        >
          <CheckCircle2 size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>100% Escrow Protection:</strong> Funds remain securely locked in Trust+ Escrow. The seller is only paid after you review and release approval.
          </div>
        </div>

        <button
          className="btn-submit"
          onClick={handleConfirmOrder}
          disabled={!hasEnoughBalance || loading}
          style={{
            opacity: hasEnoughBalance ? 1 : 0.6,
            cursor: hasEnoughBalance ? 'pointer' : 'not-allowed'
          }}
        >
          {loading ? (
            'Securing Escrow Vault...'
          ) : hasEnoughBalance ? (
            `Lock ${formatPrice(price)} in Escrow & Place Order`
          ) : (
            'Insufficient Balance — Please Top Up'
          )}
        </button>
      </div>
    </div>
  );
}
