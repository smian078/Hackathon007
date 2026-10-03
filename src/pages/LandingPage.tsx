import React from 'react';
import {
  ShieldCheck,
  QrCode,
  FileCheck,
  Building2,
  Lock,
  ArrowRight,
  Sparkles,
  Fingerprint,
  Layers,
  HeartHandshake,
  CheckCircle2,
  AlertTriangle,
  Blocks,
  Globe2,
  BookOpen,
  KeyRound,
  Palette,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CosmicCanvas } from '../components/CosmicCanvas';

export const LandingPage: React.FC = () => {
  const { navigateTo, setShowTutorial, setShowLoginModal, themeMode, colorPalette, setShowThemeModal } = useApp();

  const isLight = themeMode === 'light';
  const isOled = themeMode === 'oled';

  return (
    <div className={`min-h-screen relative transition-colors duration-200 ${
      isOled ? 'bg-black text-neutral-100' : isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#05070E] text-slate-100'
    }`}>
      {/* Hero Section with Interactive Fluid Canvas */}
      <section className={`relative overflow-hidden pt-16 pb-24 sm:pt-20 sm:pb-32 border-b ${
        isLight ? 'border-slate-200' : isOled ? 'border-neutral-900' : 'border-white/10'
      }`}>
        {/* Interactive Background */}
        <div className="absolute inset-0 z-0">
          <CosmicCanvas
            intensity={1.1}
            showRings={true}
            palette={colorPalette}
            themeMode={themeMode}
          />
          <div className={`absolute inset-0 pointer-events-none ${
            isLight
              ? 'bg-gradient-to-b from-white/30 via-transparent to-slate-50'
              : isOled
              ? 'bg-gradient-to-b from-black/50 via-transparent to-black'
              : 'bg-gradient-to-b from-[#05070E]/50 via-transparent to-[#05070E]'
          }`} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Announcement Badge */}
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold shadow-lg backdrop-blur-md border ${
            isLight
              ? 'bg-white/90 border-cyan-200 text-cyan-800 shadow-slate-200'
              : 'bg-slate-950/80 border-cyan-500/40 text-cyan-300 shadow-cyan-950/50'
          }`}>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>PROOFPASS // QUANTUM CONSENSUS PROTOCOL</span>
          </div>

          {/* Heading & Subtitle */}
          <div className="max-w-4xl mx-auto space-y-5">
            <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.12] ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Trust every document.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500">
                Verify every record.
              </span>
            </h1>
            <p className={`text-base sm:text-xl max-w-2xl mx-auto leading-relaxed font-light ${
              isLight ? 'text-slate-600' : 'text-slate-300'
            }`}>
              ProofPass binds official certificates, diplomas, and donation records to an immutable blockchain proof layer with instant zero-login QR verification.
            </p>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 max-w-3xl mx-auto">
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-600 hover:from-cyan-300 hover:to-violet-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-slate-950" />
              <span>Gateway Sign-In</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            <button
              onClick={() => navigateTo('dashboard')}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm border backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-sm'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-white border-white/15'
              }`}
            >
              <span>Open Document Wallet</span>
            </button>

            <button
              onClick={() => setShowTutorial(true)}
              className={`w-full sm:w-auto px-5 py-3.5 rounded-xl font-semibold text-sm border backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isLight
                  ? 'bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border-cyan-200'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-cyan-300 border-cyan-500/30'
              }`}
            >
              <BookOpen className="w-4 h-4 text-cyan-500" />
              <span>Tutorial Guide</span>
            </button>

            <button
              onClick={() => setShowThemeModal(true)}
              className={`w-full sm:w-auto px-4 py-3.5 rounded-xl font-semibold text-sm border backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border-white/10'
              }`}
              title="Customize Theme & Palette"
            >
              <Palette className="w-4 h-4 text-cyan-400" />
              <span>Theme</span>
            </button>
          </div>

          {/* Visual Trust Pipeline */}
          <div className="pt-10 max-w-4xl mx-auto">
            <p className={`text-[11px] font-mono uppercase tracking-widest mb-3 ${
              isLight ? 'text-cyan-700' : 'text-cyan-400/80'
            }`}>
              Mathematical Verification Flow
            </p>
            <div className={`grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${
              isLight
                ? 'bg-white/90 border-slate-200 shadow-slate-200 text-slate-800'
                : 'bg-slate-950/70 border-white/10 shadow-black text-slate-200'
            }`}>
              <div className={`p-3 rounded-xl border text-center space-y-1 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/70 border-white/5'
              }`}>
                <span className="text-[10px] font-mono font-bold text-cyan-500 uppercase">01. ISSUE</span>
                <p className="text-xs font-bold">Accredited Org</p>
              </div>

              <div className={`p-3 rounded-xl border text-center space-y-1 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/70 border-white/5'
              }`}>
                <span className="text-[10px] font-mono font-bold text-indigo-500 uppercase">02. HASH</span>
                <p className="text-xs font-bold">SHA-256 Fingerprint</p>
              </div>

              <div className={`p-3 rounded-xl border text-center space-y-1 col-span-2 sm:col-span-1 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/70 border-white/5'
              }`}>
                <span className="text-[10px] font-mono font-bold text-violet-500 uppercase">03. ANCHOR</span>
                <p className="text-xs font-bold">ProofPass Ledger</p>
              </div>

              <div className={`p-3 rounded-xl border text-center space-y-1 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/70 border-white/5'
              }`}>
                <span className="text-[10px] font-mono font-bold text-teal-500 uppercase">04. QR CODE</span>
                <p className="text-xs font-bold">Instant Scan</p>
              </div>

              <div className={`p-3 rounded-xl text-center space-y-1 col-span-2 sm:col-span-1 border ${
                isLight ? 'bg-cyan-50 border-cyan-200 text-cyan-900' : 'bg-cyan-950/30 border-cyan-500/40 text-white'
              }`}>
                <span className="text-[10px] font-mono font-bold text-cyan-500 uppercase">05. VERIFY</span>
                <p className="text-xs font-bold">Zero Account</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Roles Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-500">
            DECENTRALIZED ARCHITECTURE
          </span>
          <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            A Unified Trust Network for All Stakeholders
          </h2>
          <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Eliminate credential fraud and untraceable donations with cryptographic certainty
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {/* For Issuers */}
          <div className={`p-6 rounded-2xl border backdrop-blur-xl transition-all space-y-3 ${
            isLight
              ? 'bg-white border-slate-200 hover:border-cyan-500 shadow-xs'
              : 'bg-slate-900/50 border-white/10 hover:border-cyan-500/40'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-cyan-500 flex items-center justify-center font-bold border border-cyan-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>For Issuers</h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Universities, corporations, and governments issue cryptographically signed credentials,
              generate QR codes, manage versions, and execute legitimate revocations.
            </p>
          </div>

          {/* For Holders */}
          <div className={`p-6 rounded-2xl border backdrop-blur-xl transition-all space-y-3 ${
            isLight
              ? 'bg-white border-slate-200 hover:border-indigo-500 shadow-xs'
              : 'bg-slate-900/50 border-white/10 hover:border-indigo-500/40'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center font-bold border border-indigo-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>For Holders</h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Store all diplomas, certificates, licenses, and donation receipts in a clean, personal
              digital wallet. Easily share verification links with employers or colleges.
            </p>
          </div>

          {/* For Donors */}
          <div className={`p-6 rounded-2xl border backdrop-blur-xl transition-all space-y-3 ${
            isLight
              ? 'bg-white border-slate-200 hover:border-teal-500 shadow-xs'
              : 'bg-slate-900/50 border-white/10 hover:border-teal-500/40'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-500 flex items-center justify-center font-bold border border-teal-500/20">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>For Donors</h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Track 100% of charitable contributions directly to down-stream vendor invoices, receipts,
              and on-the-ground proof documents anchored on the ledger.
            </p>
          </div>

          {/* For Verifiers */}
          <div className={`p-6 rounded-2xl border backdrop-blur-xl transition-all space-y-3 ${
            isLight
              ? 'bg-white border-slate-200 hover:border-emerald-500 shadow-xs'
              : 'bg-slate-900/50 border-white/10 hover:border-emerald-500/40'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-bold border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>For Verifiers</h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Employers and admissions teams can verify documents instantly via QR code without an
              account, and upload PDFs to detect any marks tampering in seconds.
            </p>
          </div>
        </div>

        {/* Institutional Domain & DNS Tethering Spotlight */}
        <div className={`mt-12 p-6 sm:p-8 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl ${
          isLight
            ? 'bg-white border-cyan-200 shadow-slate-200'
            : isOled
            ? 'bg-black border-neutral-800 shadow-black'
            : 'bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border-cyan-500/30'
        }`}>
          <div className="space-y-2 max-w-2xl">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-semibold ${
              isLight
                ? 'bg-cyan-50 text-cyan-800 border-cyan-200'
                : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
            }`}>
              <Globe2 className="w-3.5 h-3.5 text-cyan-500" />
              <span>INSTITUTIONAL TRUST DIRECTORY</span>
            </div>
            <h3 className={`text-xl sm:text-2xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Cryptographically Tethered Educational & Corporate Domains
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed font-light ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Every accredited institution publishes cryptographic public key records to their DNS TXT records. Verify official university subdomains, registrar keypairs, and smart contract authorizations in real-time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => navigateTo('domains')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Globe2 className="w-4 h-4 text-slate-950" />
              <span>Explore Domains</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
            <button
              onClick={() => setShowLoginModal(true)}
              className={`px-5 py-3 rounded-xl font-semibold text-xs border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span>Authenticate</span>
            </button>
          </div>
        </div>
      </section>

      {/* Core Privacy & Architecture Promise */}
      <section className={`py-14 border-t relative z-10 ${
        isLight ? 'bg-slate-100 border-slate-200' : isOled ? 'bg-black border-neutral-900' : 'bg-slate-950 border-white/10'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-cyan-500 font-semibold text-sm">
                <Fingerprint className="w-4 h-4" />
                <span>Zero Private Data On-Chain</span>
              </div>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Personal identities, Aadhaar numbers, phone numbers, and full PDFs are NEVER stored on
                the blockchain. Only one-way SHA-256 hashes and digital signatures are anchored.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-500 font-semibold text-sm">
                <Layers className="w-4 h-4" />
                <span>Immutable Version History</span>
              </div>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Credentials are never overwritten. When an updated certificate is issued, previous
                versions become superseded while maintaining an immutable historical audit trail.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-500 font-semibold text-sm">
                <Globe2 className="w-4 h-4" />
                <span>Zero Crypto Wallets Required</span>
              </div>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Neither students nor HR verifiers ever need MetaMask, gas tokens, or crypto knowledge.
                The experience is seamless, instantaneous, and accessible on any mobile device.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
