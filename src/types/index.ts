export type UserRole = 'ISSUER' | 'HOLDER' | 'VERIFIER' | 'DONOR' | 'ADMIN';

export type CredentialType =
  | 'DegreeCertificate'
  | 'CourseCertificate'
  | 'InternshipCertificate'
  | 'DonationReceipt'
  | 'AwardCertificate'
  | 'License'
  | 'Invoice'
  | 'CustomDocument';

export type CredentialStatus = 'VALID' | 'SUPERSEDED' | 'REVOKED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  organizationId?: string;
  walletAddress?: string;
}

export type UserProfile = User;

export interface Organization {
  id: string;
  name: string;
  type: 'University' | 'NGO' | 'Company' | 'Government' | 'Training Institute';
  domain: string;
  walletAddress: string;
  publicKey: string;
  isApproved: boolean;
  isRevoked: boolean;
  registrationNumber: string;
  location: string;
  logoUrl?: string;
  registeredAt: string;
}

export interface DocumentVersion {
  versionNumber: number;
  documentHash: string; // SHA-256
  issuerSignature: string;
  changeReason: string;
  timestamp: string;
  blockchainTx: string;
  fileName: string;
  fileSize: number;
  previewUrl?: string;
  status: CredentialStatus;
  customData?: Record<string, any>;
}

export interface DocumentRecord {
  documentId: string;
  certificateNumber: string;
  title: string;
  type: CredentialType;
  holderName: string;
  holderEmail: string;
  recipientId: string;
  issuerName: string;
  issuerOrgId: string;
  issuerAddress: string;
  issuerSignature: string;
  issuedAt: string;
  expiresAt?: string;
  status: CredentialStatus;
  currentVersion: number;
  documentHash: string;
  blockchainTx: string;
  verificationUrl: string;
  versions: DocumentVersion[];
  revocationReason?: string;
  revokedAt?: string;
  description?: string;
  customFields?: Record<string, string>;
  isSampleTampered?: boolean;
  fileName?: string;
  fileSize?: number;
  fileData?: string; // Base64 data URL
  mimeType?: string;
}

export interface EvidenceRecord {
  evidenceId: string;
  fileName: string;
  vendorOrRecipient: string;
  amount: number;
  documentHash: string;
  blockchainTx: string;
  timestamp: string;
  description: string;
  verified: boolean;
}

export interface DonationAllocation {
  allocationId: string;
  category: string; // e.g. Books, Furniture, Transport
  amount: number;
  description: string;
  evidence: EvidenceRecord[];
}

export interface DonationRecord {
  donationId: string;
  donorName: string;
  donorEmail: string;
  recipientOrg: string;
  recipientOrgId: string;
  campaignTitle: string;
  totalAmount: number;
  allocatedAmount: number;
  currency: string;
  timestamp: string;
  blockchainTx: string;
  isCompleted: boolean;
  allocations: DonationAllocation[];
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  actorRole: string;
  documentId?: string;
  donationId?: string;
  blockchainTx?: string;
  details: string;
  ipAddress?: string;
}

export interface VerificationChecklist {
  issuerRecognized: boolean;
  digitalSignatureValid: boolean;
  blockchainProofFound: boolean;
  documentHashMatches: boolean;
  versionVerified: boolean;
  notRevoked: boolean;
}

export interface VerificationResult {
  status: 'AUTHENTIC' | 'TAMPERED' | 'REVOKED' | 'SUPERSEDED' | 'NOT_FOUND';
  document?: DocumentRecord;
  version?: DocumentVersion;
  checklist: VerificationChecklist;
  originalHash?: string;
  testedHash?: string;
  message: string;
  detailedExplanation?: string;
  blockchainTx?: string;
  timestamp: string;
}

export interface BlockchainTransaction {
  txHash: string;
  blockNumber: number;
  timestamp: string;
  from: string;
  to: string;
  action: string;
  documentId?: string;
  payloadHash: string;
  gasUsed: number;
  status: 'CONFIRMED' | 'PENDING';
}
