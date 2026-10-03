import React, { useState } from 'react';
import {
  FileCheck2,
  Award,
  Coins,
  ShieldAlert,
  Download,
  Share2,
  ShieldCheck,
  Eye,
  PlusCircle,
  ExternalLink,
  Building2,
  Calendar,
  Sparkles,
  QrCode,
  ArrowRight,
  BookOpen,
  Globe2,
  X,
  KeyRound,
  Fingerprint,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DocumentRecord } from '../types';

export const Dashboard: React.FC = () => {
  const {
    currentUser,
    documents,
    donations,
    navigateTo,
    runDemoAction,
    addNotification,
    setShowTutorial,
    setShowLoginModal,
    themeMode,
  } = useApp();
  const [hideBanner, setHideBanner] = useState(false);

  const isLight = themeMode === 'light';
  const isOled = themeMode === 'oled';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) {
      return 'Good morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };

  const handleShare = (doc: DocumentRecord) => {
    const url = `${window.location.origin}/verify/${doc.documentId}`;
    navigator.clipboard.writeText(url);
    addNotification('Link Copied', `Public verification link for ${doc.title} copied to clipboard!`, 'success');
  };

  const handleDownload = (doc: DocumentRecord) => {
    const data = JSON.stringify(doc, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.documentId}_ProofPass.json`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification('Download Started', `Downloaded cryptographic record for ${doc.title}`, 'info');
  };

  return (
    <div className={`space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
      {/* Welcome Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
        isLight ? 'border-slate-200' : 'border-white/10'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {getGreeting()}, {currentUser.name.split(' ')[0]}
            </h1>
            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
              isLight ? 'bg-cyan-100 text-cyan-800 border-cyan-200' : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
            }`}>
              LEDGER ACTIVE
            </span>
          </div>
          <p className={`text-xs sm:text-sm mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Your decentralized wallet is synchronized with the ProofPass blockchain ledger.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowLoginModal(true)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer border ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                : 'bg-slate-900/80 hover:bg-slate-800 border-cyan-500/40 text-cyan-300'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-cyan-500" />
            <span>Identity Gateway</span>
          </button>

          <button
            onClick={() => navigateTo('verify')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer border ${
              isLight
                ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                : 'bg-slate-900/80 hover:bg-slate-800 border-white/15 text-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4 text-cyan-500" />
            <span>Scan / Verify</span>
          </button>

          <button
            onClick={() => navigateTo('issue-wizard')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>Issue Document</span>
          </button>
        </div>
      </div>

      {/* New User Onboarding Banner */}
      {!hideBanner && (
        <div className={`relative overflow-hidden rounded-2xl p-5 sm:p-6 shadow-xl border ${
          isLight
            ? 'bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 text-white border-slate-800'
            : 'bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 text-white border-cyan-500/30'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Visual Architecture & Guided Tour</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Welcome to ProofPass — Decentralized Document Wallet & Cryptographic Verification
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                Learn how document hashing, blockchain proofs, zero-account QR verification, tamper detection, and verified institutional domains protect official credentials.
              </p>
            </div>

            <div className="flex items-center gap-2 sm:shrink-0">
              <button
                onClick={() => setShowTutorial(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-slate-950" />
                <span>Start Tutorial</span>
              </button>
              <button
                onClick={() => navigateTo('domains')}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer"
              >
                <Globe2 className="w-4 h-4 text-cyan-300" />
                <span>Verified Domains</span>
              </button>
              <button
                onClick={() => setHideBanner(true)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Verified Documents */}
        <div className={`p-5 rounded-2xl backdrop-blur-xl border shadow-lg hover:border-cyan-500/50 hover:shadow-cyan-500/10 transition-all space-y-1 ${
          isOled ? 'bg-neutral-950/80 border-neutral-800/80' : isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-white/10'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-mono uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Verified Documents
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-3xl font-black font-mono tabular-nums ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {documents.length}
          </p>
          <p className="text-[11px] text-cyan-400 font-medium flex items-center gap-1">
            <span>● 100% Cryptographically Verified</span>
          </p>
        </div>

        {/* Active Credentials */}
        <div className={`p-5 rounded-2xl backdrop-blur-xl border shadow-lg hover:border-indigo-500/50 hover:shadow-indigo-500/10 transition-all space-y-1 ${
          isOled ? 'bg-neutral-950/80 border-neutral-800/80' : isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-white/10'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-mono uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Active Credentials
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-3xl font-black font-mono tabular-nums ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {documents.filter(d => d.status !== 'REVOKED').length}
          </p>
          <p className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Valid & Non-Revoked</p>
        </div>

        {/* Donations Tracked */}
        <div className={`p-5 rounded-2xl backdrop-blur-xl border shadow-lg hover:border-cyan-500/50 hover:shadow-cyan-500/10 transition-all space-y-1 ${
          isOled ? 'bg-neutral-950/80 border-neutral-800/80' : isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-white/10'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-mono uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Donations Tracked
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-3xl font-black font-mono tabular-nums ${isLight ? 'text-slate-900' : 'text-white'}`}>
            ₹{donations.reduce((sum: number, d) => sum + (d.totalAmount || 0), 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-cyan-400 font-medium flex items-center gap-1">
            <span>100% Traceable Invoices</span>
          </p>
        </div>

        {/* Tampering Events */}
        <div className={`p-5 rounded-2xl backdrop-blur-xl border shadow-lg hover:border-indigo-500/50 hover:shadow-indigo-500/10 transition-all space-y-1 ${
          isOled ? 'bg-neutral-950/80 border-neutral-800/80' : isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-white/10'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-mono uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Tampering Events
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-cyan-400 font-mono tabular-nums">0</p>
          <p className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Zero unauthorized alters</p>
        </div>
      </div>

      {/* Recent Documents Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-lg font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Recent Cryptographic Records</h2>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Credentials issued to your digital wallet with immutable blockchain proofs
            </p>
          </div>
          <button
            onClick={() => navigateTo('my-documents')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({documents.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Empty State vs Document Cards Grid */}
        {documents.length === 0 ? (
          <div className={`p-8 rounded-2xl border text-center space-y-4 ${
            isOled ? 'bg-neutral-950/80 border-neutral-800/80' : isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-white/10'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mx-auto">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                No Credentials in Digital Wallet Yet
              </h3>
              <p className={`text-xs max-w-md mx-auto ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Issue your first academic degree, work certificate, or donation receipt to generate a cryptographically anchored blockchain proof.
              </p>
            </div>
            <button
              onClick={() => navigateTo('issue-wizard')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>Issue First Document</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.slice(0, 4).map(doc => {
              const isRevoked = doc.status === 'REVOKED';

              return (
                <div
                  key={doc.documentId}
                  className={`backdrop-blur-xl rounded-2xl border hover:border-cyan-500/50 p-5 shadow-xl hover:shadow-cyan-500/10 transition-all flex flex-col justify-between space-y-4 relative overflow-hidden ${
                    isOled ? 'bg-neutral-950/80 border-neutral-800/80' : isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-white/10'
                  }`}
                >
                  {/* Decorative border highlight */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 ${
                      isRevoked ? 'bg-rose-500' : 'bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-500'
                    }`}
                  />

                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-[11px] font-mono text-cyan-400/90 font-medium">
                        {doc.documentId}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded tracking-wider border ${
                          isRevoked
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {isRevoked ? 'REVOKED' : 'VERIFIED'}
                      </span>
                    </div>

                    <h3 className={`text-base font-bold leading-snug ${isLight ? 'text-slate-900' : 'text-white'}`}>{doc.title}</h3>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs">
                      <span className={`flex items-center gap-1 font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                        {doc.issuerName}
                      </span>
                      <span className={`flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        Issued: {new Date(doc.issuedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className={`text-xs line-clamp-2 leading-relaxed font-light ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {doc.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className={`pt-3 border-t flex items-center justify-between gap-2 ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => navigateTo('document-detail', { docId: doc.documentId })}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                          isLight
                            ? 'border-slate-200 hover:bg-slate-50 text-slate-700 hover:border-cyan-400'
                            : 'border-white/10 hover:border-cyan-500/30 hover:bg-slate-800 text-slate-200'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Details</span>
                      </button>

                      <button
                        onClick={() => navigateTo('verify', { docId: doc.documentId })}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                          isLight
                            ? 'border-slate-200 hover:bg-slate-50 text-slate-700 hover:border-cyan-400'
                            : 'border-white/10 hover:border-cyan-500/30 hover:bg-slate-800 text-slate-200'
                        }`}
                      >
                        <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Verify</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleShare(doc)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isLight ? 'hover:bg-slate-100 text-slate-500 hover:text-slate-900' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title="Share Public Link"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(doc)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isLight ? 'hover:bg-slate-100 text-slate-500 hover:text-slate-900' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title="Download JSON Proof"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
