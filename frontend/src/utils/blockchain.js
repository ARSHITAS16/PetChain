import { ethers } from 'ethers';
import contractAddressData from '../contracts/contract-address.json';
import contractArtifact from '../contracts/PetChain.json';

export const HARDHAT_CHAIN_ID = '0x7a69'; // 31337 in hex
export const HARDHAT_RPC_URL = 'http://127.0.0.1:8545';

export const CONTRACT_ADDRESS = contractAddressData?.PetChain || '0x5FbDB2315678afecb367f032d93F642f64180aa3';
export const CONTRACT_ABI = contractArtifact?.abi || [];

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
 * Returns contract instance bound to current MetaMask Signer
 */
export async function getSignerContract() {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed. Please install the MetaMask extension to execute transactions.');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

/**
 * Requests wallet connection via MetaMask
 */
export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed in your browser.');
  }

  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  if (!accounts || accounts.length === 0) {
    throw new Error('No accounts found in MetaMask.');
  }

  const chainId = await window.ethereum.request({ method: 'eth_chainId' });
  return {
    account: accounts[0],
    chainId
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
    // Code 4902 means the chain has not been added to MetaMask
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
  return 'Transaction failed. Please verify inputs and wallet network.';
}
