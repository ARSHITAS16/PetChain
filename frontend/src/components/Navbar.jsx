import React from 'react';
import { PawPrint, Home, Grid, ShieldCheck } from 'lucide-react';
import WalletConnect from './WalletConnect';

export default function Navbar({ activeTab, setActiveTab, account, setAccount, chainId, setChainId, isAdmin }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <a href="#home" onClick={() => setActiveTab('home')} className="nav-brand">
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
              className={`nav-link ${activeTab === 'pets' ? 'active' : ''}`}
              onClick={() => setActiveTab('pets')}
            >
              <Grid size={16} style={{ display: 'inline', marginRight: '4px' }} />
              Browse Pets
            </a>
          </li>
          {isAdmin && (
            <li>
              <a 
                className={`nav-link ${activeTab === 'admin' ? 'active' : ''}`}
                onClick={() => setActiveTab('admin')}
              >
                <ShieldCheck size={16} style={{ display: 'inline', marginRight: '4px' }} />
                Admin Dashboard
              </a>
            </li>
          )}
        </ul>

        <WalletConnect 
          account={account} 
          setAccount={setAccount} 
          chainId={chainId} 
          setChainId={setChainId} 
          isAdmin={isAdmin}
        />
      </div>
    </nav>
  );
}
