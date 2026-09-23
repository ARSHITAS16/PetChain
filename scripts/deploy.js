const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("==================================================");
  console.log("Deploying PetChain Smart Contract to Local Network");
  console.log("==================================================");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer / Shelter Admin Address:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer Account Balance:", ethers.formatEther(balance), "ETH");

  // Deploy PetChain
  const PetChain = await ethers.getContractFactory("PetChain");
  const petChain = await PetChain.deploy();
  await petChain.waitForDeployment();

  const contractAddress = await petChain.getAddress();
  console.log("\n>>> PetChain Contract Successfully Deployed! <<<");
  console.log("Contract Address:", contractAddress);

  // Prepare directories for artifacts
  const frontendContractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");
  if (!fs.existsSync(frontendContractsDir)) {
    fs.mkdirSync(frontendContractsDir, { recursive: true });
  }

  // Export Contract Address JSON
  const addressPayload = {
    PetChain: contractAddress,
    network: "localhost",
    chainId: 31337,
    adminAddress: deployer.address,
    deployedAt: new Date().toISOString()
  };

  fs.writeFileSync(
    path.join(frontendContractsDir, "contract-address.json"),
    JSON.stringify(addressPayload, null, 2)
  );
  console.log("Exported contract address to frontend/src/contracts/contract-address.json");

  // Export Contract Artifact & ABI
  const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", "PetChain.sol", "PetChain.json");
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    fs.writeFileSync(
      path.join(frontendContractsDir, "PetChain.json"),
      JSON.stringify(artifact, null, 2)
    );
    console.log("Exported contract ABI artifact to frontend/src/contracts/PetChain.json");
  } else {
    console.warn("Artifact not found at expected path. Ensure 'npx hardhat compile' was executed.");
  }

  console.log("==================================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed with error:", error);
    process.exit(1);
  });
