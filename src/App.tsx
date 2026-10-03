/**
 * ProofPass - Digital Document Wallet & Blockchain Verification Platform
 * Tagline: "Verify the document. Trace the record. Trust the proof."
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { DemoBar } from './components/DemoBar';
import { WhyTrustedModal } from './components/WhyTrustedModal';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { MyDocuments } from './pages/MyDocuments';
import { DocumentDetail } from './pages/DocumentDetail';
import { PublicVerifyPage } from './pages/PublicVerifyPage';
import { DonationTrackingPage } from './pages/DonationTrackingPage';
import { IssueDocumentWizard } from './pages/IssueDocumentWizard';
import { IssuerPortal } from './pages/IssuerPortal';
import { AuditTrailPage } from './pages/AuditTrailPage';
import { DomainPage } from './pages/DomainPage';
import { SettingsPage } from './pages/SettingsPage';
import { UserTutorialModal } from './components/UserTutorialModal';
import { GatewayLoginModal } from './components/GatewayLoginModal';
import { ThemeModal } from './components/ThemeModal';
import { CosmicCanvas } from './components/CosmicCanvas';

function AppContent() {
  const {
    currentRoute,
    navigateTo,
    showTutorial,
    setShowTutorial,
    showLoginModal,
    setShowLoginModal,
    showThemeModal,
    setShowThemeModal,
    themeMode,
    colorPalette,
  } = useApp();
  const [showWhyTrusted, setShowWhyTrusted] = useState(false);

  // Check URL pathname for deep-link / QR verification e.g., /verify/:id
  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname.startsWith('/verify/')) {
      const docId = pathname.replace('/verify/', '');
      if (docId) {
        navigateTo('verify', { docId });
      }
    }
  }, []);

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'landing':
        return <LandingPage />;
      case 'dashboard':
        return <Dashboard />;
      case 'my-documents':
        return <MyDocuments />;
      case 'document-detail':
        return <DocumentDetail />;
      case 'verify':
        return <PublicVerifyPage />;
      case 'donations':
      case 'donation-detail':
        return <DonationTrackingPage />;
      case 'issuer-portal':
        return <IssuerPortal />;
      case 'issue-wizard':
        return <IssueDocumentWizard />;
      case 'audit-trail':
        return <AuditTrailPage />;
      case 'domains':
        return <DomainPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  const isLight = themeMode === 'light';
  const isOled = themeMode === 'oled';

  const bgClass = isOled
    ? 'bg-black text-neutral-100 selection:bg-cyan-500/30 selection:text-cyan-200'
    : isLight
    ? 'bg-slate-50 text-slate-900 selection:bg-cyan-500/20 selection:text-cyan-800'
    : 'bg-[#0b0f19] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200';

  if (currentRoute === 'landing') {
    return (
      <div
        data-theme={themeMode}
        data-palette={colorPalette}
        className={`min-h-screen flex flex-col font-sans antialiased relative overflow-hidden transition-colors duration-200 ${bgClass}`}
      >
        <DemoBar />
        <Navbar />
        <main className="flex-1 relative z-10">{renderCurrentPage()}</main>
        <footer
          className={`relative z-10 border-t py-8 text-center text-xs space-y-2 backdrop-blur-md transition-colors ${
            isLight
              ? 'bg-white/80 border-slate-200 text-slate-500'
              : isOled
              ? 'bg-black/90 border-neutral-900 text-neutral-400'
              : 'bg-slate-950/80 border-white/10 text-slate-400'
          }`}
        >
          <p className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
            ProofPass • Decentralized Document Wallet & Ledger
          </p>
          <p className="font-mono text-[11px] opacity-75">
            “Verify the document. Trace the record. Trust the proof.” • Neural Consensus Protocol
          </p>
        </footer>
        <UserTutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
        <GatewayLoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        <ThemeModal isOpen={showThemeModal} onClose={() => setShowThemeModal(false)} />
      </div>
    );
  }

  return (
    <div
      data-theme={themeMode}
      data-palette={colorPalette}
      className={`min-h-screen flex flex-col font-sans antialiased relative overflow-hidden transition-colors duration-200 ${bgClass}`}
    >
      {/* 1-Click Hackathon Demo Bar */}
      <DemoBar />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        <Sidebar onOpenWhyTrusted={() => setShowWhyTrusted(true)} />

        <main className="flex-1 overflow-y-auto pb-20 lg:pb-10 relative">
          {/* Ambient luminous glow & cosmic substrate */}
          {!isLight && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35">
              <CosmicCanvas
                interactive={false}
                palette={colorPalette}
                themeMode={themeMode}
                intensity={0.4}
                showRings={false}
              />
            </div>
          )}
          {!isLight && (
            <>
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/12 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            </>
          )}
          <div className="relative z-10">
            {renderCurrentPage()}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Why Is This Trusted Modal */}
      <WhyTrustedModal isOpen={showWhyTrusted} onClose={() => setShowWhyTrusted(false)} />

      {/* Interactive New User Tutorial Modal */}
      <UserTutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} />

      {/* Cryptographic Gateway Login Modal */}
      <GatewayLoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      {/* Theme & Palette Customizer Modal */}
      <ThemeModal isOpen={showThemeModal} onClose={() => setShowThemeModal(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
