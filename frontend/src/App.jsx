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
  parseError,
  HARDHAT_CHAIN_ID 
} from './utils/blockchain';

export default function App() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [adminAddress, setAdminAddress] = useState(null);
  
  const [activeTab, setActiveTab] = useState('home'); // home, pets, pet-details, admin
  const [selectedPetId, setSelectedPetId] = useState(null);

  const [pets, setPets] = useState([]);
  const [stats, setStats] = useState({ totalPets: 0, availablePets: 0, adoptedPets: 0, totalRequests: 0 });
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

  // Check connected account & contract admin
  const initBlockchain = useCallback(async () => {
    try {
      const contract = getReadOnlyContract();
      const adminAcc = await contract.admin();
      setAdminAddress(adminAcc);

      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
        const currentChain = await window.ethereum.request({ method: 'eth_chainId' });
        setChainId(currentChain);
      }
    } catch (err) {
      console.warn("Failed to read contract admin or initial wallet state:", err);
    }
  }, []);

  // Fetch all pets and statistics from smart contract
  const loadPetsAndStats = useCallback(async () => {
    setLoadingPets(true);
    try {
      const contract = getReadOnlyContract();
      const allPets = await contract.getAllPets();
      const dashboardStats = await contract.getDashboardStats();

      setPets(allPets);
      setStats({
        totalPets: Number(dashboardStats.totalPets),
        availablePets: Number(dashboardStats.availablePets),
        adoptedPets: Number(dashboardStats.adoptedPets),
        totalRequests: Number(dashboardStats.totalRequests)
      });
    } catch (err) {
      console.error("Error loading pets from smart contract:", err);
    } finally {
      setLoadingPets(false);
    }
  }, []);

  useEffect(() => {
    initBlockchain();
    loadPetsAndStats();
  }, [initBlockchain, loadPetsAndStats]);

  const isAdmin = Boolean(account && adminAddress && account.toLowerCase() === adminAddress.toLowerCase());

  // View Pet Details Helper
  const handleViewPetDetails = (petId) => {
    setSelectedPetId(petId);
    setActiveTab('pet-details');
  };

  // Open Adoption Modal
  const handleOpenAdoptModal = (pet) => {
    if (!account) {
      alert("Please connect your MetaMask wallet first to submit an adoption application.");
      return;
    }
    setSelectedPetForAdopt(pet);
    setApplicantNotes('');
    setAdoptModalOpen(true);
  };

  // Transaction Wrappers
  const executeTx = async (txPromise) => {
    setTxModal({ isOpen: true, txStatus: 'submitting', txHash: null, error: null });
    try {
      const contractWithSigner = await getSignerContract();
      const tx = await txPromise(contractWithSigner);
      
      setTxModal({ isOpen: true, txStatus: 'mining', txHash: tx.hash, error: null });
      await tx.wait();

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

    setAdoptModalOpen(false);
    const petId = Number(selectedPetForAdopt.petId);

    await executeTx((contract) => 
      contract.requestAdoption(petId, applicantNotes)
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

  return (
    <div className="app-container">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        account={account}
        setAccount={setAccount}
        chainId={chainId}
        setChainId={setChainId}
        isAdmin={isAdmin}
      />

      <main className="main-content">
        {activeTab === 'home' && (
          <Home 
            stats={stats} 
            onBrowsePets={() => setActiveTab('pets')}
            onConnectWallet={connectWallet}
            account={account}
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
            userAccount={account}
            isAdmin={isAdmin}
            onAddVaccination={handleAddVaccination}
            loadingTx={txModal.txStatus === 'submitting' || txModal.txStatus === 'mining'}
          />
        )}

        {activeTab === 'admin' && isAdmin && (
          <AdminDashboard 
            onRegisterPet={handleRegisterPet}
            onApproveAdoption={handleApproveAdoption}
            onRejectAdoption={handleRejectAdoption}
            onViewPetDetails={handleViewPetDetails}
            loadingTx={txModal.txStatus === 'submitting' || txModal.txStatus === 'mining'}
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
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                Your adoption request will be logged on-chain for shelter review. Please provide relevant details about your living space or pet experience.
              </p>

              <div className="form-group">
                <label className="form-label">Applicant Notes & Housing Info *</label>
                <textarea 
                  className="form-control" 
                  rows="4" 
                  placeholder="e.g. Spacious yard, quiet home, previous dog ownership experience..."
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
        <p>© 2026 PetChain. Academic B.Tech CSE Mini Project | Presidency University.</p>
        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>
          Powered by Ethereum Smart Contracts • Hardhat Local Network (Chain ID: 31337)
        </p>
      </footer>
    </div>
  );
}
