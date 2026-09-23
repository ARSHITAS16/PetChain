import React from 'react';
import { Loader2, CheckCircle2, XCircle, ExternalLink, Hash } from 'lucide-react';

export default function TxModal({ isOpen, txStatus, txHash, error, onClose }) {
  if (!isOpen) return null;

  const isPending = txStatus === 'submitting' || txStatus === 'mining';
  const isSuccess = txStatus === 'success';
  const isFailed = txStatus === 'error';

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Blockchain Transaction Status</h3>
          {!isPending && (
            <button onClick={onClose} className="modal-close">&times;</button>
          )}
        </div>

        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
          {isPending && (
            <div>
              <Loader2 size={48} color="#38bdf8" style={{ animation: 'spin 1.5s linear infinite', marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1.2rem', color: '#f3f4f6', marginBottom: '0.5rem' }}>
                {txStatus === 'submitting' ? 'Awaiting MetaMask Authorization...' : 'Mining Block on Hardhat Node...'}
              </h4>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                Please confirm the transaction prompt in your MetaMask wallet extension.
              </p>
            </div>
          )}

          {isSuccess && (
            <div>
              <CheckCircle2 size={52} color="#10b981" style={{ marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1.3rem', color: '#34d399', marginBottom: '0.5rem' }}>
                Transaction Confirmed On-Chain!
              </h4>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                Smart contract state successfully updated on local Ethereum node.
              </p>

              {txHash && (
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.85rem', textAlign: 'left', marginBottom: '1.5rem' }}>
                  <div style={{ color: '#9ca3af', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.25rem' }}>
                    <Hash size={12} /> Real Transaction Hash:
                  </div>
                  <code style={{ wordBreak: 'break-all', color: '#38bdf8' }}>{txHash}</code>
                </div>
              )}

              <button onClick={onClose} className="btn btn-primary" style={{ minWidth: '140px' }}>
                Continue
              </button>
            </div>
          )}

          {isFailed && (
            <div>
              <XCircle size={52} color="#ef4444" style={{ marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1.3rem', color: '#f87171', marginBottom: '0.5rem' }}>
                Transaction Failed
              </h4>
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '0.85rem', borderRadius: '8px', color: '#fca5a5', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                {error || 'The smart contract transaction reverted or was cancelled by user.'}
              </div>

              <button onClick={onClose} className="btn btn-secondary">
                Close & Retry
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
