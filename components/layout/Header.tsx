'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { QrCode, CreditCard, Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Início' },
    { href: '/qrcode', label: 'QR Code' },
    { href: '/cartoes', label: 'Cartões' },
    { href: '/sobre', label: 'Sobre' },
    { href: '/contacto', label: 'Contacto' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FCFFFF]/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-[#202C39] flex items-center justify-center text-[#99E1D9] shadow-md group-hover:scale-105 transition-transform">
            <QrCode size={24} className="stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-[#202C39] leading-tight">
              QR & Cartões
            </span>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Estúdio de Impressão
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/60">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-[#202C39] shadow-sm'
                    : 'text-slate-600 hover:text-[#202C39] hover:bg-white/60'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button
        <div className="hidden md:flex items-center gap-3">
          <Link href="/cartoes">
            <Button
              variant="primary"
              size="md"
              icon={ArrowRight}
              iconPosition="right"
              className="bg-[#202C39] hover:bg-[#18222D] text-white shadow-md shadow-[#202C39]/15"
            >
              Criar agora
            </Button>
          </Link>
        </div> */}

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-[#99E1D9]/25 text-[#202C39] font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#0f766e]" />}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <Link href="/cartoes" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="md" className="w-full">
                Criar agora
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
