import React, { useState, useEffect } from 'react';
import { Shield, PlusCircle, Heart, Syringe, CheckCircle, Clock, Eye, AlertCircle, Check } from 'lucide-react';
import PetForm from '../components/PetForm';
import AdoptionRequestList from '../components/AdoptionRequestList';
import { getReadOnlyContract, formatAddress, demoStore } from '../utils/blockchain';

export default function AdminDashboard({ onRegisterPet, onApproveAdoption, onRejectAdoption, onViewPetDetails, loadingTx, account, isAdmin, onEnableAdmin }) {
  const [pets, setPets] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const contract = getReadOnlyContract();
      const allPets = await contract.getAllPets();
      setPets(allPets || []);

      // Collect all requests for each pet
      let combinedRequests = [];
      for (const pet of (allPets || [])) {
        const petId = Number(pet.petId);
        const reqs = await contract.getAdoptionRequests(petId);
        (reqs || []).forEach((r, idx) => {
          combinedRequests.push({
            petId,
            petName: pet.name,
            requestIndex: idx,
            applicant: r.applicant,
            applicantNotes: r.applicantNotes,
            timestamp: r.timestamp,
            status: Number(r.status)
          });
        });
      }
      setAllRequests(combinedRequests);
    } catch (err) {
      console.warn("Using demoStore for admin dashboard data:", err);
      const allPets = demoStore.getAllPets();
      setPets(allPets);
      let combinedRequests = [];
      for (const pet of allPets) {
        const petId = Number(pet.petId);
        const reqs = demoStore.getAdoptionRequests(petId);
        reqs.forEach((r, idx) => {
          combinedRequests.push({
            petId,
            petName: pet.name,
            requestIndex: idx,
            applicant: r.applicant,
            applicantNotes: r.applicantNotes,
            timestamp: r.timestamp,
            status: Number(r.status)
          });
        });
      }
      setAllRequests(combinedRequests);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [loadingTx]);

  const pendingRequests = allRequests.filter(r => Number(r.status) === 0);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '0.65rem', borderRadius: '12px' }}>
            <Shield size={28} color="#fbbf24" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: '#f3f4f6' }}>Shelter Admin Control Dashboard</h1>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
              Review adoption applications, approve ownership transfers, register pets, and log medical records.
            </p>
          </div>
        </div>

        {!isAdmin && onEnableAdmin && (
          <button 
            onClick={onEnableAdmin}
            className="btn btn-warning btn-sm"
            style={{ background: '#f59e0b', color: '#000', fontWeight: 700 }}
          >
            👑 Grant Admin Privileges
          </button>
        )}
      </div>

      {/* Admin Privileges Badge Banner */}
      <div style={{ 
        background: 'rgba(245, 158, 11, 0.08)', 
        border: '1px solid rgba(245, 158, 11, 0.25)', 
        padding: '0.85rem 1.25rem', 
        borderRadius: '10px', 
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={18} color="#fbbf24" />
          <span style={{ fontSize: '0.9rem', color: '#fef3c7' }}>
            Administrator Access Active for: <strong>{formatAddress(account)}</strong>
          </span>
        </div>
        <span style={{ fontSize: '0.8rem', color: '#fbbf24', background: 'rgba(245, 158, 11, 0.2)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600 }}>
          SHELTER APPROVER AUTHORIZED
        </span>
      </div>

      {/* Pending Adoption Requests Section */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={20} color="#fbbf24" /> Pending Adoption Applications ({pendingRequests.length})
          </h2>
          <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
            Review applicant housing notes and approve adoption
          </span>
        </div>

        {pendingRequests.length > 0 ? (
          <div>
            <div style={{ marginBottom: '1rem', padding: '0.65rem 0.85rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '8px', fontSize: '0.85rem', color: '#fde68a' }}>
              💡 Approving an adoption application will transfer smart contract ownership to the adopter and automatically update the pet's immutable history.
            </div>

            <AdoptionRequestList 
              requests={pendingRequests}
              onApprove={(idx) => {
                const req = pendingRequests[idx];
                onApproveAdoption(req.petId, req.requestIndex);
              }}
              onReject={(idx) => {
                const req = pendingRequests[idx];
                onRejectAdoption(req.petId, req.requestIndex);
              }}
              loading={loadingTx}
            />
          </div>
        ) : (
          <p style={{ color: '#9ca3af', fontStyle: 'italic', padding: '1rem 0' }}>
            There are currently no pending adoption applications requiring shelter review.
          </p>
        )}
      </div>

      {/* Register Pet Form */}
      <PetForm onSubmitPet={onRegisterPet} loading={loadingTx} />

      {/* Overview Table of Registered Pets */}
      <div className="card">
        <h2 style={{ fontSize: '1.3rem', color: '#f3f4f6', marginBottom: '1rem' }}>
          All Registered Pets ({pets.length})
        </h2>

        {pets.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af' }}>
                  <th style={{ padding: '0.75rem' }}>ID</th>
                  <th style={{ padding: '0.75rem' }}>Name</th>
                  <th style={{ padding: '0.75rem' }}>Breed</th>
                  <th style={{ padding: '0.75rem' }}>Age</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                  <th style={{ padding: '0.75rem' }}>Owner</th>
                  <th style={{ padding: '0.75rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pets.map((pet) => (
                  <tr key={pet.petId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>#{Number(pet.petId)}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 600, color: '#f3f4f6' }}>{pet.name}</td>
                    <td style={{ padding: '0.75rem', color: '#9ca3af' }}>{pet.breed}</td>
                    <td style={{ padding: '0.75rem', color: '#9ca3af' }}>{Number(pet.age)} yrs</td>
                    <td style={{ padding: '0.75rem' }}>
                      {pet.isAdopted ? (
                        <span className="badge badge-adopted">Adopted</span>
                      ) : (
                        <span className="badge badge-available">Available</span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <code>{formatAddress(pet.owner)}</code>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <button 
                        onClick={() => onViewPetDetails(Number(pet.petId))}
                        className="btn btn-secondary btn-sm"
                      >
                        <Eye size={14} /> Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: '#9ca3af', fontStyle: 'italic', padding: '1rem 0' }}>
            No pets registered yet. Use the form above to add your first pet record.
          </p>
        )}
      </div>
    </div>
  );
}
