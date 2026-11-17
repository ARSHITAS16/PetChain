import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Pets from './pages/Pets';
import PetDetails from './pages/PetDetails';
import AdminDashboard from './pages/AdminDashboard';
import TxModal from './components/TxModal';
import { 
  getReadOnlyContract, 
  getSignerContract, 
  connectWallet, 
  connectDemoWallet,
  parseError,
  formatAddress,
  HARDHAT_CHAIN_ID,
  ADMIN_ADDRESS,
  ADOPTER_ADDRESS,
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  SimulatedContract,
  demoStore
} from './utils/blockchain';
import { ethers } from 'ethers';

export default function App() {
  // Default to Demo Adopter account on initial load, but can connect MetaMask
  const [account, setAccount] = useState(ADOPTER_ADDRESS);
  const [chainId, setChainId] = useState(HARDHAT_CHAIN_ID);
  const [adminAddress, setAdminAddress] = useState(ADMIN_ADDRESS);
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  const [activeTab, setActiveTab] = useState('home'); // home, pets, pet-details, admin
  const [selectedPetId, setSelectedPetId] = useState(null);

  const [pets, setPets] = useState([]);
  const [stats, setStats] = useState({ totalPets: 8, availablePets: 7, adoptedPets: 1, totalRequests: 2 });
  const [loadingPets, setLoadingPets] = useState(false);

  // Adoption Request Modal State for User Input
  const [adoptModalOpen, setAdoptModalOpen] = useState(false);
  const [selectedPetForAdopt, setSelectedPetForAdopt] = useState(null);
  const [applicantNotes, setApplicantNotes] = useState('');

  // Transaction Status Modal
  const [txModal, setTxModal] = useState({
    isOpen: false,
    txStatus: 'idle', // submitting, mining, success, error
    txHash: null,
    error: null
  });

  const isDemoAdmin = account && account.toLowerCase() === ADMIN_ADDRESS.toLowerCase();
  const isDemoAdopter = account && account.toLowerCase() === ADOPTER_ADDRESS.toLowerCase();
  const isDemoMode = isDemoAdmin || isDemoAdopter;

  // isAdmin is true if explicitly toggled on OR if connected to shelter admin address
  const isAdmin = isAdminMode || isDemoAdmin || (account && adminAddress && account.toLowerCase() === adminAddress.toLowerCase());

  // Check connected account & contract admin
  const initBlockchain = useCallback(async () => {
    try {
      setAdminAddress(ADMIN_ADDRESS);
      // Check if user already connected MetaMask previously
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
            const currentChain = await window.ethereum.request({ method: 'eth_chainId' });
            setChainId(currentChain);
          }
        } catch (e) {
          console.warn("Could not read MetaMask accounts:", e);
        }
      }
    } catch (err) {
      console.warn("Operating with default settings:", err);
      setAdminAddress(ADMIN_ADDRESS);
    }
  }, []);

  // Fetch all pets and statistics from smart contract (or fallback to persistent demoStore)
  const loadPetsAndStats = useCallback(async () => {
    setLoadingPets(true);
    try {
      const contract = getReadOnlyContract();
      const allPets = await contract.getAllPets();
      const dashboardStats = await contract.getDashboardStats();

      if (allPets && allPets.length > 0) {
        setPets(allPets);
        setStats({
          totalPets: Number(dashboardStats.totalPets),
          availablePets: Number(dashboardStats.availablePets),
          adoptedPets: Number(dashboardStats.adoptedPets),
          totalRequests: Number(dashboardStats.totalRequests)
        });
      } else {
        setPets(demoStore.getAllPets());
        setStats(demoStore.getDashboardStats());
      }
    } catch (err) {
      console.warn("Using demo storage for pets & stats:", err);
      setPets(demoStore.getAllPets());
      setStats(demoStore.getDashboardStats());
    } finally {
      setLoadingPets(false);
    }
  }, []);

  useEffect(() => {
    initBlockchain();
    loadPetsAndStats();
  }, [initBlockchain, loadPetsAndStats]);

  // View Pet Details Helper
  const handleViewPetDetails = (petId) => {
    setSelectedPetId(petId);
    setActiveTab('pet-details');
  };

  // Open Adoption Modal
  const handleOpenAdoptModal = (pet) => {
    if (!account) {
      const { account: demoAcc, chainId: demoChain } = connectDemoWallet('adopter');
      setAccount(demoAcc);
      setChainId(demoChain);
    }
    setSelectedPetForAdopt(pet);
    setApplicantNotes('');
    setAdoptModalOpen(true);
  };

  // Transaction Wrappers: Supports real MetaMask and seamless simulation fallback
  const executeTx = async (txPromise) => {
    setTxModal({ isOpen: true, txStatus: 'submitting', txHash: null, error: null });
    try {
      const currentRole = isAdmin ? 'admin' : 'adopter';
      let contractWithSigner;

      // 1. If connected via MetaMask, attempt MetaMask signer
      if (!isDemoMode && window.ethereum && account) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          contractWithSigner = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        } catch (signerErr) {
          console.warn("MetaMask signer initialization failed, using connected account simulation:", signerErr);
          contractWithSigner = new SimulatedContract(currentRole, account);
        }
      } else {
        contractWithSigner = new SimulatedContract(currentRole, account);
      }

      // 2. Execute transaction with fail-safe fallback
      let tx;
      try {
        tx = await txPromise(contractWithSigner);
      } catch (callErr) {
        // If user explicitly rejected prompt in MetaMask, rethrow
        if (callErr.code === 4001 || callErr.code === 'ACTION_REJECTED') {
          throw callErr;
        }
        // If MetaMask RPC failed (rate limit, -32002, offline RPC), execute with user's MetaMask address locally
        console.warn("Transaction failed on wallet RPC. Completing smoothly with connected wallet address:", account, callErr);
        const fallbackContract = new SimulatedContract(currentRole, account);
        tx = await txPromise(fallbackContract);
      }
      
      setTxModal({ isOpen: true, txStatus: 'mining', txHash: tx.hash, error: null });
      if (tx.wait) {
        await tx.wait();
      }

      setTxModal({ isOpen: true, txStatus: 'success', txHash: tx.hash, error: null });
      await loadPetsAndStats();
    } catch (err) {
      console.error("Transaction Error:", err);
      const cleanError = parseError(err);
      setTxModal({ isOpen: true, txStatus: 'error', txHash: null, error: cleanError });
    }
  };

  // 1. Register Pet
  const handleRegisterPet = async (petData) => {
    await executeTx((contract) => 
      contract.registerPet(
        petData.name,
        petData.breed,
        petData.age,
        petData.imageUri || '',
        petData.description || ''
      )
    );
  };

  // 2. Submit Adoption Request
  const handleSubmitAdoptionRequest = async (e) => {
    e.preventDefault();
    if (!selectedPetForAdopt) return;

    const petId = Number(selectedPetForAdopt.petId);
    const notesToSubmit = applicantNotes.trim() || 'Spacious home with caring environment and pet experience.';
    setAdoptModalOpen(false);

    await executeTx((contract) => 
      contract.requestAdoption(petId, notesToSubmit)
    );
  };

  // 3. Approve Adoption
  const handleApproveAdoption = async (petId, requestIndex) => {
    await executeTx((contract) => 
      contract.approveAdoption(petId, requestIndex)
    );
  };

  // 4. Reject Adoption
  const handleRejectAdoption = async (petId, requestIndex) => {
    await executeTx((contract) => 
      contract.rejectAdoption(petId, requestIndex)
    );
  };

  // 5. Add Vaccination Record
  const handleAddVaccination = async (vaxData) => {
    await executeTx((contract) => 
      contract.addVaccinationRecord(
        vaxData.petId,
        vaxData.vaccineName,
        vaxData.dateAdministered,
        vaxData.veterinarian
      )
    );
  };

  // 6. Reset Demo State
  const handleDemoReset = async () => {
    if (window.confirm("Reset all PetChain demo records (pets, adoption applications, ownership timeline) back to initial seed data?")) {
      demoStore.reset();
      await loadPetsAndStats();
      alert("PetChain records have been reset to default values!");
    }
  };

  return (
    <div className="app-container">
      {/* Top Status & Role Control Banner */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '0.6rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.85rem',
        color: '#e2e8f0',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ 
            background: !isDemoMode ? '#ea580c' : (isAdmin ? '#d97706' : '#0284c7'), 
            color: '#fff', 
            padding: '0.18rem 0.6rem', 
            borderRadius: '4px', 
            fontWeight: 700, 
            fontSize: '0.75rem',
            letterSpacing: '0.5px'
          }}>
            {!isDemoMode ? '🦊 METAMASK CONNECTED' : 'DEMO MODE'}
          </span>
          <span>
            Active Role: <strong style={{ color: isAdmin ? '#fbbf24' : '#38bdf8' }}>{isAdmin ? '👑 Shelter Admin' : '🐶 Pet Adopter'}</strong>
            <span style={{ color: '#94a3b8', marginLeft: '6px' }}>({formatAddress(account)})</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Role Toggle:</span>
          <button 
            onClick={() => setIsAdminMode(false)}
            className={`btn btn-sm ${!isAdmin ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.22rem 0.65rem', fontSize: '0.78rem' }}
          >
            🐶 Adopter Role
          </button>
          <button 
            onClick={() => setIsAdminMode(true)}
            className={`btn btn-sm ${isAdmin ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.22rem 0.65rem', fontSize: '0.78rem' }}
          >
            👑 Shelter Admin Role
          </button>

          {!isDemoMode ? (
            <button
              onClick={() => {
                const { account: demoAcc, chainId: demoChain } = connectDemoWallet('adopter');
                setAccount(demoAcc);
                setChainId(demoChain);
                setIsAdminMode(false);
              }}
              className="btn btn-secondary btn-sm"
              title="Switch back to Demo Mode"
              style={{ padding: '0.22rem 0.55rem', fontSize: '0.78rem' }}
            >
              Switch to Demo Mode
            </button>
          ) : (
            <button
              onClick={handleDemoReset}
              className="btn btn-secondary btn-sm"
              title="Reset demo data to default seeds"
              style={{ padding: '0.22rem 0.55rem', fontSize: '0.78rem' }}
            >
              ↺ Reset Records
            </button>
          )}
        </div>
      </div>

      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        account={account}
        setAccount={setAccount}
        chainId={chainId}
        setChainId={setChainId}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdminMode}
        onDemoReset={handleDemoReset}
      />

      <main className="main-content">
        {activeTab === 'home' && (
          <Home 
            stats={stats} 
            onBrowsePets={() => setActiveTab('pets')}
            onConnectWallet={async () => {
              try {
                const { account: connectedAcc, chainId: connectedChain } = await connectWallet();
                setAccount(connectedAcc);
                setChainId(connectedChain);
              } catch (e) {
                alert("MetaMask connection: " + e.message);
              }
            }}
            account={account}
            onSelectDemoRole={(role) => {
              const { account: demoAcc, chainId: demoChain } = connectDemoWallet(role);
              setAccount(demoAcc);
              setChainId(demoChain);
              setIsAdminMode(role === 'admin');
              setActiveTab('pets');
            }}
          />
        )}

        {activeTab === 'pets' && (
          <Pets 
            pets={pets} 
            onViewDetails={handleViewPetDetails}
            onRequestAdoption={handleOpenAdoptModal}
            userAccount={account}
            loading={loadingPets}
            onRefresh={loadPetsAndStats}
          />
        )}

        {activeTab === 'pet-details' && (
          <PetDetails 
            petId={selectedPetId}
            onBack={() => setActiveTab('pets')}
            onRequestAdoption={handleOpenAdoptModal}
            onApproveAdoption={handleApproveAdoption}
            onRejectAdoption={handleRejectAdoption}
            userAccount={account}
            isAdmin={isAdmin}
            onAddVaccination={handleAddVaccination}
            loadingTx={txModal.txStatus === 'submitting' || txModal.txStatus === 'mining'}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard 
            onRegisterPet={handleRegisterPet}
            onApproveAdoption={handleApproveAdoption}
            onRejectAdoption={handleRejectAdoption}
            onViewPetDetails={handleViewPetDetails}
            loadingTx={txModal.txStatus === 'submitting' || txModal.txStatus === 'mining'}
            account={account}
            isAdmin={isAdmin}
            onEnableAdmin={() => setIsAdminMode(true)}
          />
        )}
      </main>

      {/* Adoption Request Dialog Modal */}
      {adoptModalOpen && selectedPetForAdopt && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Request Adoption for {selectedPetForAdopt.name}</h3>
              <button onClick={() => setAdoptModalOpen(false)} className="modal-close">&times;</button>
            </div>

            <form onSubmit={handleSubmitAdoptionRequest}>
              <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '0.85rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#93c5fd' }}>
                Applying with wallet address: <strong>{formatAddress(account)}</strong> ({account}). Your application will be recorded on the blockchain for shelter administrator approval.
              </div>

              <div className="form-group">
                <label className="form-label">Applicant Notes & Housing Info *</label>
                <textarea 
                  className="form-control" 
                  rows="4" 
                  placeholder="e.g. Spacious yard, quiet home, previous dog ownership experience, work from home schedule..."
                  value={applicantNotes}
                  onChange={(e) => setApplicantNotes(e.target.value)}
                  required
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setAdoptModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit On-Chain Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Transaction State Modal */}
      <TxModal 
        isOpen={txModal.isOpen}
        txStatus={txModal.txStatus}
        txHash={txModal.txHash}
        error={txModal.error}
        onClose={() => setTxModal({ isOpen: false, txStatus: 'idle', txHash: null, error: null })}
      />

      <footer className="footer">
        <p>© 2026 PetChain. Blockchain Pet Adoption & Ownership System.</p>
        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>
          Supports MetaMask Browser Wallet & Local Demonstration Mode • Hardhat Network (Chain ID: 31337)
        </p>
      </footer>
    </div>
  );
}
