import React from 'react';
import { Shield, Sparkles, Heart, RefreshCw, Lock, Award, ArrowRight } from 'lucide-react';

export default function Home({ stats, onBrowsePets, onConnectWallet, account }) {
  return (
    <div className="home-page">
      {/* Hero Header */}
      <section className="hero">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '0.4rem 1rem', borderRadius: '30px', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
          <Sparkles size={14} /> Ethereum Smart Contract Powered Pet Management
        </div>

        <h1 className="hero-title">
          Transparent. Traceable. Trusted.<br />
          <span className="gradient-text">Pet Adoption on Blockchain</span>
        </h1>

        <p className="hero-subtitle">
          PetChain revolutionizes animal welfare by storing pet registries, adoption lifecycles, vaccination logs, and ownership transfers immutably on a decentralized Ethereum ledger.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onBrowsePets} className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
            Browse Available Pets <ArrowRight size={18} />
          </button>

          {!account && (
            <button onClick={onConnectWallet} className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
              Connect MetaMask Wallet
            </button>
          )}
        </div>

        {/* Live On-Chain Statistics calculated from blockchain contract */}
        <div className="hero-stats">
          <div className="stat-card">
            <div className="stat-val">{stats.totalPets}</div>
            <div className="stat-lbl">Total Registered Pets</div>
          </div>
          <div className="stat-card">
            <div className="stat-val" style={{ color: '#34d399' }}>{stats.availablePets}</div>
            <div className="stat-lbl">Available for Adoption</div>
          </div>
          <div className="stat-card">
            <div className="stat-val" style={{ color: '#818cf8' }}>{stats.adoptedPets}</div>
            <div className="stat-lbl">Successfully Adopted</div>
          </div>
          <div className="stat-card">
            <div className="stat-val" style={{ color: '#fbbf24' }}>{stats.totalRequests}</div>
            <div className="stat-lbl">Adoption Requests Submitted</div>
          </div>
        </div>
      </section>

      {/* Core Features Breakdown */}
      <section style={{ margin: '4rem 0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', color: '#f3f4f6', marginBottom: '0.5rem' }}>Why Blockchain for Pet Adoption?</h2>
          <p style={{ color: '#9ca3af', maxWidth: '600px', margin: '0 auto' }}>
            Eliminating fake adoption claims, unverified health records, and lost ownership histories.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
          <div className="card">
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Lock size={24} color="#38bdf8" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#f3f4f6' }}>Immutable Ownership History</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
              Every transfer of pet ownership is timestamped and recorded irreversibly on Ethereum smart contract storage.
            </p>
          </div>

          <div className="card">
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Award size={24} color="#10b981" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#f3f4f6' }}>Verified Medical & Vaccination Logs</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
              Licensed shelter administrators log vaccination dates and clinic details, giving adopters 100% confidence.
            </p>
          </div>

          <div className="card">
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(129, 140, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <RefreshCw size={24} color="#818cf8" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#f3f4f6' }}>Decentralized Lifecycle Workflow</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
              Adoption applications, shelter approvals, and automatic request rejections execute automatically on-chain via smart contracts.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
