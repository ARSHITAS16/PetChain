const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("==================================================");
  console.log("Seeding PetChain Demonstration Data On-Chain");
  console.log("==================================================");

  const [admin, adopter1, adopter2] = await ethers.getSigners();

  // Read contract address
  const addressPath = path.join(__dirname, "..", "frontend", "src", "contracts", "contract-address.json");
  if (!fs.existsSync(addressPath)) {
    throw new Error("contract-address.json not found! Please run 'npx hardhat run scripts/deploy.js --network localhost' first.");
  }
  const { PetChain: contractAddress } = JSON.parse(fs.readFileSync(addressPath, "utf8"));

  const petChain = await ethers.getContractAt("PetChain", contractAddress);
  console.log("Connected to deployed PetChain contract at:", contractAddress);

  const samplePets = [
    {
      name: "Buddy",
      breed: "Golden Retriever",
      age: 2,
      imageUri: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600",
      description: "Friendly, intelligent, and energetic Golden Retriever. Loves playing fetch, water activities, and family companionship."
    },
    {
      name: "Luna",
      breed: "Siamese Cat",
      age: 1,
      imageUri: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600",
      description: "Gentle and affectionate Siamese cat with striking blue eyes. Perfect indoor companion, loves warm sun spots and quiet lap time."
    },
    {
      name: "Max",
      breed: "German Shepherd",
      age: 3,
      imageUri: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&q=80&w=600",
      description: "Loyal, highly trained German Shepherd. Excellent guard dog, great agility skills, responds well to obedience commands."
    },
    {
      name: "Rocky",
      breed: "Beagle",
      age: 4,
      imageUri: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=600",
      description: "Curious and cheerful Beagle with a keen sense of scent. Friendly with children and other pets, loves outdoor scent trails."
    }
  ];

  console.log("\n1. Registering Demonstration Pets...");
  for (const pet of samplePets) {
    const tx = await petChain.connect(admin).registerPet(
      pet.name,
      pet.breed,
      pet.age,
      pet.imageUri,
      pet.description
    );
    await tx.wait();
    console.log(` -> Registered ${pet.name} (${pet.breed})`);
  }

  console.log("\n2. Logging Verification & Vaccination Records...");
  const timestampNow = Math.floor(Date.now() / 1000);
  
  // Pet 1 (Buddy) Vaccinations
  await (await petChain.connect(admin).addVaccinationRecord(1, "Rabies Virus Vaccine", timestampNow - 86400 * 90, "Dr. Sarah Jenkins (City Pet Care)")).wait();
  await (await petChain.connect(admin).addVaccinationRecord(1, "DHPP Combination", timestampNow - 86400 * 60, "Dr. Sarah Jenkins (City Pet Care)")).wait();
  console.log(" -> Added 2 vaccination records for Buddy");

  // Pet 2 (Luna) Vaccinations
  await (await petChain.connect(admin).addVaccinationRecord(2, "FVRCP Core Vaccine", timestampNow - 86400 * 45, "Dr. Michael Chang (Pawsitive Vet Clinic)")).wait();
  console.log(" -> Added vaccination record for Luna");

  // Pet 3 (Max) Vaccinations
  await (await petChain.connect(admin).addVaccinationRecord(3, "Bordetella Kennel Cough", timestampNow - 86400 * 30, "Dr. Sarah Jenkins (City Pet Care)")).wait();
  console.log(" -> Added vaccination record for Max");

  console.log("\n3. Submitting Sample Adoption Requests...");
  // Adopter 1 requests Buddy (Pet 1)
  await (await petChain.connect(adopter1).requestAdoption(1, "We live in a quiet suburban home with a spacious fenced backyard and 2 kids.")).wait();
  console.log(` -> Adopter 1 (${adopter1.address.substring(0,6)}...) submitted adoption request for Buddy`);

  // Adopter 2 requests Buddy (Pet 1)
  await (await petChain.connect(adopter2).requestAdoption(1, "Work from home full-time, experienced dog owner with active outdoor lifestyle.")).wait();
  console.log(` -> Adopter 2 (${adopter2.address.substring(0,6)}...) submitted adoption request for Buddy`);

  // Adopter 1 requests Luna (Pet 2)
  await (await petChain.connect(adopter1).requestAdoption(2, "Looking for a peaceful indoor feline companion.")).wait();
  console.log(` -> Adopter 1 submitted adoption request for Luna`);

  console.log("\n4. Approving Sample Adoption (Buddy -> Adopter 1)...");
  // Admin approves request 0 (Adopter 1) for Buddy (Pet 1)
  await (await petChain.connect(admin).approveAdoption(1, 0)).wait();
  console.log(" -> Approved adoption of Buddy to Adopter 1. Ownership updated & timeline logged!");

  console.log("\n==================================================");
  console.log("PetChain Demonstration Data Successfully Seeded!");
  console.log("==================================================");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seeding failed with error:", err);
    process.exit(1);
  });
