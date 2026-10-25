import React from 'react';
import { Star, Heart, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../data/mockData';

export default function GigCard({ gig, onSelectGig, onSelectUser }) {
  const { favorites, toggleFavorite } = useApp();
  const isFav = favorites.includes(gig.id);

  const rating = !isNaN(gig.totalStars / gig.starNumber)
    ? (gig.totalStars / gig.starNumber).toFixed(1)
    : '5.0';

  return (
    <div
      className="gig-card"
      onClick={() => onSelectGig && onSelectGig(gig.id)}
    >
      {/* Cover Image & Category Badge */}
      <div className="gig-card-cover-wrapper">
        <img
          src={gig.img || gig.cover || 'https://picsum.photos/seed/placeholder/800/400'}
          alt={gig.title}
          className="gig-card-cover"
          loading="lazy"
        />
        {gig.cat && <span className="gig-card-cat-badge">{gig.cat}</span>}

        <button
          className={`gig-card-heart-btn ${isFav ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(gig.id);
          }}
          title={isFav ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart size={16} fill={isFav ? '#ef4444' : 'none'} color={isFav ? '#ef4444' : 'currentColor'} />
        </button>
      </div>

      {/* Card Body */}
      <div className="gig-card-body">
        {/* Seller Info */}
        <div
          className="gig-card-seller"
          onClick={(e) => {
            e.stopPropagation();
            if (onSelectUser) onSelectUser(gig.username);
          }}
          style={{ cursor: 'pointer' }}
          title={`View ${gig.username}'s profile`}
        >
          <img
            src={gig.userImg || `https://i.pravatar.cc/150?u=${gig.username}`}
            alt={gig.username}
            className="gig-seller-avatar"
          />
          <div>
            <div className="gig-seller-name">{gig.username}</div>
            <div className="gig-seller-tag">{gig.rate || 'Freelance Pro'}</div>
          </div>
        </div>

        {/* Title */}
        <div className="gig-card-title" title={gig.title}>
          {gig.title}
        </div>

        {/* Star Rating */}
        <div className="gig-card-rating">
          <Star size={14} fill="#f59e0b" color="#f59e0b" />
          <span>{rating}</span>
          <span className="rating-count">({gig.starNumber || 20})</span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="gig-card-footer">
        <div className="gig-delivery-badge">
          <Clock size={13} />
          <span>{gig.deliveryTime || '3 days'}</span>
        </div>

        <div className="gig-card-price-box">
          <div className="gig-price-label">Starting At</div>
          <div className="gig-price-value">{formatPrice(gig.price)}</div>
        </div>
      </div>
    </div>
  );
}
