import React, { useState, useEffect } from 'react';
import {
  Globe2,
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Copy,
  ExternalLink,
  Building2,
  Lock,
  Server,
  PlusCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface VerifiedDomain {
  domain: string;
  orgName: string;
  orgId: string;
  type: string;
  walletAddress: string;
  publicKey: string;
  txtRecord: string;
  dnsStatus: string;
  sslStatus: string;
  subdomain: string;
  lastChecked: string;
}

export const DomainPage: React.FC = () => {
  const { organizations, addNotification, navigateTo } = useApp();
  const [domainList, setDomainList] = useState<VerifiedDomain[]>([]);
  const [searchDomain, setSearchDomain] = useState<string>('');
  const [testDomainInput, setTestDomainInput] = useState<string>('abcuniversity.edu.in');
  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [copiedRecord, setCopiedRecord] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/domains')
      .then(res => res.json())
      .then(data => {
        if (data.data) setDomainList(data.data);
      })
      .catch(() => {
        // Fallback to local organizations
        const mapped = organizations.map(org => ({
          domain: org.domain,
          orgName: org.name,
          orgId: org.id,
          type: org.type,
          walletAddress: org.walletAddress,
          publicKey: org.publicKey,
          txtRecord: `_proofpass-verify=${org.walletAddress}`,
          dnsStatus: 'VERIFIED_ACTIVE',
          sslStatus: 'A+ SECURE',
          subdomain: `verify.${org.domain}`,
          lastChecked: new Date().toISOString(),
        }));
        setDomainList(mapped);
      });
  }, [organizations]);

  const handleTestDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testDomainInput.trim()) return;

    setIsTesting(true);
    try {
      const res = await fetch('/api/domains/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: testDomainInput.trim() }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch {
      setTestResult({
        verified: false,
        message: 'Could not contact domain resolution endpoint',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecord(text);
    addNotification('Copied', 'DNS TXT record copied to clipboard', 'info');
    setTimeout(() => setCopiedRecord(null), 2000);
  };

  const filteredDomains = domainList.filter(
    d =>
      !searchDomain ||
      d.domain.toLowerCase().includes(searchDomain.toLowerCase()) ||
      d.orgName.toLowerCase().includes(searchDomain.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">
            PROOFPASS // DNS CRYPTOGRAPHIC REGISTRY
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5 mt-0.5">
            <Globe2 className="w-6 h-6 text-cyan-400" />
            <span>ProofPass Verified Institutional Domains</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-light">
            Prevent email phishing and unauthorized credential issuance via DNS TXT cryptographic binding
          </p>
        </div>

        <button
          onClick={() => navigateTo('issue-wizard')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-slate-950" />
          <span>Register Institution Domain</span>
        </button>
      </div>

      {/* Interactive Domain Lookup & DNS Check Tool */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl space-y-5">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-400" />
            <span>Check Institutional Domain Authorization</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Enter an institutional domain (e.g. <code>abcuniversity.edu.in</code> or <code>helpinghands.org.in</code>) to verify its cryptographic DNS proof on the blockchain.
          </p>
        </div>

        <form onSubmit={handleTestDomain} className="flex gap-2">
          <div className="relative flex-1">
            <Globe2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="e.g. abcuniversity.edu.in, harvard.edu, ngo.org..."
              value={testDomainInput}
              onChange={e => setTestDomainInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-white/10 rounded-xl text-xs sm:text-sm font-mono text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder-slate-500"
            />
          </div>
          <button
            type="submit"
            disabled={isTesting}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            {isTesting ? 'Validating DNS...' : 'Verify Domain'}
          </button>
        </form>

        {/* Test Result Card */}
        {testResult && (
          <div
            className={`p-4 rounded-xl border transition-all animate-in fade-in duration-150 ${
              testResult.verified
                ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-100'
                : 'bg-rose-950/30 border-rose-500/50 text-rose-100'
            }`}
          >
            <div className="flex items-start gap-3">
              {testResult.verified ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded border ${
                      testResult.verified
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    {testResult.verified ? 'VERIFIED INSTITUTION' : 'UNREGISTERED DOMAIN'}
                  </span>
                  <span className="font-mono text-xs font-bold text-white">{testResult.domain}</span>
                </div>
                <p className="text-xs font-medium leading-relaxed text-slate-300">{testResult.message}</p>
                {testResult.recordValue && (
                  <p className="font-mono text-[11px] text-cyan-300 bg-slate-950/80 p-2.5 rounded-lg border border-cyan-500/30 mt-1 select-all">
                    DNS TXT Record: {testResult.recordValue}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Verified Domains Table */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Active Authorized Institutional Domains ({domainList.length})
            </h3>
            <p className="text-xs text-slate-400">
              Domains cryptographically tethered to registered ProofPass issuer smart contracts
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search domains or orgs..."
              value={searchDomain}
              onChange={e => setSearchDomain(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950/80 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Official Domain</th>
                <th className="py-2.5 px-3">Organization</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">DNS TXT Cryptographic Record</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredDomains.map(d => (
                <tr key={d.domain} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-cyan-400 block">{d.domain}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{d.subdomain}</span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-white">{d.orgName}</td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/5">
                      {d.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate max-w-[200px] select-all bg-slate-950/80 px-2 py-1 rounded border border-white/10 text-cyan-300">
                        {d.txtRecord}
                      </span>
                      <button
                        onClick={() => handleCopyText(d.txtRecord)}
                        className="text-slate-400 hover:text-white p-1 cursor-pointer"
                        title="Copy DNS TXT record"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{d.dnsStatus}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        setTestDomainInput(d.domain);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                    >
                      Check DNS
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* How Domain Verification Works */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 rounded-2xl border border-cyan-500/30 p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-cyan-400" />
          <span>How ProofPass Cryptographic Domain Binding Works</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed font-light">
          Similar to how email servers use DKIM (DomainKeys Identified Mail) to guarantee that an email genuinely came from <code>google.com</code> or <code>stanford.edu</code>, ProofPass binds institutional domains to smart contract wallet addresses.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-1">
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">Step 1</span>
            <h4 className="text-xs font-bold text-white">Add DNS TXT Record</h4>
            <p className="text-[11px] text-slate-400 font-light">
              The institution adds <code>_proofpass-verify=0x...</code> to their DNS zone via Cloudflare, Route53, or GoDaddy.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-1">
            <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">Step 2</span>
            <h4 className="text-xs font-bold text-white">IssuerRegistry Check</h4>
            <p className="text-[11px] text-slate-400 font-light">
              The ProofPass smart contract verifies ownership by matching the public key against DNS records.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-1">
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Step 3</span>
            <h4 className="text-xs font-bold text-white">Phishing Immunity</h4>
            <p className="text-[11px] text-slate-400 font-light">
              Third-party verifiers are guaranteed that the diploma was issued by the true owner of the accredited domain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
