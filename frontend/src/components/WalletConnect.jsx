import React, { useState, useEffect } from 'react';
import { Wallet, ShieldAlert, CheckCircle2, ExternalLink, UserCheck, ChevronDown, RefreshCw, Shield, User } from 'lucide-react';
import { 
  connectWallet, 
  connectDemoWallet, 
  switchToHardhatNetwork, 
  formatAddress, 
  HARDHAT_CHAIN_ID,
  ADMIN_ADDRESS,
  ADOPTER_ADDRESS
} from '../utils/blockchain';

export default function WalletConnect({ account, setAccount, chainId, setChainId, isAdmin, setIsAdmin, onDemoReset }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const hasMetaMask = Boolean(typeof window !== 'undefined' && window.ethereum);

  const isDemoAdmin = account && account.toLowerCase() === ADMIN_ADDRESS.toLowerCase();
  const isDemoAdopter = account && account.toLowerCase() === ADOPTER_ADDRESS.toLowerCase();
  const isDemoMode = isDemoAdmin || isDemoAdopter;

  const handleConnectMetaMask = async () => {
    setLoading(true);
    setError(null);
    try {
      if (hasMetaMask) {
        const { account: connectedAcc, chainId: connectedChain } = await connectWallet();
        setAccount(connectedAcc);
        setChainId(connectedChain);
        // By default, let the user also have admin privileges or toggle them
        if (setIsAdmin) {
          setIsAdmin(false); // starts as adopter by default, can switch to admin
        }
      } else {
        setError('MetaMask is not installed in this browser.');
      }
    } catch (err) {
      console.error("MetaMask connection error:", err);
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
      if (setIsAdmin) {
        setIsAdmin(role === 'admin');
      }
      setError(null);
      setShowDemoMenu(false);
    } catch (err) {
      console.error(err);
      setError('Failed to connect demo wallet.');
    }
  };

  const handleToggleAdminRole = () => {
    if (isDemoMode) {
      handleSelectDemo(isAdmin ? 'adopter' : 'admin');
    } else {
      // For real MetaMask account, toggle admin role
      if (setIsAdmin) {
        setIsAdmin(!isAdmin);
      }
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      const handleAccounts = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      };

      const handleChain = (newChainId) => {
        setChainId(newChainId);
      };

      window.ethereum.on('accountsChanged', handleAccounts);
      window.ethereum.on('chainChanged', handleChain);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccounts);
          window.ethereum.removeListener('chainChanged', handleChain);
        }
      };
    }
  }, [setAccount, setChainId]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', position: 'relative' }}>
      {!account ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* MetaMask Connect Button */}
          {hasMetaMask ? (
            <button 
              onClick={handleConnectMetaMask} 
              disabled={loading} 
              className="btn btn-primary btn-sm"
              style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)' }}
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
              style={{ fontSize: '0.8rem', opacity: 0.9 }}
            >
              <ExternalLink size={12} /> Install MetaMask
            </a>
          )}

          {/* Quick Demo Mode Dropdown */}
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
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Role Switcher Button for currently connected wallet */}
          <button 
            onClick={handleToggleAdminRole}
            className="btn btn-secondary btn-sm"
            title={isAdmin ? "Switch to Adopter Mode to browse and request adoption" : "Switch to Admin Mode to review and approve adoption requests"}
            style={{
              fontSize: '0.8rem',
              padding: '0.3rem 0.7rem',
              borderColor: isAdmin ? 'rgba(245, 158, 11, 0.5)' : 'rgba(56, 189, 248, 0.5)',
              background: isAdmin ? 'rgba(245, 158, 11, 0.18)' : 'rgba(56, 189, 248, 0.18)',
              color: isAdmin ? '#fbbf24' : '#38bdf8',
              fontWeight: 600
            }}
          >
            {isAdmin ? '👑 Shelter Admin Mode (Switch to 🐶 Adopter)' : '🐶 Adopter Mode (Switch to 👑 Admin)'}
          </button>

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
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              {!isDemoMode ? `🦊 ${formatAddress(account)}` : formatAddress(account)}
            </span>
            {isAdmin && <span className="admin-badge">ADMIN</span>}
            
            <button 
              onClick={() => { setAccount(null); setError(null); }} 
              style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '0.9rem', marginLeft: '0.2rem', lineHeight: 1 }}
              title="Disconnect Wallet"
            >
              &times;
            </button>
          </div>

          {onDemoReset && (
            <button
              onClick={onDemoReset}
              className="btn btn-secondary btn-sm"
              title="Reset Demo Records back to initial seed data"
              style={{ padding: '0.3rem 0.55rem', fontSize: '0.75rem' }}
            >
              <RefreshCw size={12} /> Reset
            </button>
          )}
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
