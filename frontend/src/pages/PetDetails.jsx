import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Shield, Syringe, History, CheckCircle, Clock, Calendar, User, Check, X, FileText } from 'lucide-react';
import { 
  formatAddress, 
  formatTimestamp, 
  getReadOnlyContract,
  demoStore
} from '../utils/blockchain';
import OwnershipHistory from '../components/OwnershipHistory';
import VaccinationForm from '../components/VaccinationForm';

export default function PetDetails({ petId, onBack, onRequestAdoption, onApproveAdoption, onRejectAdoption, userAccount, isAdmin, onAddVaccination, loadingTx }) {
  const [pet, setPet] = useState(null);
  const [vaccinations, setVaccinations] = useState([]);
  const [history, setHistory] = useState([]);
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPetDetails() {
      setLoading(true);
      setError(null);
      try {
        const contract = getReadOnlyContract();
        const petData = await contract.getPetDetails(petId);
        const vaxData = await contract.getVaccinationHistory(petId);
        const historyData = await contract.getOwnershipHistory(petId);
        const reqData = await contract.getAdoptionRequests(petId);

        setPet(petData);
        setVaccinations(vaxData || []);
        setHistory(historyData || []);
        setAdoptionRequests(reqData || []);
      } catch (err) {
        console.warn("Using demoStore details for pet #", petId, err);
        const fallbackPet = demoStore.getPet(petId);
        setPet(fallbackPet);
        setVaccinations(demoStore.getVaccinations(petId));
        setHistory(demoStore.getOwnershipHistory(petId));
        setAdoptionRequests(demoStore.getAdoptionRequests(petId));
      } finally {
        setLoading(false);
      }
    }
    if (petId) {
      fetchPetDetails();
    }
  }, [petId, loadingTx]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: '#9ca3af' }}>
        <Clock size={36} color="#38bdf8" style={{ animation: 'spin 1.5s linear infinite', marginBottom: '1rem' }} />
        <p>Loading pet details and on-chain history...</p>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error || 'Pet not found.'}</p>
        <button onClick={onBack} className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Pets
        </button>
      </div>
    );
  }

  const isOwner = Boolean(userAccount && pet.owner && userAccount.toLowerCase() === pet.owner.toLowerCase());
  const userHasPendingRequest = Boolean(
    userAccount && 
    adoptionRequests.some(r => r.applicant && r.applicant.toLowerCase() === userAccount.toLowerCase() && Number(r.status) === 0)
  );

  const pendingRequestsForThisPet = adoptionRequests.filter(r => Number(r.status) === 0);

  return (
    <div>
      {/* Top Back Navigation */}
      <button onClick={onBack} className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Browse Pets
      </button>

      {/* Main Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Left Column: Image & Adoption Trigger */}
        <div>
          <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '320px' }}>
              <img 
                src={pet.imageUri || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600"} 
                alt={pet.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600";
                }}
              />
              <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                {pet.isAdopted ? (
                  <span className="badge badge-adopted"><CheckCircle size={14} /> Adopted</span>
                ) : (
                  <span className="badge badge-available"><Clock size={14} /> Available</span>
                )}
              </div>
            </div>

            <div style={{ padding: '1.25rem 0.5rem 0.5rem' }}>
              <h2 style={{ fontSize: '1.8rem', color: '#f3f4f6', marginBottom: '0.25rem' }}>{pet.name}</h2>
              <p style={{ color: '#9ca3af', fontSize: '1rem', marginBottom: '1rem' }}>
                {pet.breed} • {Number(pet.age)} {Number(pet.age) === 1 ? 'year' : 'years'} old
              </p>

              {/* Status and Action Buttons */}
              {isOwner ? (
                <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.85rem', borderRadius: '8px', color: '#6ee7b7', fontSize: '0.9rem', textAlign: 'center' }}>
                  <Check size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  <strong>You are the registered guardian of this pet!</strong>
                </div>
              ) : pet.isAdopted ? (
                <div style={{ background: 'rgba(129, 140, 248, 0.1)', border: '1px solid rgba(129, 140, 248, 0.2)', padding: '0.85rem', borderRadius: '8px', color: '#a5b4fc', fontSize: '0.9rem', textAlign: 'center' }}>
                  This pet has been successfully adopted! View verified ownership timeline below.
                </div>
              ) : userHasPendingRequest ? (
                <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.85rem', borderRadius: '8px', color: '#fbbf24', fontSize: '0.9rem', textAlign: 'center' }}>
                  <Clock size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  Your adoption application has been submitted and is pending shelter review!
                </div>
              ) : (
                <button 
                  onClick={() => onRequestAdoption(pet)} 
                  disabled={loadingTx} 
                  className="btn btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
                >
                  <Heart size={18} /> Request Adoption
                </button>
              )}
            </div>
          </div>

          {/* Admin Pending Adoption Approval Box on Pet Page */}
          {isAdmin && !pet.isAdopted && pendingRequestsForThisPet.length > 0 && (
            <div className="card" style={{ border: '1px solid rgba(245, 158, 11, 0.3)', background: 'rgba(245, 158, 11, 0.05)' }}>
              <h4 style={{ color: '#fbbf24', fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={16} /> Shelter Admin Actions ({pendingRequestsForThisPet.length} pending)
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '1rem' }}>
                Review applicant notes and approve adoption for {pet.name}:
              </p>

              {pendingRequestsForThisPet.map((req, idx) => (
                <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: '8px', marginBottom: '0.75rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#38bdf8', marginBottom: '0.35rem' }}>
                    Applicant: {formatAddress(req.applicant)}
                  </div>
                  {req.applicantNotes && (
                    <div style={{ fontSize: '0.82rem', color: '#d1d5db', fontStyle: 'italic', marginBottom: '0.75rem' }}>
                      "{req.applicantNotes}"
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => onApproveAdoption && onApproveAdoption(Number(pet.petId), idx)}
                      disabled={loadingTx}
                      className="btn btn-success btn-sm"
                    >
                      <Check size={14} /> Approve Adoption
                    </button>
                    <button 
                      onClick={() => onRejectAdoption && onRejectAdoption(Number(pet.petId), idx)}
                      disabled={loadingTx}
                      className="btn btn-danger btn-sm"
                    >
                      <X size={14} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Detailed Info, Vaccination & History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* General Information Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', color: '#f3f4f6', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={20} color="#38bdf8" /> Smart Contract Registration Data
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block' }}>Blockchain Pet ID</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>#{Number(pet.petId)}</span>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block' }}>Current Owner Address</span>
                <code style={{ fontSize: '0.95rem', color: '#34d399' }}>{formatAddress(pet.owner)}</code>
              </div>

              <div>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block' }}>Registered On-Chain</span>
                <span style={{ fontSize: '0.9rem', color: '#e5e7eb' }}>{formatTimestamp(pet.registrationTime)}</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#9ca3af', display: 'block', marginBottom: '0.4rem' }}>Description & Temperament</span>
              <p style={{ color: '#d1d5db', fontSize: '0.95rem', lineHeight: '1.6' }}>
                {pet.description || 'No detailed description recorded.'}
              </p>
            </div>
          </div>

          {/* Vaccination Records Section */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Syringe size={20} color="#10b981" /> Vaccination Records ({vaccinations.length})
              </h3>
            </div>

            {vaccinations.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {vaccinations.map((vax, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600, color: '#38bdf8' }}>{vax.vaccineName}</span>
                      <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{formatTimestamp(vax.dateAdministered)}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                      Administered by: <span style={{ color: '#e5e7eb' }}>{vax.veterinarian}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#9ca3af', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                No vaccination logs submitted for this pet yet.
              </p>
            )}

            {/* Admin Form to add new vaccination record */}
            {isAdmin && (
              <VaccinationForm 
                petId={Number(pet.petId)} 
                onAddVaccination={onAddVaccination} 
                loading={loadingTx} 
              />
            )}
          </div>

          {/* Ownership History Section */}
          <div className="card">
            <OwnershipHistory history={history} />
          </div>
        </div>
      </div>
    </div>
  );
}
