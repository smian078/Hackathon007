import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  QrCode,
  Search,
  Building2,
  Calendar,
  Layers,
  Blocks,
  KeyRound,
  Fingerprint,
  FileCheck,
  ExternalLink,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VerificationResult, DocumentRecord } from '../types';
import { api } from '../services/api';
import { TamperDetector } from '../components/TamperDetector';
import { ProofGraph } from '../components/ProofGraph';
import { WhyTrustedModal } from '../components/WhyTrustedModal';
import { GeminiAIAuditModal } from '../components/GeminiAIAuditModal';

export const PublicVerifyPage: React.FC = () => {
  const { selectedDocId, documents, navigateTo, themeMode } = useApp();
  const [lookupId, setLookupId] = useState<string>(selectedDocId || (documents[0]?.documentId || ''));
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showWhyTrusted, setShowWhyTrusted] = useState<boolean>(false);
  const [showAiModal, setShowAiModal] = useState<boolean>(false);

  const isLight = themeMode === 'light';
  const isOled = themeMode === 'oled';

  useEffect(() => {
    if (selectedDocId) {
      setLookupId(selectedDocId);
      performVerification(selectedDocId);
    } else if (documents.length > 0) {
      setLookupId(documents[0].documentId);
      performVerification(documents[0].documentId);
    }
  }, [selectedDocId, documents]);

  const performVerification = async (docIdToVerify: string) => {
    try {
      setLoading(true);
      const res = await api.verifyById(docIdToVerify.trim());
      setVerificationResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lookupId.trim()) {
      performVerification(lookupId.trim());
    }
  };

  const doc = verificationResult?.document;
  const isAuthentic = verificationResult?.status === 'AUTHENTIC';
  const isTampered = verificationResult?.status === 'TAMPERED';
  const isRevoked = verificationResult?.status === 'REVOKED';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      {/* Top Banner & Lookup Input */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">
              PROOFPASS // PUBLIC VERIFICATION ENGINE
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5 tracking-tight">
              Decentralized Document Verification
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 font-light">
              Zero login required. Verify credentials directly against the immutable blockchain anchor.
            </p>
          </div>

          <button
            onClick={() => setShowWhyTrusted(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>Why is this trusted?</span>
          </button>
        </div>

        {/* Verification ID Search Form */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Enter Document ID (e.g. DOC-..., CERT-...)..."
              value={lookupId}
              onChange={e => setLookupId(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono outline-none border transition-all ${
                isLight
                  ? 'bg-white text-slate-900 border-slate-300 placeholder-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                  : 'bg-slate-950/80 text-white border-white/10 placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
              }`}
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            Verify
          </button>
        </form>

        {/* Quick Sample Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
          <span className="text-[11px] font-mono text-slate-500">Sample Records:</span>
          <button
            type="button"
            onClick={() => {
              setLookupId('TC-UNI-2026-00128');
              performVerification('TC-UNI-2026-00128');
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 font-mono text-[11px] border border-white/10 cursor-pointer"
          >
            B.Tech Degree (Valid)
          </button>
          <button
            type="button"
            onClick={() => {
              setLookupId('TC-XYZ-2026-00452');
              performVerification('TC-XYZ-2026-00452');
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-[11px] border border-white/10 cursor-pointer"
          >
            XYZ Internship (v2)
          </button>
          <button
            type="button"
            onClick={() => {
              setLookupId('TC-UNI-2026-00094');
              performVerification('TC-UNI-2026-00094');
            }}
            className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-mono text-[11px] cursor-pointer border border-rose-500/30"
          >
            Cybersecurity (Revoked)
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-800">
            Querying ProofPass Decentralized Ledger...
          </p>
          <p className="text-xs text-slate-400">
            Evaluating digital signature, hash consistency, and revocation registry
          </p>
        </div>
      ) : !verificationResult || verificationResult.status === 'NOT_FOUND' ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <XCircle className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-lg font-bold text-slate-800">Document Not Found</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No record found for Document ID &ldquo;{lookupId}&rdquo;. Please verify the QR code or identifier.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* VERY LARGE VISUAL STATUS CARD from Section 14 */}
          <div
            className={`rounded-2xl p-6 sm:p-8 border-2 shadow-lg transition-all ${
              isAuthentic
                ? 'bg-emerald-500 text-white border-emerald-400'
                : isRevoked
                ? 'bg-rose-600 text-white border-rose-500'
                : 'bg-amber-500 text-white border-amber-400'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                  {isAuthentic ? (
                    <ShieldCheck className="w-10 h-10 text-white" />
                  ) : isRevoked ? (
                    <ShieldAlert className="w-10 h-10 text-white" />
                  ) : (
                    <AlertTriangle className="w-10 h-10 text-white" />
                  )}
                </div>

                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-white/80">
                    PUBLIC VERIFICATION STATUS
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black tracking-tight mt-0.5">
                    {isAuthentic
                      ? 'AUTHENTIC DOCUMENT'
                      : isRevoked
                      ? 'CREDENTIAL REVOKED'
                      : 'TAMPERING DETECTED'}
                  </h2>
                  <p className="text-sm font-medium text-white/90 mt-1 max-w-xl">
                    {verificationResult.message}
                  </p>
                </div>
              </div>

              {/* Version & Date Pills */}
              <div className="sm:text-right space-y-1 font-mono text-xs text-white/90 shrink-0">
                <p>
                  <strong>Version:</strong> {verificationResult.version?.versionNumber || 1}
                </p>
                <p>
                  <strong>Issued:</strong>{' '}
                  {doc ? new Date(doc.issuedAt).toLocaleDateString() : 'N/A'}
                </p>
                {doc && (
                  <button
                    onClick={() => setShowAiModal(true)}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-sans text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Forensic Check</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Verification Checklist & Document Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Checklist from Section 14 */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Verification Checklist
                </h3>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  Automated ZK-Audit
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                  <span className="text-xs font-medium text-slate-300">Issuer recognized</span>
                  {verificationResult.checklist.issuerRecognized ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Valid
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-rose-400">
                      <XCircle className="w-4 h-4" /> Unverified
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                  <span className="text-xs font-medium text-slate-300">
                    Digital signature valid
                  </span>
                  {verificationResult.checklist.digitalSignatureValid ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Signed by Issuer
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-rose-400">
                      <XCircle className="w-4 h-4" /> Invalid
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                  <span className="text-xs font-medium text-slate-300">
                    Blockchain proof found
                  </span>
                  {verificationResult.checklist.blockchainProofFound ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Anchored
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-rose-400">
                      <XCircle className="w-4 h-4" /> Not on-chain
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                  <span className="text-xs font-medium text-slate-300">Document hash matches</span>
                  {verificationResult.checklist.documentHashMatches ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Exact 100% Match
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-rose-400">
                      <XCircle className="w-4 h-4" /> Mismatch / Tampered
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                  <span className="text-xs font-medium text-slate-300">Version verified</span>
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> Current
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-white/5">
                  <span className="text-xs font-medium text-slate-300">Credential not revoked</span>
                  {verificationResult.checklist.notRevoked ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> Active & Valid
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-rose-400">
                      <XCircle className="w-4 h-4" /> Revoked on Ledger
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Document Context Card */}
            {doc && (
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Official Record Metadata
                  </h3>
                  <button
                    onClick={() => navigateTo('document-detail', { docId: doc.documentId })}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Certificate</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Qualification / Title
                    </span>
                    <p className="text-base font-bold text-slate-900 mt-0.5">{doc.title}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Holder Name
                      </span>
                      <p className="font-semibold text-slate-800 text-sm mt-0.5">
                        {doc.holderName}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Recipient ID
                      </span>
                      <p className="font-mono text-slate-700 mt-0.5">{doc.recipientId}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Issuing Authority
                      </span>
                      <p className="font-semibold text-slate-800 mt-0.5">{doc.issuerName}</p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Certificate Number
                      </span>
                      <p className="font-mono text-slate-700 mt-0.5">{doc.certificateNumber}</p>
                    </div>
                  </div>

                  {/* Blockchain proof details */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-mono text-[11px] space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Blockchain Tx:</span>
                      <span className="text-blue-600 font-semibold truncate max-w-[200px]">
                        {doc.blockchainTx}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">SHA-256 Hash:</span>
                      <span className="text-slate-700 truncate max-w-[200px]">
                        {doc.documentHash}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tamper Detection Upload Dropzone from Section 15 */}
          {doc && (
            <TamperDetector
              document={doc}
              onResult={res => {
                setVerificationResult(res);
              }}
            />
          )}

          {/* Proof Graph Component */}
          {doc && <ProofGraph mode="certificate" document={doc} />}
        </div>
      )}

      {/* Why is this trusted modal */}
      <WhyTrustedModal isOpen={showWhyTrusted} onClose={() => setShowWhyTrusted(false)} />

      {/* AI Forensic Inspector */}
      {doc && (
        <GeminiAIAuditModal
          document={doc}
          isOpen={showAiModal}
          onClose={() => setShowAiModal(false)}
        />
      )}
    </div>
  );
};
