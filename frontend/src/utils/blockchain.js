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
    const provider = new ethers.JsonRpcProvider(HARDHAT_RPC_URL);
    const wallet = new ethers.Wallet(DEMO_KEYS[activeDemoRole], provider);
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
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
  const provider = new ethers.JsonRpcProvider(HARDHAT_RPC_URL);
  const wallet = new ethers.Wallet(DEMO_KEYS[role], provider);
  setDemoWalletRole(role);
  return {
    account: wallet.address,
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
