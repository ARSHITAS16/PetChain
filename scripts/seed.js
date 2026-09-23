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
      name: "Rudra",
      breed: "Indie Dog Breed",
      age: 1,
      imageUri: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600",
      description: "Super energetic 1-year-old Indie boy with a handsome bowtie! Extremely smart, quick to learn, loves morning walks and sunny spots."
    },
    {
      name: "Bella",
      breed: "Indie Puppy",
      age: 1,
      imageUri: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600",
      description: "Adorable 6-month-old Indie puppy wearing a polka-dot red bow tie. Inquisitive, playful, great with kids, and loves cozy lap naps."
    },
    {
      name: "Pinky",
      breed: "Indian Pariah Mix",
      age: 1,
      imageUri: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=600",
      description: "A pretty girl with the prettiest smile! Loves outdoor garden playtime, treats, dressing up in cute outfits, and belly rubs."
    },
    {
      name: "Simba",
      breed: "Golden Retriever Pup",
      age: 1,
      imageUri: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600",
      description: "Ultra-cute fluffy Golden puppy with endless energy. Loves playing fetch with tennis balls, water fun, and giving warm puppy cuddles."
    },
    {
      name: "Coco",
      breed: "Pug & Indie Mix",
      age: 2,
      imageUri: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=600",
      description: "Charming little cuddlebug who treats herself like royalty. Perfectly house-trained, calm, and loves family evening snuggles."
    },
    {
      name: "Kavu",
      breed: "Indie Beach Hound",
      age: 2,
      imageUri: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=600",
      description: "Beach-loving Indie boy who adores golden hour sunsets, sandy runs, and playing in water. Loyal and athletic outdoor companion."
    },
    {
      name: "Milo",
      breed: "Indie Puppy",
      age: 1,
      imageUri: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&q=80&w=600",
      description: "Gentle tan Indie puppy with adorable floppy ears and brown eyes. Fully vaccinated, healthy, and eager to find a forever home."
    },
    {
      name: "Luna",
      breed: "Siamese Cat",
      age: 1,
      imageUri: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600",
      description: "Sweet indoor Siamese cat with striking blue eyes. Peaceful lap companion, loves quiet sunbeams."
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
  
  // Rudra Vaccinations
  await (await petChain.connect(admin).addVaccinationRecord(1, "Rabies Virus Vaccine", timestampNow - 86400 * 90, "Dr. Sarah Jenkins (Pawsitive Vet Care)")).wait();
  await (await petChain.connect(admin).addVaccinationRecord(1, "DHPP Combination", timestampNow - 86400 * 60, "Dr. Sarah Jenkins (Pawsitive Vet Care)")).wait();

  // Bella Vaccinations
  await (await petChain.connect(admin).addVaccinationRecord(2, "Puppy Core 7-in-1", timestampNow - 86400 * 30, "Dr. Michael Chang (PetCare Clinic)")).wait();

  // Pinky Vaccinations
  await (await petChain.connect(admin).addVaccinationRecord(3, "Rabies & Anti-Tick", timestampNow - 86400 * 45, "Dr. Sarah Jenkins (Pawsitive Vet Care)")).wait();

  // Simba Vaccinations
  await (await petChain.connect(admin).addVaccinationRecord(4, "DHPP Booster", timestampNow - 86400 * 20, "Dr. Michael Chang (PetCare Clinic)")).wait();

  console.log(" -> Added vaccination records for Rudra, Bella, Pinky, and Simba");

  console.log("\n3. Submitting Sample Adoption Requests...");
  // Adopter 1 requests Rudra (Pet 1)
  await (await petChain.connect(adopter1).requestAdoption(1, "We live in a quiet suburban home with a spacious fenced backyard and 2 kids.")).wait();

  // Adopter 2 requests Rudra (Pet 1)
  await (await petChain.connect(adopter2).requestAdoption(1, "Work from home full-time, experienced dog owner with active outdoor lifestyle.")).wait();

  // Adopter 1 requests Pinky (Pet 3)
  await (await petChain.connect(adopter1).requestAdoption(3, "Looking for a cute Indie pup to spoil with love and treats.")).wait();

  console.log("\n4. Approving Sample Adoption (Rudra -> Adopter 1)...");
  // Admin approves request 0 (Adopter 1) for Rudra (Pet 1)
  await (await petChain.connect(admin).approveAdoption(1, 0)).wait();
  console.log(" -> Approved adoption of Rudra to Adopter 1. Ownership updated & timeline logged!");

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
