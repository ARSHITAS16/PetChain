# PetChain: A Blockchain-Based Pet Adoption & Ownership Management System

> **B.Tech CSE Blockchain Mini Project | Presidency University | Academic Year 2026–27**

PetChain is a full-stack decentralized application (dApp) built on Ethereum smart contracts to bring transparency, immutability, and trust to pet adoption lifecycles, ownership history tracking, and medical vaccination records.

---

## Key Features

- 🐾 **Decentralized Pet Registry**: Smart contract based registration for shelter pets with unique IDs, breed, age, and care notes.
- 📜 **Immutable Ownership History**: Every transfer of pet ownership (Shelter ➔ Owner A ➔ Owner B) is recorded permanently on-chain.
- 💉 **Verified Vaccination Records**: Shelter administrators log vaccination dates, vaccine names, and veterinarian details on-chain.
- 🤝 **Smart Adoption Lifecycle**: Users submit adoption applications on-chain; shelter admin approves or rejects applications with automated competing application management.
- 🦊 **MetaMask Integration**: Instant wallet connection, automatic chain verification (Chain ID: 31337), and real transaction hash tracking.
- 🎨 **Modern Web3 UI**: Dark mode UI built with React, Vite, and glassmorphism styling.

---

## Technology Stack

- **Smart Contract**: Solidity `0.8.24`, Hardhat
- **Blockchain Network**: Local Ethereum Node (`http://127.0.0.1:8545`)
- **Frontend**: React 18, JavaScript, Vite 5
- **Web3 Integration**: ethers.js v6, MetaMask Extension
- **Styling**: Vanilla CSS (Design Tokens, Glassmorphism, Dark Mode)

---

## Architecture Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  React Frontend │ <---> │    ethers.js    │ <---> │    MetaMask     │
└─────────────────┘       └─────────────────┘       └────────┬────────┘
                                                             │
                                                             ▼
                                                    ┌─────────────────┐
                                                    │  PetChain.sol   │
                                                    │ Smart Contract  │
                                                    └────────┬────────┘
                                                             │
                                                             ▼
                                                    ┌─────────────────┐
                                                    │ Hardhat Network │
                                                    └─────────────────┘
```

---

## Quick Start Guide

### 1. Prerequisites
- Node.js (v18+ or v24+)
- MetaMask Browser Extension

### 2. Installation
Clone or navigate to the project folder:
```bash
cmd /c npm install
cmd /c "cd /d frontend && npm install"
```

### 3. Smart Contract Compilation & Testing
```bash
cmd /c npx hardhat compile
cmd /c npx hardhat test
```

### 4. Running Local Node & Deployment
Start the local Ethereum blockchain:
```bash
# Terminal 1
cmd /c npx hardhat node
```

In a new terminal window, deploy the smart contract:
```bash
# Terminal 2
cmd /c npx hardhat run scripts/deploy.js --network localhost
```

Seed demonstration pets and sample records:
```bash
cmd /c npx hardhat run scripts/seed.js --network localhost
```

### 5. Start Frontend
```bash
cmd /c "cd /d frontend && npm run dev"
```
Open `http://localhost:3000` in your web browser.

---

## Project Structure

```
PetChain/
├── contracts/
│   └── PetChain.sol            # Smart contract
├── test/
│   └── PetChain.js             # 17 Hardhat unit tests
├── scripts/
│   ├── deploy.js               # Contract deployment script
│   └── seed.js                 # Demo data seeding script
├── frontend/
│   ├── src/
│   │   ├── components/         # Navbar, WalletConnect, PetCard, PetForm, etc.
│   │   ├── pages/              # Home, Pets, PetDetails, AdminDashboard
│   │   ├── utils/              # blockchain.js (ethers.js v6 helpers)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── docs/
│   ├── ARCHITECTURE.md         # Technical architecture
│   ├── SMART_CONTRACT.md       # Contract specification
│   ├── SETUP.md                # Installation & MetaMask guide
│   ├── DEMO_WORKFLOW.md        # 14-step presentation demo protocol
│   └── IMPLEMENTATION_REPORT.md# Academic verification report
├── .gitignore
├── hardhat.config.js
├── package.json
└── README.md
```

---

## Academic Team

- **Institution**: Presidency University
- **Program**: B.Tech Computer Science & Engineering
- **Academic Year**: 2026–2027
