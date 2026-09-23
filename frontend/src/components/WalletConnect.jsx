import React, { useState, useEffect } from 'react';
import { Wallet, ShieldAlert, CheckCircle2, ExternalLink, UserCheck, ChevronDown } from 'lucide-react';
import { 
  connectWallet, 
  connectDemoWallet, 
  switchToHardhatNetwork, 
  formatAddress, 
  HARDHAT_CHAIN_ID 
} from '../utils/blockchain';

export default function WalletConnect({ account, setAccount, chainId, setChainId, isAdmin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const hasMetaMask = Boolean(typeof window !== 'undefined' && window.ethereum);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      if (hasMetaMask) {
        const { account: connectedAcc, chainId: connectedChain } = await connectWallet();
        setAccount(connectedAcc);
        setChainId(connectedChain);
        if (connectedChain !== HARDHAT_CHAIN_ID) {
          await switchToHardhatNetwork();
          const updatedChain = await window.ethereum.request({ method: 'eth_chainId' });
          setChainId(updatedChain);
        }
      } else {
        // Fallback if no MetaMask extension
        setError('MetaMask is not installed in your browser.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemo = (role) => {
    try {
      const { account: demoAcc, chainId: demoChain } = connectDemoWallet(role);
      setAccount(demoAcc);
      setChainId(demoChain);
      setError(null);
      setShowDemoMenu(false);
    } catch (err) {
      console.error(err);
      setError('Failed to connect demo wallet.');
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });

      window.ethereum.on('chainChanged', (newChainId) => {
        setChainId(newChainId);
      });
    }
  }, [setAccount, setChainId]);

  const isWrongNetwork = account && hasMetaMask && chainId && chainId !== HARDHAT_CHAIN_ID;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
      {isWrongNetwork && (
        <button 
          onClick={switchToHardhatNetwork}
          className="btn btn-danger btn-sm"
          title="Switch to Hardhat Localhost Network (31337)"
        >
          <ShieldAlert size={16} /> Switch to Hardhat Network
        </button>
      )}

      {!account ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {hasMetaMask ? (
            <button 
              onClick={handleConnect} 
              disabled={loading} 
              className="btn btn-primary"
            >
              <Wallet size={18} />
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <a 
                href="https://metamask.io/download/" 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-primary btn-sm"
              >
                <ExternalLink size={14} /> Install MetaMask
              </a>

              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setShowDemoMenu(!showDemoMenu)} 
                  className="btn btn-secondary btn-sm"
                >
                  <UserCheck size={14} /> Demo Mode <ChevronDown size={14} />
                </button>

                {showDemoMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    background: '#131b2e',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    padding: '0.5rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    zIndex: 200,
                    minWidth: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem'
                  }}>
                    <button 
                      onClick={() => handleSelectDemo('admin')} 
                      className="btn btn-secondary btn-sm" 
                      style={{ justifyContent: 'flex-start', fontSize: '0.82rem' }}
                    >
                      👑 Demo Admin Wallet
                    </button>
                    <button 
                      onClick={() => handleSelectDemo('adopter')} 
                      className="btn btn-secondary btn-sm" 
                      style={{ justifyContent: 'flex-start', fontSize: '0.82rem' }}
                    >
                      🐶 Demo Adopter Wallet
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.4rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <CheckCircle2 size={16} color="#10b981" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{formatAddress(account)}</span>
          {isAdmin && <span className="admin-badge">ADMIN</span>}
          <button 
            onClick={() => { setAccount(null); setError(null); }} 
            style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '0.8rem', marginLeft: '0.25rem' }}
            title="Disconnect Wallet"
          >
            &times;
          </button>
        </div>
      )}

      {error && !account && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#ef4444', fontSize: '0.82rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </span>
          {!hasMetaMask && (
            <button 
              onClick={() => handleSelectDemo('admin')}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}
            >
              Use Demo Wallet
            </button>
          )}
        </div>
      )}
    </div>
  );
}
