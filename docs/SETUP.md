# PetChain: Development & MetaMask Setup Guide

## Prerequisites
- Node.js v18+ or v24+
- npm v9+ or v11+
- Git
- MetaMask Browser Extension installed in Chrome/Brave/Firefox

## Step-by-Step Installation

### 1. Install Root & Frontend Dependencies
Open terminal in the project root:
```bash
cmd /c npm install
cmd /c "cd /d frontend && npm install"
```

### 2. Smart Contract Compilation & Automated Testing
Compile smart contract:
```bash
cmd /c npx hardhat compile
```

Run automated Hardhat unit tests:
```bash
cmd /c npx hardhat test
```

### 3. Running Local Hardhat Blockchain Node
Start the local Ethereum blockchain in Terminal 1:
```bash
cmd /c npx hardhat node
```
This node runs at `http://127.0.0.1:8545` with Chain ID `31337`.
Take note of Account #0 private key (Admin) and Account #1 private key (Adopter).

### 4. Smart Contract Deployment & Seeding
In Terminal 2, deploy the smart contract to the running node:
```bash
cmd /c npx hardhat run scripts/deploy.js --network localhost
```
Optionally seed demonstration data (pets, vaccination logs, requests):
```bash
cmd /c npx hardhat run scripts/seed.js --network localhost
```

### 5. Launch React Frontend
In Terminal 2:
```bash
cmd /c "cd /d frontend && npm run dev"
```
The dApp will open at `http://localhost:3000`.

## MetaMask Configuration Guide

1. Open MetaMask extension in your browser.
2. Click Network Selector dropdown -> **Add Network** -> **Add network manually**.
3. Enter Network Parameters:
   - **Network Name**: Hardhat Localhost
   - **RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `31337`
   - **Currency Symbol**: `ETH`
4. Import Test Accounts:
   - Click Account Selector -> **Import Account**.
   - Paste Private Key for Account #0 from `npx hardhat node` output (Shelter Admin).
   - Paste Private Key for Account #1 (Adopter Applicant).
