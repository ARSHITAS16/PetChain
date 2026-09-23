import React from 'react';
import { Check, X, Clock, User, FileText } from 'lucide-react';
import { formatAddress, formatTimestamp } from '../utils/blockchain';

export default function AdoptionRequestList({ requests, onApprove, onReject, loading }) {
  if (!requests || requests.length === 0) {
    return (
      <div style={{ textTransform: 'none', color: '#9ca3af', fontStyle: 'italic', padding: '1rem 0' }}>
        No adoption requests submitted yet for this pet.
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={16} color="#38bdf8" />
                <span style={{ fontWeight: 600, color: '#f3f4f6' }}>{formatAddress(req.applicant)}</span>
                <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  ({req.applicant})
                </span>
              </div>

              <div>
                {isPending && <span className="badge badge-pending"><Clock size={12} /> Pending Review</span>}
                {isApproved && <span className="badge badge-approved"><Check size={12} /> Approved</span>}
                {isRejected && <span className="badge badge-rejected"><X size={12} /> Rejected</span>}
              </div>
            </div>

            {req.applicantNotes && (
              <div style={{ fontSize: '0.9rem', color: '#d1d5db', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '6px' }}>
                <FileText size={14} style={{ display: 'inline', marginRight: '6px', color: '#9ca3af' }} />
                "{req.applicantNotes}"
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#9ca3af', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
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
