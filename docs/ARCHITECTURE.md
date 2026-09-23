# PetChain: System Architecture Document

## Overview

PetChain is a decentralized application (dApp) designed to manage pet registries, adoption requests, ownership history, and vaccination records on an Ethereum-compatible blockchain.

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface Layer                 │
│          React 18 + Vite Web Application                │
│   ├── Landing Page & Live On-Chain Metrics              │
│   ├── Pet Gallery & Filterable Search                   │
│   ├── Pet Details & Immutable Ownership Timeline        │
│   └── Shelter Admin Control Panel                       │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    Blockchain Middleware                │
│                     ethers.js v6 + MetaMask             │
│   ├── JSON-RPC Read-Only Fallback Provider              │
│   ├── BrowserProvider & MetaMask Signer Integration     │
│   └── Network Verification (Chain ID: 31337)            │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    Smart Contract Layer                 │
│                     PetChain.sol                        │
│   ├── Admin Access Control (onlyAdmin)                  │
│   ├── Pet Registry & Lifecycle Management               │
│   ├── Adoption Request Processing (Approve / Reject)    │
│   ├── Immutable Ownership Records                      │
│   └── Verified Medical & Vaccination History            │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    Execution Layer                      │
│                Hardhat Local Ethereum Node              │
│                 (http://127.0.0.1:8545)                 │
└─────────────────────────────────────────────────────────┘
```

## Layer Descriptions

### 1. User Interface (React + Vite)
- Built with React 18, Vite, and custom CSS for sleek dark mode aesthetics.
- Utilizes state hooks and callback memos to reactively update UI elements when smart contract transactions complete.
- Implements fallback read-only data fetching so unauthenticated users can browse pets without MetaMask popups.

### 2. Middleware (ethers.js v6 & MetaMask)
- `ethers.BrowserProvider` connects the application to the user's browser wallet extension.
- Listens to `accountsChanged` and `chainChanged` events to seamlessly react to wallet switches.
- Standardizes transaction execution, status monitoring (`submitting` -> `mining` -> `success`), and error parsing.

### 3. Smart Contract (`PetChain.sol`)
- Written in Solidity `0.8.24` and compiled using Hardhat optimizer (200 runs).
- Serves as the single source of truth for all pets, applications, ownership transfers, and medical logs.
- Enforces strict access control preventing non-admin accounts from registering pets or approving adoption requests.

### 4. Local Execution Node (Hardhat Network)
- Runs a deterministic local EVM node simulating Ethereum mainnet behavior with zero gas costs for local testing.
