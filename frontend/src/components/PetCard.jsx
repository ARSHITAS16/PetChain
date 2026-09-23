import React from 'react';
import { Eye, Heart, CheckCircle, Clock } from 'lucide-react';
import { formatAddress } from '../utils/blockchain';

export default function PetCard({ pet, onViewDetails, onRequestAdoption, userAccount }) {
  const isOwner = userAccount && pet.owner.toLowerCase() === userAccount.toLowerCase();

  return (
    <div className="pet-card">
      <div className="pet-image-container">
        <img 
          src={pet.imageUri || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600"} 
          alt={pet.name} 
          className="pet-image" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600";
          }}
        />
        <div className="pet-badge-pos">
          {pet.isAdopted ? (
            <span className="badge badge-adopted">
              <CheckCircle size={12} /> Adopted
            </span>
          ) : (
            <span className="badge badge-available">
              <Clock size={12} /> Available
            </span>
          )}
        </div>
      </div>

      <div className="pet-card-body">
        <h3 className="pet-card-title">{pet.name}</h3>
        <p className="pet-card-sub">
          {pet.breed} • {Number(pet.age)} {Number(pet.age) === 1 ? 'yr' : 'yrs'} old
        </p>
        <p className="pet-card-desc">
          {pet.description || 'No description provided.'}
        </p>

        <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.75rem' }}>
          Owner: <span style={{ color: '#38bdf8', fontWeight: 600 }}>{formatAddress(pet.owner)}</span>
        </div>

        <div className="pet-card-footer">
          <button 
            onClick={() => onViewDetails(pet.petId)}
            className="btn btn-secondary btn-sm"
          >
            <Eye size={14} /> View Details
          </button>

          {!pet.isAdopted && !isOwner && (
            <button 
              onClick={() => onRequestAdoption(pet)}
              className="btn btn-primary btn-sm"
            >
              <Heart size={14} /> Adopt
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
