import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  KeyRound,
  Cpu,
  Globe2,
  Lock,
  User,
  CheckCircle2,
  RefreshCw,
  LogOut,
  Sparkles,
  Palette,
  Sun,
  Moon,
  Monitor,
  Check,
} from 'lucide-react';
import { useApp, ThemeMode, ColorPalette } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const {
    currentUser,
    blockchainStats,
    logout,
    addNotification,
    themeMode,
    setThemeMode,
    colorPalette,
    setColorPalette,
  } = useApp();
  const [networkType, setNetworkType] = useState<string>('local');

  const handleSaveNetwork = () => {
    addNotification('Network Updated', `Blockchain provider configured to: ${networkType.toUpperCase()}`, 'success');
  };

  const isLight = themeMode === 'light';
  const isOled = themeMode === 'oled';

  const cardClass = isLight
    ? 'bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4'
    : isOled
    ? 'bg-black rounded-2xl border border-neutral-800 p-6 shadow-xs space-y-4'
    : 'bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-xl space-y-4';

  const themeModes: Array<{
    id: ThemeMode;
    label: string;
    sublabel: string;
    icon: React.FC<{ className?: string }>;
  }> = [
    {
      id: 'oled',
      label: 'OLED Black',
      sublabel: 'Pure pitch black (#000000) with ultra-deep blacks and battery efficiency',
      icon: Monitor,
    },
    {
      id: 'dark',
      label: 'Midnight Dark',
      sublabel: 'Deep space cosmic slate (#0b0f19) with cool indigo undertones',
      icon: Moon,
    },
    {
      id: 'light',
      label: 'Clean Light',
      sublabel: 'High-contrast modern daylight mode (#f8fafc) with crisp paper cards',
      icon: Sun,
    },
  ];

  const palettes: Array<{
    id: ColorPalette;
    name: string;
    badge: string;
    gradientClass: string;
  }> = [
    {
      id: 'cyan',
      name: 'Cyber Sky',
      badge: '#06B6D4',
      gradientClass: 'from-cyan-400 to-blue-500',
    },
    {
      id: 'emerald',
      name: 'Neo Emerald',
      badge: '#10B981',
      gradientClass: 'from-emerald-400 to-teal-500',
    },
    {
      id: 'indigo',
      name: 'Cosmic Violet',
      badge: '#6366F1',
      gradientClass: 'from-indigo-400 to-purple-500',
    },
    {
      id: 'amber',
      name: 'Solar Amber',
      badge: '#F59E0B',
      gradientClass: 'from-amber-400 to-orange-500',
    },
    {
      id: 'rose',
      name: 'Crimson Ruby',
      badge: '#F43F5E',
      gradientClass: 'from-rose-400 to-pink-500',
    },
  ];

  return (
    <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
      {/* Header */}
      <div className={`pb-3 border-b ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5">
          <SettingsIcon className={`w-6 h-6 ${isLight ? 'text-slate-700' : 'text-cyan-400'}`} />
          <span>Application Settings & Appearance</span>
        </h1>
        <p className={`text-xs sm:text-sm mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          Configure theme modes, color palettes, blockchain nodes, and decentralized storage
        </p>
      </div>

      <div className="space-y-6">
        {/* NEW THEME & COLOR PALETTES CONFIGURATION CARD */}
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-cyan-500" />
              <span>Theme Modes & Color Palettes</span>
            </h2>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-500 border border-cyan-500/30">
              Active: {themeMode} • {colorPalette}
            </span>
          </div>

          {/* Theme Mode Selector */}
          <div className="space-y-2.5">
            <label className={`text-xs font-mono font-semibold uppercase block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Background Tone: OLED Black, Midnight Dark, or Clean Light
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {themeModes.map(mode => {
                const Icon = mode.icon;
                const isSelected = themeMode === mode.id;

                return (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setThemeMode(mode.id);
                      addNotification('Theme Changed', `Theme mode switched to ${mode.label}`, 'info');
                    }}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? isLight
                          ? 'border-cyan-600 bg-cyan-50/50 ring-2 ring-cyan-500/30 shadow-sm'
                          : 'border-cyan-400 bg-white/10 ring-2 ring-cyan-400/30 shadow-md'
                        : isLight
                        ? 'border-slate-200 hover:border-slate-300 bg-slate-50'
                        : 'border-white/10 hover:border-white/20 bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg ${
                        isSelected ? 'bg-cyan-500 text-white' : isLight ? 'bg-slate-200 text-slate-700' : 'bg-white/10 text-slate-300'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-cyan-500 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">{mode.label}</h4>
                      <p className={`text-[11px] mt-0.5 leading-snug ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {mode.sublabel}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Palette Selector */}
          <div className="space-y-2.5 pt-2">
            <label className={`text-xs font-mono font-semibold uppercase block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Accent Color Palette Options
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {palettes.map(p => {
                const isSelected = colorPalette === p.id;

                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setColorPalette(p.id);
                      addNotification('Palette Changed', `Accent palette switched to ${p.name}`, 'info');
                    }}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 group ${
                      isSelected
                        ? isLight
                          ? 'border-slate-900 bg-slate-100 ring-2 ring-slate-400 shadow-sm'
                          : 'border-white bg-white/15 ring-2 ring-white/30 shadow-md'
                        : isLight
                        ? 'border-slate-200 hover:border-slate-300 bg-slate-50'
                        : 'border-white/10 hover:border-white/20 bg-white/5'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full bg-gradient-to-tr ${p.gradientClass} shadow-md flex items-center justify-center text-white transition-transform group-hover:scale-110`}
                    >
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">{p.name}</p>
                      <span className="text-[10px] font-mono opacity-60 block mt-0.5">
                        {p.badge}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* User Identity Card */}
        <div className={cardClass}>
          <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-500" />
            <span>Active Profile & Role</span>
          </h2>

          <div className={`flex items-center gap-4 p-4 rounded-xl border ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'
          }`}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow-md">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold">{currentUser.name}</h3>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{currentUser.email}</p>
              <span className={`inline-block mt-1 text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded ${
                isLight ? 'bg-cyan-100 text-cyan-800' : 'bg-cyan-500/20 text-cyan-300'
              }`}>
                Current Role: {currentUser.role}
              </span>
            </div>
            <button
              onClick={logout}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer ${
                isLight ? 'border-slate-200' : 'border-white/10'
              }`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Blockchain Network Settings */}
        <div className={cardClass}>
          <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-500" />
            <span>Blockchain Provider Abstraction</span>
          </h2>
          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            ProofPass is designed around a clean <code>BlockchainProvider</code> interface that runs
            locally without real cryptocurrency, and seamlessly swaps to Polygon or Ethereum testnets.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setNetworkType('local')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                networkType === 'local'
                  ? isLight
                    ? 'border-cyan-600 bg-cyan-50/50 ring-1 ring-cyan-500'
                    : 'border-cyan-400 bg-white/10 ring-1 ring-cyan-400'
                  : isLight
                  ? 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  : 'border-white/10 hover:border-white/20 bg-white/5'
              }`}
            >
              <span className="text-[10px] font-bold text-cyan-500 uppercase block mb-1">
                Recommended
              </span>
              <h4 className="text-xs font-bold">Local EVM Substrate</h4>
              <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Zero crypto or gas tokens required. Instant block mining and deterministic simulation.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setNetworkType('polygon')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                networkType === 'polygon'
                  ? isLight
                    ? 'border-purple-600 bg-purple-50/50 ring-1 ring-purple-500'
                    : 'border-purple-400 bg-white/10 ring-1 ring-purple-400'
                  : isLight
                  ? 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  : 'border-white/10 hover:border-white/20 bg-white/5'
              }`}
            >
              <span className="text-[10px] font-bold text-purple-500 uppercase block mb-1">
                Public Testnet
              </span>
              <h4 className="text-xs font-bold">Polygon Amoy Testnet</h4>
              <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Live EVM testnet RPC with Etherscan/Polygonscan public explorer anchoring.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setNetworkType('sepolia')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                networkType === 'sepolia'
                  ? isLight
                    ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500'
                    : 'border-emerald-400 bg-white/10 ring-1 ring-emerald-400'
                  : isLight
                  ? 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  : 'border-white/10 hover:border-white/20 bg-white/5'
              }`}
            >
              <span className="text-[10px] font-bold text-emerald-500 uppercase block mb-1">
                Ethereum
              </span>
              <h4 className="text-xs font-bold">Ethereum Sepolia</h4>
              <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Ethereum testnet for enterprise smart contract deployment.
              </p>
            </button>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSaveNetwork}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md cursor-pointer transition-all"
            >
              Update Network Provider
            </button>
          </div>
        </div>

        {/* What goes on-chain vs off-chain */}
        <div className={cardClass}>
          <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-500" />
            <span>Data Separation: On-Chain Proofs vs Off-Chain Storage</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border space-y-2 ${
              isLight
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
            }`}>
              <span className="text-xs font-bold block">
                ✓ Recorded on Blockchain Ledger
              </span>
              <ul className={`text-xs space-y-1 list-disc pl-4 ${isLight ? 'text-emerald-800' : 'text-emerald-400'}`}>
                <li>Document ID & Certificate Number</li>
                <li>One-way SHA-256 cryptographic hashes</li>
                <li>Issuer wallet identity & digital signatures</li>
                <li>Timestamps & Block height</li>
                <li>Version number & parent hashes</li>
                <li>Revocation status & formal reasons</li>
              </ul>
            </div>

            <div className={`p-4 rounded-xl border space-y-2 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'
            }`}>
              <span className="text-xs font-bold block">
                🔒 Kept Securely Off-Chain (Privacy Protected)
              </span>
              <ul className={`text-xs space-y-1 list-disc pl-4 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                <li>Full PDF document files & printable designs</li>
                <li>Aadhaar / National ID numbers</li>
                <li>Personal phone numbers & home addresses</li>
                <li>Bank account numbers & financial details</li>
                <li>Private user passwords and authentication tokens</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
