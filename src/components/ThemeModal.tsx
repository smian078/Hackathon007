import React from 'react';
import {
  Sun,
  Moon,
  Sparkles,
  Check,
  X,
  Palette,
  Laptop,
  Monitor,
} from 'lucide-react';
import { useApp, ThemeMode, ColorPalette } from '../context/AppContext';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({ isOpen, onClose }) => {
  const { themeMode, setThemeMode, colorPalette, setColorPalette } = useApp();

  if (!isOpen) return null;

  const themeModes: Array<{
    id: ThemeMode;
    label: string;
    sublabel: string;
    icon: React.FC<{ className?: string }>;
    previewBg: string;
    previewBorder: string;
    previewCard: string;
  }> = [
    {
      id: 'oled',
      label: 'OLED Black',
      sublabel: 'Pure pitch black (#000000), ultimate contrast & battery efficiency',
      icon: Monitor,
      previewBg: 'bg-black',
      previewBorder: 'border-neutral-800',
      previewCard: 'bg-neutral-900',
    },
    {
      id: 'dark',
      label: 'Midnight Dark',
      sublabel: 'Deep space cosmic slate (#0b0f19) with cool indigo undertones',
      icon: Moon,
      previewBg: 'bg-[#0b0f19]',
      previewBorder: 'border-slate-800',
      previewCard: 'bg-slate-900',
    },
    {
      id: 'light',
      label: 'Clean Light',
      sublabel: 'High-contrast daylight mode (#f8fafc) with crisp paper white cards',
      icon: Sun,
      previewBg: 'bg-slate-100',
      previewBorder: 'border-slate-300',
      previewCard: 'bg-white',
    },
  ];

  const palettes: Array<{
    id: ColorPalette;
    name: string;
    badge: string;
    accentClass: string;
    gradientClass: string;
    dotClass: string;
  }> = [
    {
      id: 'cyan',
      name: 'Cyber Sky',
      badge: '#06B6D4',
      accentClass: 'border-cyan-500 text-cyan-400',
      gradientClass: 'from-cyan-400 to-blue-500',
      dotClass: 'bg-cyan-400',
    },
    {
      id: 'emerald',
      name: 'Neo Emerald',
      badge: '#10B981',
      accentClass: 'border-emerald-500 text-emerald-400',
      gradientClass: 'from-emerald-400 to-teal-500',
      dotClass: 'bg-emerald-400',
    },
    {
      id: 'indigo',
      name: 'Cosmic Violet',
      badge: '#6366F1',
      accentClass: 'border-indigo-500 text-indigo-400',
      gradientClass: 'from-indigo-400 to-purple-500',
      dotClass: 'bg-indigo-400',
    },
    {
      id: 'amber',
      name: 'Solar Amber',
      badge: '#F59E0B',
      accentClass: 'border-amber-500 text-amber-400',
      gradientClass: 'from-amber-400 to-orange-500',
      dotClass: 'bg-amber-400',
    },
    {
      id: 'rose',
      name: 'Crimson Ruby',
      badge: '#F43F5E',
      accentClass: 'border-rose-500 text-rose-400',
      gradientClass: 'from-rose-400 to-pink-500',
      dotClass: 'bg-rose-400',
    },
  ];

  const isLight = themeMode === 'light';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className={`relative z-10 w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden flex flex-col transition-colors duration-200 ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900 shadow-slate-300'
            : themeMode === 'oled'
            ? 'bg-black border-neutral-800 text-neutral-100 shadow-black'
            : 'bg-slate-950 border-slate-800 text-slate-100 shadow-slate-950'
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-5 border-b flex items-center justify-between ${
            isLight
              ? 'border-slate-100 bg-slate-50'
              : 'border-white/10 bg-white/5'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-cyan-500">
                  VISUAL ENGINE
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase ${
                    isLight
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {themeMode} • {colorPalette}
                </span>
              </div>
              <h2 className="text-sm font-bold tracking-wide">
                Theme & Color Palette Settings
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

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Section 1: Base Theme Modes */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold uppercase tracking-wider block opacity-70">
              01. Background Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {themeModes.map(mode => {
                const Icon = mode.icon;
                const isSelected = themeMode === mode.id;

                return (
                  <button
                    key={mode.id}
                    onClick={() => setThemeMode(mode.id)}
                    className={`relative p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-28 ${
                      isSelected
                        ? isLight
                          ? 'border-cyan-600 bg-cyan-50/50 ring-2 ring-cyan-500/20 shadow-md'
                          : 'border-cyan-400 bg-white/10 ring-2 ring-cyan-400/30 shadow-lg shadow-cyan-950/40'
                        : isLight
                        ? 'border-slate-200 hover:border-slate-300 bg-slate-50'
                        : 'border-white/10 hover:border-white/20 bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isSelected
                            ? 'bg-cyan-500 text-white'
                            : isLight
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-white/10 text-slate-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-cyan-500 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-bold">{mode.label}</p>
                      <p className="text-[10px] opacity-60 leading-tight mt-0.5 line-clamp-2">
                        {mode.sublabel}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Color Palette */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold uppercase tracking-wider block opacity-70">
              02. Accent Color Palette
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {palettes.map(p => {
                const isSelected = colorPalette === p.id;

                return (
                  <button
                    key={p.id}
                    onClick={() => setColorPalette(p.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-2 group ${
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
                      <span className="text-[10px] font-mono opacity-50 block mt-0.5">
                        {p.badge}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Preview Sample */}
          <div
            className={`p-4 rounded-2xl border text-xs space-y-2 ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-800'
                : 'bg-white/5 border-white/10 text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold uppercase opacity-70">
                Live Theme Preview
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400">
                ACTIVE
              </span>
            </div>
            <p className="opacity-80 leading-relaxed text-[11px]">
              Theme mode is applied dynamically to cryptographic canvases, ledger cards, borders, and navigation. Saved to local browser preferences.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`px-6 py-4 border-t flex items-center justify-between ${
            isLight
              ? 'border-slate-100 bg-slate-50'
              : 'border-white/10 bg-black/50'
          }`}
        >
          <span className="text-[11px] font-mono opacity-50">
            ProofPass Visual Engine v6.1
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
