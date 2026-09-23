import React from 'react';
import { History, ArrowRight, ShieldCheck, Calendar } from 'lucide-react';
import { formatAddress, formatTimestamp } from '../utils/blockchain';

export default function OwnershipHistory({ history }) {
  if (!history || history.length === 0) {
    return (
      <div style={{ color: '#9ca3af', fontStyle: 'italic', padding: '1rem 0' }}>
        No ownership history recorded.
      </div>
    );
  }

  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <History size={18} color="#818cf8" />
        <h3 style={{ fontSize: '1.1rem', color: '#f3f4f6' }}>Immutable On-Chain Ownership Timeline</h3>
      </div>

      <div className="timeline">
        {history.map((record, index) => (
          <div className="timeline-item" key={index}>
            <div className="timeline-dot" />
            <div className="timeline-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.9rem' }}>
                  {record.reason || 'Ownership Record'}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={12} /> {formatTimestamp(record.timestamp)}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#e5e7eb', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block' }}>Previous Owner</span>
                  <code>{formatAddress(record.previousOwner)}</code>
                </div>

                <ArrowRight size={16} color="#818cf8" />

                <div>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block' }}>New Owner</span>
                  <code style={{ color: '#34d399' }}>{formatAddress(record.newOwner)}</code>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={12} color="#10b981" /> Verified Hardhat Blockchain Record
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
