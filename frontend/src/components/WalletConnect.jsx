import React, { useState, useEffect } from 'react';
import { Wallet, ShieldAlert, CheckCircle2, ExternalLink, UserCheck, ChevronDown, RefreshCw } from 'lucide-react';
import { 
  connectWallet, 
  connectDemoWallet, 
  switchToHardhatNetwork, 
  formatAddress, 
  HARDHAT_CHAIN_ID,
  ADMIN_ADDRESS,
  ADOPTER_ADDRESS,
  demoStore
} from '../utils/blockchain';

export default function WalletConnect({ account, setAccount, chainId, setChainId, isAdmin, onDemoReset }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const hasMetaMask = Boolean(typeof window !== 'undefined' && window.ethereum);

  const isDemoAdmin = account && account.toLowerCase() === ADMIN_ADDRESS.toLowerCase();
  const isDemoAdopter = account && account.toLowerCase() === ADOPTER_ADDRESS.toLowerCase();
  const isDemoMode = isDemoAdmin || isDemoAdopter;

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      if (hasMetaMask) {
        const { account: connectedAcc, chainId: connectedChain } = await connectWallet();
        setAccount(connectedAcc);
        setChainId(connectedChain);
        if (connectedChain !== HARDHAT_CHAIN_ID) {
          try {
            await switchToHardhatNetwork();
            const updatedChain = await window.ethereum.request({ method: 'eth_chainId' });
            setChainId(updatedChain);
          } catch (netErr) {
            console.warn("Could not switch to Hardhat network:", netErr);
          }
        }
      } else {
        // Fallback to demo mode if no MetaMask
        handleSelectDemo('adopter');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to connect MetaMask');
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

  const handleSwitchDemoRole = () => {
    if (isDemoAdmin) {
      handleSelectDemo('adopter');
    } else {
      handleSelectDemo('admin');
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

  const isWrongNetwork = account && hasMetaMask && !isDemoMode && chainId && chainId !== HARDHAT_CHAIN_ID;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', position: 'relative' }}>
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
          {/* Quick Demo Mode Buttons */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowDemoMenu(!showDemoMenu)} 
              className="btn btn-secondary btn-sm"
              style={{ borderColor: 'rgba(56, 189, 248, 0.4)', background: 'rgba(56, 189, 248, 0.1)' }}
            >
              <UserCheck size={14} color="#38bdf8" /> 
              <span>Demo Mode</span> 
              <ChevronDown size={14} />
            </button>

            {showDemoMenu && (
              <div style={{
                position: 'absolute',
                top: '115%',
                right: 0,
                background: '#131b2e',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '10px',
                padding: '0.5rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                zIndex: 200,
                minWidth: '220px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem'
              }}>
                <button 
                  onClick={() => handleSelectDemo('adopter')} 
                  className="btn btn-secondary btn-sm" 
                  style={{ justifyContent: 'flex-start', fontSize: '0.85rem' }}
                >
                  🐶 Demo Adopter Wallet
                </button>
                <button 
                  onClick={() => handleSelectDemo('admin')} 
                  className="btn btn-secondary btn-sm" 
                  style={{ justifyContent: 'flex-start', fontSize: '0.85rem' }}
                >
                  👑 Demo Shelter Admin Wallet
                </button>
              </div>
            )}
          </div>

          {/* MetaMask Connect */}
          {hasMetaMask ? (
            <button 
              onClick={handleConnect} 
              disabled={loading} 
              className="btn btn-primary btn-sm"
            >
              <Wallet size={16} />
              {loading ? 'Connecting...' : 'Connect MetaMask'}
            </button>
          ) : (
            <a 
              href="https://metamask.io/download/" 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.8rem', opacity: 0.8 }}
            >
              <ExternalLink size={12} /> Install MetaMask
            </a>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Active Demo Role pill with 1-click Switch */}
          {isDemoMode && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button 
                onClick={handleSwitchDemoRole}
                className="btn btn-secondary btn-sm"
                title={isDemoAdmin ? "Switch to Demo Adopter" : "Switch to Demo Admin"}
                style={{
                  fontSize: '0.8rem',
                  padding: '0.3rem 0.65rem',
                  borderColor: isDemoAdmin ? 'rgba(245, 158, 11, 0.4)' : 'rgba(56, 189, 248, 0.4)',
                  background: isDemoAdmin ? 'rgba(245, 158, 11, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                  color: isDemoAdmin ? '#fbbf24' : '#38bdf8'
                }}
              >
                {isDemoAdmin ? '👑 Admin (Switch to 🐶 Adopter)' : '🐶 Adopter (Switch to 👑 Admin)'}
              </button>

              {onDemoReset && (
                <button
                  onClick={onDemoReset}
                  className="btn btn-secondary btn-sm"
                  title="Reset Demo Data to Initial Seeds"
                  style={{ padding: '0.3rem 0.55rem', fontSize: '0.75rem' }}
                >
                  <RefreshCw size={12} /> Reset
                </button>
              )}
            </div>
          )}

          {/* Connected Address Indicator */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.4rem', 
            background: 'rgba(255, 255, 255, 0.05)', 
            padding: '0.35rem 0.75rem', 
            borderRadius: '8px', 
            border: '1px solid rgba(255,255,255,0.1)' 
          }}>
            <CheckCircle2 size={14} color="#10b981" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{formatAddress(account)}</span>
            {isAdmin && <span className="admin-badge">ADMIN</span>}
            
            <button 
              onClick={() => { setAccount(null); setError(null); }} 
              style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '0.9rem', marginLeft: '0.2rem', lineHeight: 1 }}
              title="Disconnect Wallet"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {error && !account && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#ef4444', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </span>
          <button 
            onClick={() => handleSelectDemo('adopter')}
            className="btn btn-primary btn-sm"
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}
          >
            Use Demo Mode
          </button>
        </div>
      )}
    </div>
  );
}
