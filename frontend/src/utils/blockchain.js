import { ethers } from 'ethers';
import contractAddressData from '../contracts/contract-address.json';
import contractArtifact from '../contracts/PetChain.json';

export const HARDHAT_CHAIN_ID = '0x7a69'; // 31337 in hex
export const HARDHAT_RPC_URL = 'http://127.0.0.1:8545';

export const CONTRACT_ADDRESS = contractAddressData?.PetChain || '0x5FbDB2315678afecb367f032d93F642f64180aa3';
export const CONTRACT_ABI = contractArtifact?.abi || [];

// Standard Hardhat Test Private Keys for Demo Mode
export const DEMO_KEYS = {
  admin: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',  // Account #0 (0xf39F...92266)
  adopter: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d' // Account #1 (0x7099...79C8)
};

export const FALLBACK_DEMO_PETS = [
  {
    petId: 1n,
    name: "Rudra",
    breed: "Indie Dog Breed",
    age: 1n,
    imageUri: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600",
    description: "Super energetic 1-year-old Indie boy with a handsome bowtie! Extremely smart, quick to learn, loves morning walks and sunny spots.",
    owner: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    isAdopted: true,
    registrationTime: 1774300000n
  },
  {
    petId: 2n,
    name: "Bella",
    breed: "Indie Puppy",
    age: 1n,
    imageUri: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600",
    description: "Adorable 6-month-old Indie puppy wearing a polka-dot red bow tie. Inquisitive, playful, great with kids, and loves cozy lap naps.",
    owner: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    isAdopted: false,
    registrationTime: 1774301000n
  },
  {
    petId: 3n,
    name: "Pinky",
    breed: "Indian Pariah Mix",
    age: 1n,
    imageUri: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=600",
    description: "A pretty girl with the prettiest smile! Loves outdoor garden playtime, treats, dressing up in cute outfits, and belly rubs.",
    owner: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    isAdopted: false,
    registrationTime: 1774302000n
  },
  {
    petId: 4n,
    name: "Simba",
    breed: "Golden Retriever Pup",
    age: 1n,
    imageUri: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600",
    description: "Ultra-cute fluffy Golden puppy with endless energy. Loves playing fetch with tennis balls, water fun, and giving warm puppy cuddles.",
    owner: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    isAdopted: false,
    registrationTime: 1774303000n
  },
  {
    petId: 5n,
    name: "Coco",
    breed: "Pug & Indie Mix",
    age: 2n,
    imageUri: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=600",
    description: "Charming little cuddlebug who treats herself like royalty. Perfectly house-trained, calm, and loves family evening snuggles.",
    owner: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    isAdopted: false,
    registrationTime: 1774304000n
  },
  {
    petId: 6n,
    name: "Kavu",
    breed: "Indie Beach Hound",
    age: 2n,
    imageUri: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=600",
    description: "Beach-loving Indie boy who adores golden hour sunsets, sandy runs, and playing in water. Loyal and athletic outdoor companion.",
    owner: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    isAdopted: false,
    registrationTime: 1774305000n
  },
  {
    petId: 7n,
    name: "Milo",
    breed: "Indie Puppy",
    age: 1n,
    imageUri: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&q=80&w=600",
    description: "Gentle tan Indie puppy with adorable floppy ears and brown eyes. Fully vaccinated, healthy, and eager to find a forever home.",
    owner: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    isAdopted: false,
    registrationTime: 1774306000n
  },
  {
    petId: 8n,
    name: "Luna",
    breed: "Siamese Cat",
    age: 1n,
    imageUri: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600",
    description: "Sweet indoor Siamese cat with striking blue eyes. Peaceful lap companion, loves quiet sunbeams.",
    owner: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    isAdopted: false,
    registrationTime: 1774307000n
  }
];

export const FALLBACK_VACCINATIONS = {
  1: [
    { vaccineName: 'Rabies Virus Vaccine', dateAdministered: 1766400000n, veterinarian: 'Dr. Sarah Jenkins (Pawsitive Vet Care)' },
    { vaccineName: 'DHPP Combination', dateAdministered: 1769000000n, veterinarian: 'Dr. Sarah Jenkins (Pawsitive Vet Care)' }
  ],
  2: [
    { vaccineName: 'Puppy Core 7-in-1', dateAdministered: 1771000000n, veterinarian: 'Dr. Michael Chang (PetCare Clinic)' }
  ],
  3: [
    { vaccineName: 'Rabies & Anti-Tick', dateAdministered: 1770000000n, veterinarian: 'Dr. Sarah Jenkins (Pawsitive Vet Care)' }
  ],
  4: [
    { vaccineName: 'DHPP Booster', dateAdministered: 1772000000n, veterinarian: 'Dr. Michael Chang (PetCare Clinic)' }
  ]
};

export const FALLBACK_OWNERSHIP_HISTORY = {
  1: [
    { previousOwner: ethers.ZeroAddress, newOwner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', timestamp: 1774300000n, reason: 'Initial Shelter Registration' },
    { previousOwner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', newOwner: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', timestamp: 1774300500n, reason: 'Adoption Approved by Shelter' }
  ],
  2: [
    { previousOwner: ethers.ZeroAddress, newOwner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', timestamp: 1774301000n, reason: 'Initial Shelter Registration' }
  ]
};

let activeDemoRole = null; // null | 'admin' | 'adopter'

export function setDemoWalletRole(role) {
  activeDemoRole = role;
}

export function getDemoWalletRole() {
  return activeDemoRole;
}

/**
 * Creates a read-only ethers Provider (fallback to local Hardhat node)
 */
export function getReadOnlyProvider() {
  if (window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return new ethers.JsonRpcProvider(HARDHAT_RPC_URL);
}

/**
 * Returns read-only contract instance
 */
export function getReadOnlyContract() {
  const provider = getReadOnlyProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}

/**
 * Returns contract instance bound to current Signer (MetaMask or Demo Wallet)
 */
export async function getSignerContract() {
  // 1. If Demo Wallet Role is active
  if (activeDemoRole && DEMO_KEYS[activeDemoRole]) {
    try {
      const provider = new ethers.JsonRpcProvider(HARDHAT_RPC_URL);
      const wallet = new ethers.Wallet(DEMO_KEYS[activeDemoRole], provider);
      return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
    } catch (e) {
      console.warn("JsonRpcProvider not reachable for demo signer, using fallback simulation signer.");
    }
  }

  // 2. Browser MetaMask
  if (!window.ethereum) {
    throw new Error('MetaMask browser extension is not installed.');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
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
  return {
    account: accounts[0],
    chainId
  };
}

/**
 * Connects a Demo Local Hardhat Wallet (Admin or Adopter) for testing without MetaMask
 */
export function connectDemoWallet(role = 'admin') {
  setDemoWalletRole(role);
  const address = role === 'admin' ? '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' : '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
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
  if (!address || address === ethers.ZeroAddress) return 'None (Shelter)';
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
