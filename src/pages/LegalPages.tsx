import React from 'react';
import { ShieldCheck, MessageCircle, Mail, Clock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { StoreSettings } from '../types';

interface LegalPagesProps {
  pageType: 'about' | 'contact' | 'privacy-policy' | 'terms' | 'refund-policy' | 'delivery-policy';
  settings: StoreSettings;
  onBack: () => void;
}

export const LegalPages: React.FC<LegalPagesProps> = ({ pageType, settings, onBack }) => {
  const whatsappNumber = settings.whatsappNumber || '+92 300 1234567';
  const supportEmail = settings.supportEmail || 'support@digitalproductpakistan.com';

  const renderContent = () => {
    switch (pageType) {
      case 'about':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">About Digital Product Pakistan</h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              <strong>Digital Product Pakistan</strong> is an independent digital products marketplace dedicated to providing Pakistani freelancers, remote workers, students, and businesses with authentic, high-value digital assets.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-[#15231F] border border-[#233730] p-5 rounded-2xl space-y-2">
                <span className="text-[#B7F34A] font-bold text-sm block">Curated E-Books</span>
                <p className="text-xs text-slate-400">Practical guides written for the local Pakistani freelance and business ecosystem.</p>
              </div>
              <div className="bg-[#15231F] border border-[#233730] p-5 rounded-2xl space-y-2">
                <span className="text-[#B7F34A] font-bold text-sm block">Verified Tools</span>
                <p className="text-xs text-slate-400">Strictly verified subscriptions, vouchers, and team invitations.</p>
              </div>
              <div className="bg-[#15231F] border border-[#233730] p-5 rounded-2xl space-y-2">
                <span className="text-[#B7F34A] font-bold text-sm block">Regional Learning</span>
                <p className="text-xs text-slate-400">Extensive course vaults in English, Urdu, and Hindi for zero-barrier learning.</p>
              </div>
            </div>
            <div className="pt-4 border-t border-[#233730] text-xs text-slate-400 leading-relaxed">
              We operate on an honest, transparent model: orders are placed in Pakistani Rupees, payments are verified manually via Easypaisa receipts, and deliverables are provided with direct human WhatsApp assistance.
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Contact & Customer Care</h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Need assistance before purchasing or checking on an existing order? Our human support team is available during standard business hours (9:00 AM – 11:00 PM PKT).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="bg-[#15231F] border border-[#233730] p-6 rounded-2xl space-y-3">
                <MessageCircle className="w-6 h-6 text-[#25D366]" />
                <h3 className="font-bold text-white text-base">Direct WhatsApp Support</h3>
                <p className="text-xs text-slate-400">Fastest channel for payment proof questions and instant delivery inquiries.</p>
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block bg-[#B7F34A] text-[#111C18] text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Message {whatsappNumber}
                </a>
              </div>

              <div className="bg-[#15231F] border border-[#233730] p-6 rounded-2xl space-y-3">
                <Mail className="w-6 h-6 text-[#B7F34A]" />
                <h3 className="font-bold text-white text-base">Official Email Support</h3>
                <p className="text-xs text-slate-400">For partnership proposals, large team licenses, and administrative inquiries.</p>
                <a
                  href={`mailto:${supportEmail}`}
                  className="inline-block bg-[#1A2924] text-white border border-[#233730] text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#233730]"
                >
                  {supportEmail}
                </a>
              </div>
            </div>
          </div>
        );

      case 'delivery-policy':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Digital Product Delivery Policy</h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              {settings.policies?.delivery || `All products sold on Digital Product Pakistan are intangible digital goods. Physical parcels or postal deliveries are not issued.`}
            </p>
            <div className="bg-[#15231F] border border-[#233730] p-6 rounded-2xl space-y-4 text-xs text-slate-300 leading-relaxed">
              <h3 className="font-bold text-white text-sm">Delivery Process Timeline:</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li><strong>Order & Proof Submission:</strong> Customer submits transaction screenshot via our secure checkout.</li>
                <li><strong>Manual Verification:</strong> Administrator checks Easypaisa account records (typically completed within 15–45 minutes during PKT business hours).</li>
                <li><strong>Electronic Delivery:</strong> Download URLs, credentials, or cloud access links are dispatched to the customer's submitted WhatsApp number and backup email.</li>
                <li><strong>Assistance & Setup:</strong> If any setup issue occurs, customer can reply immediately on WhatsApp for step-by-step assistance.</li>
              </ol>
            </div>
          </div>
        );

      case 'refund-policy':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Refund Policy</h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              {settings.policies?.refund || `Due to the non-tangible and irrevocable nature of digital downloads, courses, and software licenses, orders are generally non-refundable once credentials or access links have been delivered and redeemed.`}
            </p>
            <div className="bg-[#15231F] border border-[#233730] p-6 rounded-2xl space-y-3 text-xs text-slate-300 leading-relaxed">
              <h3 className="font-bold text-white text-sm">Eligible Exceptions:</h3>
              <ul className="list-disc list-inside space-y-1.5 text-slate-400">
                <li>If a software license key or invitation link is verified defective upon initial handover and cannot be resolved within 24 hours.</li>
                <li>If a customer accidentally double-paid the same invoice via Easypaisa (refunded minus nominal bank charges).</li>
                <li>If product is declared out of stock or cancelled before delivery.</li>
              </ul>
            </div>
          </div>
        );

      case 'privacy-policy':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Privacy Policy</h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              {settings.policies?.privacy || `We respect your privacy. Customer contact numbers, emails, and payment screenshots are used strictly for order fulfillment, payment verification, and customer support. We never share or sell customer data to third parties.`}
            </p>
            <div className="bg-[#15231F] border border-[#233730] p-6 rounded-2xl space-y-3 text-xs text-slate-300 leading-relaxed">
              <h3 className="font-bold text-white text-sm">Payment Screenshot Security:</h3>
              <p className="text-slate-400">
                Uploaded payment receipts are stored in secure storage buckets and accessible only by authenticated store administrators during order verification. Payment screenshots are never exposed via public indexing.
              </p>
            </div>
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Terms & Conditions</h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              {settings.policies?.terms || `By placing an order on Digital Product Pakistan, you agree to submit legitimate payment proof for manual verification. We do not sell cracked, stolen, or unauthorized credentials. All software and tool offers are subject to individual provider service terms and plan validity.`}
            </p>
            <div className="bg-[#15231F] border border-[#233730] p-6 rounded-2xl space-y-3 text-xs text-slate-300 leading-relaxed">
              <h3 className="font-bold text-white text-sm">Governing Principle:</h3>
              <p className="text-slate-400">
                All prices are in Pakistani Rupees (PKR). Products remain drafts until officially verified and approved by the store administrator. Digital Product Pakistan is an independent reseller and curator and not directly affiliated with trademarks unless explicitly stated.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#B7F34A] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Store</span>
      </button>

      <div className="bg-[#111C18] border border-[#233730] rounded-3xl p-8 sm:p-12 shadow-2xl">
        {renderContent()}
      </div>
    </div>
  );
};
