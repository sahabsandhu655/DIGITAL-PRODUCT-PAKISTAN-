import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Check, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Save, 
  Server, 
  ArrowRight,
  Terminal,
  Zap,
  Search,
  BookOpen
} from 'lucide-react';
import { StoreSettings } from '../types';
import { saveStoreSettings } from '../services/storeService';

interface NetlifyDeployManagerProps {
  settings: StoreSettings;
  onSettingsUpdated?: (updated: StoreSettings) => void;
}

interface DnsCheckResult {
  checked: boolean;
  isChecking: boolean;
  isNxDomain?: boolean;
  hasNameservers?: boolean;
  nameservers?: string[];
  apexResolvedIp?: string;
  apexSuccess?: boolean;
  wwwResolved?: string;
  wwwSuccess?: boolean;
  error?: string;
  checkedAt?: string;
}

export const NetlifyDeployManager: React.FC<NetlifyDeployManagerProps> = ({
  settings,
  onSettingsUpdated,
}) => {
  const primaryNetlifyUrl = 'https://6ae746c556b8b9e857f26901--effulgent-sawine-30de04.netlify.app/';
  const [domainInput, setDomainInput] = useState(settings.customDomain || 'digitalproductpakistan.net');
  const [dnsMethod, setDnsMethod] = useState<'external' | 'netlify-dns'>('external');

  // UI state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Live DNS Check State
  const [dnsResult, setDnsResult] = useState<DnsCheckResult>({
    checked: false,
    isChecking: false,
  });

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSaveDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    try {
      const cleanDomain = domainInput.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      const updated: StoreSettings = {
        ...settings,
        customDomain: cleanDomain,
      };
      await saveStoreSettings(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
      if (onSettingsUpdated) {
        onSettingsUpdated(updated);
      }
    } catch (err: any) {
      setSaveError(err.message || 'Failed to update custom domain');
    } finally {
      setIsSaving(false);
    }
  };

  // Perform live DNS lookup via Cloudflare DNS-over-HTTPS (DoH)
  const runLiveDnsDiagnostic = async () => {
    const cleanDomain = domainInput.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    if (!cleanDomain) return;

    setDnsResult({ checked: false, isChecking: true });

    try {
      // 1. Check A record of apex
      const aRes = await fetch(`https://cloudflare-dns.com/dns-query?name=${cleanDomain}&type=A`, {
        headers: { accept: 'application/dns-json' },
      });
      const aData = await aRes.json();

      // 2. Check CNAME of www
      const cnameRes = await fetch(`https://cloudflare-dns.com/dns-query?name=www.${cleanDomain}&type=CNAME`, {
        headers: { accept: 'application/dns-json' },
      });
      const cnameData = await cnameRes.json();

      // 3. Check NS records
      const nsRes = await fetch(`https://cloudflare-dns.com/dns-query?name=${cleanDomain}&type=NS`, {
        headers: { accept: 'application/dns-json' },
      });
      const nsData = await nsRes.json();

      const apexIp = aData.Answer && aData.Answer.length > 0 ? aData.Answer[0].data : undefined;
      const wwwTarget = cnameData.Answer && cnameData.Answer.length > 0 ? cnameData.Answer[0].data : undefined;
      const nameservers = nsData.Answer ? nsData.Answer.map((a: any) => a.data) : [];

      // Netlify standard IP is 75.2.60.5
      const apexMatchesNetlify = apexIp === '75.2.60.5';
      const wwwMatchesNetlify = wwwTarget ? wwwTarget.toLowerCase().includes('netlify.app') : false;

      const isNxDomain = aData.Status === 3 || (!apexIp && nameservers.length === 0);

      setDnsResult({
        checked: true,
        isChecking: false,
        isNxDomain,
        hasNameservers: nameservers.length > 0,
        nameservers,
        apexResolvedIp: apexIp,
        apexSuccess: apexMatchesNetlify,
        wwwResolved: wwwTarget,
        wwwSuccess: wwwMatchesNetlify,
        checkedAt: new Date().toLocaleTimeString(),
      });
    } catch (err: any) {
      setDnsResult({
        checked: true,
        isChecking: false,
        error: 'Unable to reach public DNS resolvers from this network.',
        checkedAt: new Date().toLocaleTimeString(),
      });
    }
  };

  useEffect(() => {
    runLiveDnsDiagnostic();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#15231F] border border-[#233730] rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-[#00C7B7]/10 border border-[#00C7B7]/40 text-[#00C7B7] text-xs font-bold px-3 py-1 rounded-full">
              <Globe className="w-3.5 h-3.5" />
              <span>Official Netlify Deployment Active</span>
            </div>
            <h2 className="text-2xl font-black text-white">
              Netlify Production Hub & Custom Domain Setup
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Your storefront is deployed directly to high-speed global Netlify Edge CDN with automatic HTTPS and PWA caching.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <a
              href={primaryNetlifyUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-[#00C7B7] hover:bg-[#00b3a4] text-[#111C18] font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#00C7B7]/20 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Live Netlify App</span>
            </a>

            <button
              onClick={runLiveDnsDiagnostic}
              disabled={dnsResult.isChecking}
              className="bg-[#1A2924] hover:bg-[#233730] border border-[#233730] text-slate-200 font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${dnsResult.isChecking ? 'animate-spin' : ''}`} />
              <span>Test DNS</span>
            </button>
          </div>
        </div>

        {/* Live URL Card */}
        <div className="bg-[#111C18] border border-[#233730] rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#00C7B7]/10 text-[#00C7B7] flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                Primary Netlify URL
              </span>
              <a
                href={primaryNetlifyUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs sm:text-sm font-mono text-[#00C7B7] hover:underline truncate block"
              >
                {primaryNetlifyUrl}
              </a>
            </div>
          </div>

          <button
            onClick={() => copyToClipboard(primaryNetlifyUrl, 'primary-url')}
            className="bg-[#1A2924] hover:bg-[#233730] text-slate-200 border border-[#233730] text-xs font-bold px-3.5 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            {copiedKey === 'primary-url' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedKey === 'primary-url' ? 'Copied URL!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>

      {/* Domain Configuration Card */}
      <div className="bg-[#15231F] border border-[#233730] rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-[#B7F34A]" />
            <span>Custom Domain Linking ({domainInput})</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Configure your custom domain DNS records in GoDaddy, Namecheap, Cloudflare, or PKNIC.
          </p>
        </div>

        {saveSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs p-3.5 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Custom domain saved to store configuration!</span>
          </div>
        )}

        {saveError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs p-3.5 rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>{saveError}</span>
          </div>
        )}

        <form onSubmit={handleSaveDomain} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="e.g. digitalproductpakistan.net"
                className="w-full bg-[#1A2924] border border-[#233730] focus:border-[#B7F34A] rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-slate-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#B7F34A] hover:bg-[#A3E037] text-[#111C18] font-bold text-xs sm:text-sm px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Custom Domain'}</span>
            </button>
          </div>
        </form>

        {/* DNS Method Picker */}
        <div className="flex items-center gap-2 border-b border-[#233730] pb-4">
          <button
            onClick={() => setDnsMethod('external')}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
              dnsMethod === 'external'
                ? 'bg-[#B7F34A] text-[#111C18]'
                : 'bg-[#1A2924] text-slate-300 hover:text-white'
            }`}
          >
            Method 1: Standard A & CNAME Records (Recommended)
          </button>
          <button
            onClick={() => setDnsMethod('netlify-dns')}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
              dnsMethod === 'netlify-dns'
                ? 'bg-[#B7F34A] text-[#111C18]'
                : 'bg-[#1A2924] text-slate-300 hover:text-white'
            }`}
          >
            Method 2: Netlify Custom Nameservers
          </button>
        </div>

        {/* METHOD 1: STANDARD DNS RECORDS */}
        {dnsMethod === 'external' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Go to your domain registrar (e.g. GoDaddy, Namecheap, Cloudflare) and add the following two DNS records:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[#233730] rounded-xl overflow-hidden">
                <thead className="bg-[#111C18] text-slate-400 font-semibold border-b border-[#233730]">
                  <tr>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Name / Host</th>
                    <th className="py-3 px-4">Value / Target</th>
                    <th className="py-3 px-4">TTL</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#233730] font-mono">
                  <tr className="hover:bg-[#1A2924]/50">
                    <td className="py-3 px-4 font-bold text-amber-400">A</td>
                    <td className="py-3 px-4 text-white">@ (or root)</td>
                    <td className="py-3 px-4 text-[#B7F34A] font-bold">75.2.60.5</td>
                    <td className="py-3 px-4 text-slate-400">Automatic (or 3600)</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => copyToClipboard('75.2.60.5', 'a-ip')}
                        className="text-slate-300 hover:text-white bg-[#1A2924] px-2.5 py-1 rounded-md text-[11px] cursor-pointer"
                      >
                        {copiedKey === 'a-ip' ? 'Copied!' : 'Copy IP'}
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#1A2924]/50">
                    <td className="py-3 px-4 font-bold text-blue-400">CNAME</td>
                    <td className="py-3 px-4 text-white">www</td>
                    <td className="py-3 px-4 text-[#B7F34A] font-bold">effulgent-sawine-30de04.netlify.app</td>
                    <td className="py-3 px-4 text-slate-400">Automatic (or 3600)</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => copyToClipboard('effulgent-sawine-30de04.netlify.app', 'cname-target')}
                        className="text-slate-300 hover:text-white bg-[#1A2924] px-2.5 py-1 rounded-md text-[11px] cursor-pointer"
                      >
                        {copiedKey === 'cname-target' ? 'Copied!' : 'Copy Host'}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* METHOD 2: NETLIFY NAMESERVERS */}
        {dnsMethod === 'netlify-dns' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              If you want Netlify to manage DNS and auto-renew SSL certificates, update the Nameservers at your registrar to:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              {['dns1.p01.nsone.net', 'dns2.p01.nsone.net', 'dns3.p01.nsone.net', 'dns4.p01.nsone.net'].map((ns, idx) => (
                <div key={idx} className="bg-[#111C18] border border-[#233730] p-3 rounded-xl flex items-center justify-between">
                  <span className="text-[#00C7B7]">{ns}</span>
                  <button
                    onClick={() => copyToClipboard(ns, `ns-${idx}`)}
                    className="text-slate-400 hover:text-white text-[11px] bg-[#1A2924] px-2 py-1 rounded cursor-pointer"
                  >
                    {copiedKey === `ns-${idx}` ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LIVE DNS DIAGNOSTIC RESULTS */}
        <div className="border-t border-[#233730] pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-[#B7F34A]" />
              <span>Real-Time DNS Health Check</span>
            </h4>
            {dnsResult.checkedAt && (
              <span className="text-[10px] text-slate-400">Last inspected: {dnsResult.checkedAt}</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Apex Status */}
            <div className="bg-[#111C18] border border-[#233730] rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 font-mono">
                  Apex Domain ({domainInput})
                </span>
                {dnsResult.isChecking ? (
                  <span className="text-[10px] text-amber-400 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Querying...
                  </span>
                ) : dnsResult.apexSuccess ? (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Pointing to Netlify (75.2.60.5)
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 bg-[#1A2924] px-2 py-0.5 rounded-full">
                    Resolved: {dnsResult.apexResolvedIp || 'Not set yet'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Target IP for Netlify is <code className="text-[#B7F34A]">75.2.60.5</code>. Once updated at your registrar, propagation takes 5 to 60 minutes.
              </p>
            </div>

            {/* WWW Status */}
            <div className="bg-[#111C18] border border-[#233730] rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 font-mono">
                  Subdomain (www.{domainInput})
                </span>
                {dnsResult.isChecking ? (
                  <span className="text-[10px] text-amber-400 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Querying...
                  </span>
                ) : dnsResult.wwwSuccess ? (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Pointing to Netlify
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 bg-[#1A2924] px-2 py-0.5 rounded-full">
                    Target: {dnsResult.wwwResolved || 'Not set yet'}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                CNAME record should point to <code className="text-[#B7F34A]">effulgent-sawine-30de04.netlify.app</code>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
