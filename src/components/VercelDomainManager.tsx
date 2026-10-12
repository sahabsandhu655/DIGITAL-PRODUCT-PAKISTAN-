import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Check, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon,
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

interface VercelDomainManagerProps {
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
  isOldNetlifyIp?: boolean;
  wwwResolved?: string;
  wwwSuccess?: boolean;
  error?: string;
  checkedAt?: string;
}

export const VercelDomainManager: React.FC<VercelDomainManagerProps> = ({
  settings,
  onSettingsUpdated,
}) => {
  // Config state - pre-populate with user's domain digitalproductpakistan.net
  const [domainInput, setDomainInput] = useState(settings.customDomain || 'digitalproductpakistan.net');
  const [vercelProjectName, setVercelProjectName] = useState(settings.vercelProjectName || 'digital-product-pakistan');
  const [dnsMethod, setDnsMethod] = useState<'external' | 'vercel-dns'>('external');

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

  // Clean domain helper
  const cleanDomain = domainInput
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/^www\./, '');

  const fullVercelUrl = `${vercelProjectName.trim().toLowerCase().replace(/\.vercel\.app$/, '')}.vercel.app`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2500);
  };

  const handleSaveDomainSettings = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const updated: StoreSettings = {
        ...settings,
        customDomain: cleanDomain,
        vercelProjectName: vercelProjectName.trim().toLowerCase().replace(/\.vercel\.app$/, ''),
        deploymentPlatform: 'vercel',
        dnsMethod: dnsMethod,
        updatedAt: new Date().toISOString(),
      };

      await saveStoreSettings(updated);
      setSaveSuccess(true);
      if (onSettingsUpdated) {
        onSettingsUpdated(updated);
      }
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      console.error('Error saving domain settings:', err);
      setSaveError(err.message || 'Failed to save domain settings');
    } finally {
      setIsSaving(false);
    }
  };

  const checkLiveDnsPropagation = async (domainToTest?: string) => {
    const targetDomain = (domainToTest || cleanDomain).trim().toLowerCase();
    if (!targetDomain) return;

    setDnsResult({
      checked: false,
      isChecking: true,
    });

    try {
      // 1. Check NS (Nameservers / delegation at root TLD)
      const nsRes = await fetch(`https://dns.google/resolve?name=${targetDomain}&type=NS`);
      const nsData = await nsRes.json();

      const isNxDomain = nsData.Status === 3;
      const nameservers: string[] = [];
      if (nsData.Answer && Array.isArray(nsData.Answer)) {
        nsData.Answer.forEach((ans: any) => {
          if (ans.type === 2 && ans.data) {
            nameservers.push(ans.data.replace(/\.$/, ''));
          }
        });
      }

      // 2. Check Apex A record via Google DNS
      const apexRes = await fetch(`https://dns.google/resolve?name=${targetDomain}&type=A`);
      const apexData = await apexRes.json();
      
      let apexIp = 'Not Found';
      let apexMatch = false;
      let isOldNetlifyIp = false;

      if (apexData.Answer && Array.isArray(apexData.Answer)) {
        const aRecord = apexData.Answer.find((ans: any) => ans.type === 1);
        if (aRecord) {
          apexIp = aRecord.data;
          apexMatch = aRecord.data === '76.76.21.21';
          isOldNetlifyIp = aRecord.data === '104.198.14.52';
        }
      }

      // 3. Check www CNAME & A record via Google DNS
      const wwwCnameRes = await fetch(`https://dns.google/resolve?name=www.${targetDomain}&type=CNAME`);
      const wwwCnameData = await wwwCnameRes.json();

      const wwwARes = await fetch(`https://dns.google/resolve?name=www.${targetDomain}&type=A`);
      const wwwAData = await wwwARes.json();

      let wwwTarget = 'Not Found';
      let wwwMatch = false;

      if (wwwCnameData.Answer && Array.isArray(wwwCnameData.Answer)) {
        const cnameRecord = wwwCnameData.Answer.find((ans: any) => ans.type === 5);
        if (cnameRecord) {
          wwwTarget = cnameRecord.data.replace(/\.$/, '');
          wwwMatch = wwwTarget.includes('vercel-dns.com') || wwwTarget.includes('vercel.app');
        }
      } else if (wwwAData.Answer && Array.isArray(wwwAData.Answer)) {
        const aRecord = wwwAData.Answer.find((ans: any) => ans.type === 1);
        if (aRecord) {
          wwwTarget = aRecord.data;
          wwwMatch = aRecord.data === '76.76.21.21';
        }
      }

      setDnsResult({
        checked: true,
        isChecking: false,
        isNxDomain: isNxDomain || apexData.Status === 3,
        hasNameservers: nameservers.length > 0,
        nameservers: nameservers,
        apexResolvedIp: apexIp,
        apexSuccess: apexMatch,
        isOldNetlifyIp: isOldNetlifyIp,
        wwwResolved: wwwTarget,
        wwwSuccess: wwwMatch,
        checkedAt: new Date().toLocaleTimeString(),
      });
    } catch (err: any) {
      setDnsResult({
        checked: true,
        isChecking: false,
        error: 'Failed to query DNS records. Please check your internet connection.',
        checkedAt: new Date().toLocaleTimeString(),
      });
    }
  };

  // Run initial diagnostic check automatically on mount
  useEffect(() => {
    if (cleanDomain) {
      checkLiveDnsPropagation(cleanDomain);
    }
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#111C18] via-[#15231F] to-[#101915] border border-[#233730] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-black/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-black text-white px-3 py-1 rounded-full text-xs font-bold border border-white/20">
              {/* Vercel Triangle Logo */}
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 75 65" height="12" width="14">
                <path d="M37.5.5 75 64.5H0Z" />
              </svg>
              <span>Vercel.com Deployment & Custom Domain</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Custom Domain & Vercel Connection
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Connect and verify <span className="text-[#B7F34A] font-semibold">www.digitalproductpakistan.net</span> with Vercel Anycast CDN and automated SSL certificates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://vercel.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-slate-200 text-black px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>Open Vercel Dashboard</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="https://vercel.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1A2924] hover:bg-[#233730] text-white border border-[#233730] px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <span>Deploy New Project</span>
              <ArrowRight className="w-4 h-4 text-[#B7F34A]" />
            </a>
          </div>
        </div>
      </div>

      {/* QUICK STATUS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#15231F] border border-[#233730] rounded-2xl p-5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Target Domain
          </span>
          <div className="text-base font-extrabold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#B7F34A]" />
            <span className="truncate">{cleanDomain || 'Not set'}</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">
            Apex + www subdomain
          </span>
        </div>

        <div className="bg-[#15231F] border border-[#233730] rounded-2xl p-5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Vercel Project
          </span>
          <div className="text-base font-extrabold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-sky-400" />
            <span className="truncate">{fullVercelUrl}</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">
            Automatic staging & production URL
          </span>
        </div>

        <div className="bg-[#15231F] border border-[#233730] rounded-2xl p-5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Live DNS Health
          </span>
          <div className="text-base font-extrabold flex items-center gap-2">
            {dnsResult.checked ? (
              dnsResult.isNxDomain ? (
                <>
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                  <span className="text-rose-400">NXDOMAIN (Not Registered)</span>
                </>
              ) : dnsResult.apexSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Connected to Vercel</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400">DNS Needs Configuration</span>
                </>
              )
            ) : (
              <>
                <RefreshCw className="w-4 h-4 text-slate-400 animate-spin" />
                <span className="text-slate-300">Checking DNS...</span>
              </>
            )}
          </div>
          <span className="text-[11px] text-slate-400 mt-2 block">
            Real-time Google Public DNS
          </span>
        </div>
      </div>

      {/* CRITICAL DIAGNOSIS ALERT IF NXDOMAIN OR MISCONFIGURED */}
      {dnsResult.checked && (dnsResult.isNxDomain || !dnsResult.apexSuccess) && (
        <div className="bg-rose-950/30 border-2 border-rose-500/50 rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
              <AlertOctagon className="w-6 h-6 text-rose-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-white">
                Why is <span className="text-[#B7F34A]">www.{cleanDomain}</span> not working?
              </h3>
              <p className="text-xs sm:text-sm text-rose-200 leading-relaxed">
                {dnsResult.isNxDomain ? (
                  <>
                    The domain <strong className="text-white font-mono">{cleanDomain}</strong> returns <strong className="text-rose-300 font-mono">NXDOMAIN (Status 3)</strong> from global DNS root servers. This means the domain does not exist on the internet registry yet or its nameservers are missing.
                  </>
                ) : dnsResult.isOldNetlifyIp ? (
                  <>
                    Your domain is still pointing to the old Netlify server IP (<strong className="text-rose-300 font-mono">104.198.14.52</strong>). Because we switched from Netlify to Vercel, Netlify no longer serves your site.
                  </>
                ) : (
                  <>
                    Your domain DNS records have not been pointed to Vercel&apos;s IP address (<strong className="text-emerald-300 font-mono">76.76.21.21</strong>) or added inside your Vercel account.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-[#111C18] border border-rose-500/20 rounded-2xl p-4 space-y-2">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-500/30 text-rose-300 flex items-center justify-center text-[10px]">1</span>
                <span>Check Domain Registration</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Did you purchase <code className="text-[#B7F34A]">{cleanDomain}</code> from a registrar like <strong>GoDaddy, Namecheap, Hostinger, or PKNIC</strong>? Simply typing a domain into Vercel will not work if the domain has not been registered and paid for first.
              </p>
            </div>

            <div className="bg-[#111C18] border border-rose-500/20 rounded-2xl p-4 space-y-2">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-500/30 text-rose-300 flex items-center justify-center text-[10px]">2</span>
                <span>Verify Exact Spelling</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Check whether your domain was registered under <strong>.net</strong>, <strong>.com</strong>, or <strong>.pk</strong>, or with plural &quot;products&quot;. Test other extensions:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setDomainInput('digitalproductpakistan.net');
                    checkLiveDnsPropagation('digitalproductpakistan.net');
                  }}
                  className="bg-[#1A2924] hover:bg-[#233730] text-slate-200 px-2 py-1 rounded text-[10px] font-mono border border-[#233730] transition-colors"
                >
                  .net
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDomainInput('digitalproductpakistan.com');
                    checkLiveDnsPropagation('digitalproductpakistan.com');
                  }}
                  className="bg-[#1A2924] hover:bg-[#233730] text-slate-200 px-2 py-1 rounded text-[10px] font-mono border border-[#233730] transition-colors"
                >
                  .com
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDomainInput('digitalproductpakistan.pk');
                    checkLiveDnsPropagation('digitalproductpakistan.pk');
                  }}
                  className="bg-[#1A2924] hover:bg-[#233730] text-slate-200 px-2 py-1 rounded text-[10px] font-mono border border-[#233730] transition-colors"
                >
                  .pk
                </button>
              </div>
            </div>

            <div className="bg-[#111C18] border border-rose-500/20 rounded-2xl p-4 space-y-2">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-500/30 text-rose-300 flex items-center justify-center text-[10px]">3</span>
                <span>Add in Vercel & Registrar</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                You must complete <strong>two steps</strong>:
                <br />1. In <strong>Vercel</strong>: Go to Project Settings &gt; Domains &gt; Add <code className="text-[#B7F34A]">www.{cleanDomain}</code>.
                <br />2. At your <strong>Registrar</strong>: Add A record to <code className="text-emerald-400">76.76.21.21</code> and CNAME to <code className="text-purple-300">cname.vercel-dns.com</code>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: CONFIGURE & SAVE DOMAIN SETTINGS */}
      <div className="bg-[#15231F] border border-[#233730] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#233730] pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#B7F34A]" />
              <span>1. Your Custom Domain Settings</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Configure your exact domain name. Saved settings persist directly to your Firestore database.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveDomainSettings}
            disabled={isSaving}
            className="bg-[#B7F34A] hover:bg-[#a6de42] text-[#111C18] px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Domain Settings'}</span>
          </button>
        </div>

        {saveSuccess && (
          <div className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Store domain settings saved successfully to Firestore!</span>
          </div>
        )}

        {saveError && (
          <div className="bg-rose-950/40 border border-rose-500/30 text-rose-300 px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Your Custom Domain Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="e.g. digitalproductpakistan.net"
                className="w-full bg-[#1A2924] border border-[#233730] focus:border-[#B7F34A] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Enter without <code className="text-slate-300 font-mono">https://</code> or <code className="text-slate-300 font-mono">www.</code> (currently: <span className="text-[#B7F34A] font-semibold">{cleanDomain}</span>)
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Vercel Project Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={vercelProjectName}
                onChange={(e) => setVercelProjectName(e.target.value)}
                placeholder="e.g. digital-product-pakistan"
                className="w-full bg-[#1A2924] border border-[#233730] focus:border-[#B7F34A] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Vercel URL: <span className="text-sky-300 font-mono">{fullVercelUrl}</span>
            </p>
          </div>
        </div>

        {/* DNS Management Method Toggle */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-slate-300">
            Preferred DNS Strategy
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setDnsMethod('external')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                dnsMethod === 'external'
                  ? 'bg-[#1A2924] border-[#B7F34A] text-white shadow-md'
                  : 'bg-[#111C18] border-[#233730] text-slate-400 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Method A: External DNS (Recommended)</span>
                </span>
                {dnsMethod === 'external' && <Check className="w-4 h-4 text-[#B7F34A]" />}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Keep your registrar (GoDaddy, Namecheap, Hostinger, PKNIC) and add standard <span className="text-white font-mono">A</span> and <span className="text-white font-mono">CNAME</span> records.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setDnsMethod('vercel-dns')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                dnsMethod === 'vercel-dns'
                  ? 'bg-[#1A2924] border-[#B7F34A] text-white shadow-md'
                  : 'bg-[#111C18] border-[#233730] text-slate-400 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Method B: Vercel Nameservers</span>
                </span>
                {dnsMethod === 'vercel-dns' && <Check className="w-4 h-4 text-[#B7F34A]" />}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Change your registrar nameservers to Vercel&apos;s authoritative nameservers for full automated DNS management.
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: REQUIRED DNS RECORDS TABLE */}
      <div className="bg-[#15231F] border border-[#233730] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#233730] pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-[#B7F34A]" />
              <span>2. Required DNS Records to Add at Your Registrar</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Add these exact records in your domain registrar DNS settings (GoDaddy, Namecheap, Hostinger, etc.):
            </p>
          </div>
        </div>

        {dnsMethod === 'external' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#233730] text-slate-400 font-semibold">
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Name / Host</th>
                  <th className="py-3 px-3">Points To (Value)</th>
                  <th className="py-3 px-3">TTL</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#233730] font-mono">
                {/* RECORD 1: APEX A RECORD */}
                <tr className="hover:bg-[#1A2924]/50 transition-colors">
                  <td className="py-4 px-3">
                    <span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-md text-xs font-bold border border-emerald-500/30">
                      A
                    </span>
                  </td>
                  <td className="py-4 px-3 font-semibold text-white">
                    @ <span className="text-slate-500 font-sans text-[11px]">(or leave blank)</span>
                  </td>
                  <td className="py-4 px-3 text-emerald-400 font-bold">
                    76.76.21.21
                  </td>
                  <td className="py-4 px-3 text-slate-400">
                    Automatic / 3600
                  </td>
                  <td className="py-4 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => copyToClipboard('76.76.21.21', 'apex-a')}
                      className="inline-flex items-center gap-1.5 bg-[#1A2924] hover:bg-[#233730] text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-[#233730] text-[11px] font-sans font-semibold transition-all cursor-pointer"
                    >
                      {copiedKey === 'apex-a' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy IP</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>

                {/* RECORD 2: WWW CNAME */}
                <tr className="hover:bg-[#1A2924]/50 transition-colors">
                  <td className="py-4 px-3">
                    <span className="bg-purple-500/20 text-purple-300 px-2.5 py-1 rounded-md text-xs font-bold border border-purple-500/30">
                      CNAME
                    </span>
                  </td>
                  <td className="py-4 px-3 font-semibold text-white">
                    www
                  </td>
                  <td className="py-4 px-3 text-purple-300 font-semibold">
                    cname.vercel-dns.com
                  </td>
                  <td className="py-4 px-3 text-slate-400">
                    Automatic / 3600
                  </td>
                  <td className="py-4 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => copyToClipboard('cname.vercel-dns.com', 'www-cname')}
                      className="inline-flex items-center gap-1.5 bg-[#1A2924] hover:bg-[#233730] text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-[#233730] text-[11px] font-sans font-semibold transition-all cursor-pointer"
                    >
                      {copiedKey === 'www-cname' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy CNAME</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              Change the custom nameservers at your domain registrar to Vercel&apos;s authoritative nameservers:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              {['ns1.vercel-dns.com', 'ns2.vercel-dns.com'].map((ns, idx) => (
                <div key={ns} className="bg-[#111C18] border border-[#233730] p-3 rounded-xl flex items-center justify-between">
                  <span className="text-slate-300 font-bold">NS {idx + 1}: <span className="text-[#B7F34A]">{ns}</span></span>
                  <button
                    onClick={() => copyToClipboard(ns, `ns-${idx}`)}
                    className="p-1.5 hover:bg-[#1A2924] rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedKey === `ns-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warning if still on Netlify */}
        <div className="bg-[#111C18] border border-[#233730] rounded-2xl p-4 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 space-y-1">
            <span className="font-bold text-white block">Important Cleanup Step (Removing Netlify):</span>
            <p className="text-slate-400 leading-relaxed">
              If your domain had previous records for Netlify (such as IP <code className="text-amber-300">104.198.14.52</code> or a CNAME pointing to <code className="text-amber-300">netlify.app</code>), you <strong>MUST delete those old Netlify records</strong> before adding Vercel&apos;s records. Leaving old records active causes traffic conflicts and domain errors.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: LIVE DNS PROPAGATION CHECKER */}
      <div className="bg-[#15231F] border border-[#233730] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#233730] pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[#B7F34A]" />
              <span>3. Live DNS Diagnostic Tool</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Tests <span className="text-[#B7F34A] font-semibold">{cleanDomain}</span> and <span className="text-[#B7F34A] font-semibold">www.{cleanDomain}</span> against Google&apos;s global Anycast DNS servers in real time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => checkLiveDnsPropagation(cleanDomain)}
              disabled={dnsResult.isChecking || !cleanDomain}
              className="bg-[#1A2924] hover:bg-[#233730] text-white border border-[#233730] hover:border-[#B7F34A] px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#B7F34A] ${dnsResult.isChecking ? 'animate-spin' : ''}`} />
              <span>{dnsResult.isChecking ? 'Testing DNS...' : 'Test DNS Live'}</span>
            </button>

            <a
              href={`https://www.whatsmydns.net/#A/${cleanDomain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#111C18] hover:bg-[#1A2924] text-slate-300 hover:text-white border border-[#233730] px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>WhatsMyDNS</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* DIAGNOSTIC RESULTS */}
        {dnsResult.checked ? (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Apex Check Result */}
              <div className={`p-4 rounded-2xl border ${
                dnsResult.apexSuccess
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-amber-950/20 border-amber-500/30'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300">
                    Apex A Record ({cleanDomain})
                  </span>
                  {dnsResult.apexSuccess ? (
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Resolving to Vercel (76.76.21.21)
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {dnsResult.isNxDomain ? 'Domain NXDOMAIN' : 'Incorrect IP / Pending'}
                    </span>
                  )}
                </div>
                <div className="font-mono text-xs text-slate-200 bg-[#111C18] p-2.5 rounded-xl flex items-center justify-between">
                  <span>Resolved: <span className={dnsResult.apexSuccess ? 'text-emerald-400 font-bold' : 'text-amber-300 font-bold'}>{dnsResult.apexResolvedIp}</span></span>
                  <span className="text-[10px] text-slate-500">Expected: 76.76.21.21</span>
                </div>
              </div>

              {/* WWW Check Result */}
              <div className={`p-4 rounded-2xl border ${
                dnsResult.wwwSuccess
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-slate-900/40 border-[#233730]'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300">
                    WWW Subdomain (www.{cleanDomain})
                  </span>
                  {dnsResult.wwwSuccess ? (
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Resolving to Vercel
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      {dnsResult.wwwResolved === 'Not Found' ? 'CNAME Not Set' : 'Custom Target'}
                    </span>
                  )}
                </div>
                <div className="font-mono text-xs text-slate-200 bg-[#111C18] p-2.5 rounded-xl flex items-center justify-between">
                  <span className="truncate pr-2">Resolved: <span className="text-purple-300 font-bold truncate">{dnsResult.wwwResolved}</span></span>
                  <span className="text-[10px] text-slate-500 shrink-0">Expected: cname.vercel-dns.com</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
              <span>Last checked at: <strong className="text-slate-300 font-mono">{dnsResult.checkedAt}</strong></span>
              <span>DNS propagation can take between 5 to 60 minutes worldwide.</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-[#111C18] rounded-2xl border border-[#233730]/60 space-y-2">
            <Globe className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-xs text-slate-300 font-medium">
              Click &quot;Test DNS Live&quot; to test your domain against Google Public DNS.
            </p>
          </div>
        )}
      </div>

      {/* SECTION 4: EXACT STEP-BY-STEP FIX GUIDE */}
      <div className="bg-[#15231F] border border-[#233730] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 border-b border-[#233730] pb-4">
          <BookOpen className="w-5 h-5 text-[#B7F34A]" />
          <div>
            <h3 className="text-lg font-bold text-white">4. Step-by-Step Fix to Make www.{cleanDomain} Work</h3>
            <p className="text-xs text-slate-400">Follow these 4 exact steps in order:</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* STEP 1 */}
          <div className="bg-[#111C18] border border-[#233730] rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#B7F34A] text-[#111C18] flex items-center justify-center font-extrabold text-xs">
                1
              </span>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Step 1: Check Domain at Registrar
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Log in to the account where you purchased the domain (GoDaddy, Namecheap, Hostinger, PKNIC).
              <br />• Verify the domain status is <strong className="text-emerald-400">&quot;Active&quot;</strong> and not suspended or pending payment.
              <br />• Check your email for any ICANN verification link if required.
            </p>
          </div>

          {/* STEP 2 */}
          <div className="bg-[#111C18] border border-[#233730] rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#B7F34A] text-[#111C18] flex items-center justify-center font-extrabold text-xs">
                2
              </span>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Step 2: Add Domain in Vercel Dashboard
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Log in to <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-[#B7F34A] underline">vercel.com</a>:
              <br />1. Open your project (<strong className="text-white">{vercelProjectName}</strong>).
              <br />2. Click <strong className="text-white">Settings</strong> &gt; <strong className="text-white">Domains</strong>.
              <br />3. Add <strong className="text-[#B7F34A]">{cleanDomain}</strong>. Vercel will recommend adding <strong className="text-[#B7F34A]">www.{cleanDomain}</strong> as well.
            </p>
          </div>

          {/* STEP 3 */}
          <div className="bg-[#111C18] border border-[#233730] rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#B7F34A] text-[#111C18] flex items-center justify-center font-extrabold text-xs">
                3
              </span>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Step 3: Add DNS Records at Registrar
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              In your registrar DNS Zone editor:
              <br />• <strong>Delete</strong> any old Netlify A records (<code className="text-amber-300">104.198.14.52</code>).
              <br />• <strong>Add Record</strong>: Type <code className="text-emerald-400 font-bold">A</code>, Name <code className="text-white font-bold">@</code>, Value <code className="text-emerald-400 font-bold">76.76.21.21</code>.
              <br />• <strong>Add Record</strong>: Type <code className="text-purple-300 font-bold">CNAME</code>, Name <code className="text-white font-bold">www</code>, Value <code className="text-purple-300 font-bold">cname.vercel-dns.com</code>.
            </p>
          </div>

          {/* STEP 4 */}
          <div className="bg-[#111C18] border border-[#233730] rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#B7F34A] text-[#111C18] flex items-center justify-center font-extrabold text-xs">
                4
              </span>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Step 4: Automatic SSL Certificate
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Once DNS points to Vercel, Vercel will automatically verify the records, issue a free Let&apos;s Encrypt SSL certificate, and make <strong className="text-white">https://www.{cleanDomain}</strong> live worldwide!
            </p>
          </div>
        </div>

        {/* CLI DEPLOY OPTION */}
        <div className="bg-[#111C18] border border-[#233730] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#B7F34A]" />
              <span>Deploy via Vercel CLI (Optional)</span>
            </span>
            <button
              onClick={() => copyToClipboard('npm i -g vercel && vercel --prod', 'cli-cmd')}
              className="text-[11px] text-[#B7F34A] hover:underline font-mono flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'cli-cmd' ? 'Copied!' : 'Copy commands'}
            </button>
          </div>
          <pre className="bg-black/60 text-slate-300 p-3 rounded-xl font-mono text-xs overflow-x-auto border border-white/10">
            <code># Deploy directly to Vercel production{'\n'}npm i -g vercel{'\n'}vercel login{'\n'}vercel --prod</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
