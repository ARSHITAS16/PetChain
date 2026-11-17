import React from 'react';
import { PawPrint, Home, Grid, ShieldCheck } from 'lucide-react';
import WalletConnect from './WalletConnect';

export default function Navbar({ activeTab, setActiveTab, account, setAccount, chainId, setChainId, isAdmin, setIsAdmin, onDemoReset }) {
  const handleNavAdmin = () => {
    if (setIsAdmin) {
      setIsAdmin(true); // Ensure admin mode is active when opening Admin Dashboard
    }
    setActiveTab('admin');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a href="#home" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }} className="nav-brand">
          <div className="brand-icon">
            <PawPrint size={22} color="#ffffff" />
          </div>
          <span>Pet<span className="gradient-text">Chain</span></span>
        </a>

        <ul className="nav-links">
          <li>
            <a 
              className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              <Home size={16} style={{ display: 'inline', marginRight: '4px' }} />
              Home
            </a>
          </li>
          <li>
            <a 
              className={`nav-link ${activeTab === 'pets' || activeTab === 'pet-details' ? 'active' : ''}`}
              onClick={() => setActiveTab('pets')}
            >
              <Grid size={16} style={{ display: 'inline', marginRight: '4px' }} />
              Browse Pets
            </a>
          </li>
          <li>
            <a 
              className={`nav-link ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={handleNavAdmin}
              title="Shelter Administrator Control Dashboard"
              style={{
                color: isAdmin ? '#fbbf24' : undefined,
                fontWeight: isAdmin ? 700 : undefined
              }}
            >
              <ShieldCheck size={16} style={{ display: 'inline', marginRight: '4px' }} />
              Admin Dashboard
              {isAdmin && <span className="admin-badge" style={{ marginLeft: '6px' }}>ACTIVE</span>}
            </a>
          </li>
        </ul>

        <WalletConnect 
          account={account} 
          setAccount={setAccount} 
          chainId={chainId} 
          setChainId={setChainId} 
          isAdmin={isAdmin}
          setIsAdmin={setIsAdmin}
          onDemoReset={onDemoReset}
        />
      </div>
    </nav>
  );
}
