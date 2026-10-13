'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TemplateGallery } from '@/components/cartao/TemplateGallery';
import { CreditCard, Sparkles, Printer, ShieldCheck } from 'lucide-react';

export default function CartoesGalleryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FCFFFF]">
      <Header />

      <main className="flex-1 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#202C39] tracking-tight">
              Galeria de Modelos de Cartão
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Escolha entre modelos de cartões corporativos, crachás digitais, placas de mesa e cartões de serviços. Todos incluem suporte a QR codes de alta definição e exportação com margens de sangria a 300 DPI.
            </p>
          </div>

          {/* Interactive Template Gallery with Filters */}
          <TemplateGallery />

          {/* Value Props Strip */}
          <div className="mt-16 pt-12 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#202C39] mb-3">
                <Printer size={20} />
              </div>
              <h4 className="font-bold text-sm text-[#202C39]">Padrão Internacional de Impressão</h4>
              <p className="text-xs text-slate-500 mt-1">
                Ficheiros PDF gerados em escala 1:1 com 300 DPI, guias de corte e 3mm de sangria gráfica.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#202C39] mb-3">
                <Sparkles size={20} />
              </div>
              <h4 className="font-bold text-sm text-[#202C39]">Até 3 Códigos no Verso</h4>
              <p className="text-xs text-slate-500 mt-1">
                Integre WhatsApp, Instagram e Website em simultâneo com alinhamento dinâmico automático.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#202C39] mb-3">
                <ShieldCheck size={20} />
              </div>
              <h4 className="font-bold text-sm text-[#202C39]">Privacidade & Rascunho Seguro</h4>
              <p className="text-xs text-slate-500 mt-1">
                Os seus dados não saem do seu navegador e os rascunhos são mantidos automaticamente no dispositivo.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
