import { ethers } from 'ethers';
import contractAddressData from '../contracts/contract-address.json' with { type: 'json' };
import contractArtifact from '../contracts/PetChain.json' with { type: 'json' };

export const HARDHAT_CHAIN_ID = '0x7a69'; // 31337 in hex
export const HARDHAT_RPC_URL = 'http://127.0.0.1:8545';

export const CONTRACT_ADDRESS = contractAddressData?.PetChain || '0x5FbDB2315678afecb367f032d93F642f64180aa3';
export const CONTRACT_ABI = contractArtifact?.abi || [];

export const ADMIN_ADDRESS = contractAddressData?.adminAddress || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
export const ADOPTER_ADDRESS = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

// Hardhat standard test keys for reference
export const DEMO_KEYS = {
  admin: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',  // Account #0 (0xf39F...92266)
  adopter: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d' // Account #1 (0x7099...79C8)
};

const DEMO_STORAGE_KEY = 'petchain_demo_storage_v3';

export const INITIAL_DEMO_PETS = [
  {
    petId: 1,
    name: "Rudra",
    breed: "Indie Dog Breed",
    age: 1,
    imageUri: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600",
    description: "Super energetic 1-year-old Indie boy with a handsome bowtie! Extremely smart, quick to learn, loves morning walks and sunny spots.",
    owner: ADOPTER_ADDRESS,
    isAdopted: true,
    registrationTime: 1774300000
  },
  {
    petId: 2,
    name: "Bella",
    breed: "Indie Puppy",
    age: 1,
    imageUri: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600",
    description: "Adorable 6-month-old Indie puppy wearing a polka-dot red bow tie. Inquisitive, playful, great with kids, and loves cozy lap naps.",
    owner: ADMIN_ADDRESS,
    isAdopted: false,
    registrationTime: 1774301000
  },
  {
    petId: 3,
    name: "Pinky",
    breed: "Indian Pariah Mix",
    age: 1,
    imageUri: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=600",
    description: "A pretty girl with the prettiest smile! Loves outdoor garden playtime, treats, dressing up in cute outfits, and belly rubs.",
    owner: ADMIN_ADDRESS,
    isAdopted: false,
    registrationTime: 1774302000
  },
  {
    petId: 4,
    name: "Simba",
    breed: "Golden Retriever Pup",
    age: 1,
    imageUri: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600",
    description: "Ultra-cute fluffy Golden puppy with endless energy. Loves playing fetch with tennis balls, water fun, and giving warm puppy cuddles.",
    owner: ADMIN_ADDRESS,
    isAdopted: false,
    registrationTime: 1774303000
  },
  {
    petId: 5,
    name: "Coco",
    breed: "Pug & Indie Mix",
    age: 2,
    imageUri: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=600",
    description: "Charming little cuddlebug who treats herself like royalty. Perfectly house-trained, calm, and loves family evening snuggles.",
    owner: ADMIN_ADDRESS,
    isAdopted: false,
    registrationTime: 1774304000
  },
  {
    petId: 6,
    name: "Kavu",
    breed: "Indie Beach Hound",
    age: 2,
    imageUri: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=600",
    description: "Beach-loving Indie boy who adores golden hour sunsets, sandy runs, and playing in water. Loyal and athletic outdoor companion.",
    owner: ADMIN_ADDRESS,
    isAdopted: false,
    registrationTime: 1774305000
  },
  {
    petId: 7,
    name: "Milo",
    breed: "Indie Puppy",
    age: 1,
    imageUri: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&q=80&w=600",
    description: "Gentle tan Indie puppy with adorable floppy ears and brown eyes. Fully vaccinated, healthy, and eager to find a forever home.",
    owner: ADMIN_ADDRESS,
    isAdopted: false,
    registrationTime: 1774306000
  },
  {
    petId: 8,
    name: "Luna",
    breed: "Siamese Cat",
    age: 1,
    imageUri: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600",
    description: "Sweet indoor Siamese cat with striking blue eyes. Peaceful lap companion, loves quiet sunbeams.",
    owner: ADMIN_ADDRESS,
    isAdopted: false,
    registrationTime: 1774307000
  }
];

export const INITIAL_DEMO_REQUESTS = [
  {
    requestId: 1,
    petId: 1,
    petName: "Rudra",
    applicant: ADOPTER_ADDRESS,
    applicantNotes: "Quiet suburban home with a spacious fenced backyard, experienced dog owners.",
    timestamp: 1774300300,
    status: 1 // Approved
  },
  {
    requestId: 2,
    petId: 3,
    petName: "Pinky",
    applicant: ADOPTER_ADDRESS,
    applicantNotes: "Looking for an energetic, loving Indie companion to spoil with treats and garden playtime.",
    timestamp: 1774302200,
    status: 0 // Pending
  }
];

export const INITIAL_DEMO_OWNERSHIP = {
  1: [
    { previousOwner: '0x0000000000000000000000000000000000000000', newOwner: ADMIN_ADDRESS, timestamp: 1774300000, reason: 'Initial Shelter Registration' },
    { previousOwner: ADMIN_ADDRESS, newOwner: ADOPTER_ADDRESS, timestamp: 1774300500, reason: 'Adoption Approved by Shelter' }
  ],
  2: [
    { previousOwner: '0x0000000000000000000000000000000000000000', newOwner: ADMIN_ADDRESS, timestamp: 1774301000, reason: 'Initial Shelter Registration' }
  ],
  3: [
    { previousOwner: '0x0000000000000000000000000000000000000000', newOwner: ADMIN_ADDRESS, timestamp: 1774302000, reason: 'Initial Shelter Registration' }
  ],
  4: [
    { previousOwner: '0x0000000000000000000000000000000000000000', newOwner: ADMIN_ADDRESS, timestamp: 1774303000, reason: 'Initial Shelter Registration' }
  ],
  5: [
    { previousOwner: '0x0000000000000000000000000000000000000000', newOwner: ADMIN_ADDRESS, timestamp: 1774304000, reason: 'Initial Shelter Registration' }
  ],
  6: [
    { previousOwner: '0x0000000000000000000000000000000000000000', newOwner: ADMIN_ADDRESS, timestamp: 1774305000, reason: 'Initial Shelter Registration' }
  ],
  7: [
    { previousOwner: '0x0000000000000000000000000000000000000000', newOwner: ADMIN_ADDRESS, timestamp: 1774306000, reason: 'Initial Shelter Registration' }
  ],
  8: [
    { previousOwner: '0x0000000000000000000000000000000000000000', newOwner: ADMIN_ADDRESS, timestamp: 1774307000, reason: 'Initial Shelter Registration' }
  ]
};

export const INITIAL_DEMO_VACCINATIONS = {
  1: [
    { vaccineName: 'Rabies Virus Vaccine', dateAdministered: 1766400000, veterinarian: 'Dr. Sarah Jenkins (Pawsitive Vet Care)' },
    { vaccineName: 'DHPP Combination', dateAdministered: 1769000000, veterinarian: 'Dr. Sarah Jenkins (Pawsitive Vet Care)' }
  ],
  2: [
    { vaccineName: 'Puppy Core 7-in-1', dateAdministered: 1771000000, veterinarian: 'Dr. Michael Chang (PetCare Clinic)' }
  ],
  3: [
    { vaccineName: 'Rabies & Anti-Tick', dateAdministered: 1770000000, veterinarian: 'Dr. Sarah Jenkins (Pawsitive Vet Care)' }
  ],
  4: [
    { vaccineName: 'DHPP Booster', dateAdministered: 1772000000, veterinarian: 'Dr. Michael Chang (PetCare Clinic)' }
  ]
};

// Aliases for backwards compatibility
export const FALLBACK_DEMO_PETS = INITIAL_DEMO_PETS;
export const FALLBACK_VACCINATIONS = INITIAL_DEMO_VACCINATIONS;
export const FALLBACK_OWNERSHIP_HISTORY = INITIAL_DEMO_OWNERSHIP;

function generateTxHash() {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

let inMemoryState = null;

export const demoStore = {
  getState() {
    if (typeof localStorage === 'undefined') {
      if (!inMemoryState) {
        inMemoryState = {
          pets: JSON.parse(JSON.stringify(INITIAL_DEMO_PETS)),
          requests: JSON.parse(JSON.stringify(INITIAL_DEMO_REQUESTS)),
          ownership: JSON.parse(JSON.stringify(INITIAL_DEMO_OWNERSHIP)),
          vaccinations: JSON.parse(JSON.stringify(INITIAL_DEMO_VACCINATIONS))
        };
      }
      return inMemoryState;
    }

    try {
      const stored = localStorage.getItem(DEMO_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Error reading demo storage, initializing fresh state", e);
    }
    const initialState = {
      pets: JSON.parse(JSON.stringify(INITIAL_DEMO_PETS)),
      requests: JSON.parse(JSON.stringify(INITIAL_DEMO_REQUESTS)),
      ownership: JSON.parse(JSON.stringify(INITIAL_DEMO_OWNERSHIP)),
      vaccinations: JSON.parse(JSON.stringify(INITIAL_DEMO_VACCINATIONS))
    };
    try {
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(initialState));
    } catch (e) {}
    return initialState;
  },

  saveState(state) {
    if (typeof localStorage === 'undefined') {
      inMemoryState = state;
      return;
    }
    try {
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save demo state", e);
    }
  },

  reset() {
    const initialState = {
      pets: JSON.parse(JSON.stringify(INITIAL_DEMO_PETS)),
      requests: JSON.parse(JSON.stringify(INITIAL_DEMO_REQUESTS)),
      ownership: JSON.parse(JSON.stringify(INITIAL_DEMO_OWNERSHIP)),
      vaccinations: JSON.parse(JSON.stringify(INITIAL_DEMO_VACCINATIONS))
    };
    this.saveState(initialState);
    return initialState;
  },

  getAllPets() {
    return this.getState().pets;
  },

  getPet(petId) {
    const pets = this.getAllPets();
    return pets.find(p => Number(p.petId) === Number(petId)) || null;
  },

  getDashboardStats() {
    const state = this.getState();
    const totalPets = state.pets.length;
    const adoptedPets = state.pets.filter(p => p.isAdopted).length;
    const availablePets = totalPets - adoptedPets;
    const totalRequests = state.requests.length;
    return { totalPets, availablePets, adoptedPets, totalRequests };
  },

  getAdoptionRequests(petId) {
    const state = this.getState();
    return state.requests.filter(r => Number(r.petId) === Number(petId));
  },

  getAllPendingRequests() {
    const state = this.getState();
    return state.requests.filter(r => Number(r.status) === 0);
  },

  getAllRequests() {
    const state = this.getState();
    return state.requests;
  },

  getOwnershipHistory(petId) {
    const state = this.getState();
    return state.ownership[Number(petId)] || [
      { previousOwner: '0x0000000000000000000000000000000000000000', newOwner: ADMIN_ADDRESS, timestamp: Math.floor(Date.now() / 1000) - 86400, reason: 'Initial Shelter Registration' }
    ];
  },

  getVaccinations(petId) {
    const state = this.getState();
    return state.vaccinations[Number(petId)] || [];
  },

  requestAdoption(petId, applicantNotes, applicant) {
    const state = this.getState();
    const pet = state.pets.find(p => Number(p.petId) === Number(petId));
    if (!pet) throw new Error("PetChain: Pet ID does not exist");
    if (pet.isAdopted) throw new Error("PetChain: Pet is already adopted");

    const appAddress = applicant || ADOPTER_ADDRESS;
    // Check if user already has an active pending request
    const existing = state.requests.find(
      r => Number(r.petId) === Number(petId) && 
      r.applicant.toLowerCase() === appAddress.toLowerCase() && 
      Number(r.status) === 0
    );
    if (existing) {
      throw new Error("PetChain: Adoption request already submitted for this pet");
    }

    const newRequestId = state.requests.length > 0 ? Math.max(...state.requests.map(r => Number(r.requestId) || 0)) + 1 : 1;
    const newReq = {
      requestId: newRequestId,
      petId: Number(petId),
      petName: pet.name,
      applicant: appAddress,
      applicantNotes: applicantNotes || "Application submitted via PetChain Web3 Portal",
      timestamp: Math.floor(Date.now() / 1000),
      status: 0 // Pending
    };

    state.requests.push(newReq);
    this.saveState(state);
    return {
      hash: generateTxHash(),
      wait: async () => new Promise(res => setTimeout(res, 800))
    };
  },

  approveAdoption(petId, requestIndex, applicantAddress) {
    const state = this.getState();
    const pet = state.pets.find(p => Number(p.petId) === Number(petId));
    if (!pet) throw new Error("PetChain: Pet ID does not exist");
    if (pet.isAdopted) throw new Error("PetChain: Pet has already been adopted");

    const petRequests = state.requests.filter(r => Number(r.petId) === Number(petId));
    let targetReq = null;
    if (typeof requestIndex === 'number' && requestIndex >= 0 && requestIndex < petRequests.length) {
      targetReq = petRequests[requestIndex];
    } else if (applicantAddress) {
      targetReq = petRequests.find(r => r.applicant.toLowerCase() === applicantAddress.toLowerCase() && Number(r.status) === 0);
    } else {
      targetReq = petRequests.find(r => Number(r.status) === 0);
    }

    if (!targetReq) {
      throw new Error("PetChain: Request is not pending or invalid request index");
    }

    const prevOwner = pet.owner;
    const newOwner = targetReq.applicant;

    // Approve target request
    targetReq.status = 1; // Approved

    // Reject all other pending requests for this pet
    petRequests.forEach(r => {
      if (r !== targetReq && Number(r.status) === 0) {
        r.status = 2; // Rejected
      }
    });

    // Update pet status
    pet.isAdopted = true;
    pet.owner = newOwner;

    // Append to ownership history
    if (!state.ownership[Number(petId)]) {
      state.ownership[Number(petId)] = [];
    }
    state.ownership[Number(petId)].push({
      previousOwner: prevOwner,
      newOwner: newOwner,
      timestamp: Math.floor(Date.now() / 1000),
      reason: "Adoption Approved by Shelter"
    });

    this.saveState(state);
    return {
      hash: generateTxHash(),
      wait: async () => new Promise(res => setTimeout(res, 800))
    };
  },

  rejectAdoption(petId, requestIndex, applicantAddress) {
    const state = this.getState();
    const petRequests = state.requests.filter(r => Number(r.petId) === Number(petId));
    let targetReq = null;
    if (typeof requestIndex === 'number' && requestIndex >= 0 && requestIndex < petRequests.length) {
      targetReq = petRequests[requestIndex];
    } else if (applicantAddress) {
      targetReq = petRequests.find(r => r.applicant.toLowerCase() === applicantAddress.toLowerCase() && Number(r.status) === 0);
    } else {
      targetReq = petRequests.find(r => Number(r.status) === 0);
    }

    if (!targetReq) {
      throw new Error("PetChain: Request is not pending");
    }

    targetReq.status = 2; // Rejected
    this.saveState(state);
    return {
      hash: generateTxHash(),
      wait: async () => new Promise(res => setTimeout(res, 800))
    };
  },

  registerPet(name, breed, age, imageUri, description) {
    const state = this.getState();
    const newPetId = state.pets.length > 0 ? Math.max(...state.pets.map(p => Number(p.petId) || 0)) + 1 : 1;
    const timestampNow = Math.floor(Date.now() / 1000);

    const newPet = {
      petId: newPetId,
      name,
      breed,
      age: Number(age),
      imageUri: imageUri || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600",
      description: description || "Loving pet ready for a caring forever home.",
      owner: ADMIN_ADDRESS,
      isAdopted: false,
      registrationTime: timestampNow
    };

    state.pets.push(newPet);
    if (!state.ownership[newPetId]) {
      state.ownership[newPetId] = [];
    }
    state.ownership[newPetId].push({
      previousOwner: '0x0000000000000000000000000000000000000000',
      newOwner: ADMIN_ADDRESS,
      timestamp: timestampNow,
      reason: "Initial Shelter Registration"
    });

    this.saveState(state);
    return {
      hash: generateTxHash(),
      wait: async () => new Promise(res => setTimeout(res, 800))
    };
  },

  addVaccinationRecord(petId, vaccineName, dateAdministered, veterinarian) {
    const state = this.getState();
    if (!state.vaccinations[Number(petId)]) {
      state.vaccinations[Number(petId)] = [];
    }

    state.vaccinations[Number(petId)].push({
      vaccineName,
      dateAdministered: Number(dateAdministered) || Math.floor(Date.now() / 1000),
      veterinarian,
      timestamp: Math.floor(Date.now() / 1000)
    });

    this.saveState(state);
    return {
      hash: generateTxHash(),
      wait: async () => new Promise(res => setTimeout(res, 800))
    };
  }
};

/**
 * In-memory simulation contract providing standard PetChain interface
 */
export class SimulatedContract {
  constructor(role = 'adopter') {
    this.role = role;
    this.currentAccount = role === 'admin' ? ADMIN_ADDRESS : ADOPTER_ADDRESS;
  }

  async admin() {
    return ADMIN_ADDRESS;
  }

  async petCount() {
    return demoStore.getAllPets().length;
  }

  async getAllPets() {
    return demoStore.getAllPets();
  }

  async getPetDetails(petId) {
    const pet = demoStore.getPet(petId);
    if (!pet) throw new Error("PetChain: Pet ID does not exist");
    return pet;
  }

  async getDashboardStats() {
    return demoStore.getDashboardStats();
  }

  async getAdoptionRequests(petId) {
    return demoStore.getAdoptionRequests(petId);
  }

  async getOwnershipHistory(petId) {
    return demoStore.getOwnershipHistory(petId);
  }

  async getVaccinationHistory(petId) {
    return demoStore.getVaccinations(petId);
  }

  async requestAdoption(petId, applicantNotes) {
    return demoStore.requestAdoption(petId, applicantNotes, this.currentAccount);
  }

  async approveAdoption(petId, requestIndex) {
    return demoStore.approveAdoption(petId, requestIndex);
  }

  async rejectAdoption(petId, requestIndex) {
    return demoStore.rejectAdoption(petId, requestIndex);
  }

  async registerPet(name, breed, age, imageUri, description) {
    return demoStore.registerPet(name, breed, age, imageUri, description);
  }

  async addVaccinationRecord(petId, vaccineName, dateAdministered, veterinarian) {
    return demoStore.addVaccinationRecord(petId, vaccineName, dateAdministered, veterinarian);
  }
}

let activeDemoRole = 'adopter'; // default to adopter demo role
let isDemoModeActive = true;

export function setDemoWalletRole(role) {
  activeDemoRole = role;
  isDemoModeActive = Boolean(role);
}

export function getDemoWalletRole() {
  return activeDemoRole;
}

export function isDemoActive() {
  return isDemoModeActive;
}

/**
 * Returns read-only contract instance
 */
export function getReadOnlyContract() {
  // If in demo mode or without web3 provider, return simulation contract
  if (isDemoModeActive || !window.ethereum) {
    return new SimulatedContract(activeDemoRole || 'adopter');
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  } catch (e) {
    return new SimulatedContract(activeDemoRole || 'adopter');
  }
}

/**
 * Returns contract instance bound to current Signer (MetaMask or Demo Simulation)
 */
export async function getSignerContract() {
  // If demo role is active, return our simulation contract
  if (isDemoModeActive || activeDemoRole) {
    return new SimulatedContract(activeDemoRole || 'adopter');
  }

  // MetaMask browser connection
  if (!window.ethereum) {
    return new SimulatedContract('adopter');
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  } catch (err) {
    console.warn("Falling back to demo simulation signer due to wallet error:", err);
    return new SimulatedContract('adopter');
  }
}

/**
 * Connects wallet via MetaMask
 */
export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error('MetaMask extension is not detected in your browser.');
  }

  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  if (!accounts || accounts.length === 0) {
    throw new Error('No accounts found in MetaMask.');
  }

  const chainId = await window.ethereum.request({ method: 'eth_chainId' });
  setDemoWalletRole(null);
  isDemoModeActive = false;
  return {
    account: accounts[0],
    chainId
  };
}

/**
 * Connects a Demo Local Hardhat Wallet (Admin or Adopter) for testing without MetaMask
 */
export function connectDemoWallet(role = 'adopter') {
  setDemoWalletRole(role);
  const address = role === 'admin' ? ADMIN_ADDRESS : ADOPTER_ADDRESS;
  return {
    account: address,
    chainId: HARDHAT_CHAIN_ID
  };
}

/**
 * Switches MetaMask network to Hardhat Localhost (Chain ID 31337)
 */
export async function switchToHardhatNetwork() {
  if (!window.ethereum) return;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: HARDHAT_CHAIN_ID }]
    });
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: HARDHAT_CHAIN_ID,
              chainName: 'Hardhat Localhost',
              rpcUrls: [HARDHAT_RPC_URL],
              nativeCurrency: {
                name: 'Test ETH',
                symbol: 'ETH',
                decimals: 18
              }
            }
          ]
        });
      } catch (addError) {
        throw new Error('Failed to add Hardhat network to MetaMask: ' + addError.message);
      }
    } else {
      throw switchError;
    }
  }
}

/**
 * Format Ethereum address for clean display (e.g. 0x1234...5678)
 */
export function formatAddress(address) {
  if (!address || address === ethers.ZeroAddress || address === '0x0000000000000000000000000000000000000000') {
    return 'None (Shelter)';
  }
  if (address.toLowerCase() === ADMIN_ADDRESS.toLowerCase()) {
    return 'Shelter Admin (' + address.substring(0, 6) + '...' + address.substring(address.length - 4) + ')';
  }
  if (address.toLowerCase() === ADOPTER_ADDRESS.toLowerCase()) {
    return 'Adopter (' + address.substring(0, 6) + '...' + address.substring(address.length - 4) + ')';
  }
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Format Unix Timestamp (seconds) to readable Date/Time string
 */
export function formatTimestamp(timestamp) {
  if (!timestamp) return 'N/A';
  const dateNum = typeof timestamp === 'bigint' ? Number(timestamp) * 1000 : Number(timestamp) * 1000;
  return new Date(dateNum).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

/**
 * Extracts clean, human-readable error messages from ethers / Solidity reverts
 */
export function parseError(err) {
  if (!err) return 'An unknown error occurred.';
  if (typeof err === 'string') return err;
  if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
    return 'Transaction rejected in MetaMask by user.';
  }
  if (err.reason) return err.reason;
  if (err.message) {
    if (err.message.includes('-32002') || err.message.includes('RPC endpoint') || err.message.includes('eth_blockNumber')) {
      return 'MetaMask RPC network error. Please use PetChain Demo Mode (selected in the top bar) to submit transactions without MetaMask.';
    }
    if (err.message.includes('PetChain:')) {
      const match = err.message.match(/PetChain:[^"']+/);
      if (match) return match[0];
    }
    if (err.message.includes('user rejected')) {
      return 'Transaction rejected by user.';
    }
    return err.message;
  }
  return 'Transaction failed. Please verify inputs and network connection.';
}
