import React, { useState, useEffect } from 'react';
import {
  StickyNote,
  Copy,
  Check,
  X,
  ExternalLink,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { DocumentRecord } from '../types';
import { api } from '../services/api';

interface GoogleKeepExportModalProps {
  document: DocumentRecord;
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleKeepExportModal: React.FC<GoogleKeepExportModalProps> = ({
  document,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadKeepSummary();
    }
  }, [isOpen, document.documentId]);

  const loadKeepSummary = async () => {
    setLoading(true);
    try {
      const res = await api.getQuickSummary({
        documentId: document.documentId,
        title: document.title,
        holderName: document.holderName,
        issuerName: document.issuerName,
        status: document.status,
        hash: document.documentHash,
      });

      setNoteTitle(res.noteTitle || `ProofPass Audit: ${document.title}`);
      setNoteBody(
        res.noteBody ||
          `✓ Verified: ${document.title}\n• Recipient: ${document.holderName}\n• Issuer: ${document.issuerName}\n• SHA-256: ${document.documentHash}\n• Blockchain Tx: ${document.blockchainTx}\n• Status: ${document.status}`
      );
    } catch {
      setNoteTitle(`ProofPass Audit: ${document.title}`);
      setNoteBody(
        `✓ Verified: ${document.title}\n• Recipient: ${document.holderName}\n• Issuer: ${document.issuerName}\n• SHA-256: ${document.documentHash}`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleCopy = () => {
    const fullText = `${noteTitle}\n\n${noteBody}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openGoogleKeep = () => {
    // Opens Google Keep directly
    window.open('https://keep.google.com', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-amber-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <StickyNote className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <span>Save Audit Note to Google Keep</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Export verifiable proof summary into your personal notes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {loading ? (
            <div className="py-8 text-center space-y-2">
              <RefreshCw className="w-6 h-6 text-amber-500 animate-spin mx-auto" />
              <p className="text-xs text-slate-600 font-medium">
                Formatting audit memo with Gemini Flash-Lite...
              </p>
            </div>
          ) : (
            <>
              {/* Keep Card Mockup */}
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 shadow-xs space-y-2">
                <input
                  type="text"
                  value={noteTitle}
                  onChange={e => setNoteTitle(e.target.value)}
                  className="w-full font-bold text-sm text-slate-900 bg-transparent border-b border-amber-200 pb-1 outline-none"
                  placeholder="Note Title"
                />
                <textarea
                  rows={6}
                  value={noteBody}
                  onChange={e => setNoteBody(e.target.value)}
                  className="w-full text-xs text-slate-700 bg-transparent outline-none font-mono resize-none leading-relaxed"
                  placeholder="Note content..."
                />
              </div>

              <p className="text-[11px] text-slate-500">
                This note contains immutable proof identifiers, the registered SHA-256 fingerprint, and
                accredited issuer signatures.
              </p>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={openGoogleKeep}
            className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-800 font-medium"
          >
            <span>Open Google Keep</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy to Keep'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
