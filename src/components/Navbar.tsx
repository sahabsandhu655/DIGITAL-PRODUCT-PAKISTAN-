import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  ShieldCheck, 
  BookOpen, 
  Cpu, 
  GraduationCap, 
  Newspaper, 
  MessageCircle, 
  UserCheck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onSearchClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate, onSearchClick }) => {
  const { itemCount, setIsCartOpen } = useCart();
  const { currentUser, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', route: 'home' },
    { label: 'E-books', route: 'ebooks', icon: BookOpen },
    { label: 'Software & Tools', route: 'software', icon: Cpu },
    { label: 'Courses', route: 'courses', icon: GraduationCap },
    { label: 'Blog', route: 'blog', icon: Newspaper },
    { label: 'Contact', route: 'contact', icon: MessageCircle },
  ];

  const handleLinkClick = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#111C18]/95 backdrop-blur-md border-b border-[#233730]">
      {/* Announcement bar */}
      <div className="bg-[#1A2924] border-b border-[#233730] py-1.5 px-4 text-center text-xs text-slate-300 flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-[#B7F34A] animate-pulse"></span>
        <span>Manual Easypaisa payment verification & direct WhatsApp delivery across Pakistan</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleLinkClick('home')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B7F34A] to-[#86C227] flex items-center justify-center text-[#111C18] font-black text-xl shadow-lg shadow-[#B7F34A]/10 group-hover:scale-105 transition-transform">
                DP
              </div>
              <div>
                <span className="block font-bold text-lg tracking-tight text-white group-hover:text-[#B7F34A] transition-colors leading-tight">
                  Digital Product <span className="text-[#B7F34A]">Pakistan</span>
                </span>
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                  Verified Marketplace
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const active = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  onClick={() => handleLinkClick(link.route)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    active
                      ? 'text-[#B7F34A] bg-[#1A2924]'
                      : 'text-slate-300 hover:text-white hover:bg-[#1A2924]/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            {/* Search Button */}
            <button
              onClick={onSearchClick}
              aria-label="Search catalog"
              className="p-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#1A2924] transition-colors cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Admin shortcut badge */}
            <button
              onClick={() => handleLinkClick('admin')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                currentRoute === 'admin'
                  ? 'bg-[#B7F34A] text-[#111C18]'
                  : isAdmin
                  ? 'bg-[#233730] text-[#B7F34A] hover:bg-[#2e473e]'
                  : 'text-slate-400 hover:text-white hover:bg-[#1A2924]'
              }`}
              title="Admin Portal"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden lg:inline">{isAdmin ? 'Admin Panel' : 'Admin'}</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="View Shopping Cart"
              className="relative flex items-center gap-2 bg-[#B7F34A] text-[#111C18] hover:bg-[#A3E037] px-3.5 py-2 rounded-xl font-bold text-sm transition-all shadow-md shadow-[#B7F34A]/20 cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="bg-[#111C18] text-[#B7F34A] text-xs font-extrabold px-1.5 py-0.5 rounded-full min-w-5 text-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-[#1A2924] rounded-lg cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#15231F] border-b border-[#233730] px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = currentRoute === link.route;
            return (
              <button
                key={link.route}
                onClick={() => handleLinkClick(link.route)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left text-base font-medium transition-colors cursor-pointer ${
                  active
                    ? 'text-[#B7F34A] bg-[#1A2924]'
                    : 'text-slate-200 hover:bg-[#1A2924]'
                }`}
              >
                {Icon && <Icon className="w-5 h-5 text-slate-400" />}
                <span>{link.label}</span>
              </button>
            );
          })}
          <div className="pt-3 border-t border-[#233730]">
            <button
              onClick={() => handleLinkClick('admin')}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left text-base font-semibold text-[#B7F34A] bg-[#1A2924] cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Admin Management Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
