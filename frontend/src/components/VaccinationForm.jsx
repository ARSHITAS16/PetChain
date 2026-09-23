import React, { useState } from 'react';
import { Syringe, Plus } from 'lucide-react';

export default function VaccinationForm({ petId, onAddVaccination, loading }) {
  const [vaccineName, setVaccineName] = useState('');
  const [veterinarian, setVeterinarian] = useState('');
  const [dateAdministered, setDateAdministered] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!vaccineName || !veterinarian) {
      alert('Vaccine Name and Veterinarian clinic details are required.');
      return;
    }

    const timestampSec = Math.floor(new Date(dateAdministered).getTime() / 1000);

    onAddVaccination({
      petId,
      vaccineName,
      dateAdministered: timestampSec,
      veterinarian
    });

    setVaccineName('');
    setVeterinarian('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Syringe size={18} color="#10b981" />
        <h4 style={{ fontSize: '1rem', color: '#f3f4f6' }}>Log Vaccination Record</h4>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Vaccine Name *</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="e.g. Rabies Vaccine" 
            value={vaccineName} 
            onChange={(e) => setVaccineName(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Date Administered *</label>
          <input 
            type="date" 
            className="form-control" 
            value={dateAdministered} 
            onChange={(e) => setDateAdministered(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Veterinarian / Clinic *</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="e.g. Dr. Sarah Jenkins (City Pet Care)" 
            value={veterinarian} 
            onChange={(e) => setVeterinarian(e.target.value)} 
            required 
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading} 
        className="btn btn-success btn-sm" 
        style={{ marginTop: '1rem' }}
      >
        <Plus size={14} /> Log Vaccination Record On-Chain
      </button>
    </form>
  );
}
