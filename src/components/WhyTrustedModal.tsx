import React from 'react';
import {
  ShieldCheck,
  KeyRound,
  Fingerprint,
  Blocks,
  FileCheck2,
  Building2,
  History,
  X,
  CheckCircle2,
} from 'lucide-react';

export const WhyTrustedModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      icon: KeyRound,
      step: 'Step 1',
      title: 'The issuer signed the document',
      desc: 'The official institution (like your university or company) applied a cryptographic digital signature using their accredited private identity key.',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      icon: Fingerprint,
      step: 'Step 2',
      title: 'A unique digital fingerprint was created',
      desc: 'A mathematical SHA-256 cryptographic hash was computed from the document content. Even changing a single punctuation mark completely changes this fingerprint.',
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      icon: Blocks,
      step: 'Step 3',
      title: 'Fingerprint recorded on the blockchain',
      desc: 'Only the mathematical fingerprint was permanently registered on an immutable ledger. No sensitive personal data or private PDFs are stored on-chain.',
      color: 'text-purple-600 bg-purple-50',
    },
    {
      icon: FileCheck2,
      step: 'Step 4',
      title: 'Real-time fingerprint comparison',
      desc: 'When a verifier scans the QR code or uploads a PDF, its hash is immediately recalculated and matched against the original blockchain block.',
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      icon: Building2,
      step: 'Step 5',
      title: "The issuer's active authority is verified",
      desc: 'The system validates that the institution is currently registered, accredited, and has not revoked their authorization.',
      color: 'text-amber-600 bg-amber-50',
    },
    {
      icon: History,
      step: 'Step 6',
      title: 'Previous versions & audit trail remain visible',
      desc: 'Documents are never silently overwritten or erased. Any historical update creates an immutable version record preserving the full chain of custody.',
      color: 'text-teal-600 bg-teal-50',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50/60 to-indigo-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Why is this document trusted?</h2>
              <p className="text-xs text-slate-500 font-medium">
                Plain-language breakdown of ProofPass decentralized verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map(s => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-blue-200 transition-all shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {s.step}
                    </span>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{s.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-emerald-900">Zero Cryptographic Knowledge Needed</p>
              <p className="text-xs text-emerald-700 mt-0.5">
                ProofPass abstracts away gas fees, crypto wallets, and complex hashes into simple,
                actionable status signals: Verified, Superseded, Revoked, or Tampered.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Got it, close
          </button>
        </div>
      </div>
    </div>
  );
};
