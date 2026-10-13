'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { 
  ShieldCheck, 
  Zap, 
  Printer, 
  Infinity as InfinityIcon, 
  Lock, 
  FileCheck2,
  ArrowRight
} from 'lucide-react';

export default function SobrePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FCFFFF]">
      <Header />

      <main className="flex-1 py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-3">
        
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#202C39] tracking-tight">
              A Ferramenta Definitiva para QR Codes e Cartões Profissionais
            </h1>
            <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Desenvolvido para profissionais, empresas e gráficas que exigem rapidez, privacidade absoluta e qualidade técnica sem concessões.
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#99E1D9]/30 text-[#0f766e] flex items-center justify-center">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#202C39]">Privacidade 100% no Dispositivo</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Toda a geração dos códigos QR e a renderização gráfica dos cartões acontecem no navegador do seu dispositivo. Nenhuma informação de contacto, palavra-passe de Wi-Fi ou fotografia é enviada para qualquer servidor.
              </p>
            </div>

            <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#202C39] text-[#99E1D9] flex items-center justify-center">
                <InfinityIcon size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#202C39]">Códigos Estáticos Sem Expiração</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ao contrário de outros serviços que cobram mensalidades e desactivam os seus códigos após alguns dias, os nossos QR codes são directos e estáticos. Funcionam para sempre.
              </p>
            </div>

            <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#202C39] text-amber-400 flex items-center justify-center">
                <Printer size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#202C39]">Pronto para Gráfica a 300 DPI</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Os ficheiros exportados em PDF contam com sangria gráfica de 3mm e marcas de corte padrão, garantindo que o seu fornecedor de impressão gráfica recebe um trabalho sem falhas.
              </p>
            </div>

            <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#99E1D9]/30 text-[#0f766e] flex items-center justify-center">
                <FileCheck2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#202C39]">Multi-QR Dinâmico</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Os modelos de cartão permitem colocar até 3 códigos no verso (por exemplo WhatsApp, Instagram e Website) sem comprometer o equilíbrio visual ou a leitura dos scanners.
              </p>
            </div>
          </div>

          {/* CTA Box */}
          <div className="p-8 sm:p-12 bg-gradient-to-br from-[#202C39] to-[#18222D] text-white rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-2xl font-bold">Comece a criar hoje mesmo</h3>
              <p className="text-sm text-slate-300">Sem registo, sem custos e sem complicações.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/cartoes">
                <Button variant="secondary" size="lg" icon={ArrowRight} iconPosition="right">
                  Ver Cartões
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
