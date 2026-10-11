import React from 'react';
import { ShieldCheck, MessageCircle, Mail, BookOpen, Cpu, GraduationCap, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
  whatsappNumber?: string;
  supportEmail?: string;
}

export const Footer: React.FC<FooterProps> = ({ 
  onNavigate, 
  whatsappNumber = '+923107759274',
  supportEmail = 'support@digitalproductpakistan.com'
}) => {
  return (
    <footer className="bg-[#0B1310] border-t border-[#233730] text-slate-300 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#233730]">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#B7F34A] flex items-center justify-center text-[#111C18] font-black text-xl">
                DP
              </div>
              <span className="font-bold text-xl text-white">
                Digital Product <span className="text-[#B7F34A]">Pakistan</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Your Digital World. One Place. Discover curated e-books, verified software and productivity tools, and comprehensive online courses with reliable Easypaisa manual payment verification.
            </p>
            <div className="inline-flex items-center gap-2 bg-[#162420] border border-[#233730] px-3.5 py-2 rounded-xl text-xs text-[#B7F34A]">
              <ShieldCheck className="w-4 h-4 text-[#B7F34A]" />
              <span>Manual verification prevents fraud & guarantees direct WhatsApp delivery.</span>
            </div>
          </div>

          {/* Catalog Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Catalog</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => onNavigate('ebooks')} 
                  className="hover:text-[#B7F34A] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" /> E-books
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('software')} 
                  className="hover:text-[#B7F34A] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Cpu className="w-3.5 h-3.5 text-slate-500" /> Software & Tools
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('courses')} 
                  className="hover:text-[#B7F34A] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-slate-500" /> Online Courses
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('blog')} 
                  className="hover:text-[#B7F34A] transition-colors cursor-pointer"
                >
                  Product & Skill Blog
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('orders')} 
                  className="hover:text-[#B7F34A] transition-colors font-medium text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B7F34A]"></span> My Orders & Downloads
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Policies</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('delivery-policy')} className="hover:text-[#B7F34A] transition-colors cursor-pointer">
                  Delivery Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('refund-policy')} className="hover:text-[#B7F34A] transition-colors cursor-pointer">
                  Refund Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy-policy')} className="hover:text-[#B7F34A] transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-[#B7F34A] transition-colors cursor-pointer">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#B7F34A] transition-colors cursor-pointer">
                  About Us
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Verification */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Direct Support</h4>
            <div className="space-y-2.5 text-sm">
              <a 
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 text-slate-300 hover:text-[#B7F34A] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#B7F34A]" />
                <span>WhatsApp: {whatsappNumber}</span>
              </a>
              <a 
                href={`mailto:${supportEmail}`}
                className="flex items-center gap-2 text-slate-300 hover:text-[#B7F34A] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#B7F34A]" />
                <span className="truncate">{supportEmail}</span>
              </a>
              <div className="pt-2">
                <span className="text-xs text-slate-400 block mb-1">Accepted Payment:</span>
                <div className="inline-block bg-[#162420] border border-[#233730] px-3 py-1.5 rounded-lg text-xs font-semibold text-white">
                  📱 Easypaisa (Verified Manually)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Digital Product Pakistan. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('admin')}
              className="text-slate-400 hover:text-[#B7F34A] transition-colors cursor-pointer"
            >
              Administrator Access
            </button>
            <span>•</span>
            <span>Operating Currency: PKR (Rs.)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
