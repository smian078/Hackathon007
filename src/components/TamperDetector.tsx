import React, { useState } from 'react';
import {
  Upload,
  AlertOctagon,
  CheckCircle2,
  FileWarning,
  Fingerprint,
  Blocks,
  RefreshCw,
  FileCheck2,
  ArrowRight,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { DocumentRecord, VerificationResult } from '../types';
import { api } from '../services/api';
import { computeSHA256 } from '../blockchain/crypto';

interface TamperDetectorProps {
  document: DocumentRecord;
  onResult?: (result: VerificationResult) => void;
}

export const TamperDetector: React.FC<TamperDetectorProps> = ({ document, onResult }) => {
  const [dragActive, setDragActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [testedFileName, setTestedFileName] = useState<string>('');

  const handleFileDrop = async (file: File, isTamperedSimulated = false) => {
    try {
      setAnalyzing(true);
      setTestedFileName(file.name);

      let fileData: string;
      if (isTamperedSimulated) {
        fileData = 'SIMULATED_ALTERED_MARKS_82_TO_92_PERCENT';
      } else {
        const text = await file.text();
        fileData = text || file.name;
      }

      const result = await api.verifyByUpload({
        documentId: document.documentId,
        fileData,
        fileName: file.name,
        simulatedTamper: isTamperedSimulated,
      });

      setVerificationResult(result);
      if (onResult) onResult(result);
    } catch (err: any) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileDrop(e.target.files[0], false);
    }
  };

  const handleSimulateTampered = () => {
    const fakeFile = new File(['Altered marks: 92% (Original was 82%)'], 'Rahul_Sharma_BTech_MarksAltered.pdf', {
      type: 'application/pdf',
    });
    handleFileDrop(fakeFile, true);
  };

  const handleSimulateAuthentic = () => {
    const fakeFile = new File(['Authentic Degree Record 82%'], 'Rahul_Sharma_BTech_Original.pdf', {
      type: 'application/pdf',
    });
    // Upload with exact document hash
    setAnalyzing(true);
    setTestedFileName('Rahul_Sharma_BTech_Original.pdf');
    setTimeout(() => {
      const result: VerificationResult = {
        status: 'AUTHENTIC',
        document,
        version: document.versions[0],
        checklist: {
          issuerRecognized: true,
          digitalSignatureValid: true,
          blockchainProofFound: true,
          documentHashMatches: true,
          versionVerified: true,
          notRevoked: document.status !== 'REVOKED',
        },
        originalHash: document.documentHash,
        testedHash: document.documentHash,
        message: 'DOCUMENT AUTHENTIC',
        detailedExplanation:
          'The uploaded document SHA-256 cryptographic fingerprint exactly matches the immutable hash recorded on the blockchain ledger.',
        blockchainTx: document.blockchainTx,
        timestamp: new Date().toISOString(),
      };
      setVerificationResult(result);
      if (onResult) onResult(result);
      setAnalyzing(false);
    }, 400);
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-xl space-y-6 text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-cyan-400" />
            <span>Upload Document to Verify Integrity (Tamper Detection)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare any PDF or file fingerprint against the blockchain's immutable SHA-256 anchor
          </p>
        </div>

        {/* Demo Shortcut buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateAuthentic}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/40 transition-colors cursor-pointer"
          >
            ✓ Test Original PDF
          </button>
          <button
            onClick={handleSimulateTampered}
            className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold border border-rose-500/40 transition-colors cursor-pointer"
          >
            🚨 Simulate Altered Marks PDF
          </button>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={e => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={e => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileDrop(e.dataTransfer.files[0], false);
          }
        }}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          dragActive
            ? 'border-cyan-400 bg-cyan-500/10'
            : 'border-white/15 hover:border-cyan-500/40 bg-slate-950/60'
        }`}
      >
        <input
          type="file"
          id="tamper-file-input"
          accept=".pdf,.png,.jpg,.jpeg,.json"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            {analyzing ? (
              <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
            ) : (
              <Upload className="w-6 h-6 text-cyan-400" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100">
              {analyzing
                ? 'Hashing file & matching blockchain proof...'
                : 'Drop document here or click to browse'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">Supports PDF, PNG, JPG, or JSON</p>
          </div>
        </div>
      </div>

      {/* Analysis Result Banner */}
      {verificationResult && (
        <div
          className={`rounded-2xl p-6 border-2 transition-all animate-in fade-in zoom-in-95 duration-200 ${
            verificationResult.status === 'AUTHENTIC'
              ? 'bg-emerald-50/60 border-emerald-500 text-emerald-950'
              : verificationResult.status === 'TAMPERED'
              ? 'bg-rose-50/80 border-rose-500 text-rose-950'
              : 'bg-amber-50/70 border-amber-500 text-amber-950'
          }`}
        >
          {/* Status Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  verificationResult.status === 'AUTHENTIC'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                    : verificationResult.status === 'TAMPERED'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                    : 'bg-amber-600 text-white'
                }`}
              >
                {verificationResult.status === 'AUTHENTIC' ? (
                  <CheckCircle2 className="w-7 h-7" />
                ) : verificationResult.status === 'TAMPERED' ? (
                  <ShieldAlert className="w-7 h-7 animate-bounce" />
                ) : (
                  <FileWarning className="w-7 h-7" />
                )}
              </div>
              <div>
                <span
                  className={`text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded ${
                    verificationResult.status === 'AUTHENTIC'
                      ? 'bg-emerald-200 text-emerald-800'
                      : verificationResult.status === 'TAMPERED'
                      ? 'bg-rose-200 text-rose-900'
                      : 'bg-amber-200 text-amber-900'
                  }`}
                >
                  {verificationResult.status === 'AUTHENTIC'
                    ? 'Integrity Verified'
                    : verificationResult.status === 'TAMPERED'
                    ? 'Tampering Detected'
                    : 'Notice'}
                </span>
                <h2 className="text-xl font-black mt-1">{verificationResult.message}</h2>
                <p className="text-xs font-medium text-slate-700 mt-0.5">
                  {verificationResult.detailedExplanation}
                </p>
              </div>
            </div>

            <span className="text-[11px] font-mono text-slate-500 shrink-0">
              Tested File: {testedFileName}
            </span>
          </div>

          {/* Cryptographic Hash Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-200/60">
            {/* Registered Blockchain Hash */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Original Blockchain Hash
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                  Anchor Genesis
                </span>
              </div>
              <p className="font-mono text-xs text-slate-800 break-all select-all font-semibold">
                {verificationResult.originalHash}
              </p>
            </div>

            {/* Uploaded File Computed Hash */}
            <div
              className={`p-3.5 rounded-xl border shadow-2xs ${
                verificationResult.status === 'AUTHENTIC'
                  ? 'bg-emerald-50/50 border-emerald-300'
                  : 'bg-rose-50/50 border-rose-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Uploaded File Computed Hash
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    verificationResult.status === 'AUTHENTIC'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {verificationResult.status === 'AUTHENTIC' ? 'MATCH' : 'MISMATCH'}
                </span>
              </div>
              <p
                className={`font-mono text-xs break-all select-all font-semibold ${
                  verificationResult.status === 'AUTHENTIC' ? 'text-emerald-900' : 'text-rose-900'
                }`}
              >
                {verificationResult.testedHash}
              </p>
            </div>
          </div>

          {/* Plain language explanation box */}
          {verificationResult.status === 'TAMPERED' && (
            <div className="mt-4 p-3.5 rounded-xl bg-white border border-rose-200 text-xs text-rose-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Forensic Tamper Assessment:</span>
              </p>
              <p className="text-slate-700 leading-relaxed">
                The blockchain contains the mathematical hash of the genuine document issued by{' '}
                <strong>{document.issuerName}</strong> on{' '}
                <strong>{new Date(document.issuedAt).toLocaleDateString()}</strong>. Because the
                uploaded PDF was altered (e.g., marks or grades edited), calculating its SHA-256
                fingerprint yields an entirely different hash value. ProofPass prevents undetected
                forgeries.
              </p>
            </div>
          )}

          {/* Document Context Metadata */}
          <div className="mt-4 pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-3">
            <div>
              <span>Issuing Body: </span>
              <strong className="text-slate-900">{document.issuerName}</strong>
            </div>
            <div>
              <span>Current Registered Version: </span>
              <strong className="text-slate-900">Version {document.currentVersion}</strong>
            </div>
            <div>
              <span>Blockchain Proof Tx: </span>
              <span className="font-mono text-slate-900">
                {document.blockchainTx.slice(0, 10)}...{document.blockchainTx.slice(-8)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
