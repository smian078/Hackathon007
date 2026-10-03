import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building,
  Hash,
  Download,
  Share2,
  Printer,
  Sparkles,
  QrCode as QrIcon,
  ExternalLink,
} from 'lucide-react';
import { DocumentRecord, DocumentVersion } from '../types';

interface CertificateRendererProps {
  document: DocumentRecord;
  version?: DocumentVersion;
  onShare?: () => void;
  onVerify?: () => void;
}

export const CertificateRenderer: React.FC<CertificateRendererProps> = ({
  document,
  version,
  onShare,
  onVerify,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [viewMode, setViewMode] = useState<'CERTIFICATE' | 'UPLOADED_FILE'>('CERTIFICATE');
  const currentVersion = version || document.versions.find(v => v.versionNumber === document.currentVersion) || document.versions[0];

  useEffect(() => {
    const fullVerifyUrl = `${window.location.origin}/verify/${document.documentId}`;
    QRCode.toDataURL(fullVerifyUrl, {
      width: 140,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error('Failed to generate QR code', err));
  }, [document.documentId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadStub = () => {
    // Generate a downloadable JSON proof + Certificate summary text
    const proofData = JSON.stringify(
      {
        proofPassFormat: 'ProofPass-VerifiableCredential-v1',
        documentId: document.documentId,
        title: document.title,
        recipient: document.holderName,
        issuer: document.issuerName,
        issueDate: document.issuedAt,
        version: currentVersion.versionNumber,
        sha256Hash: currentVersion.documentHash,
        signature: currentVersion.issuerSignature,
        blockchainTx: currentVersion.blockchainTx,
        verificationUrl: `${window.location.origin}/verify/${document.documentId}`,
      },
      null,
      2
    );

    const blob = new Blob([proofData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.documentId}_ProofPass_Verification_Stub.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Top action toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs print:hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Official Document View</span>
          <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
            Version {currentVersion.versionNumber}
          </span>
          {document.status === 'REVOKED' && (
            <span className="text-[11px] px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200">
              REVOKED
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {document.fileData && (
            <div className="flex items-center rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('CERTIFICATE')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  viewMode === 'CERTIFICATE'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Certificate
              </button>
              <button
                type="button"
                onClick={() => setViewMode('UPLOADED_FILE')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  viewMode === 'UPLOADED_FILE'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Uploaded File
              </button>
            </div>
          )}

          <button
            onClick={handleDownloadStub}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
            title="Download Cryptographic JSON Proof Stub"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download Proof</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print</span>
          </button>

          {onShare && (
            <button
              onClick={onShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Share</span>
            </button>
          )}

          {onVerify && (
            <button
              onClick={onVerify}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-xs transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verify Online</span>
            </button>
          )}
        </div>
      </div>

      {/* Uploaded File View when active */}
      {viewMode === 'UPLOADED_FILE' && document.fileData && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{document.fileName || 'Uploaded Original Document'}</h3>
              <p className="text-xs text-slate-500 font-mono">
                {document.fileSize ? `${(document.fileSize / 1024).toFixed(1)} KB` : ''} • SHA-256 Verified
              </p>
            </div>
            <a
              href={document.fileData}
              download={document.fileName || `${document.documentId}_original`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </a>
          </div>

          <div className="rounded-xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center p-2 min-h-[400px]">
            {document.fileData.startsWith('data:image/') ? (
              <img
                src={document.fileData}
                alt={document.title}
                className="max-h-[600px] w-auto mx-auto rounded-lg object-contain shadow-xs"
              />
            ) : document.fileData.startsWith('data:application/pdf') ? (
              <iframe
                src={document.fileData}
                className="w-full h-[600px] rounded-lg border-0"
                title={document.title}
              />
            ) : (
              <div className="w-full p-4 font-mono text-xs text-slate-700 overflow-auto max-h-[500px] whitespace-pre-wrap">
                {document.fileData}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Official Certificate Paper Frame */}
      {viewMode === 'CERTIFICATE' && (
        <div className="relative bg-white rounded-2xl border-4 border-double border-slate-300 p-8 sm:p-12 shadow-xl overflow-hidden print:p-6 print:border-2 print:shadow-none">
        {/* Holographic / Security Watermark */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center select-none">
          <ShieldCheck className="w-[450px] h-[450px] text-slate-900" />
        </div>

        {/* Revoked watermark banner if revoked */}
        {document.status === 'REVOKED' && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
            <div className="transform -rotate-12 border-8 border-rose-600 text-rose-600/70 font-black text-6xl tracking-widest px-8 py-3 rounded-2xl select-none uppercase">
              REVOKED
            </div>
          </div>
        )}

        {/* Certificate Header */}
        <div className="text-center relative z-10 space-y-2 pb-6 border-b border-slate-200">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 text-blue-700 border-2 border-blue-200 mb-2">
            <Building className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-wide uppercase">
            {document.issuerName}
          </h2>
          <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
            Institutional Registry of Accredited Credentials
          </p>
        </div>

        {/* Body Text */}
        <div className="py-8 sm:py-10 text-center relative z-10 space-y-4">
          <p className="text-sm font-serif italic text-slate-600">
            This is to officially certify and record that
          </p>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-blue-900 tracking-normal underline decoration-blue-200 underline-offset-8">
            {document.holderName}
          </h1>

          <p className="text-xs text-slate-500 font-mono">
            Recipient ID: {document.recipientId} | Email: {document.holderEmail}
          </p>

          <p className="text-sm font-serif text-slate-600 max-w-xl mx-auto pt-2">
            has been conferred the qualification and authentic certification of
          </p>

          <h3 className="text-lg sm:text-2xl font-bold text-slate-900 font-serif pt-1">
            {document.title}
          </h3>

          <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed pt-1">
            {document.description}
          </p>

          {/* Custom Fields Grid */}
          {document.customFields && Object.keys(document.customFields).length > 0 && (
            <div className="pt-4 max-w-md mx-auto grid grid-cols-2 gap-2 text-left bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
              {Object.entries(document.customFields).map(([key, val]) => (
                <div key={key} className="text-xs">
                  <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">
                    {key}
                  </span>
                  <span className="font-semibold text-slate-800">{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Certificate Footer / Security Credentials */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          {/* Signatures & Dates */}
          <div className="text-left space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Date of Issuance:{' '}
                <strong className="text-slate-900">
                  {new Date(document.issuedAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-600 font-mono">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              <span>Certificate #: {document.certificateNumber}</span>
            </div>

            <div className="pt-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Issuer Signature: {currentVersion.issuerSignature}</span>
              </div>
            </div>
          </div>

          {/* QR Verification Code & Seal */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[11px] font-bold text-slate-800">Scan to Verify</p>
              <p className="text-[10px] text-slate-500 font-mono">ID: {document.documentId}</p>
              <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-600 font-semibold mt-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>ProofPass Verified</span>
              </div>
            </div>

            <div className="p-1.5 bg-white border border-slate-200 rounded-xl shadow-xs shrink-0">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="QR Verification" className="w-24 h-24 rounded-lg" />
              ) : (
                <div className="w-24 h-24 bg-slate-100 animate-pulse rounded-lg" />
              )}
            </div>
          </div>
        </div>

        {/* Cryptographic SHA-256 Microprint Footer */}
        <div className="mt-6 pt-3 border-t border-slate-100 text-center">
          <p className="text-[9px] font-mono text-slate-400 break-all select-all">
            IMMUTABLE LEDGER FINGERPRINT: {currentVersion.documentHash} | BLOCKCHAIN TX:{' '}
            {currentVersion.blockchainTx}
          </p>
        </div>
      </div>
      )}
    </div>
  );
};
