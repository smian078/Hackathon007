import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  GitBranch,
  History,
  AlertTriangle,
  Download,
  Share2,
  Trash2,
  Sparkles,
  StickyNote,
  Blocks,
  Fingerprint,
  Building2,
  Calendar,
  Layers,
  AlertOctagon,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DocumentRecord, DocumentVersion, AuditEvent } from '../types';
import { api } from '../services/api';
import { CertificateRenderer } from '../components/CertificateRenderer';
import { ProofGraph } from '../components/ProofGraph';
import { GeminiAIAuditModal } from '../components/GeminiAIAuditModal';
import { GoogleKeepExportModal } from '../components/GoogleKeepExportModal';

export const DocumentDetail: React.FC = () => {
  const { selectedDocId, documents, navigateTo, currentUser, addNotification, refreshData } =
    useApp();
  const [doc, setDoc] = useState<DocumentRecord | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>([]);
  const [selectedVersionNum, setSelectedVersionNum] = useState<number>(1);
  const [showRevokeModal, setShowRevokeModal] = useState<boolean>(false);
  const [revokeReason, setRevokeReason] = useState<string>('Disciplinary action');
  const [isRevoking, setIsRevoking] = useState<boolean>(false);
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [showKeepModal, setShowKeepModal] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedDocId) return;
    const found = documents.find(d => d.documentId === selectedDocId);
    if (found) {
      setDoc(found);
      setSelectedVersionNum(found.currentVersion);
    }

    api.getDocumentById(selectedDocId).then(res => {
      if (res?.document) {
        setDoc(res.document);
        setSelectedVersionNum(res.document.currentVersion);
        setAuditLogs(res.audit);
      }
    });
  }, [selectedDocId, documents]);

  if (!doc) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center space-y-4">
        <p className="text-sm font-semibold text-slate-700">Document record not found.</p>
        <button
          onClick={() => navigateTo('my-documents')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
        >
          Return to Wallet
        </button>
      </div>
    );
  }

  const selectedVersion =
    doc.versions.find(v => v.versionNumber === selectedVersionNum) || doc.versions[0];
  const isRevoked = doc.status === 'REVOKED';

  const handleRevoke = async () => {
    try {
      setIsRevoking(true);
      await api.revokeDocument(doc.documentId, revokeReason);
      addNotification('Credential Revoked', `Document ${doc.documentId} has been officially revoked on blockchain`, 'error');
      setShowRevokeModal(false);
      await refreshData();
    } catch (err: any) {
      addNotification('Revocation Failed', err.message, 'error');
    } finally {
      setIsRevoking(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/verify/${doc.documentId}`;
    navigator.clipboard.writeText(url);
    addNotification('Link Copied', 'Public verification link copied to clipboard', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Back and Action Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <button
          onClick={() => navigateTo('my-documents')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Documents</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* AI Forensic Inspector */}
          <button
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Forensic Audit</span>
          </button>

          {/* Export to Google Keep */}
          <button
            onClick={() => setShowKeepModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-200 transition-colors"
          >
            <StickyNote className="w-3.5 h-3.5 text-amber-600" />
            <span>Save to Keep</span>
          </button>

          {/* Public Verification Link */}
          <button
            onClick={() => navigateTo('verify', { docId: doc.documentId })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verify Live</span>
          </button>

          {/* Revoke Credential Action (for Issuers/Admins) */}
          {!isRevoked && (currentUser.role === 'ISSUER' || currentUser.role === 'ADMIN') && (
            <button
              onClick={() => setShowRevokeModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Revoke Credential</span>
            </button>
          )}
        </div>
      </div>

      {/* Revocation Warning Alert if Revoked */}
      {isRevoked && (
        <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-400 flex items-start gap-3">
          <AlertOctagon className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-200 text-rose-900">
              OFFICIALLY REVOKED
            </span>
            <h3 className="text-sm font-bold text-rose-950">
              Originally issued on {new Date(doc.issuedAt).toLocaleDateString()} and revoked on{' '}
              {new Date(doc.revokedAt || doc.issuedAt).toLocaleDateString()} by {doc.issuerName}.
            </h3>
            <p className="text-xs text-rose-800">
              <strong>Official Reason: </strong>
              {doc.revocationReason || 'Withdrawn by issuing authority.'}
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Certificate Paper on Left, Cryptographic Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Certificate Rendering (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <CertificateRenderer
            document={doc}
            version={selectedVersion}
            onShare={handleShare}
            onVerify={() => navigateTo('verify', { docId: doc.documentId })}
          />

          {/* Interactive Proof Graph */}
          <ProofGraph mode="certificate" document={doc} />
        </div>

        {/* Cryptographic Inspector & Version Timeline (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Version History from Section 16 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-blue-600" />
                  <span>Version History</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Immutable records: previous versions remain verifiable
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {doc.versions.length} Version{doc.versions.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Visual Version Timeline: V1 -> V2 Current */}
            <div className="space-y-3">
              {doc.versions.map(v => {
                const isSelected = selectedVersionNum === v.versionNumber;
                const isCurrent = v.versionNumber === doc.currentVersion;

                return (
                  <button
                    key={v.versionNumber}
                    onClick={() => setSelectedVersionNum(v.versionNumber)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">
                          Version {v.versionNumber}
                        </span>
                        {isCurrent ? (
                          <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                            Current
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                            Superseded
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(v.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mb-2 leading-relaxed font-medium">
                      {v.changeReason}
                    </p>

                    <div className="pt-2 border-t border-slate-200/60 font-mono text-[10px] text-slate-500 space-y-0.5">
                      <div className="flex justify-between">
                        <span>Fingerprint:</span>
                        <span className="text-slate-800 font-semibold truncate max-w-[170px]">
                          {v.documentHash}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tx Proof:</span>
                        <span className="text-blue-600 font-semibold truncate max-w-[170px]">
                          {v.blockchainTx}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chronological Audit Trail from Section 18 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <History className="w-4 h-4 text-blue-600" />
                  <span>Document Audit Trail</span>
                </h3>
                <p className="text-[11px] text-slate-500">Chronological lifecycle logs</p>
              </div>
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {auditLogs.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No audit events recorded</p>
              ) : (
                auditLogs.map(log => (
                  <div key={log.id} className="relative pl-5 border-l-2 border-slate-200 space-y-1">
                    <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-blue-600 ring-4 ring-white" />
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-900">{log.action}</span>
                      <span className="text-slate-400 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-snug">{log.details}</p>
                    <p className="text-[10px] text-slate-400">
                      By: <strong className="text-slate-700">{log.actor}</strong> ({log.actorRole})
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Revocation Confirmation Dialog from Section 17 */}
      {showRevokeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Revoke this credential?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Revoking a document permanently flags it as REVOKED on the blockchain ledger. Once
                revoked, verifiers will see a critical tampering/revocation warning.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Reason for Revocation</label>
              <select
                value={revokeReason}
                onChange={e => setRevokeReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white outline-none focus:border-rose-500"
              >
                <option value="Fraudulent prerequisite submission">Fraudulent</option>
                <option value="Issued in administrative error">Issued in error</option>
                <option value="Credential withdrawn by institution">Credential withdrawn</option>
                <option value="Replaced by subsequent degree">Replaced</option>
                <option value="Disciplinary academic misconduct">Other / Disciplinary</option>
              </select>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setShowRevokeModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleRevoke}
                disabled={isRevoking}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow-md shadow-rose-500/20"
              >
                {isRevoking ? 'Anchoring Revocation...' : 'Confirm Revocation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Forensic Inspector Modal */}
      <GeminiAIAuditModal
        document={doc}
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
      />

      {/* Google Keep Export Modal */}
      <GoogleKeepExportModal
        document={doc}
        isOpen={showKeepModal}
        onClose={() => setShowKeepModal(false)}
      />
    </div>
  );
};
