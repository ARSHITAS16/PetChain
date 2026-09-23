import React, { useState } from 'react';
import { PlusCircle, Image, Sparkles } from 'lucide-react';

export default function PetForm({ onSubmitPet, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    imageUri: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.breed || !formData.age) {
      alert('Please fill in required fields (Name, Breed, Age).');
      return;
    }
    onSubmitPet({
      ...formData,
      age: parseInt(formData.age, 10)
    });
    setFormData({ name: '', breed: '', age: '', imageUri: '', description: '' });
  };

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <PlusCircle size={24} color="#38bdf8" />
        <div>
          <h2 style={{ fontSize: '1.3rem', color: '#f3f4f6' }}>Register New Pet On-Chain</h2>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Add pet record directly to smart contract storage.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Pet Name *</label>
            <input 
              type="text" 
              name="name" 
              className="form-control" 
              placeholder="e.g. Charlie" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Breed *</label>
            <input 
              type="text" 
              name="breed" 
              className="form-control" 
              placeholder="e.g. Labrador Retriever" 
              value={formData.breed} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Age (years) *</label>
            <input 
              type="number" 
              name="age" 
              min="0" 
              max="30" 
              className="form-control" 
              placeholder="e.g. 2" 
              value={formData.age} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            <Image size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Image URL (Optional)
          </label>
          <input 
            type="url" 
            name="imageUri" 
            className="form-control" 
            placeholder="https://images.unsplash.com/..." 
            value={formData.imageUri} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-group">
          <label className="form-label">Pet Description & Care Notes</label>
          <textarea 
            name="description" 
            className="form-control" 
            rows="3" 
            placeholder="Provide temperament details, medical history, or shelter notes..." 
            value={formData.description} 
            onChange={handleChange}
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="btn btn-primary" 
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <Sparkles size={18} />
          {loading ? 'Submitting Smart Contract Transaction...' : 'Register Pet On Blockchain'}
        </button>
      </form>
    </div>
  );
}
