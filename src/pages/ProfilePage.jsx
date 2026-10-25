import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import GigCard from '../components/GigCard';
import {
  MapPin,
  Calendar,
  Languages,
  Clock,
  ShieldCheck,
  Star,
  PlusCircle,
  MessageSquare,
  Award,
  CheckCircle2
} from 'lucide-react';

export default function ProfilePage({ routeParams, navigate }) {
  const { gigs, users, currentUser, addToast } = useApp();

  const targetUsername = routeParams?.user || currentUser?.username || 'webdesigner_pro';
  const matchedUser = users.find(
    (u) => u.username?.toLowerCase() === targetUsername.toLowerCase()
  );

  const [messageOpen, setMessageOpen] = useState(false);
  const [msgText, setMsgText] = useState('');

  const profile = {
    username: targetUsername,
    country: matchedUser?.country || 'India',
    memberSince: matchedUser?.memberSince || 'Nov 2021',
    description:
      matchedUser?.desc ||
      'Hi, I am a professional freelancer with 5+ years of experience delivering bespoke creative and software solutions. I strive to achieve 100% client satisfaction on every milestone.',
    languages: 'English, Hindi',
    skills: matchedUser?.skills || ['Web Design', 'UI/UX', 'WordPress', 'React', 'Brand Strategy', 'Escrow Certified'],
    rating: matchedUser?.rating || 4.9,
    isSeller: matchedUser ? matchedUser.isSeller : true
  };

  const isOwnProfile = currentUser && currentUser.username === targetUsername;

  // Find gigs by this user
  let userGigs = gigs.filter(
    (g) => g.username?.toLowerCase() === targetUsername.toLowerCase()
  );

  // Fallback if none found
  if (userGigs.length === 0) {
    userGigs = gigs.slice(0, 3);
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!msgText.trim()) return;
    addToast(`Message sent to ${targetUsername}! They usually respond within 1 hour. 💬`);
    setMsgText('');
    setMessageOpen(false);
  };

  return (
    <div style={{ padding: '40px 0 80px', background: 'var(--bg-main)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '32px' }}>
          {/* Left Column: User Profile Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: '32px 24px',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)',
                textAlign: 'center'
              }}
            >
              {/* Avatar with status indicator */}
              <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 16px' }}>
                <img
                  src={`https://i.pravatar.cc/150?u=${profile.username}`}
                  alt={profile.username}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--border-light)' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: 4,
                    right: 4,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#10b981',
                    border: '2px solid white'
                  }}
                  title="Online Now"
                />
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--dark)' }}>
                {profile.username}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {profile.isSeller ? '🌟 Verified Freelance Specialist' : 'Trust+ Client'}
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  margin: '12px 0 20px',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  color: '#b45309'
                }}
              >
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <span>{profile.rating}</span>
                <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>(60+ reviews)</span>
              </div>

              {!isOwnProfile ? (
                <button
                  className="btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => setMessageOpen(!messageOpen)}
                >
                  <MessageSquare size={16} />
                  <span>Contact Me</span>
                </button>
              ) : (
                <button
                  className="btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => navigate('add-gig')}
                >
                  <PlusCircle size={16} />
                  <span>Create New Gig</span>
                </button>
              )}

              {/* Message Dropdown Form */}
              {messageOpen && (
                <form onSubmit={handleSendMessage} style={{ marginTop: '16px', textAlign: 'left' }}>
                  <textarea
                    rows={3}
                    required
                    placeholder={`Write a message to ${profile.username}...`}
                    className="form-textarea"
                    style={{ fontSize: '0.85rem' }}
                    value={msgText}
                    onChange={(e) => setMsgText(e.target.value)}
                  />
                  <button type="submit" className="btn-submit" style={{ marginTop: '8px', padding: '10px' }}>
                    Send Direct Message
                  </button>
                </form>
              )}

              <div className="dropdown-divider" style={{ margin: '24px 0' }} />

              {/* Meta details list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569' }}>
                  <MapPin size={17} color="var(--text-muted)" />
                  <span>From: <strong>{profile.country}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569' }}>
                  <Calendar size={17} color="var(--text-muted)" />
                  <span>Member Since: <strong>{profile.memberSince}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569' }}>
                  <Clock size={17} color="var(--text-muted)" />
                  <span>Avg. Response: <strong>1 hour</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569' }}>
                  <Languages size={17} color="var(--text-muted)" />
                  <span>Languages: <strong>{profile.languages}</strong></span>
                </div>
              </div>
            </div>

            {/* Skills & Certifications Card */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                border: '1px solid var(--border-light)'
              }}
            >
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--dark)', marginBottom: '14px' }}>
                Skills & Expertise
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-full)',
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      color: '#334155'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Bio and Published Gigs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Bio Box */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: '32px',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <h3 className="gig-section-title">Description</h3>
              <p style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.7 }}>
                {profile.description}
              </p>
            </div>

            {/* Gigs by user */}
            <div>
              <div className="section-header">
                <div>
                  <h3 className="section-title">
                    Services by {profile.username} ({userGigs.length})
                  </h3>
                  <p className="section-subtitle">
                    All orders are secured with milestone escrow protection
                  </p>
                </div>
              </div>

              <div className="gigs-grid">
                {userGigs.map((gig) => (
                  <GigCard
                    key={gig.id}
                    gig={gig}
                    onSelectGig={(id) => navigate('gig-detail', { id })}
                    onSelectUser={(user) => navigate('profile', { user })}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
