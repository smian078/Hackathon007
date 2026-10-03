import React, { useState } from 'react';
import {
  Building2,
  FileText,
  Fingerprint,
  Blocks,
  User,
  HeartHandshake,
  Target,
  Layers,
  FileCheck,
  CheckCircle2,
  Info,
  ExternalLink,
} from 'lucide-react';
import { DocumentRecord, DonationRecord } from '../types';

interface ProofGraphProps {
  mode: 'certificate' | 'donation';
  document?: DocumentRecord;
  donation?: DonationRecord;
}

interface GraphNode {
  id: string;
  label: string;
  category: string;
  icon: React.FC<{ className?: string }>;
  details: Record<string, string>;
  status?: string;
}

export const ProofGraph: React.FC<ProofGraphProps> = ({ mode, document, donation }) => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // Generate nodes for certificate
  const certNodes: GraphNode[] = document
    ? [
        {
          id: 'issuer',
          label: document.issuerName,
          category: 'Verified Issuer',
          icon: Building2,
          details: {
            'Institution': document.issuerName,
            'Wallet Address': document.issuerAddress,
            'Public Key': 'PUBKEY_ED25519_VALIDATED',
            'Status': 'Authorized Academic/Corporate Issuer',
          },
        },
        {
          id: 'credential',
          label: document.title,
          category: 'Digital Credential',
          icon: FileText,
          details: {
            'Document ID': document.documentId,
            'Recipient': document.holderName,
            'Type': document.type,
            'Certificate #': document.certificateNumber,
            'Current Version': `Version ${document.currentVersion}`,
            'Issuance Date': new Date(document.issuedAt).toLocaleDateString(),
          },
        },
        {
          id: 'hash',
          label: `${document.documentHash.slice(0, 10)}...${document.documentHash.slice(-6)}`,
          category: 'SHA-256 Fingerprint',
          icon: Fingerprint,
          details: {
            'Algorithm': 'SHA-256 (FIPS 180-4 Standard)',
            'Full Hash': document.documentHash,
            'Digital Signature': document.issuerSignature,
            'Tamper Protection': 'Zero collision probability',
          },
        },
        {
          id: 'blockchain',
          label: `${document.blockchainTx.slice(0, 8)}...`,
          category: 'Blockchain Transaction',
          icon: Blocks,
          details: {
            'Transaction Hash': document.blockchainTx,
            'Ledger': 'ProofPass EVM Smart Contract',
            'Smart Contract': 'CredentialRegistry.sol',
            'Block Height': '#18452311',
            'Gas Confirmed': '42,180 units',
          },
        },
      ]
    : [];

  // Generate nodes for donation
  const donationNodes: GraphNode[] = donation
    ? [
        {
          id: 'donor',
          label: donation.donorName,
          category: 'Verified Donor',
          icon: User,
          details: {
            'Donor': donation.donorName,
            'Email': donation.donorEmail,
            'Contribution': `₹${donation.totalAmount.toLocaleString()} ${donation.currency}`,
            'Status': 'Recorded on Ledger',
          },
        },
        {
          id: 'donation-record',
          label: donation.donationId,
          category: 'Donation Record',
          icon: HeartHandshake,
          details: {
            'Donation ID': donation.donationId,
            'Timestamp': new Date(donation.timestamp).toLocaleDateString(),
            'Tx Proof': donation.blockchainTx,
          },
        },
        {
          id: 'campaign',
          label: donation.campaignTitle,
          category: 'Target Campaign',
          icon: Target,
          details: {
            'Campaign Title': donation.campaignTitle,
            'Recipient Org': donation.recipientOrg,
            'Total Allocated': `₹${donation.allocatedAmount.toLocaleString()} of ₹${donation.totalAmount.toLocaleString()}`,
          },
        },
        {
          id: 'allocations',
          label: `${donation.allocations.length} Expense Allocations`,
          category: 'Fund Allocations',
          icon: Layers,
          details: {
            'Allocations Count': `${donation.allocations.length} categories`,
            'Breakdown': donation.allocations
              .map(a => `${a.category}: ₹${a.amount.toLocaleString()}`)
              .join(', '),
          },
        },
        {
          id: 'evidence',
          label: 'Invoices & Receipts',
          category: 'Verifiable Evidence',
          icon: FileCheck,
          details: {
            'Invoice 1': 'National Book House (₹6,000)',
            'Purchase Order': 'OakWood Furnishings (₹2,500)',
            'Freight Receipt': 'Swift Logistics (₹1,500)',
            'Evidence Status': 'All 3 receipts cryptographic hashes verified',
          },
        },
        {
          id: 'blockchain-don',
          label: 'Proof Anchored',
          category: 'Blockchain Proof',
          icon: Blocks,
          details: {
            'Contract': 'DonationRegistry.sol',
            'Tx Hash': donation.blockchainTx,
            'Transparency Level': '100% Traceable to source invoices',
          },
        },
      ]
    : [];

  const nodes = mode === 'certificate' ? certNodes : donationNodes;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Cryptographic Proof Graph</span>
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Interactive Relationship DAG
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            Click on any node in the chain to inspect verifiable metadata
          </p>
        </div>
      </div>

      {/* Nodes Linear / Tree Flow */}
      <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50/70 border border-slate-200/60 overflow-x-auto">
        {nodes.map((node, index) => {
          const Icon = node.icon;
          const isSelected = selectedNode?.id === node.id;

          return (
            <React.Fragment key={node.id}>
              <button
                onClick={() => setSelectedNode(node)}
                className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all cursor-pointer min-w-[130px] flex-1 ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 ring-2 ring-blue-300'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400 hover:bg-blue-50/40'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-blue-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider mb-0.5 ${
                    isSelected ? 'text-blue-100' : 'text-slate-400'
                  }`}
                >
                  {node.category}
                </span>
                <span className="text-xs font-bold truncate max-w-[120px]">{node.label}</span>
              </button>

              {index < nodes.length - 1 && (
                <div className="hidden lg:flex items-center text-slate-300 font-bold shrink-0">
                  <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="mt-4 p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between pb-2 border-b border-blue-200/50 mb-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Node Inspector: {selectedNode.category}
              </span>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-xs text-blue-700 hover:underline"
            >
              Dismiss
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(selectedNode.details).map(([key, value]) => (
              <div key={key} className="bg-white/90 p-2.5 rounded-lg border border-blue-100 text-xs">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                  {key}
                </span>
                <span className="font-mono text-slate-800 font-medium break-all">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
