import React from 'react';
import {
  LayoutDashboard,
  FolderLock,
  QrCode,
  HeartHandshake,
  History,
  Building2,
  Globe2,
  Settings,
  Cpu,
  PlusCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  KeyRound,
  Palette,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { useApp, PageRoute } from '../context/AppContext';

export const Sidebar: React.FC<{ onOpenWhyTrusted: () => void }> = ({ onOpenWhyTrusted }) => {
  const {
    currentRoute,
    navigateTo,
    currentUser,
    blockchainStats,
    setShowTutorial,
    setShowLoginModal,
    themeMode,
    colorPalette,
    setShowThemeModal,
  } = useApp();

  const navItems: Array<{ route: PageRoute; label: string; icon: React.FC<{ className?: string }>; badge?: string }> = [
    { route: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { route: 'my-documents', label: 'My Documents', icon: FolderLock },
    { route: 'verify', label: 'Verify', icon: QrCode },
    { route: 'donations', label: 'Donations', icon: HeartHandshake },
    { route: 'audit-trail', label: 'Audit Trail', icon: History },
    { route: 'domains', label: 'Domains', icon: Globe2 },
    { route: 'issuer-portal', label: 'Issuer Portal', icon: Building2, badge: currentUser.role === 'ISSUER' ? 'Active' : undefined },
    { route: 'settings', label: 'Settings', icon: Settings },
  ];

  const isLight = themeMode === 'light';
  const isOled = themeMode === 'oled';

  const sidebarClass = isOled
    ? 'bg-black text-neutral-300 border-neutral-900'
    : isLight
    ? 'bg-white text-slate-700 border-slate-200'
    : 'bg-slate-950/90 text-slate-300 border-white/10';

  const ThemeIcon = themeMode === 'light' ? Sun : themeMode === 'oled' ? Monitor : Moon;

  return (
    <aside className={`hidden lg:flex flex-col w-64 border-r shrink-0 select-none backdrop-blur-xl transition-colors duration-200 ${sidebarClass}`}>
      {/* Quick Action Button */}
      <div className={`p-4 border-b ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
        <button
          onClick={() => navigateTo('issue-wizard')}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-600 hover:from-cyan-300 hover:to-violet-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-slate-950" />
          <span>Issue Credential</span>
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentRoute === item.route;

          return (
            <button
              key={item.route}
              onClick={() => navigateTo(item.route)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
                isActive
                  ? isLight
                    ? 'bg-cyan-50 text-cyan-700 font-semibold border border-cyan-200 shadow-xs'
                    : 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30 shadow-xs shadow-cyan-500/10'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-500' : isLight ? 'text-slate-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-mono uppercase font-bold px-1.5 py-0.5 rounded ${
                  isLight
                    ? 'bg-cyan-100 text-cyan-800 border border-cyan-200'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Login Gateway, Tutorial & Appearance */}
      <div className={`px-4 py-3 border-t space-y-2 ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
        <button
          onClick={() => setShowThemeModal(true)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono font-semibold transition-colors cursor-pointer border ${
            isLight
              ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
          }`}
          title="Theme (OLED / Dark / Light) and Color Palettes"
        >
          <div className="flex items-center gap-2">
            <ThemeIcon className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="capitalize">{themeMode} Theme</span>
          </div>
          <span className="text-[10px] font-mono uppercase opacity-70">{colorPalette}</span>
        </button>

        <button
          onClick={() => setShowLoginModal(true)}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono font-semibold transition-colors cursor-pointer border ${
            isLight
              ? 'bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border-cyan-200'
              : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
          }`}
        >
          <KeyRound className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="truncate">Login Gateway</span>
        </button>

        <button
          onClick={() => setShowTutorial(true)}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
            isLight
              ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-white/10'
          }`}
        >
          <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="truncate">New User Tutorial</span>
        </button>

        <button
          onClick={onOpenWhyTrusted}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer border ${
            isLight
              ? 'bg-transparent hover:bg-slate-50 text-slate-500 border-transparent'
              : 'bg-slate-900/50 hover:bg-slate-900 text-slate-400 border-white/5'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="truncate">Why is this trusted?</span>
        </button>
      </div>

      {/* Blockchain Node Telemetry Card */}
      <div className={`p-4 border-t font-mono text-[11px] ${
        isLight
          ? 'border-slate-100 bg-slate-50 text-slate-600'
          : isOled
          ? 'border-neutral-900 bg-black text-neutral-400'
          : 'border-white/10 bg-black/60 text-slate-400'
      }`}>
        <div className="flex items-center justify-between font-semibold mb-1.5">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>PROOF CONSENSUS</span>
          </span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] border border-emerald-500/30">
            ACTIVE
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="opacity-60">Block Height:</span>
            <span className="text-cyan-500 font-bold">#{blockchainStats?.totalBlocks || '18452312'}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-60">Proofs Anchored:</span>
            <span>{blockchainStats?.activeProofs || '12'}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-60">Consensus Engine:</span>
            <span className="text-indigo-400 text-[10px]">ProofPass ZK-EVM</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
