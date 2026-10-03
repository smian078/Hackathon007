// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

import "./IssuerRegistry.sol";

/**
 * @title CredentialRegistry
 * @notice Anchors cryptographic proofs, versions, and revocation states on-chain.
 * NOTE: Full PDFs and sensitive PII are NEVER stored on-chain.
 */
contract CredentialRegistry {
    enum Status { VALID, SUPERSEDED, REVOKED }

    struct VersionProof {
        uint256 versionNumber;
        bytes32 documentHash; // SHA-256 fingerprint
        bytes issuerSignature;
        string changeReason;
        uint256 timestamp;
        bytes32 transactionHash;
    }

    struct Credential {
        string documentId;
        string credentialType;
        address issuerAddress;
        address holderAddress;
        Status status;
        uint256 currentVersion;
        string revocationReason;
        uint256 revokedAt;
        uint256 createdAt;
    }

    IssuerRegistry public issuerRegistry;

    // documentId => Credential
    mapping(string => Credential) private credentials;
    // documentId => versionNumber => VersionProof
    mapping(string => mapping(uint256 => VersionProof)) private versionHistory;
    // documentHash => documentId
    mapping(bytes32 => string) public hashToDocumentId;

    string[] private allDocumentIds;

    event CredentialIssued(
        string indexed documentId,
        bytes32 indexed documentHash,
        address indexed issuer,
        uint256 version,
        uint256 timestamp
    );

    event CredentialVersionCreated(
        string indexed documentId,
        bytes32 indexed newDocumentHash,
        uint256 version,
        string changeReason,
        uint256 timestamp
    );

    event CredentialRevoked(
        string indexed documentId,
        address indexed issuer,
        string reason,
        uint256 timestamp
    );

    modifier onlyAuthorizedIssuer() {
        require(issuerRegistry.isIssuer(msg.sender), "Not an approved issuer");
        _;
    }

    constructor(address _issuerRegistryAddress) {
        issuerRegistry = IssuerRegistry(_issuerRegistryAddress);
    }

    function issueCredential(
        string calldata documentId,
        string calldata credentialType,
        address holderAddress,
        bytes32 documentHash,
        bytes calldata issuerSignature
    ) external onlyAuthorizedIssuer {
        require(credentials[documentId].createdAt == 0, "Document ID already registered");
        require(documentHash != bytes32(0), "Invalid document hash");

        credentials[documentId] = Credential({
            documentId: documentId,
            credentialType: credentialType,
            issuerAddress: msg.sender,
            holderAddress: holderAddress,
            status: Status.VALID,
            currentVersion: 1,
            revocationReason: "",
            revokedAt: 0,
            createdAt: block.timestamp
        });

        versionHistory[documentId][1] = VersionProof({
            versionNumber: 1,
            documentHash: documentHash,
            issuerSignature: issuerSignature,
            changeReason: "Initial issuance",
            timestamp: block.timestamp,
            transactionHash: blockhash(block.number - 1)
        });

        hashToDocumentId[documentHash] = documentId;
        allDocumentIds.push(documentId);

        emit CredentialIssued(documentId, documentHash, msg.sender, 1, block.timestamp);
    }

    function createVersion(
        string calldata documentId,
        bytes32 newDocumentHash,
        bytes calldata issuerSignature,
        string calldata changeReason
    ) external onlyAuthorizedIssuer {
        Credential storage cred = credentials[documentId];
        require(cred.createdAt != 0, "Document not found");
        require(cred.issuerAddress == msg.sender, "Only original issuer can update version");
        require(cred.status == Status.VALID, "Cannot update non-valid credential");

        uint256 newVersion = cred.currentVersion + 1;
        cred.currentVersion = newVersion;

        versionHistory[documentId][newVersion] = VersionProof({
            versionNumber: newVersion,
            documentHash: newDocumentHash,
            issuerSignature: issuerSignature,
            changeReason: changeReason,
            timestamp: block.timestamp,
            transactionHash: blockhash(block.number - 1)
        });

        hashToDocumentId[newDocumentHash] = documentId;

        emit CredentialVersionCreated(documentId, newDocumentHash, newVersion, changeReason, block.timestamp);
    }

    function revokeCredential(string calldata documentId, string calldata reason) external onlyAuthorizedIssuer {
        Credential storage cred = credentials[documentId];
        require(cred.createdAt != 0, "Document not found");
        require(cred.issuerAddress == msg.sender, "Only issuer can revoke");
        require(cred.status != Status.REVOKED, "Already revoked");

        cred.status = Status.REVOKED;
        cred.revocationReason = reason;
        cred.revokedAt = block.timestamp;

        emit CredentialRevoked(documentId, msg.sender, reason, block.timestamp);
    }

    function getCredential(string calldata documentId) external view returns (Credential memory, VersionProof memory) {
        Credential memory cred = credentials[documentId];
        require(cred.createdAt != 0, "Credential not found");
        VersionProof memory currentProof = versionHistory[documentId][cred.currentVersion];
        return (cred, currentProof);
    }

    function getVersionProof(string calldata documentId, uint256 versionNumber) external view returns (VersionProof memory) {
        require(versionHistory[documentId][versionNumber].timestamp != 0, "Version not found");
        return versionHistory[documentId][versionNumber];
    }
}
