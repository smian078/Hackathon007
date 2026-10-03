import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  FolderLock,
  QrCode,
  FileWarning,
  GitBranch,
  Coins,
  Globe2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  PlayCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const UserTutorialModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { runDemoAction, navigateTo } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const tutorialSteps = [
    {
      title: 'Welcome to ProofPass',
      subtitle: 'DigiLocker Simplicity + Blockchain Mathematical Certainty',
      icon: ShieldCheck,
      badge: 'Getting Started',
      color: 'from-blue-600 to-indigo-600',
      description:
        'ProofPass allows organizations to issue trusted digital documents such as university degrees, diplomas, internship credentials, donation receipts, and licenses. Users securely store their documents in a digital wallet, while anyone can independently verify them via QR code without an account.',
      bulletPoints: [
        'Zero cryptocurrency knowledge, gas fees, or crypto wallets required.',
        'Zero personal PDFs or private Aadhaar/ID information stored on-chain.',
        'One-way SHA-256 cryptographic fingerprints ensure 100% tamper resistance.',
      ],
      actionLabel: 'Explore Digital Wallet',
      action: () => {
        navigateTo('dashboard');
        onClose();
      },
    },
    {
      title: 'Digital Document Wallet',
      subtitle: 'Your Personal Vault for Verified Credentials',
      icon: FolderLock,
      badge: 'Holder Experience',
      color: 'from-indigo-600 to-purple-600',
      description:
        'All your academic degrees, training certificates, and 80G charitable donation receipts live in one unified wallet. Every document features an official high-resolution certificate card with holographic security watermarks, issuer signature, and a unique QR verification code.',
      bulletPoints: [
        'Instant view, download, and printable layout with authentic seals.',
        'Generate shareable public verification links for employers or universities.',
        'Inspect immutable cryptographic transaction proofs on the blockchain.',
      ],
      actionLabel: 'View Recent Documents',
      action: () => {
        navigateTo('my-documents');
        onClose();
      },
    },
    {
      title: 'Public QR Verification',
      subtitle: 'Zero-Account Instant Validation for Anyone',
      icon: QrCode,
      badge: 'Verifier Experience',
      color: 'from-emerald-600 to-teal-600',
      description:
        'HR managers, university admissions officers, and public auditors do not need to create an account or log in. Simply scan the document QR code or enter the Document ID to evaluate the 6-point cryptographic verification checklist in seconds.',
      bulletPoints: [
        'Validates issuer recognition, digital signature, and blockchain anchor.',
        'Confirms the document hash matches genesis issuance.',
        'Checks real-time revocation registry status.',
      ],
      actionLabel: 'Try Live Verification',
      action: () => {
        runDemoAction('verify');
        onClose();
      },
    },
    {
      title: 'Tamper Detection (Signature Feature)',
      subtitle: 'Altered Marks or Grades are Immediately Caught',
      icon: FileWarning,
      badge: 'Signature Feature',
      color: 'from-rose-600 to-pink-600',
      description:
        'ProofPass features browser-based SHA-256 integrity verification. Upload any PDF or certificate file: ProofPass calculates its mathematical hash and compares it directly against the original blockchain block.',
      bulletPoints: [
        'If marks are edited (e.g., from 82% to 92%), the calculated hash completely changes.',
        'System immediately turns RED with a loud TAMPERING DETECTED warning.',
        'Shows side-by-side hash mismatch comparison with plain-language explanations.',
      ],
      actionLabel: 'Simulate Tampering Demo',
      action: () => {
        runDemoAction('tamper');
        onClose();
      },
    },
    {
      title: 'Immutable Version History',
      subtitle: 'Records are Never Silently Overwritten',
      icon: GitBranch,
      badge: 'Audit & Compliance',
      color: 'from-amber-600 to-orange-600',
      description:
        'When an organization issues an updated credential (e.g. promoting a job title or correcting an administrative error), previous versions are not deleted. The older version is marked SUPERSEDED, while the new version becomes CURRENT.',
      bulletPoints: [
        'Full historical audit trail of all revisions is permanently preserved.',
        'Disciplinary revocations display clear permanent notices on-chain.',
        'Complete chronological lifecycle from genesis block to current state.',
      ],
      actionLabel: 'Inspect Version History',
      action: () => {
        runDemoAction('version');
        onClose();
      },
    },
    {
      title: 'Donation Transparency Module',
      subtitle: 'Trace Philanthropy to Actual Merchant Invoices',
      icon: Coins,
      badge: 'Philanthropy & NGOs',
      color: 'from-teal-600 to-emerald-600',
      description:
        'Donors can track 100% of charitable donations down to the exact invoice, delivery slip, and transport receipt. Explore verified fund breakdowns where every rupee spent is anchored with its own verifiable cryptographic proof.',
      bulletPoints: [
        'See ₹10,000 School Library donation allocated into Books, Furniture & Freight.',
        'Verify independent invoice SHA-256 hashes and merchant receipts.',
        'Interactive relationship graph connecting donors, NGOs, and vendor evidence.',
      ],
      actionLabel: 'Trace Donation & Invoices',
      action: () => {
        runDemoAction('donation');
        onClose();
      },
    },
    {
      title: 'Institutional Domains & DNS Verification',
      subtitle: 'Tethering Educational & Corporate Domains to Blockchain Contracts',
      icon: Globe2,
      badge: 'Institutional Trust',
      color: 'from-sky-600 to-blue-700',
      description:
        'ProofPass prevents phishing and fraudulent credential issuers by requiring organizations to prove domain ownership via DNS TXT records (_proofpass-verify=0x1A2B...). Only approved, accredited institutions can issue official degrees.',
      bulletPoints: [
        'Public directory of authorized institutions like ABC University and Helping Hands Foundation.',
        'Real-time DNS resolver verifies cryptographic records and SSL certificate status.',
        'Interactive domain tester allows instant lookup for any institutional domain.',
      ],
      actionLabel: 'Explore Domain Registry',
      action: () => {
        navigateTo('domains');
        onClose();
      },
    },
  ];

  const stepData = tutorialSteps[currentStep];
  const StepIcon = stepData.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-slate-950/95 backdrop-blur-2xl rounded-3xl max-w-2xl w-full shadow-2xl border border-cyan-500/30 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col text-slate-100">
        {/* Header with gradient badge */}
        <div className={`p-6 bg-gradient-to-r ${stepData.color} text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/25 text-white">
              {stepData.badge} • Step {currentStep + 1} of {tutorialSteps.length}
            </span>
          </div>

          <h2 className="text-2xl font-black">{stepData.title}</h2>
          <p className="text-xs text-white/90 font-medium mt-1">{stepData.subtitle}</p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <p className="text-sm text-slate-300 leading-relaxed font-light">
            {stepData.description}
          </p>

          <div className="space-y-2.5 p-4 rounded-2xl bg-slate-900/70 border border-white/10">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
              Key Highlights:
            </span>
            <ul className="space-y-2">
              {stepData.bulletPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Interactive Demo Trigger Button for this step */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
            <div className="flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-cyan-400 shrink-0" />
              <span className="text-xs font-bold text-cyan-200">
                Want to test this feature right now?
              </span>
            </div>
            <button
              onClick={stepData.action}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-bold text-xs transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <span>{stepData.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-black/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {tutorialSteps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  currentStep === i ? 'w-6 bg-cyan-400' : 'bg-slate-700 hover:bg-slate-600'
                }`}
                title={`Go to step ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            )}

            {currentStep < tutorialSteps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer shadow-md shadow-cyan-500/20"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-colors cursor-pointer"
              >
                Done, Let&apos;s Start!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
