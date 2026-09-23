# PetChain: Smart Contract Specification

## Contract Summary
- **Contract Name**: `PetChain`
- **Compiler Version**: Solidity `0.8.24`
- **License**: MIT
- **Deployer Role**: Shelter Admin

## Data Structures

### `Pet`
```solidity
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
```

### `AdoptionRequest`
```solidity
struct AdoptionRequest {
    uint256 requestId;
    uint256 petId;
    address applicant;
    string applicantNotes;
    uint256 timestamp;
    RequestStatus status; // Pending (0), Approved (1), Rejected (2)
}
```

### `OwnershipRecord`
```solidity
struct OwnershipRecord {
    address previousOwner;
    address newOwner;
    uint256 timestamp;
    string reason;
}
```

### `VaccinationRecord`
```solidity
struct VaccinationRecord {
    string vaccineName;
    uint256 dateAdministered;
    string veterinarian;
    uint256 timestamp;
}
```

## Modifiers
- `onlyAdmin()`: Reverts with `"PetChain: Caller is not the authorized shelter admin"` if `msg.sender != admin`.
- `petExists(uint256 _petId)`: Reverts with `"PetChain: Pet ID does not exist"` if `_petId` is out of bounds.

## Primary External Functions

| Function Signature | Access | Description |
| :--- | :--- | :--- |
| `registerPet(name, breed, age, imageUri, description)` | `onlyAdmin` | Registers a new pet, assigns shelter as owner, logs initial ownership record, and emits `PetRegistered`. |
| `requestAdoption(petId, applicantNotes)` | Public | Allows connected user to apply for an available pet. Reverts if duplicate or pet already adopted. |
| `approveAdoption(petId, requestIndex)` | `onlyAdmin` | Approves applicant, transfers ownership, marks pet adopted, appends ownership record, and auto-rejects other pending requests. |
| `rejectAdoption(petId, requestIndex)` | `onlyAdmin` | Rejects a specific adoption application. |
| `addVaccinationRecord(petId, vaccineName, date, vet)` | `onlyAdmin` | Logs a verified vaccination record for a pet. |
| `getAllPets()` | View | Returns array of all registered `Pet` structs. |
| `getPetDetails(petId)` | View | Returns a single `Pet` struct. |
| `getAdoptionRequests(petId)` | View | Returns all `AdoptionRequest` structs for a pet. |
| `getOwnershipHistory(petId)` | View | Returns chronological `OwnershipRecord` timeline. |
| `getVaccinationHistory(petId)` | View | Returns all `VaccinationRecord` entries. |
| `getDashboardStats()` | View | Calculates total, available, adopted pet counts and request count dynamically. |

## Smart Contract Events
- `PetRegistered`
- `AdoptionRequested`
- `AdoptionApproved`
- `AdoptionRejected`
- `OwnershipTransferred`
- `VaccinationAdded`
