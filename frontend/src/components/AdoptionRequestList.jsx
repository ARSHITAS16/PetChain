import React from 'react';
import { Check, X, Clock, User, FileText, PawPrint } from 'lucide-react';
import { formatAddress, formatTimestamp } from '../utils/blockchain';

export default function AdoptionRequestList({ requests, onApprove, onReject, loading }) {
  if (!requests || requests.length === 0) {
    return (
      <div style={{ textTransform: 'none', color: '#9ca3af', fontStyle: 'italic', padding: '1rem 0' }}>
        No adoption requests submitted yet.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
      {requests.map((req, idx) => {
        const statusNum = Number(req.status);
        const isPending = statusNum === 0;
        const isApproved = statusNum === 1;
        const isRejected = statusNum === 2;

        return (
          <div 
            key={idx} 
            style={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid rgba(255, 255, 255, 0.08)', 
              borderRadius: '10px', 
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                {req.petName && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '0.2rem 0.65rem', borderRadius: '6px', fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600 }}>
                    <PawPrint size={14} />
                    <span>{req.petName} (Pet #{req.petId})</span>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={15} color="#94a3b8" />
                  <span style={{ fontWeight: 600, color: '#f3f4f6', fontSize: '0.9rem' }}>{formatAddress(req.applicant)}</span>
                </div>
              </div>

              <div>
                {isPending && <span className="badge badge-pending"><Clock size={12} /> Pending Review</span>}
                {isApproved && <span className="badge badge-approved"><Check size={12} /> Approved</span>}
                {isRejected && <span className="badge badge-rejected"><X size={12} /> Rejected</span>}
              </div>
            </div>

            {req.applicantNotes && (
              <div style={{ fontSize: '0.9rem', color: '#d1d5db', background: 'rgba(0,0,0,0.25)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FileText size={12} /> Applicant Notes & Housing Details
                </div>
                <div style={{ fontStyle: 'italic', color: '#e2e8f0' }}>
                  "{req.applicantNotes}"
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#9ca3af', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span>Submitted: {formatTimestamp(req.timestamp)}</span>

              {isPending && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => onApprove(idx)} 
                    disabled={loading}
                    className="btn btn-success btn-sm"
                  >
                    <Check size={14} /> Approve Adoption
                  </button>
                  <button 
                    onClick={() => onReject(idx)} 
                    disabled={loading}
                    className="btn btn-danger btn-sm"
                  >
                    <X size={14} /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
