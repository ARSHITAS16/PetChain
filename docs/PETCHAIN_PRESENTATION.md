# PetChain: Presentation Slides & System Flowchart

This document contains the slide-by-slide text, flowchart diagrams, icons, and presentation notes matching the exact 8-slide template required for the **CSSE2289-Foundation Of Blockchain Technology Mini Project Synopsis Review**.

The generated PowerPoint file is available at:  
`C:\Users\ARSHITA\.gemini\antigravity-ide\scratch\PetChain\PetChain_Presentation.pptx`

---

## SLIDE 1: Cover Slide

```
┌─────────────────────────────────────────────────────────┐
│ PRESIDENCY UNIVERSITY                                 1 │
│                                                         │
│                                                         │
│                       Presidency                        │
│        School of Computer Science and Engineering       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

- **Top Header**: PRESIDENCY UNIVERSITY
- **Main Title**: Presidency
- **Subtitle**: School of Computer Science and Engineering

---

## SLIDE 2: Title & Synopsis Review

```
┌─────────────────────────────────────────────────────────┐
│ CSSE2289-Foundation Of Blockchain Technology            │
│               Mini Project Synopsis Review              │
│ ─────────────────────────────────────────────────────── │
│                                                         │
│      “PetChain: A Blockchain-Based Pet Adoption         │
│          and Ownership Management System”               │
│                                                         │
│     Roll Number               Student Name              │
│    20231CSE0001            Team Member 1 (Lead)         │
│    20231CSE0002            Team Member 2                │
│    20231CSE0003            Team Member 3                │
│                                                         │
│  Project Guide :- Mr. Akash Raj (Assistant Professor)   │
│  Name of the Program: B.tech                            │
│  Name of Branch:- Computer Science and Engineering      │
│ ─────────────────────────────────────────────────────── │
│ PRESIDENCY UNIVERSITY | School of CSE                   │
└─────────────────────────────────────────────────────────┘
```

---

## SLIDE 3: Problem Statement

- **Header**: Problem Statement

### Content:
1. **❌ Lack of Ownership Transparency**  
   Traditional paper-based adoption certificates can be lost, altered, or forged, leading to ownership disputes and illegal re-homing.

2. **❌ Unverified Medical & Vaccination Logs**  
   Vaccination records are easily falsified or misplaced, risking animal health and giving adopters zero verifiable health proof.

3. **❌ Centralized & Isolated Data Silos**  
   Shelters operate fragmented, offline databases prone to data loss, corruption, and complete lack of public auditability.

4. **❌ Absence of Traceable Pet History**  
   Adopters have no immutable mechanism to verify a pet's complete lifecycle timeline, prior shelter transfers, or medical history.

---

## SLIDE 4: Proposed Solution

- **Header**: Proposed Solution

### Content:
1. **🐾 Decentralized Pet Registry**  
   Ethereum smart contract (`PetChain.sol`) serving as an immutable, tamper-proof single source of truth for pet identity.

2. **📜 Immutable Ownership History**  
   Cryptographically signed timeline logging every ownership transition (Shelter ➔ Adopter A ➔ Adopter B) permanently on-chain.

3. **💉 Verified Medical & Vaccination Logs**  
   Authorized shelter administrators log vaccination dates, vaccine types, and clinic details directly on-chain.

4. **🤖 Smart Contract Automation**  
   Decentralized adoption lifecycle (Request ➔ Review ➔ Approve/Reject) with automated competing request cancellation.

5. **🦊 Web3 & MetaMask Integration**  
   Seamless browser interaction via `ethers.js` v6, Web3 wallet signatures, and real-time transaction hash tracking.

---

## SLIDE 5: How the System Works (System Architecture & Flowchart)

- **Header**: How the System Works

### Visual Flowchart Diagram:

```
┌───────────────────────┐
│ 1. Registration 📝    │  Shelter Admin registers pet details & image URL
│    (PetChain.sol)     │  on-chain via `registerPet()`
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ 2. Web3 Gallery 🐾    │  Adopter browses live pets synced live from
│   (React + ethers)    │  smart contract state
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ 3. Application 📩     │  Applicant submits adoption application & notes
│   (MetaMask Signer)   │  via `requestAdoption()`
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ 4. Admin Review 🛡️     │  Shelter Admin reviews applications and executes
│   (Approve / Reject)  │  `approveAdoption()` on-chain
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ 5. Immutable Logs 📜  │  Ownership transferred, competing requests auto-rejected,
│  (Blockchain Ledger)  │  and medical vaccination records logged
└───────────────────────┘
```

### Detailed Workflow Explanation:
- **User / Adopter Workflow**: Connects Web3 Wallet ➔ Browses live pet gallery ➔ Submits adoption request with housing notes ➔ Receives instant transaction confirmation.
- **Shelter Admin Workflow**: Accesses Admin Dashboard ➔ Registers new pet profile ➔ Reviews pending applications ➔ Approves adoption (triggering atomic ownership transfer) ➔ Logs medical vaccination records.
- **Smart Contract Automation**: On approval, `PetChain.sol` updates owner address, sets `isAdopted = true`, appends `OwnershipRecord`, and automatically marks competing requests as `Rejected`.

---

## SLIDE 6: Requirements

- **Header**: Requirements

```
┌─────────────────────────┬─────────────────────────┬─────────────────────────┐
│ 1) Software             │ 2) Hardware             │ 3) Blockchain Specs     │
├─────────────────────────┼─────────────────────────┼─────────────────────────┤
│ • Smart Contract:       │ • Processor:            │ • Network:              │
│   Solidity 0.8.24       │   Dual-Core 2.0 GHz+    │   Hardhat Localhost     │
│ • Framework:            │ • System RAM:           │ • Chain ID:             │
│   Hardhat 2.22          │   8 GB minimum          │   31337 (0x7a69)        │
│ • Frontend:             │ • Storage:              │ • RPC URL:              │
│   React 18, Vite 5      │   10 GB SSD space       │   http://127.0.0.1:8545 │
│ • Web3 Middleware:      │ • Display:              │ • Contract Address:     │
│   ethers.js v6          │   1280 x 720            │   0x5FbD...80aa3        │
│ • Wallet: MetaMask      │ • Input:                │ • Tests Passed:         │
│ • Runtime: Node v18+/24+│   Keyboard & Mouse      │   17 / 17 (100%)        │
└─────────────────────────┴─────────────────────────┴─────────────────────────┘
```

---

## SLIDE 7: Expected Outcome

- **Header**: Expected Outcome

### Key Achievements:
1. **✅ 100% Transparent & Verifiable Pet Records**  
   Publicly accessible Web3 dApp enabling adopters and shelters to inspect pet profiles without central authority trust.

2. **✅ Tamper-Proof Ownership Transfer**  
   Guaranteed proof of ownership with an immutable, timestamped timeline recording every transition from shelter to adopters.

3. **✅ Immutable Medical & Vaccination History**  
   Eliminates fraudulent health certificates by storing verified vaccination logs directly on-chain.

4. **✅ Automated & Secure Adoption Management**  
   Smart contract driven approval/rejection lifecycle that auto-rejects competing applications upon adoption finalization.

5. **✅ Fully Functioning Web3 Prototype**  
   Successfully deployed and tested on local EVM with 17 passing Hardhat unit tests and live Web3 frontend.

---

## SLIDE 8: Thank You!

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                      📌 [Blue Pin]                      │
│                    ┌──────────────┐                     │
│                    │              │                     │
│                    │    Thank     │                     │
│                    │    You!      │                     │
│                    │              │                     │
│                    └──────────────┘                     │
│                                                         │
│ ─────────────────────────────────────────────────────── │
│ PRESIDENCY UNIVERSITY | School of CSE                   │
└─────────────────────────────────────────────────────────┘
```
