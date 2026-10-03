// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

/**
 * @title DonationRegistry
 * @notice Immutable tracking of charitable donations, fund allocations, and evidence records
 */
contract DonationRegistry {
    struct Evidence {
        string evidenceId;
        string fileName;
        bytes32 documentHash;
        string vendorOrRecipient;
        uint256 amount;
        uint256 timestamp;
        bytes32 txProof;
    }

    struct Allocation {
        string allocationId;
        string category; // e.g., Books, Furniture, Transport
        uint256 allocatedAmount;
        string description;
        string[] evidenceIds;
    }

    struct Donation {
        string donationId;
        address donorAddress;
        string donorName;
        address recipientOrg;
        string campaignTitle;
        uint256 totalAmount;
        uint256 allocatedAmount;
        uint256 timestamp;
        bool isCompleted;
    }

    mapping(string => Donation) private donations;
    mapping(string => Allocation[]) private donationAllocations;
    mapping(string => Evidence) private evidenceRecords;

    event DonationCreated(string indexed donationId, address indexed donor, uint256 amount, string campaign);
    event DonationAllocationRecorded(string indexed donationId, string category, uint256 amount);
    event EvidenceAdded(string indexed donationId, string evidenceId, bytes32 documentHash, uint256 amount);

    function createDonation(
        string calldata donationId,
        string calldata donorName,
        address recipientOrg,
        string calldata campaignTitle,
        uint256 totalAmount
    ) external {
        require(donations[donationId].totalAmount == 0, "Donation exists");
        donations[donationId] = Donation({
            donationId: donationId,
            donorAddress: msg.sender,
            donorName: donorName,
            recipientOrg: recipientOrg,
            campaignTitle: campaignTitle,
            totalAmount: totalAmount,
            allocatedAmount: 0,
            timestamp: block.timestamp,
            isCompleted: false
        });

        emit DonationCreated(donationId, msg.sender, totalAmount, campaignTitle);
    }

    function recordAllocation(
        string calldata donationId,
        string calldata allocationId,
        string calldata category,
        uint256 amount,
        string calldata description
    ) external {
        Donation storage don = donations[donationId];
        require(don.totalAmount > 0, "Donation not found");
        require(don.allocatedAmount + amount <= don.totalAmount, "Exceeds total donation amount");

        don.allocatedAmount += amount;
        if (don.allocatedAmount == don.totalAmount) {
            don.isCompleted = true;
        }

        string[] memory emptyIds;
        donationAllocations[donationId].push(Allocation({
            allocationId: allocationId,
            category: category,
            allocatedAmount: amount,
            description: description,
            evidenceIds: emptyIds
        }));

        emit DonationAllocationRecorded(donationId, category, amount);
    }

    function addEvidence(
        string calldata donationId,
        uint256 allocationIndex,
        string calldata evidenceId,
        string calldata fileName,
        bytes32 documentHash,
        string calldata vendorOrRecipient,
        uint256 amount
    ) external {
        require(donations[donationId].totalAmount > 0, "Donation not found");
        require(allocationIndex < donationAllocations[donationId].length, "Invalid allocation index");

        evidenceRecords[evidenceId] = Evidence({
            evidenceId: evidenceId,
            fileName: fileName,
            documentHash: documentHash,
            vendorOrRecipient: vendorOrRecipient,
            amount: amount,
            timestamp: block.timestamp,
            txProof: blockhash(block.number - 1)
        });

        donationAllocations[donationId][allocationIndex].evidenceIds.push(evidenceId);

        emit EvidenceAdded(donationId, evidenceId, documentHash, amount);
    }

    function getDonation(string calldata donationId) external view returns (Donation memory) {
        return donations[donationId];
    }

    function getAllocations(string calldata donationId) external view returns (Allocation[] memory) {
        return donationAllocations[donationId];
    }

    function getEvidence(string calldata evidenceId) external view returns (Evidence memory) {
        return evidenceRecords[evidenceId];
    }
}
