# PetChain: Presentation & Demonstration Workflow

This document provides a 14-step presentation guide aligned with the 9 mandatory project slides.

## Alignment Matrix: Presentation Slides vs Software Features

| Slide # | Slide Title | Software Demonstration Focus |
| :--- | :--- | :--- |
| **SLIDE 1** | Title & Project Overview | Landing Page Hero (`http://localhost:3000`) |
| **SLIDE 2** | Problem & Objectives | Pet Registry & Immutable Ownership Timeline |
| **SLIDE 3** | Proposed System | End-to-End Smart Contract Workflow |
| **SLIDE 4** | Architecture & Tech Stack | Hardhat Node + ethers.js + MetaMask UI |
| **SLIDE 5** | Main Features | Browse Pets, Search Filter, Admin Dashboard |
| **SLIDE 6** | Smart Contract & Blockchain | `PetChain.sol` functions, events & test pass rate |
| **SLIDE 7** | Workflow / Live Demo | Live 14-Step Adoption & Vaccination Demo |
| **SLIDE 8** | Results & Verification | Real Transaction Hashes & Ownership Transfer Event |
| **SLIDE 9** | Conclusion & Future Scope | Academic Summary & Future Roadmap |

---

## 14-Step Live Demonstration Protocol

1. **Step 1 - Node Startup**: Launch local EVM network (`npx hardhat node`).
2. **Step 2 - Contract Deployment**: Deploy contract (`npx hardhat run scripts/deploy.js --network localhost`).
3. **Step 3 - Data Seeding**: Run seed script (`npx hardhat run scripts/seed.js --network localhost`).
4. **Step 4 - Launch dApp**: Open `http://localhost:3000` in browser.
5. **Step 5 - Landing Statistics**: Demonstrate dynamically calculated metrics (Total Pets: 4, Available: 3, Adopted: 1).
6. **Step 6 - Connect Admin Wallet**: Connect MetaMask using Account #0 (Admin). Observe "ADMIN" badge in header.
7. **Step 7 - Register Pet**: Go to Admin Dashboard -> Fill out Pet Form -> Submit transaction. Watch live status modal and capture Real Transaction Hash.
8. **Step 8 - Verify Listing**: Navigate to "Browse Pets". Observe newly registered pet in available pets grid.
9. **Step 9 - Switch to Adopter Wallet**: Switch MetaMask to Account #1.
10. **Step 10 - Submit Adoption Request**: Select an available pet (e.g. Luna) -> Click "Request Adoption" -> Fill applicant notes -> Submit transaction.
11. **Step 11 - Switch to Admin**: Switch MetaMask back to Account #0.
12. **Step 12 - Approve Application**: Open Admin Dashboard -> Locate pending request -> Click "Approve Adoption".
13. **Step 13 - Verify Ownership Transfer**: Open Pet Details page. Verify owner address updated to Account #1 and status updated to "Adopted".
14. **Step 14 - Log Vaccination**: In Pet Details page, fill out Vaccination Form (e.g., Rabies Vaccine) -> Click "Log Vaccination Record On-Chain". Observe new entry appended to medical history.
