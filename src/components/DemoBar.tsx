import React from 'react';
import {
  Sparkles,
  FilePlus2,
  ShieldCheck,
  FileWarning,
  GitBranch,
  ShieldX,
  Coins,
  KeyRound,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DemoBar: React.FC = () => {
  const { runDemoAction, setShowLoginModal, themeMode } = useApp();

  const isLight = themeMode === 'light';
  const isOled = themeMode === 'oled';

  const barClass = isOled
    ? 'bg-black text-white border-neutral-900'
    : isLight
    ? 'bg-slate-100 text-slate-800 border-slate-200'
    : 'bg-[#030408] text-white border-white/10';

  return (
    <div className={`border-b text-xs py-2 px-4 relative z-50 transition-colors ${barClass}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 shrink-0">
          <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full font-mono font-semibold text-[11px] border ${
            isLight
              ? 'bg-cyan-100 text-cyan-800 border-cyan-200'
              : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
          }`}>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            Interactive Demo Tour
          </span>
          <span className={`hidden sm:inline text-[11px] font-light ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Run core ProofPass workflows in 1-click:
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setShowLoginModal(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold shrink-0 cursor-pointer border ${
              isLight
                ? 'bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border-cyan-300'
                : 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 text-cyan-300 border-cyan-500/40'
            }`}
            title="ProofPass Cryptographic Gateway Login"
          >
            <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
            <span>0. Gateway Login</span>
          </button>

          <button
            onClick={() => runDemoAction('issue')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all font-medium shrink-0 cursor-pointer border text-[11px] ${
              isLight
                ? 'bg-white hover:bg-blue-600 hover:text-white text-slate-700 border-slate-300'
                : 'bg-slate-900 hover:bg-blue-600 text-slate-200 hover:text-white border-white/10 hover:border-blue-500'
            }`}
            title="DEMO 1: ABC University issues B.Tech Degree with SHA-256 and ECDSA signature"
          >
            <FilePlus2 className="w-3.5 h-3.5 text-blue-400" />
            <span>1. Issue</span>
          </button>

          <button
            onClick={() => runDemoAction('verify')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all font-medium shrink-0 cursor-pointer border text-[11px] ${
              isLight
                ? 'bg-white hover:bg-emerald-600 hover:text-white text-slate-700 border-slate-300'
                : 'bg-slate-900 hover:bg-emerald-600 text-slate-200 hover:text-white border-white/10 hover:border-emerald-500'
            }`}
            title="DEMO 2: Public QR verification checking all 6 security checklist criteria"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>2. Verify</span>
          </button>

          <button
            onClick={() => runDemoAction('tamper')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all font-medium shrink-0 cursor-pointer border text-[11px] animate-pulse ${
              isLight
                ? 'bg-white hover:bg-rose-600 hover:text-white text-rose-600 border-rose-300'
                : 'bg-slate-900 hover:bg-rose-600 text-slate-200 hover:text-white border-white/10 hover:border-rose-500'
            }`}
            title="DEMO 3: Altered PDF (Marks 82% to 92%) triggers instant RED TAMPERING warning"
          >
            <FileWarning className="w-3.5 h-3.5 text-rose-400" />
            <span>3. Simulate Tamper</span>
          </button>

          <button
            onClick={() => runDemoAction('version')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all font-medium shrink-0 cursor-pointer border text-[11px] ${
              isLight
                ? 'bg-white hover:bg-amber-600 hover:text-white text-slate-700 border-slate-300'
                : 'bg-slate-900 hover:bg-amber-600 text-slate-200 hover:text-white border-white/10 hover:border-amber-500'
            }`}
            title="DEMO 4: Immutable version history: V1 Superseded -> V2 Current"
          >
            <GitBranch className="w-3.5 h-3.5 text-amber-400" />
            <span>4. Version</span>
          </button>

          <button
            onClick={() => runDemoAction('revoke')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all font-medium shrink-0 cursor-pointer border text-[11px] ${
              isLight
                ? 'bg-white hover:bg-purple-600 hover:text-white text-slate-700 border-slate-300'
                : 'bg-slate-900 hover:bg-purple-600 text-slate-200 hover:text-white border-white/10 hover:border-purple-500'
            }`}
            title="DEMO 5: Disciplinary revocation with on-chain permanent audit record"
          >
            <ShieldX className="w-3.5 h-3.5 text-purple-400" />
            <span>5. Revoke</span>
          </button>

          <button
            onClick={() => runDemoAction('donation')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all font-medium shrink-0 cursor-pointer border text-[11px] ${
              isLight
                ? 'bg-white hover:bg-teal-600 hover:text-white text-slate-700 border-slate-300'
                : 'bg-slate-900 hover:bg-teal-600 text-slate-200 hover:text-white border-white/10 hover:border-teal-500'
            }`}
            title="DEMO 6: Trace ₹10,000 School Library donation into Books, Furniture & Freight with invoices"
          >
            <Coins className="w-3.5 h-3.5 text-teal-400" />
            <span>6. Donations</span>
          </button>
        </div>
      </div>
    </div>
  );
};
