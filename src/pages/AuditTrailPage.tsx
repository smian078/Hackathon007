import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Blocks,
  ShieldCheck,
  Building2,
  User,
  ExternalLink,
  Calendar,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuditTrailPage: React.FC = () => {
  const { auditEvents, navigateTo } = useApp();
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredEvents = auditEvents.filter(event => {
    const matchesAction = filterAction === 'ALL' || event.action.includes(filterAction);
    const matchesSearch =
      !searchQuery ||
      event.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.documentId && event.documentId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (event.blockchainTx && event.blockchainTx.toLowerCase().includes(searchQuery.toLowerCase())) ||
      event.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAction && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest block">
            Immutable Activity Log
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5 mt-0.5">
            <History className="w-6 h-6 text-blue-600" />
            <span>Chronological Audit Trail & Event Ledger</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Every issuance, blockchain block anchoring, verification check, and revocation is recorded
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
            {auditEvents.length} Total Events
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          {['ALL', 'Issued', 'Blockchain', 'Verified', 'Revoked'].map(f => (
            <button
              key={f}
              onClick={() => setFilterAction(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterAction === f
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f === 'ALL' ? 'All Events' : f}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Chronological Timeline from Section 18 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="relative border-l-2 border-slate-200 ml-4 sm:ml-8 space-y-8">
          {filteredEvents.map(event => (
            <div key={event.id} className="relative pl-6 sm:pl-8 group">
              {/* Timeline Node Icon */}
              <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center text-blue-600 shadow-xs">
                {event.action.includes('Revoked') ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                ) : event.action.includes('Blockchain') ? (
                  <Blocks className="w-4 h-4 text-purple-600" />
                ) : event.action.includes('Verified') ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                )}
              </div>

              {/* Event Card Content */}
              <div className="bg-slate-50/70 group-hover:bg-blue-50/30 p-4 rounded-xl border border-slate-200/80 transition-all space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <span className="font-bold text-slate-900 text-sm">{event.action}</span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {new Date(event.timestamp).toLocaleString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {event.details}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-y-1 gap-x-4 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span>Actor: </span>
                    <strong className="text-slate-800">{event.actor}</strong>
                    <span className="text-slate-400">({event.actorRole})</span>
                  </div>

                  {event.documentId && (
                    <button
                      onClick={() => navigateTo('document-detail', { docId: event.documentId })}
                      className="text-blue-600 hover:underline font-mono"
                    >
                      {event.documentId}
                    </button>
                  )}

                  {event.blockchainTx && (
                    <div className="flex items-center gap-1 font-mono text-purple-600 truncate max-w-[220px]">
                      <span>Tx:</span>
                      <span className="truncate">{event.blockchainTx}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
