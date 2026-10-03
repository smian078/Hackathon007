import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  LogOut,
  Building2,
  GraduationCap,
  HeartHandshake,
  ShieldAlert,
  BookOpen,
  Globe2,
  KeyRound,
  Palette,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    switchDemoUser,
    searchQuery,
    setSearchQuery,
    navigateTo,
    notifications,
    clearNotifications,
    loginWithGoogle,
    logout,
    runDemoAction,
    setShowTutorial,
    setShowLoginModal,
    themeMode,
    colorPalette,
    setShowThemeModal,
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('my-documents');
    }
  };

  const isLight = themeMode === 'light';
  const isOled = themeMode === 'oled';

  const headerClass = isOled
    ? 'bg-black/90 border-neutral-900 text-neutral-100'
    : isLight
    ? 'bg-white/90 border-slate-200 text-slate-800 shadow-xs'
    : 'bg-slate-950/85 border-white/10 text-slate-100';

  const ThemeIcon = themeMode === 'light' ? Sun : themeMode === 'oled' ? Monitor : Moon;

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-200 ${headerClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => navigateTo('landing')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-600 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-6 h-6 stroke-[2.2] text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Proof<span className="text-cyan-500">Pass</span>
                </span>
                <span
                  className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                    isLight
                      ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                      : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>PROOF // LEDGER</span>
                </span>
              </div>
              <p className={`hidden md:block text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Verify the document. Trace the record. Trust the proof.
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-md hidden md:flex items-center relative"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by Document ID, holder, issuer, or certificate #..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 text-sm rounded-xl border transition-all outline-none ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400 border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-900 focus:bg-slate-950 text-white placeholder-slate-500 border-white/10 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-xs text-slate-400 hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </form>

          {/* Right Action Icons & User Switcher */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Theme & Palette Picker Button */}
            <button
              onClick={() => setShowThemeModal(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-all cursor-pointer ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
              }`}
              title="Change Theme Mode (OLED, Dark, Light) & Color Palette"
            >
              <ThemeIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline capitalize">{themeMode}</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
            </button>

            {/* New User Tutorial Guide */}
            <button
              onClick={() => setShowTutorial(true)}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-white/10'
              }`}
              title="Open step-by-step tutorial guide"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tutorial</span>
            </button>

            {/* Quick Demo Mode Tour Trigger */}
            <button
              onClick={() => runDemoAction('issue')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-400 font-medium text-xs border border-indigo-500/30 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>Demo Tour</span>
            </button>

            {/* Cryptographic Login Gateway Trigger */}
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 text-cyan-400 font-mono text-xs font-semibold border border-cyan-500/40 shadow-xs transition-all cursor-pointer"
              title="ProofPass Cryptographic Login Gateway"
            >
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Sign In</span>
              <span className="sm:hidden">Login</span>
            </button>

            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className={`relative p-2 rounded-xl transition-colors cursor-pointer ${
                  isLight
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title="Audit Notifications"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full ring-2 ring-slate-950 animate-pulse"></span>
                )}
              </button>

              {showNotifMenu && (
                <div
                  className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-2xl border p-3.5 z-50 animate-in fade-in zoom-in-95 duration-100 ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-800 shadow-slate-300'
                      : isOled
                      ? 'bg-black border-neutral-800 text-neutral-200 shadow-black'
                      : 'bg-slate-950/95 backdrop-blur-2xl border-white/15 text-slate-200'
                  }`}
                >
                  <div className={`flex items-center justify-between pb-2.5 border-b mb-2 ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
                    <span className="text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Ledger Notifications ({notifications.length})</span>
                    </span>
                    <button
                      onClick={clearNotifications}
                      className="text-[11px] text-cyan-500 hover:underline font-mono"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className={`text-xs text-center py-4 font-mono ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>No new ledger events</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-xl border transition-colors flex items-start gap-2.5 ${
                            isLight
                              ? 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                              : 'bg-slate-900/80 hover:bg-slate-900 border-white/5'
                          }`}
                        >
                          {n.type === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          ) : n.type === 'warning' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          ) : (
                            <FileCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-semibold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{n.title}</p>
                            <p className={`text-[11px] truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{n.message}</p>
                            <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={currentUser.email ? () => logout() : () => loginWithGoogle()}
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 shadow-2xs'
                  : 'bg-slate-900/80 hover:bg-slate-900 border-white/10 hover:border-cyan-500/40 text-slate-200'
              }`}
              title={currentUser.email ? `Signed in as ${currentUser.email}. Click to sign out.` : 'Sign in with Google Account'}
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              <span>{currentUser.email ? 'Sign Out' : 'Google'}</span>
            </button>

            {/* Role & User Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border transition-colors cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300'
                    : 'bg-slate-900/70 hover:bg-slate-900 border-white/10 hover:border-cyan-500/40'
                }`}
              >
                <div className="w-7 h-7 rounded-full overflow-hidden bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 font-bold text-xs shrink-0">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    currentUser.name.charAt(0)
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className={`text-xs font-semibold leading-tight ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-cyan-500 font-mono font-medium leading-none">
                    {currentUser.role}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleMenu && (
                <div
                  className={`absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl border p-2 z-50 animate-in fade-in zoom-in-95 duration-100 ${
                    isLight
                      ? 'bg-white border-slate-200 text-slate-800 shadow-slate-300'
                      : isOled
                      ? 'bg-black border-neutral-800 text-neutral-100 shadow-black'
                      : 'bg-slate-950/95 backdrop-blur-2xl border-white/15 text-slate-200'
                  }`}
                >
                  <div className={`px-3 py-2 border-b mb-1 ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
                    <p className={`text-[10px] font-bold font-mono uppercase tracking-wider ${isLight ? 'text-slate-400' : 'text-slate-400'}`}>
                      Active ProofPass Identity
                    </p>
                    <p className={`text-xs font-medium truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {currentUser.email}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setShowRoleMenu(false);
                        setShowLoginModal(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono font-semibold text-cyan-500 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors text-left cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Switch Account Gateway</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowRoleMenu(false);
                        setShowThemeModal(true);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono font-semibold transition-colors text-left cursor-pointer border ${
                        isLight
                          ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                          : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                      }`}
                    >
                      <Palette className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Appearance & Theme</span>
                    </button>

                    <button
                      onClick={() => {
                        switchDemoUser('student');
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
                        currentUser.role === 'HOLDER'
                          ? 'bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30'
                          : isLight
                          ? 'text-slate-700 hover:bg-slate-100'
                          : 'text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <p className="leading-tight">Rahul Sharma</p>
                        <p className="text-[10px] text-slate-400">Student (Holder)</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        switchDemoUser('issuer');
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
                        currentUser.role === 'ISSUER'
                          ? 'bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30'
                          : isLight
                          ? 'text-slate-700 hover:bg-slate-100'
                          : 'text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-purple-400 shrink-0" />
                      <div>
                        <p className="leading-tight">Dr. Aris Thorne</p>
                        <p className="text-[10px] text-slate-400">ABC University (Issuer)</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        switchDemoUser('donor');
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
                        currentUser.role === 'DONOR'
                          ? 'bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30'
                          : isLight
                          ? 'text-slate-700 hover:bg-slate-100'
                          : 'text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <HeartHandshake className="w-4 h-4 text-teal-400 shrink-0" />
                      <div>
                        <p className="leading-tight">Priya Mehta</p>
                        <p className="text-[10px] text-slate-400">Philanthropist (Donor)</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        switchDemoUser('admin');
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer ${
                        currentUser.role === 'ADMIN'
                          ? 'bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30'
                          : isLight
                          ? 'text-slate-700 hover:bg-slate-100'
                          : 'text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                      <div>
                        <p className="leading-tight">Aarav Patel</p>
                        <p className="text-[10px] text-slate-400">System Admin</p>
                      </div>
                    </button>
                  </div>

                  <div className={`pt-1 mt-1 border-t ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
                    <button
                      onClick={() => {
                        logout();
                        setShowRoleMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
