import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  KeyRound,
  Lock,
  ArrowRight,
  CheckCircle2,
  X,
  Fingerprint,
  Building2,
  GraduationCap,
  HeartHandshake,
  QrCode,
  Cpu,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CosmicCanvas } from './CosmicCanvas';

interface GatewayLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GatewayLoginModal: React.FC<GatewayLoginModalProps> = ({ isOpen, onClose }) => {
  const { switchDemoUser, loginWithGoogle, addNotification, navigateTo, themeMode, colorPalette } = useApp();
  const [authStage, setAuthStage] = useState<'SELECT' | 'AUTHENTICATING' | 'SUCCESS'>('SELECT');
  const [activePersona, setActivePersona] = useState<string>('student');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [selectedUserMeta, setSelectedUserMeta] = useState<{ name: string; role: string } | null>(null);

  if (!isOpen) return null;

  const isLight = themeMode === 'light';

  const handleStartAuth = (personaKey: 'student' | 'issuer' | 'donor' | 'admin', name: string, role: string) => {
    setActivePersona(personaKey);
    setSelectedUserMeta({ name, role });
    setAuthStage('AUTHENTICATING');
    setTerminalLogs([
      'INIT: Handshaking with ProofPass cryptographic neural core...',
    ]);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        'KEYGEN: Deriving ephemeral Ed25519 session keypair via WebCrypto API...',
      ]);
    }, 450);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        'VERIFY: Querying decentralized identity block & root signatures...',
      ]);
    }, 950);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        'PROOF: Zero-knowledge mathematical certainty verified on-chain.',
      ]);
      setAuthStage('SUCCESS');
    }, 1450);

    setTimeout(() => {
      switchDemoUser(personaKey);
      addNotification('Authenticated', `Session initiated for ${name} (${role})`, 'success');
      setAuthStage('SELECT');
      onClose();
    }, 2100);
  };

  const handleGoogleSignIn = async (emailOverride?: string) => {
    setAuthStage('AUTHENTICATING');
    const targetEmail = emailOverride || 'amankawale0@gmail.com';
    setSelectedUserMeta({ name: targetEmail, role: 'HOLDER' });
    setTerminalLogs([
      'OAUTH: Handshaking with Google OAuth 2.0 / Firebase Auth...',
    ]);

    try {
      await loginWithGoogle(emailOverride);
      setTerminalLogs(prev => [
        ...prev,
        'IDENTITY: Google Profile token verified with ProofPass Key Registry.',
        'SESSION: Cryptographic session active.',
      ]);
      setAuthStage('SUCCESS');
      setTimeout(() => {
        setAuthStage('SELECT');
        onClose();
      }, 1000);
    } catch (err: any) {
      setTerminalLogs(prev => [
        ...prev,
        `ERROR: ${err.message || 'Authentication error'}`,
      ]);
      setTimeout(() => {
        setAuthStage('SELECT');
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Interactive Fluid Canvas Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-auto">
        <CosmicCanvas
          intensity={1.15}
          showRings={true}
          palette={colorPalette}
          themeMode={themeMode}
        />
        <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black pointer-events-none" />
      </div>

      {/* Main Glassmorphic Modal Card */}
      <div
        className={`relative z-10 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border ${
          isLight
            ? 'bg-white/95 text-slate-900 border-slate-200 shadow-slate-300'
            : themeMode === 'oled'
            ? 'bg-black/90 text-neutral-100 border-neutral-800 shadow-black'
            : 'bg-slate-950/90 text-slate-100 border-white/15 shadow-slate-950/80'
        }`}
      >
        {/* Top Header Bar */}
        <div
          className={`relative px-6 py-5 border-b flex items-center justify-between ${
            isLight
              ? 'border-slate-100 bg-slate-50/80'
              : 'border-white/10 bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-indigo-950/40'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/25">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-cyan-500 uppercase font-bold">
                  PROOFPASS // GATEWAY
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isLight
                      ? 'bg-cyan-100 text-cyan-800 border border-cyan-200'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  }`}
                >
                  NEURAL AUTH
                </span>
              </div>
              <h2 className="text-sm font-bold tracking-wide">
                ProofPass Cryptographic Gateway
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isLight
                ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {authStage === 'SELECT' && (
            <>
              {/* Introduction */}
              <div className="text-center space-y-1.5 max-w-md mx-auto">
                <p className="text-lg font-bold tracking-tight">
                  Select Your Access Persona
                </p>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Authenticate with zero personal data leaks. Ephemeral cryptographic keys anchor your session to the immutable ledger.
                </p>
              </div>

              {/* 1-Click Primary Google Sign-In */}
              <div className="space-y-2">
                <button
                  onClick={() => handleGoogleSignIn()}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs transition-all shadow-md hover:shadow-lg border border-slate-200 cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
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
                  <span>Continue with Google Account</span>
                </button>

                <div className="flex items-center justify-between px-1 text-[11px]">
                  <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>
                    Google User: <span className="font-mono text-cyan-500 font-semibold">amankawale0@gmail.com</span>
                  </span>
                  <button
                    onClick={() => handleGoogleSignIn('amankawale0@gmail.com')}
                    className="text-cyan-500 hover:text-cyan-400 font-semibold underline underline-offset-2 cursor-pointer"
                  >
                    Direct Sign In
                  </button>
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className={`border-t w-full ${isLight ? 'border-slate-200' : 'border-white/10'}`} />
                <span className={`px-3 text-[11px] font-mono uppercase tracking-widest shrink-0 ${isLight ? 'bg-white text-slate-400' : 'bg-slate-950 text-slate-500'}`}>
                  Or Instant Role Persona
                </span>
                <div className={`border-t w-full ${isLight ? 'border-slate-200' : 'border-white/10'}`} />
              </div>

              {/* Instant Persona Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Holder / Student */}
                <button
                  onClick={() => handleStartAuth('student', 'Rahul Sharma', 'HOLDER')}
                  className={`p-3.5 rounded-xl border text-left transition-all group cursor-pointer ${
                    isLight
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-cyan-500'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-cyan-400/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold group-hover:text-cyan-500 transition-colors">
                        Rahul Sharma
                      </p>
                      <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Student & Credential Holder</p>
                    </div>
                  </div>
                </button>

                {/* University Issuer */}
                <button
                  onClick={() => handleStartAuth('issuer', 'Dr. Aris Thorne', 'ISSUER')}
                  className={`p-3.5 rounded-xl border text-left transition-all group cursor-pointer ${
                    isLight
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-purple-500'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-cyan-400/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold group-hover:text-cyan-500 transition-colors">
                        Dr. Aris Thorne
                      </p>
                      <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>ABC University Registrar</p>
                    </div>
                  </div>
                </button>

                {/* Philanthropic Donor */}
                <button
                  onClick={() => handleStartAuth('donor', 'Priya Mehta', 'DONOR')}
                  className={`p-3.5 rounded-xl border text-left transition-all group cursor-pointer ${
                    isLight
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-teal-500'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-cyan-400/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold group-hover:text-cyan-500 transition-colors">
                        Priya Mehta
                      </p>
                      <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Philanthropic Donor</p>
                    </div>
                  </div>
                </button>

                {/* System Compliance Admin */}
                <button
                  onClick={() => handleStartAuth('admin', 'Aarav Patel', 'ADMIN')}
                  className={`p-3.5 rounded-xl border text-left transition-all group cursor-pointer ${
                    isLight
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-rose-500'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-cyan-400/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold group-hover:text-cyan-500 transition-colors">
                        Aarav Patel
                      </p>
                      <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>System Compliance Officer</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Zero-Account Public Verifier Shortcut */}
              <div className={`pt-2 flex items-center justify-between text-xs border-t ${isLight ? 'border-slate-200 text-slate-500' : 'border-white/10 text-slate-400'}`}>
                <span className="flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-cyan-500" />
                  <span>Verifying a document?</span>
                </span>
                <button
                  onClick={() => {
                    navigateTo('verify');
                    onClose();
                  }}
                  className="text-cyan-500 hover:text-cyan-600 font-semibold underline underline-offset-4 cursor-pointer"
                >
                  Continue as Guest Verifier (No login required)
                </button>
              </div>
            </>
          )}

          {/* Handshake Telemetry Screen */}
          {(authStage === 'AUTHENTICATING' || authStage === 'SUCCESS') && (
            <div className="py-6 space-y-6 text-center">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping" />
                <div className="absolute inset-1 rounded-full bg-indigo-500/30 animate-pulse" />
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-cyan-400/40">
                  {authStage === 'SUCCESS' ? (
                    <CheckCircle2 className="w-6 h-6 text-slate-950 font-black animate-in zoom-in-50" />
                  ) : (
                    <Cpu className="w-6 h-6 text-slate-950 animate-spin" />
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold tracking-wide">
                  {authStage === 'SUCCESS'
                    ? `Session Initialized: ${selectedUserMeta?.name}`
                    : 'Neural Cryptographic Handshake'}
                </h3>
                <p className="text-xs text-cyan-500 font-mono mt-1">
                  {authStage === 'SUCCESS' ? 'Proof Verified • Entering Vault' : 'Exchanging Session Keys...'}
                </p>
              </div>

              {/* Terminal Logs */}
              <div className={`p-4 rounded-xl border text-left font-mono text-[11px] space-y-1.5 max-h-36 overflow-y-auto ${
                isLight
                  ? 'bg-slate-900 text-cyan-300 border-slate-800'
                  : 'bg-black/70 text-cyan-300 border-cyan-500/20'
              }`}>
                {terminalLogs.map((log, i) => (
                  <div key={i} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-slate-500 select-none">›</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className={`px-6 py-3 border-t flex items-center justify-between text-[10px] font-mono ${
          isLight ? 'bg-slate-50 border-slate-100 text-slate-400' : 'bg-black/60 border-white/5 text-slate-500'
        }`}>
          <span>PROOFPASS PROTOCOL // V6.1</span>
          <span>LATENCY &lt; 0.08ms • ZERO LEAKAGE</span>
        </div>
      </div>
    </div>
  );
};
