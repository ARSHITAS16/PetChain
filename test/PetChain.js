const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PetChain Smart Contract Tests", function () {
  let PetChain;
  let petChain;
  let admin, adopter1, adopter2, stranger;

  beforeEach(async function () {
    [admin, adopter1, adopter2, stranger] = await ethers.getSigners();
    PetChain = await ethers.getContractFactory("PetChain");
    petChain = await PetChain.deploy();
    await petChain.waitForDeployment();
  });

  describe("Deployment & Authorization", function () {
    it("Should assign the deployer as shelter admin", async function () {
      expect(await petChain.admin()).to.equal(admin.address);
    });

    it("Should start with 0 registered pets", async function () {
      expect(await petChain.petCount()).to.equal(0);
    });
  });

  describe("Pet Registration", function () {
    it("Should allow shelter admin to register a pet and emit event", async function () {
      const tx = await petChain.registerPet(
        "Buddy",
        "Golden Retriever",
        2,
        "https://images.unsplash.com/photo-1552053831-71594a27632d",
        "Friendly and playful golden retriever looking for a loving home."
      );

      await expect(tx)
        .to.emit(petChain, "PetRegistered")
        .withArgs(1, "Buddy", "Golden Retriever", 2, admin.address, (await ethers.provider.getBlock("latest")).timestamp);

      expect(await petChain.petCount()).to.equal(1);

      const pet = await petChain.pets(1);
      expect(pet.name).to.equal("Buddy");
      expect(pet.breed).to.equal("Golden Retriever");
      expect(pet.age).to.equal(2);
      expect(pet.owner).to.equal(admin.address);
      expect(pet.isAdopted).to.equal(false);
    });

    it("Should prevent non-admin from registering a pet", async function () {
      await expect(
        petChain.connect(stranger).registerPet(
          "Max",
          "German Shepherd",
          3,
          "https://example.com/max.jpg",
          "Unauthorized registration"
        )
      ).to.be.revertedWith("PetChain: Caller is not the authorized shelter admin");
    });
  });

  describe("Pet Retrieval & Dashboard Stats", function () {
    beforeEach(async function () {
      await petChain.registerPet("Buddy", "Golden Retriever", 2, "", "Desc 1");
      await petChain.registerPet("Luna", "Siamese Cat", 1, "", "Desc 2");
    });

    it("Should retrieve all registered pets", async function () {
      const allPets = await petChain.getAllPets();
      expect(allPets.length).to.equal(2);
      expect(allPets[0].name).to.equal("Buddy");
      expect(allPets[1].name).to.equal("Luna");
    });

    it("Should retrieve accurate dashboard statistics", async function () {
      const stats = await petChain.getDashboardStats();
      expect(stats.totalPets).to.equal(2);
      expect(stats.availablePets).to.equal(2);
      expect(stats.adoptedPets).to.equal(0);
      expect(stats.totalRequests).to.equal(0);
    });
  });

  describe("Adoption Request Workflow", function () {
    beforeEach(async function () {
      await petChain.registerPet("Buddy", "Golden Retriever", 2, "", "Desc 1");
    });

    it("Should allow a user to submit an adoption request", async function () {
      const tx = await petChain.connect(adopter1).requestAdoption(1, "We have a large fenced backyard.");

      await expect(tx)
        .to.emit(petChain, "AdoptionRequested")
        .withArgs(1, 1, adopter1.address, (await ethers.provider.getBlock("latest")).timestamp);

      const requests = await petChain.getAdoptionRequests(1);
      expect(requests.length).to.equal(1);
      expect(requests[0].applicant).to.equal(adopter1.address);
      expect(requests[0].applicantNotes).to.equal("We have a large fenced backyard.");
      expect(requests[0].status).to.equal(0); // Pending
    });

    it("Should prevent duplicate requests by the same applicant", async function () {
      await petChain.connect(adopter1).requestAdoption(1, "First attempt");

      await expect(
        petChain.connect(adopter1).requestAdoption(1, "Second attempt")
      ).to.be.revertedWith("PetChain: Adoption request already submitted for this pet");
    });

    it("Should prevent current owner from requesting adoption", async function () {
      await expect(
        petChain.connect(admin).requestAdoption(1, "Self adoption")
      ).to.be.revertedWith("PetChain: Current owner cannot request adoption");
    });
  });

  describe("Admin Approval & Rejection", function () {
    beforeEach(async function () {
      await petChain.registerPet("Buddy", "Golden Retriever", 2, "", "Desc 1");
      await petChain.connect(adopter1).requestAdoption(1, "Adopter 1 notes");
      await petChain.connect(adopter2).requestAdoption(1, "Adopter 2 notes");
    });

    it("Should allow admin to approve adoption and update ownership", async function () {
      const tx = await petChain.connect(admin).approveAdoption(1, 0); // Approve adopter1

      await expect(tx)
        .to.emit(petChain, "AdoptionApproved")
        .withArgs(1, 1, adopter1.address, (await ethers.provider.getBlock("latest")).timestamp);

      await expect(tx)
        .to.emit(petChain, "OwnershipTransferred")
        .withArgs(1, admin.address, adopter1.address, "Adoption Approved by Shelter", (await ethers.provider.getBlock("latest")).timestamp);

      const pet = await petChain.pets(1);
      expect(pet.owner).to.equal(adopter1.address);
      expect(pet.isAdopted).to.equal(true);

      const requests = await petChain.getAdoptionRequests(1);
      expect(requests[0].status).to.equal(1); // Approved
      expect(requests[1].status).to.equal(2); // Auto-Rejected
    });

    it("Should prevent non-admin from approving adoption requests", async function () {
      await expect(
        petChain.connect(stranger).approveAdoption(1, 0)
      ).to.be.revertedWith("PetChain: Caller is not the authorized shelter admin");
    });

    it("Should allow admin to reject adoption request", async function () {
      await petChain.connect(admin).rejectAdoption(1, 0);

      const requests = await petChain.getAdoptionRequests(1);
      expect(requests[0].status).to.equal(2); // Rejected
    });

    it("Should prevent adoption request for already adopted pet", async function () {
      await petChain.connect(admin).approveAdoption(1, 0); // Adopted by adopter1

      await expect(
        petChain.connect(stranger).requestAdoption(1, "Late attempt")
      ).to.be.revertedWith("PetChain: Pet is already adopted");
    });
  });

  describe("Ownership History & Vaccination Records", function () {
    beforeEach(async function () {
      await petChain.registerPet("Buddy", "Golden Retriever", 2, "", "Desc 1");
    });

    it("Should log initial registration in ownership history", async function () {
      const history = await petChain.getOwnershipHistory(1);
      expect(history.length).to.equal(1);
      expect(history[0].previousOwner).to.equal(ethers.ZeroAddress);
      expect(history[0].newOwner).to.equal(admin.address);
      expect(history[0].reason).to.equal("Initial Shelter Registration");
    });

    it("Should log ownership transfers accurately in order", async function () {
      await petChain.connect(adopter1).requestAdoption(1, "Notes");
      await petChain.connect(admin).approveAdoption(1, 0);

      const history = await petChain.getOwnershipHistory(1);
      expect(history.length).to.equal(2);
      expect(history[1].previousOwner).to.equal(admin.address);
      expect(history[1].newOwner).to.equal(adopter1.address);
      expect(history[1].reason).to.equal("Adoption Approved by Shelter");
    });

    it("Should allow admin to add vaccination records", async function () {
      const timestamp = Math.floor(Date.now() / 1000);
      const tx = await petChain.connect(admin).addVaccinationRecord(
        1,
        "Rabies Vaccine",
        timestamp,
        "Dr. Smith, City Pet Care"
      );

      await expect(tx)
        .to.emit(petChain, "VaccinationAdded")
        .withArgs(1, "Rabies Vaccine", timestamp, "Dr. Smith, City Pet Care", (await ethers.provider.getBlock("latest")).timestamp);

      const vaxHistory = await petChain.getVaccinationHistory(1);
      expect(vaxHistory.length).to.equal(1);
      expect(vaxHistory[0].vaccineName).to.equal("Rabies Vaccine");
      expect(vaxHistory[0].veterinarian).to.equal("Dr. Smith, City Pet Care");
    });

    it("Should prevent non-admin from adding vaccination records", async function () {
      await expect(
        petChain.connect(stranger).addVaccinationRecord(1, "DHPP", 1234567, "Fake Vet")
      ).to.be.revertedWith("PetChain: Caller is not the authorized shelter admin");
    });
  });
});
