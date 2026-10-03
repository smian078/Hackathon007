import {
  DocumentRecord,
  DonationRecord,
  Organization,
  AuditEvent,
  VerificationResult,
  BlockchainTransaction,
} from '../types';

export const api = {
  // Organizations
  async getOrganizations(): Promise<Organization[]> {
    try {
      const res = await fetch('/api/organizations');
      const data = await res.json();
      return data.data || [];
    } catch {
      return [];
    }
  },

  // Documents
  async getDocuments(params?: {
    holderEmail?: string;
    issuerOrgId?: string;
    type?: string;
    search?: string;
  }): Promise<DocumentRecord[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.holderEmail) searchParams.append('holderEmail', params.holderEmail);
      if (params?.issuerOrgId) searchParams.append('issuerOrgId', params.issuerOrgId);
      if (params?.type) searchParams.append('type', params.type);
      if (params?.search) searchParams.append('search', params.search);

      const res = await fetch(`/api/documents?${searchParams.toString()}`);
      const data = await res.json();
      return data.data || [];
    } catch {
      return [];
    }
  },

  async getDocumentById(id: string): Promise<{ document: DocumentRecord; audit: AuditEvent[] } | null> {
    try {
      const res = await fetch(`/api/documents/${id}`);
      const data = await res.json();
      if (!data.success) return null;
      return { document: data.data, audit: data.audit || [] };
    } catch {
      return null;
    }
  },

  async issueDocument(payload: {
    title: string;
    type: string;
    holderName: string;
    holderEmail: string;
    recipientId?: string;
    certificateNumber?: string;
    issuerOrgId: string;
    description?: string;
    customFields?: Record<string, string>;
    fileData?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    customHash?: string;
  }): Promise<{ document: DocumentRecord; blockchain: { txHash: string; blockNumber: number } }> {
    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to issue document');
    return { document: data.data, blockchain: data.blockchain };
  },

  async createNewVersion(
    id: string,
    payload: {
      changeReason: string;
      customHash?: string;
      fileData?: string;
      updatedTitle?: string;
      customFields?: Record<string, string>;
    }
  ): Promise<{ document: DocumentRecord; blockchain: { txHash: string; blockNumber: number } }> {
    const res = await fetch(`/api/documents/${id}/versions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to create new version');
    return { document: data.data, blockchain: data.blockchain };
  },

  async revokeDocument(
    id: string,
    reason: string
  ): Promise<{ document: DocumentRecord; blockchain: { txHash: string; blockNumber: number } }> {
    const res = await fetch(`/api/documents/${id}/revoke`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to revoke document');
    return { document: data.data, blockchain: data.blockchain };
  },

  // Verification & Tamper Detection
  async verifyById(id: string): Promise<VerificationResult> {
    const res = await fetch(`/api/verify/${id}`);
    const data = await res.json();
    return data.result;
  },

  async verifyByUpload(payload: {
    documentId: string;
    fileData?: string;
    fileName?: string;
    simulatedTamper?: boolean;
  }): Promise<VerificationResult> {
    const res = await fetch('/api/verify/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Integrity check failed');
    return data.result;
  },

  // Donations
  async getDonations(): Promise<DonationRecord[]> {
    try {
      const res = await fetch('/api/donations');
      const data = await res.json();
      return data.data || [];
    } catch {
      return [];
    }
  },

  async getDonationById(id: string): Promise<DonationRecord | null> {
    try {
      const res = await fetch(`/api/donations/${id}`);
      const data = await res.json();
      return data.data || null;
    } catch {
      return null;
    }
  },

  async createDonation(payload: {
    donorName: string;
    donorEmail: string;
    recipientOrgId: string;
    campaignTitle: string;
    totalAmount: number;
    currency?: string;
  }): Promise<DonationRecord> {
    const res = await fetch('/api/donations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to create donation');
    return data.data;
  },

  async addDonationEvidence(
    id: string,
    payload: {
      category: string;
      amount: number;
      description: string;
      fileName: string;
      vendorOrRecipient: string;
    }
  ): Promise<DonationRecord> {
    const res = await fetch(`/api/donations/${id}/evidence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to add evidence');
    return data.data;
  },

  // Audit
  async getAuditTrail(documentId?: string): Promise<AuditEvent[]> {
    try {
      const url = documentId ? `/api/documents/${documentId}/audit` : '/api/audit';
      const res = await fetch(url);
      const data = await res.json();
      return data.data || [];
    } catch {
      return [];
    }
  },

  // Blockchain
  async getTransaction(txHash: string): Promise<BlockchainTransaction | null> {
    try {
      const res = await fetch(`/api/blockchain/${txHash}`);
      const data = await res.json();
      return data.data || null;
    } catch {
      return null;
    }
  },

  async getBlockchainStats() {
    try {
      const res = await fetch('/api/blockchain/stats');
      const data = await res.json();
      return data.data;
    } catch {
      return null;
    }
  },

  // AI & Grounding
  async getForensicAudit(documentId: string, customFields?: any) {
    const res = await fetch('/api/ai/forensic-audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId, documentData: customFields }),
    });
    return res.json();
  },

  async getGroundingSearch(orgName: string, domain?: string) {
    const res = await fetch('/api/ai/grounding-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orgName, domain }),
    });
    return res.json();
  },

  async getQuickSummary(docData: {
    documentId: string;
    title: string;
    holderName: string;
    issuerName: string;
    status: string;
    hash: string;
  }) {
    const res = await fetch('/api/ai/quick-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(docData),
    });
    return res.json();
  },
};
