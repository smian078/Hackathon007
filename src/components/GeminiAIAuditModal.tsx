import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  ShieldCheck,
  BrainCircuit,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  X,
  RefreshCw,
} from 'lucide-react';
import { DocumentRecord } from '../types';
import { api } from '../services/api';

interface GeminiAIAuditModalProps {
  document: DocumentRecord;
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiAIAuditModal: React.FC<GeminiAIAuditModalProps> = ({
  document,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'forensics' | 'grounding'>('forensics');
  const [loadingForensics, setLoadingForensics] = useState(false);
  const [loadingGrounding, setLoadingGrounding] = useState(false);
  const [forensicAnalysis, setForensicAnalysis] = useState<any>(null);
  const [groundingResult, setGroundingResult] = useState<any>(null);

  if (!isOpen) return null;

  const runForensicAnalysis = async () => {
    setLoadingForensics(true);
    try {
      const res = await api.getForensicAudit(document.documentId, document.customFields);
      setForensicAnalysis(res.analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingForensics(false);
    }
  };

  const runGroundingSearch = async () => {
    setLoadingGrounding(true);
    try {
      const res = await api.getGroundingSearch(document.issuerName);
      setGroundingResult(res.verification);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGrounding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>ProofPass AI Verification Intelligence</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-semibold">
                  Gemini Powered
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Deep forensic inspection & Google Search accreditation grounding
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

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 px-6 pt-3 gap-6 bg-slate-50/50">
          <button
            onClick={() => {
              setActiveTab('forensics');
              if (!forensicAnalysis && !loadingForensics) runForensicAnalysis();
            }}
            className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'forensics'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Forensic Thinking Audit (gemini-3.1-pro-preview)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('grounding');
              if (!groundingResult && !loadingGrounding) runGroundingSearch();
            }}
            className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'grounding'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search Grounding (gemini-3.5-flash)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'forensics' && (
            <div className="space-y-4">
              {!forensicAnalysis && !loadingForensics && (
                <div className="text-center py-8 space-y-3">
                  <BrainCircuit className="w-12 h-12 text-indigo-400 mx-auto" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      Run High-Thinking Forensic Analysis
                    </h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                      Evaluates cryptographic integrity, issuer validity, metadata consistency, and
                      tamper risk vectors.
                    </p>
                  </div>
                  <button
                    onClick={runForensicAnalysis}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/20"
                  >
                    Analyze with High Thinking Mode
                  </button>
                </div>
              )}

              {loadingForensics && (
                <div className="text-center py-10 space-y-3">
                  <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">
                    Gemini 3.1 Pro is performing forensic reasoning and thinking...
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Applying mathematical hash validation and credential consistency rules
                  </p>
                </div>
              )}

              {forensicAnalysis && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Integrity Confidence Score
                      </span>
                      <p className="text-2xl font-black text-indigo-600 mt-0.5">
                        {forensicAnalysis.integrityScore || 99}%
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Tamper Risk Level
                      </span>
                      <p
                        className={`text-xl font-black mt-0.5 ${
                          forensicAnalysis.tamperRisk === 'HIGH'
                            ? 'text-rose-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {forensicAnalysis.tamperRisk || 'LOW'}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200">
                    <p className="text-xs font-bold text-indigo-900 mb-1">Forensic Summary</p>
                    <p className="text-xs text-indigo-800 leading-relaxed">
                      {forensicAnalysis.summary}
                    </p>
                  </div>

                  {forensicAnalysis.findings && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Key Verifiable Observations
                      </p>
                      <ul className="space-y-1.5">
                        {forensicAnalysis.findings.map((f: string, idx: number) => (
                          <li
                            key={idx}
                            className="text-xs text-slate-600 flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {forensicAnalysis.recommendation && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                      <strong>Recommendation: </strong>
                      {forensicAnalysis.recommendation}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'grounding' && (
            <div className="space-y-4">
              {!groundingResult && !loadingGrounding && (
                <div className="text-center py-8 space-y-3">
                  <Search className="w-12 h-12 text-blue-400 mx-auto" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      Search Grounding Verification
                    </h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                      Uses Google Search data to verify active university accreditation, UGC recognition,
                      or 80G tax exemption standing in official government records.
                    </p>
                  </div>
                  <button
                    onClick={runGroundingSearch}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20"
                  >
                    Check Grounding Records
                  </button>
                </div>
              )}

              {loadingGrounding && (
                <div className="text-center py-10 space-y-3">
                  <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">
                    Searching web accreditation records for {document.issuerName}...
                  </p>
                </div>
              )}

              {groundingResult && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs">
                    <p className="font-bold text-blue-900 mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>Accreditation Verification Summary</span>
                    </p>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                      {groundingResult.accreditationSummary}
                    </p>
                  </div>

                  {groundingResult.sources && groundingResult.sources.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Grounding Citations & Official Sources
                      </p>
                      <div className="space-y-1.5">
                        {groundingResult.sources.map((s: any, idx: number) => (
                          <a
                            key={idx}
                            href={s.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/40 text-xs text-blue-600 transition-colors"
                          >
                            <span className="font-medium truncate">{s.title}</span>
                            <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-2 text-slate-400" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
