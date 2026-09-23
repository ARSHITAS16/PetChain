import React, { useState } from 'react';
import { Search, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import PetCard from '../components/PetCard';

export default function Pets({ pets, onViewDetails, onRequestAdoption, userAccount, loading, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, available, adopted

  const filteredPets = pets.filter((pet) => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pet.breed.toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === 'available') return matchesSearch && !pet.isAdopted;
    if (statusFilter === 'adopted') return matchesSearch && pet.isAdopted;
    return matchesSearch;
  });

  return (
    <div>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#f3f4f6' }}>Browse Registered Pets</h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
            All records are synchronized live from the PetChain smart contract.
          </p>
        </div>

        <button onClick={onRefresh} disabled={loading} className="btn btn-secondary btn-sm">
          <RefreshCw size={14} className={loading ? 'spin' : ''} />
          {loading ? 'Refreshing...' : 'Refresh Blockchain State'}
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search by pet name or breed..." 
            style={{ paddingLeft: '2.4rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Filter size={16} color="#9ca3af" />
          <button 
            className={`btn btn-sm ${statusFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStatusFilter('all')}
          >
            All ({pets.length})
          </button>
          <button 
            className={`btn btn-sm ${statusFilter === 'available' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStatusFilter('available')}
          >
            Available ({pets.filter(p => !p.isAdopted).length})
          </button>
          <button 
            className={`btn btn-sm ${statusFilter === 'adopted' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStatusFilter('adopted')}
          >
            Adopted ({pets.filter(p => p.isAdopted).length})
          </button>
        </div>
      </div>

      {/* Pet Grid Display */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#9ca3af' }}>
          <RefreshCw size={36} color="#38bdf8" style={{ animation: 'spin 1.5s linear infinite', marginBottom: '1rem' }} />
          <p>Fetching pet records from local Hardhat blockchain...</p>
        </div>
      ) : filteredPets.length > 0 ? (
        <div className="pet-grid">
          {filteredPets.map((pet) => (
            <PetCard 
              key={pet.petId} 
              pet={pet} 
              onViewDetails={onViewDetails} 
              onRequestAdoption={onRequestAdoption}
              userAccount={userAccount}
            />
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
          <AlertCircle size={40} color="#f59e0b" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', color: '#f3f4f6', marginBottom: '0.5rem' }}>No Pets Found</h3>
          <p style={{ fontSize: '0.9rem' }}>
            {searchTerm ? `No pets matching "${searchTerm}". Try resetting search filter.` : 'No pets have been registered on the blockchain yet.'}
          </p>
        </div>
      )}
    </div>
  );
}
