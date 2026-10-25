import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../data/mockData';
import {
  ShieldCheck,
  ShoppingBag,
  CheckCircle,
  Clock,
  ExternalLink,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

export default function OrdersPage({ navigate }) {
  const { orders, currentUser, completeOrder, setAuthModalOpen, setAuthMode, quickDemoLogin } = useApp();
  const [filterTab, setFilterTab] = useState('all');

  if (!currentUser) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="empty-state">
          <div className="empty-state-icon">
            <ShoppingBag size={36} color="var(--primary)" />
          </div>
          <h2 className="empty-state-title">Sign In to View Your Escrow Orders</h2>
          <p className="empty-state-text">
            Track your ongoing deliveries, inspect milestones, and release escrow payments securely.
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
              onClick={() => quickDemoLogin('buyer')}
            >
              Try Buyer Demo Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter user's orders
  const userOrders = orders.filter(
    (o) =>
      o.buyerUsername === currentUser.username ||
      o.sellerUsername === currentUser.username ||
      currentUser.username === 'demo_buyer' // demo accounts show all sample orders
  );

  const displayedOrders = userOrders.filter((o) => {
    if (filterTab === 'in-progress') return o.status.includes('In Progress') || o.status.includes('Pending');
    if (filterTab === 'completed') return o.status === 'Completed';
    return true;
  });

  return (
    <div className="orders-page">
      <div className="container">
        {/* Header */}
        <div className="catalog-header" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 className="catalog-title">Orders & Escrow Vault</h1>
              <p className="catalog-subtitle">
                Manage your active projects. All payments remain protected in escrow until your satisfaction.
              </p>
            </div>
            <div className="badge badge-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              <ShieldCheck size={16} />
              <span>Multi-Signature Escrow Active</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="order-tabs-nav">
          <button
            className={`order-tab-pill ${filterTab === 'all' ? 'active' : ''}`}
            onClick={() => setFilterTab('all')}
          >
            All Orders ({userOrders.length})
          </button>
          <button
            className={`order-tab-pill ${filterTab === 'in-progress' ? 'active' : ''}`}
            onClick={() => setFilterTab('in-progress')}
          >
            In Progress & Escrow Funded (
            {userOrders.filter((o) => o.status !== 'Completed').length}
            )
          </button>
          <button
            className={`order-tab-pill ${filterTab === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterTab('completed')}
          >
            Completed ({userOrders.filter((o) => o.status === 'Completed').length})
          </button>
        </div>

        {/* Orders list */}
        {displayedOrders.length > 0 ? (
          <div className="orders-list">
            {displayedOrders.map((order) => {
              const isCompleted = order.status === 'Completed';

              return (
                <div key={order.id} className="order-card">
                  {/* Left: Thumbnail & Details */}
                  <div className="order-card-left">
                    <img
                      src={order.gigCover || 'https://picsum.photos/seed/order/800/400'}
                      alt={order.gigTitle}
                      className="order-cover-thumb"
                    />

                    <div className="order-info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>
                          {order.id}
                        </span>
                        <span
                          className={`badge ${isCompleted ? 'badge-primary' : 'badge-gold'}`}
                          style={{ fontSize: '0.72rem' }}
                        >
                          {order.status}
                        </span>
                      </div>

                      <h3
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate('gig-detail', { id: order.gigId })}
                        title="Click to view gig details"
                      >
                        {order.gigTitle}
                      </h3>

                      <div className="order-submeta">
                        <span>Tier: <strong>{order.packageType}</strong></span>
                        <span>Seller: <strong>{order.sellerUsername}</strong></span>
                        <span>Ordered: {order.orderedAt}</span>
                        <span>Due: {order.deliveryDue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Escrow Status, Price & Action */}
                  <div className="order-card-right">
                    <div className="order-price-display">
                      {formatPrice(order.price)}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        color: isCompleted ? 'var(--primary)' : '#b45309'
                      }}
                    >
                      <ShieldCheck size={16} />
                      <span>
                        {isCompleted
                          ? 'Escrow Settled & Released'
                          : 'Funds Locked in Escrow'}
                      </span>
                    </div>

                    {!isCompleted ? (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <button
                          className="btn-primary"
                          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                          onClick={() => completeOrder(order.id)}
                        >
                          <CheckCircle size={15} />
                          <span>Release Escrow & Approve</span>
                        </button>
                      </div>
                    ) : (
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <CheckCircle size={14} color="var(--primary)" />
                        <span>Completed on {order.completedAt || order.orderedAt}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <ShoppingBag size={36} />
            </div>
            <h3 className="empty-state-title">No orders found</h3>
            <p className="empty-state-text">
              You don't have any orders under this category. Explore the marketplace to hire talented freelancers!
            </p>
            <button className="btn-primary" onClick={() => navigate('gigs')}>
              Browse Gigs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
