import React, { useState } from 'react';
import {
  Building2,
  FilePlus2,
  Award,
  AlertTriangle,
  History,
  CheckCircle2,
  ShieldAlert,
  Search,
  KeyRound,
  Fingerprint,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DocumentRecord } from '../types';

export const IssuerPortal: React.FC = () => {
  const { organizations, documents, navigateTo, currentUser, switchDemoUser } = useApp();
  const [selectedOrgId, setSelectedOrgId] = useState<string>(
    currentUser.organizationId || organizations[0]?.id || 'org-abc-uni'
  );
  const [searchDoc, setSearchDoc] = useState<string>('');

  const currentOrg = organizations.find(o => o.id === selectedOrgId) || organizations[0];
  const orgDocuments = documents.filter(d => d.issuerOrgId === currentOrg?.id);

  const activeCount = orgDocuments.filter(d => d.status === 'VALID').length;
  const revokedCount = orgDocuments.filter(d => d.status === 'REVOKED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Portal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest block">
            Institutional Administration
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2 mt-0.5">
            <Building2 className="w-6 h-6 text-indigo-600" />
            <span>Issuer Portal & Registry Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Issue credentials, sign SHA-256 proofs, create versions, and manage revocations
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Org Switcher for demo */}
          <select
            value={selectedOrgId}
            onChange={e => setSelectedOrgId(e.target.value)}
            className="text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-white shadow-2xs outline-none focus:border-indigo-500"
          >
            {organizations.map(org => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => navigateTo('issue-wizard')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <FilePlus2 className="w-4 h-4" />
            <span>Issue New Credential</span>
          </button>
        </div>
      </div>

      {/* Organization Status & Cryptographic Identity Card */}
      {currentOrg && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1 sm:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                ✓ Accredited Issuer
              </span>
              <span className="text-xs font-medium text-slate-400 font-mono">
                Reg: {currentOrg.registrationNumber}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">{currentOrg.name}</h2>
            <p className="text-xs text-slate-500">
              Domain: <strong className="text-slate-800">{currentOrg.domain}</strong> | Location:{' '}
              <strong className="text-slate-800">{currentOrg.location}</strong>
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 font-mono text-[11px] text-slate-600">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Authorized Blockchain Address
            </span>
            <p className="truncate font-semibold text-slate-900">{currentOrg.walletAddress}</p>
            <span className="text-[10px] uppercase font-bold text-slate-400 block pt-1">
              Public Verification Key
            </span>
            <p className="truncate font-semibold text-indigo-700">{currentOrg.publicKey}</p>
          </div>
        </div>
      )}

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Issued
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">{orgDocuments.length}</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Active / Valid
          </span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{activeCount}</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Revoked
          </span>
          <p className="text-2xl font-black text-rose-600 mt-1">{revokedCount}</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Blockchain Consensus
          </span>
          <p className="text-base font-black text-indigo-600 mt-1.5 truncate">PoA Substrate</p>
        </div>
      </div>

      {/* Issued Documents Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Issued Credentials Registry</h3>
            <p className="text-xs text-slate-500">
              Manage versions, view blockchain tx proofs, and inspect status
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by ID or name..."
              value={searchDoc}
              onChange={e => setSearchDoc(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Document ID</th>
                <th className="py-2.5 px-3">Recipient</th>
                <th className="py-2.5 px-3">Title</th>
                <th className="py-2.5 px-3">Version</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orgDocuments
                .filter(
                  d =>
                    !searchDoc ||
                    d.title.toLowerCase().includes(searchDoc.toLowerCase()) ||
                    d.holderName.toLowerCase().includes(searchDoc.toLowerCase()) ||
                    d.documentId.toLowerCase().includes(searchDoc.toLowerCase())
                )
                .map(d => (
                  <tr key={d.documentId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-slate-600">
                      {d.documentId}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{d.holderName}</td>
                    <td className="py-3 px-3 font-medium text-slate-800 truncate max-w-[200px]">
                      {d.title}
                    </td>
                    <td className="py-3 px-3 font-mono text-blue-600 font-semibold">
                      v{d.currentVersion}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          d.status === 'VALID'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => navigateTo('document-detail', { docId: d.documentId })}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
