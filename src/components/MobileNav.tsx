import React from 'react';
import {
  LayoutDashboard,
  FolderLock,
  QrCode,
  HeartHandshake,
  Globe2,
  KeyRound,
  Palette,
} from 'lucide-react';
import { useApp, PageRoute } from '../context/AppContext';

export const MobileNav: React.FC = () => {
  const { currentRoute, navigateTo, setShowLoginModal, setShowThemeModal, themeMode } = useApp();

  const isLight = themeMode === 'light';
  const isOled = themeMode === 'oled';

  const navClass = isOled
    ? 'bg-black/95 border-neutral-900 text-neutral-300'
    : isLight
    ? 'bg-white/95 border-slate-200 text-slate-700 shadow-md'
    : 'bg-slate-950/95 border-white/10 text-slate-300';

  const navItems: Array<{ route: PageRoute | 'login' | 'theme'; label: string; icon: React.FC<{ className?: string }> }> = [
    { route: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { route: 'my-documents', label: 'Vault', icon: FolderLock },
    { route: 'verify', label: 'Verify', icon: QrCode },
    { route: 'donations', label: 'Donations', icon: HeartHandshake },
    { route: 'theme', label: 'Theme', icon: Palette },
    { route: 'login', label: 'Login', icon: KeyRound },
  ];

  return (
    <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t px-2 py-1 shadow-2xl transition-colors ${navClass}`}>
      <div className="flex items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentRoute === item.route;

          return (
            <button
              key={item.route}
              onClick={() => {
                if (item.route === 'login') {
                  setShowLoginModal(true);
                } else if (item.route === 'theme') {
                  setShowThemeModal(true);
                } else {
                  navigateTo(item.route);
                }
              }}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-xs transition-colors cursor-pointer ${
                isActive ? 'text-cyan-500 font-semibold' : isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-cyan-500' : isLight ? 'text-slate-500' : 'text-slate-400'}`} />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
