// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title PetChain
 * @notice Smart contract for pet registration, adoption management, vaccination records, and ownership history tracking.
 * @dev Decentralized Pet Adoption & Ownership Management System.
 */
contract PetChain {
    address public admin;
    uint256 public petCount;

    enum RequestStatus { Pending, Approved, Rejected }

    struct Pet {
        uint256 petId;
        string name;
        string breed;
        uint256 age;
        string imageUri;
        string description;
        address owner;
        bool isAdopted;
        uint256 registrationTime;
    }

    struct AdoptionRequest {
        uint256 requestId;
        uint256 petId;
        address applicant;
        string applicantNotes;
        uint256 timestamp;
        RequestStatus status;
    }

    struct OwnershipRecord {
        address previousOwner;
        address newOwner;
        uint256 timestamp;
        string reason;
    }

    struct VaccinationRecord {
        string vaccineName;
        uint256 dateAdministered;
        string veterinarian;
        uint256 timestamp;
    }

    // Storage Mappings
    mapping(uint256 => Pet) public pets;
    mapping(uint256 => AdoptionRequest[]) private petAdoptionRequests;
    mapping(uint256 => OwnershipRecord[]) private petOwnershipHistory;
    mapping(uint256 => VaccinationRecord[]) private petVaccinationHistory;
    mapping(uint256 => mapping(address => bool)) public hasActiveRequest;

    // Events
    event PetRegistered(
        uint256 indexed petId,
        string name,
        string breed,
        uint256 age,
        address indexed owner,
        uint256 timestamp
    );

    event AdoptionRequested(
        uint256 indexed petId,
        uint256 indexed requestId,
        address indexed applicant,
        uint256 timestamp
    );

    event AdoptionApproved(
        uint256 indexed petId,
        uint256 indexed requestId,
        address indexed newOwner,
        uint256 timestamp
    );

    event AdoptionRejected(
        uint256 indexed petId,
        uint256 indexed requestId,
        address indexed applicant,
        uint256 timestamp
    );

    event OwnershipTransferred(
        uint256 indexed petId,
        address indexed previousOwner,
        address indexed newOwner,
        string reason,
        uint256 timestamp
    );

    event VaccinationAdded(
        uint256 indexed petId,
        string vaccineName,
        uint256 dateAdministered,
        string veterinarian,
        uint256 timestamp
    );

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "PetChain: Caller is not the authorized shelter admin");
        _;
    }

    modifier petExists(uint256 _petId) {
        require(_petId > 0 && _petId <= petCount, "PetChain: Pet ID does not exist");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /**
     * @notice Registers a new pet in the PetChain system.
     * @dev Restricted to shelter admin. Initial owner is shelter admin.
     */
    function registerPet(
        string memory _name,
        string memory _breed,
        uint256 _age,
        string memory _imageUri,
        string memory _description
    ) external onlyAdmin returns (uint256) {
        require(bytes(_name).length > 0, "PetChain: Pet name cannot be empty");
        require(bytes(_breed).length > 0, "PetChain: Pet breed cannot be empty");

        petCount++;
        uint256 newPetId = petCount;

        pets[newPetId] = Pet({
            petId: newPetId,
            name: _name,
            breed: _breed,
            age: _age,
            imageUri: _imageUri,
            description: _description,
            owner: admin,
            isAdopted: false,
            registrationTime: block.timestamp
        });

        // Record initial ownership record
        petOwnershipHistory[newPetId].push(OwnershipRecord({
            previousOwner: address(0),
            newOwner: admin,
            timestamp: block.timestamp,
            reason: "Initial Shelter Registration"
        }));

        emit PetRegistered(newPetId, _name, _breed, _age, admin, block.timestamp);
        emit OwnershipTransferred(newPetId, address(0), admin, "Initial Shelter Registration", block.timestamp);

        return newPetId;
    }

    /**
     * @notice Submit an adoption request for an available pet.
     */
    function requestAdoption(uint256 _petId, string memory _applicantNotes) external petExists(_petId) {
        Pet storage pet = pets[_petId];
        require(!pet.isAdopted, "PetChain: Pet is already adopted");
        require(msg.sender != pet.owner, "PetChain: Current owner cannot request adoption");
        require(!hasActiveRequest[_petId][msg.sender], "PetChain: Adoption request already submitted for this pet");

        uint256 reqId = petAdoptionRequests[_petId].length + 1;

        petAdoptionRequests[_petId].push(AdoptionRequest({
            requestId: reqId,
            petId: _petId,
            applicant: msg.sender,
            applicantNotes: _applicantNotes,
            timestamp: block.timestamp,
            status: RequestStatus.Pending
        }));

        hasActiveRequest[_petId][msg.sender] = true;

        emit AdoptionRequested(_petId, reqId, msg.sender, block.timestamp);
    }

    /**
     * @notice Admin approves a pending adoption request, transferring ownership.
     */
    function approveAdoption(uint256 _petId, uint256 _requestIndex) external onlyAdmin petExists(_petId) {
        require(_requestIndex < petAdoptionRequests[_petId].length, "PetChain: Invalid request index");
        
        Pet storage pet = pets[_petId];
        require(!pet.isAdopted, "PetChain: Pet has already been adopted");

        AdoptionRequest storage request = petAdoptionRequests[_petId][_requestIndex];
        require(request.status == RequestStatus.Pending, "PetChain: Request is not pending");

        address previousOwner = pet.owner;
        address newOwner = request.applicant;

        // Update pet status & owner
        pet.owner = newOwner;
        pet.isAdopted = true;
        request.status = RequestStatus.Approved;
        hasActiveRequest[_petId][newOwner] = false;

        // Append ownership record
        petOwnershipHistory[_petId].push(OwnershipRecord({
            previousOwner: previousOwner,
            newOwner: newOwner,
            timestamp: block.timestamp,
            reason: "Adoption Approved by Shelter"
        }));

        // Reject all other pending requests for this pet
        for (uint256 i = 0; i < petAdoptionRequests[_petId].length; i++) {
            if (i != _requestIndex && petAdoptionRequests[_petId][i].status == RequestStatus.Pending) {
                petAdoptionRequests[_petId][i].status = RequestStatus.Rejected;
                hasActiveRequest[_petId][petAdoptionRequests[_petId][i].applicant] = false;
                emit AdoptionRejected(_petId, petAdoptionRequests[_petId][i].requestId, petAdoptionRequests[_petId][i].applicant, block.timestamp);
            }
        }

        emit AdoptionApproved(_petId, request.requestId, newOwner, block.timestamp);
        emit OwnershipTransferred(_petId, previousOwner, newOwner, "Adoption Approved by Shelter", block.timestamp);
    }

    /**
     * @notice Admin rejects a pending adoption request.
     */
    function rejectAdoption(uint256 _petId, uint256 _requestIndex) external onlyAdmin petExists(_petId) {
        require(_requestIndex < petAdoptionRequests[_petId].length, "PetChain: Invalid request index");
        
        AdoptionRequest storage request = petAdoptionRequests[_petId][_requestIndex];
        require(request.status == RequestStatus.Pending, "PetChain: Request is not pending");

        request.status = RequestStatus.Rejected;
        hasActiveRequest[_petId][request.applicant] = false;

        emit AdoptionRejected(_petId, request.requestId, request.applicant, block.timestamp);
    }

    /**
     * @notice Admin logs a new vaccination record for a pet.
     */
    function addVaccinationRecord(
        uint256 _petId,
        string memory _vaccineName,
        uint256 _dateAdministered,
        string memory _veterinarian
    ) external onlyAdmin petExists(_petId) {
        require(bytes(_vaccineName).length > 0, "PetChain: Vaccine name required");
        require(bytes(_veterinarian).length > 0, "PetChain: Veterinarian name required");

        petVaccinationHistory[_petId].push(VaccinationRecord({
            vaccineName: _vaccineName,
            dateAdministered: _dateAdministered,
            veterinarian: _veterinarian,
            timestamp: block.timestamp
        }));

        emit VaccinationAdded(_petId, _vaccineName, _dateAdministered, _veterinarian, block.timestamp);
    }

    /**
     * @notice Transfer ownership directly (e.g., rehoming between owners or administrative adjustment).
     */
    function transferOwnershipDirect(uint256 _petId, address _newOwner, string memory _reason) external petExists(_petId) {
        Pet storage pet = pets[_petId];
        require(msg.sender == pet.owner || msg.sender == admin, "PetChain: Only owner or admin can transfer ownership");
        require(_newOwner != address(0), "PetChain: Invalid new owner address");
        require(_newOwner != pet.owner, "PetChain: New owner must be different from current owner");

        address previousOwner = pet.owner;
        pet.owner = _newOwner;
        pet.isAdopted = true;

        petOwnershipHistory[_petId].push(OwnershipRecord({
            previousOwner: previousOwner,
            newOwner: _newOwner,
            timestamp: block.timestamp,
            reason: bytes(_reason).length > 0 ? _reason : "Direct Ownership Transfer"
        }));

        emit OwnershipTransferred(_petId, previousOwner, _newOwner, _reason, block.timestamp);
    }

    // View Functions

    function getAllPets() external view returns (Pet[] memory) {
        Pet[] memory allPets = new Pet[](petCount);
        for (uint256 i = 1; i <= petCount; i++) {
            allPets[i - 1] = pets[i];
        }
        return allPets;
    }

    function getPetDetails(uint256 _petId) external view petExists(_petId) returns (Pet memory) {
        return pets[_petId];
    }

    function getAdoptionRequests(uint256 _petId) external view petExists(_petId) returns (AdoptionRequest[] memory) {
        return petAdoptionRequests[_petId];
    }

    function getOwnershipHistory(uint256 _petId) external view petExists(_petId) returns (OwnershipRecord[] memory) {
        return petOwnershipHistory[_petId];
    }

    function getVaccinationHistory(uint256 _petId) external view petExists(_petId) returns (VaccinationRecord[] memory) {
        return petVaccinationHistory[_petId];
    }

    function getDashboardStats() external view returns (
        uint256 totalPets,
        uint256 availablePets,
        uint256 adoptedPets,
        uint256 totalRequests
    ) {
        totalPets = petCount;
        uint256 available = 0;
        uint256 adopted = 0;
        uint256 reqs = 0;

        for (uint256 i = 1; i <= petCount; i++) {
            if (pets[i].isAdopted) {
                adopted++;
            } else {
                available++;
            }
            reqs += petAdoptionRequests[i].length;
        }

        return (totalPets, available, adopted, reqs);
    }
}
