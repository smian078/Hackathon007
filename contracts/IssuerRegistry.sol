// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

/**
 * @title IssuerRegistry
 * @notice Manages authorized institutional document issuers in ProofPass
 */
contract IssuerRegistry {
    struct Issuer {
        string name;
        string organizationType; // University, NGO, Enterprise, Government
        string officialDomain;
        address walletAddress;
        bytes publicKey;
        bool isApproved;
        bool isRevoked;
        uint256 registeredAt;
    }

    address public admin;
    mapping(address => Issuer) public issuers;
    address[] public issuerAddresses;

    event IssuerRegistered(address indexed walletAddress, string name, string organizationType, uint256 timestamp);
    event IssuerApproved(address indexed walletAddress, uint256 timestamp);
    event IssuerRevoked(address indexed walletAddress, string reason, uint256 timestamp);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only ProofPass admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function registerIssuer(
        string calldata name,
        string calldata organizationType,
        string calldata officialDomain,
        bytes calldata publicKey
    ) external {
        require(bytes(issuers[msg.sender].name).length == 0, "Already registered");
        issuers[msg.sender] = Issuer({
            name: name,
            organizationType: organizationType,
            officialDomain: officialDomain,
            walletAddress: msg.sender,
            publicKey: publicKey,
            isApproved: false,
            isRevoked: false,
            registeredAt: block.timestamp
        });
        issuerAddresses.push(msg.sender);
        emit IssuerRegistered(msg.sender, name, organizationType, block.timestamp);
    }

    function approveIssuer(address issuerAddress) external onlyAdmin {
        require(!issuers[issuerAddress].isRevoked, "Issuer has been revoked");
        issuers[issuerAddress].isApproved = true;
        emit IssuerApproved(issuerAddress, block.timestamp);
    }

    function revokeIssuer(address issuerAddress, string calldata reason) external onlyAdmin {
        issuers[issuerAddress].isApproved = false;
        issuers[issuerAddress].isRevoked = true;
        emit IssuerRevoked(issuerAddress, reason, block.timestamp);
    }

    function isIssuer(address issuerAddress) external view returns (bool) {
        return issuers[issuerAddress].isApproved && !issuers[issuerAddress].isRevoked;
    }

    function getIssuer(address issuerAddress) external view returns (Issuer memory) {
        return issuers[issuerAddress];
    }
}
