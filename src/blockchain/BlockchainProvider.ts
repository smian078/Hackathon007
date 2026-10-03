import type { BlockchainTransaction } from '../types/index.ts';
import { generateTxHash } from './crypto.ts';

export interface BlockchainProof {
  documentId: string;
  documentHash: string;
  issuerAddress: string;
  version: number;
  status: 'VALID' | 'SUPERSEDED' | 'REVOKED';
  signature: string;
  txHash: string;
  blockNumber: number;
  timestamp: string;
  revocationReason?: string;
  revokedAt?: string;
}

export interface BlockchainStats {
  totalBlocks: number;
  totalTransactions: number;
  activeProofs: number;
  revokedProofs: number;
  networkName: string;
  consensus: string;
}

export interface BlockchainProvider {
  registerProof(
    documentId: string,
    documentHash: string,
    issuerAddress: string,
    version: number,
    signature: string
  ): Promise<{ txHash: string; blockNumber: number }>;

  getProof(documentId: string, version?: number): Promise<BlockchainProof | null>;

  revokeProof(
    documentId: string,
    reason: string,
    issuerAddress: string
  ): Promise<{ txHash: string; blockNumber: number }>;

  getTransaction(txHash: string): Promise<BlockchainTransaction | null>;

  verifyProof(
    documentId: string,
    documentHash: string
  ): Promise<{
    isValid: boolean;
    status: 'VALID' | 'TAMPERED' | 'REVOKED' | 'NOT_FOUND';
    proof?: BlockchainProof;
    message: string;
  }>;

  getStats(): Promise<BlockchainStats>;
}

export class LocalBlockchainProvider implements BlockchainProvider {
  private proofs: Map<string, Map<number, BlockchainProof>> = new Map();
  private transactions: Map<string, BlockchainTransaction> = new Map();
  private latestBlockNumber: number = 18452300;
  private networkName: string = 'ProofPass Local Substrate (EVM Simulated)';

  constructor() {
    this.seedInitialChain();
  }

  private seedInitialChain() {
    // Generate initial block height
    this.latestBlockNumber = 18452310;
  }

  async registerProof(
    documentId: string,
    documentHash: string,
    issuerAddress: string,
    version: number,
    signature: string
  ): Promise<{ txHash: string; blockNumber: number }> {
    this.latestBlockNumber += 1;
    const txHash = generateTxHash();
    const timestamp = new Date().toISOString();

    const proof: BlockchainProof = {
      documentId,
      documentHash,
      issuerAddress,
      version,
      status: 'VALID',
      signature,
      txHash,
      blockNumber: this.latestBlockNumber,
      timestamp,
    };

    if (!this.proofs.has(documentId)) {
      this.proofs.set(documentId, new Map());
    }

    // If previous version existed, mark previous as SUPERSEDED
    if (version > 1) {
      const prev = this.proofs.get(documentId)?.get(version - 1);
      if (prev && prev.status === 'VALID') {
        prev.status = 'SUPERSEDED';
      }
    }

    this.proofs.get(documentId)!.set(version, proof);

    // Save transaction receipt
    const tx: BlockchainTransaction = {
      txHash,
      blockNumber: this.latestBlockNumber,
      timestamp,
      from: issuerAddress,
      to: '0x000000000000000000000000000000000000BEEF', // ProofPass CredentialRegistry contract address
      action: version === 1 ? 'issueCredential' : 'createVersion',
      documentId,
      payloadHash: documentHash,
      gasUsed: 42180,
      status: 'CONFIRMED',
    };

    this.transactions.set(txHash, tx);

    return { txHash, blockNumber: this.latestBlockNumber };
  }

  async getProof(documentId: string, version?: number): Promise<BlockchainProof | null> {
    const docVersions = this.proofs.get(documentId);
    if (!docVersions || docVersions.size === 0) return null;

    if (version !== undefined) {
      return docVersions.get(version) || null;
    }

    // Get highest version (current)
    let highest = 1;
    for (const v of docVersions.keys()) {
      if (v > highest) highest = v;
    }
    return docVersions.get(highest) || null;
  }

  async revokeProof(
    documentId: string,
    reason: string,
    issuerAddress: string
  ): Promise<{ txHash: string; blockNumber: number }> {
    const docVersions = this.proofs.get(documentId);
    if (!docVersions) {
      throw new Error(`Credential ${documentId} not found on blockchain`);
    }

    this.latestBlockNumber += 1;
    const txHash = generateTxHash();
    const timestamp = new Date().toISOString();

    for (const proof of docVersions.values()) {
      proof.status = 'REVOKED';
      proof.revocationReason = reason;
      proof.revokedAt = timestamp;
    }

    const tx: BlockchainTransaction = {
      txHash,
      blockNumber: this.latestBlockNumber,
      timestamp,
      from: issuerAddress,
      to: '0x000000000000000000000000000000000000BEEF',
      action: 'revokeCredential',
      documentId,
      payloadHash: reason,
      gasUsed: 28410,
      status: 'CONFIRMED',
    };

    this.transactions.set(txHash, tx);
    return { txHash, blockNumber: this.latestBlockNumber };
  }

  async getTransaction(txHash: string): Promise<BlockchainTransaction | null> {
    return this.transactions.get(txHash) || null;
  }

  async verifyProof(
    documentId: string,
    documentHash: string
  ): Promise<{
    isValid: boolean;
    status: 'VALID' | 'TAMPERED' | 'REVOKED' | 'NOT_FOUND';
    proof?: BlockchainProof;
    message: string;
  }> {
    const proof = await this.getProof(documentId);
    if (!proof) {
      return {
        isValid: false,
        status: 'NOT_FOUND',
        message: 'No cryptographic proof found for this Document ID on the blockchain ledger.',
      };
    }

    if (proof.status === 'REVOKED') {
      return {
        isValid: false,
        status: 'REVOKED',
        proof,
        message: `This credential was officially revoked by the issuing authority on ${new Date(
          proof.revokedAt || proof.timestamp
        ).toLocaleDateString()}. Reason: ${proof.revocationReason || 'Revoked by authority'}`,
      };
    }

    const normalizedDocHash = documentHash.toLowerCase();
    const normalizedProofHash = proof.documentHash.toLowerCase();

    if (normalizedDocHash !== normalizedProofHash) {
      return {
        isValid: false,
        status: 'TAMPERED',
        proof,
        message:
          'Tampering detected! The SHA-256 fingerprint of the document does not match the immutable cryptographic record anchored on the blockchain.',
      };
    }

    return {
      isValid: true,
      status: 'VALID',
      proof,
      message: 'Cryptographic proof validated against blockchain ledger. Fingerprint matches original issuance.',
    };
  }

  async getStats(): Promise<BlockchainStats> {
    let active = 0;
    let revoked = 0;
    for (const docVersions of this.proofs.values()) {
      for (const proof of docVersions.values()) {
        if (proof.status === 'REVOKED') revoked++;
        else if (proof.status === 'VALID') active++;
      }
    }

    return {
      totalBlocks: this.latestBlockNumber,
      totalTransactions: this.transactions.size,
      activeProofs: active,
      revokedProofs: revoked,
      networkName: this.networkName,
      consensus: 'Proof of Authority (PoA / EVM)',
    };
  }
}

// Singleton blockchain provider instance
export const localBlockchain = new LocalBlockchainProvider();
