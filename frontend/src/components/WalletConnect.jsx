import React, { useState, useEffect } from 'react';
import { Wallet, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { connectWallet, switchToHardhatNetwork, formatAddress, HARDHAT_CHAIN_ID } from '../utils/blockchain';

export default function WalletConnect({ account, setAccount, chainId, setChainId, isAdmin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const { account: connectedAcc, chainId: connectedChain } = await connectWallet();
      setAccount(connectedAcc);
      setChainId(connectedChain);
      if (connectedChain !== HARDHAT_CHAIN_ID) {
        await switchToHardhatNetwork();
        const updatedChain = await window.ethereum.request({ method: 'eth_chainId' });
        setChainId(updatedChain);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
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

  const isWrongNetwork = account && chainId && chainId !== HARDHAT_CHAIN_ID;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      {isWrongNetwork && (
        <button 
          onClick={switchToHardhatNetwork}
          className="btn btn-danger btn-sm"
          title="Switch to Hardhat Localhost Network (31337)"
        >
          <ShieldAlert size={16} /> Switch to Hardhat Localhost
        </button>
      )}

      {!account ? (
        <button 
          onClick={handleConnect} 
          disabled={loading} 
          className="btn btn-primary"
        >
          <Wallet size={18} />
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.4rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <CheckCircle2 size={16} color="#10b981" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{formatAddress(account)}</span>
          {isAdmin && <span className="admin-badge">ADMIN</span>}
        </div>
      )}

      {error && (
        <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{error}</span>
      )}
    </div>
  );
}
