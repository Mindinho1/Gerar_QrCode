'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { 
  QrCode, 
  CreditCard, 
  ArrowRight, 
  CheckCircle2, 
  Globe, 
  MessageSquare, 
  UserCheck, 
  Wifi, 
  Phone, 
  Mail, 
  FileText,
  Sparkles,
  Download,
  Sliders,
  Printer,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { FaInstagram, FaFacebookF, FaXTwitter } from 'react-icons/fa6';
import { ClassicoThumbnail } from '@/components/cartao/templates/Classico';
import { PretoDouradoThumbnail } from '@/components/cartao/templates/PretoDourado';
import { RedesThumbnail } from '@/components/cartao/templates/Redes';
import { PlacaThumbnail } from '@/components/cartao/templates/Placa';

export default function HomePage() {
  const supportedTypes = [
    { label: 'URL / Links', icon: Globe },
    { label: 'WhatsApp', icon: MessageSquare },
    { label: 'Instagram', icon: FaInstagram },
    { label: 'Facebook', icon: FaFacebookF },
    { label: 'X (Twitter)', icon: FaXTwitter },
    { label: 'vCard 3.0', icon: UserCheck },
    { label: 'Rede Wi-Fi', icon: Wifi },
    { label: 'Telefone', icon: Phone },
    { label: 'E-mail', icon: Mail },
    { label: 'Texto Livre', icon: FileText },
  ];

  const featuredModels = [
    {
      id: 'classic_card',
      name: 'Cartão de Visita Clássico',
      badge: 'Até 3 QR no Verso',
      component: <ClassicoThumbnail />,
    },
    {
      id: 'gold_premium',
      name: 'Preto & Dourado Premium',
      badge: 'Selo Dourado',
      component: <PretoDouradoThumbnail />,
    },
    {
      id: 'social_card',
      name: 'Cartão Redes Sociais',
      badge: 'Instagram + WhatsApp',
      component: <RedesThumbnail />,
    },
    {
      id: 'table_tent',
      name: 'Placa de Mesa Vertical',
      badge: 'Display Balcão',
      component: <PlacaThumbnail className="max-w-[200px] mx-auto" />,
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Escolha',
      description: 'Selecione um QR code avulso (URL, WhatsApp, Wi-Fi...) ou um modelo de cartão pronto para gráfica.',
      icon: Sparkles,
    },
    {
      number: '02',
      title: 'Personalize',
      description: 'Preencha os seus dados, adicione logotipo, ajuste cores e visualize as alterações em tempo real.',
      icon: Sliders,
    },
    {
      number: '03',
      title: 'Descarregue',
      description: 'Obtenha ficheiros em alta resolução (PNG 1024px/2048px, SVG vetorial ou PDF 300 DPI com sangria de 3mm).',
      icon: Download,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFFFF] selection:bg-[#99E1D9] selection:text-[#202C39]">
      <Header />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Left Column: Headline, Subtitle & Buttons */}
              <div className="lg:col-span-6 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#99E1D9]/25 border border-[#99E1D9] text-[#202C39] text-xs font-bold tracking-wide">
                  <Sparkles size={14} className="text-[#0f766e]" />
                  <span>Estúdio de Criação & Impressão Gráfica</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#202C39] tracking-tight leading-[1.12]">
                  Crie QR codes e cartões personalizados{' '}
                  <span className="text-[#0f766e] underline decoration-[#99E1D9] decoration-wavy decoration-2">
                    em segundos
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                  Gere QR codes estáticos profissionais sem expiração ou desenhe cartões de visita e placas de mesa de alta resolução prontos para impressão com sangria a 300 DPI.
                </p>

                {/* Hero 2 CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <Link href="/qrcode">
                    <Button
                      variant="primary"
                      size="lg"
                      icon={QrCode}
                      className="w-full sm:w-auto bg-[#202C39] hover:bg-[#18222D] shadow-lg shadow-[#202C39]/20"
                    >
                      Gerar QR code
                    </Button>
                  </Link>

                  <Link href="/cartoes">
                    <Button
                      variant="secondary"
                      size="lg"
                      icon={CreditCard}
                      className="w-full sm:w-auto shadow-md"
                    >
                      Criar cartão
                    </Button>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-[#0f766e]" />
                    100% no navegador (Sem registo)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-[#0f766e]" />
                    Exportação 300 DPI & Sangria
                  </span>
                </div>
              </div>

              {/* Right Column: Hero Showcase Image with Tiffany background block */}
              <div className="lg:col-span-6 relative flex items-center justify-center">
                {/* Tiffany Block behind the image */}
                <div className="absolute w-[90%] h-[90%] rounded-3xl bg-[#99E1D9] transform -rotate-2 -translate-x-2 translate-y-3 z-0 opacity-80 shadow-xl" />

                {/* Image Card Container */}
                <div className="relative z-10 w-full max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/hero_cards.jpg"
                    alt="Mockup de cartões de visita e placa de mesa com QR Code"
                    className="w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-500"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-slate-200/80 shadow-lg flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#202C39]">Cartões & Placas com QR Dinâmico</p>
                      <p className="text-[11px] text-slate-500">Prontos para gráfica ou uso digital</p>
                    </div>
                    <span className="bg-[#99E1D9]/40 text-[#202C39] font-bold px-2.5 py-1 rounded-xl text-[11px]">
                      300 DPI
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. DOIS CARTÕES GRANDES DE ESCOLHA */}
        <section className="py-12 bg-slate-50/70 border-y border-slate-200/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202C39] tracking-tight">
                Escolha o seu fluxo de criação
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Ferramentas rápidas e dedicadas para atender às suas necessidades
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card 1: QR Code Avulso */}
              <Link
                href="/qrcode"
                className="group relative bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#99E1D9] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#99E1D9]/30 text-[#0f766e] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <QrCode size={32} className="stroke-[2.2]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#202C39] group-hover:text-[#0f766e] transition-colors">
                    Gerador de QR Code Avulso
                  </h3>
                  <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                    Crie códigos QR individuais para WhatsApp, websites, redes sociais, vCard e redes Wi-Fi. Personalize cores, adicione o logótipo oficial e descarregue em PNG ou SVG vetorial.
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-[#202C39] group-hover:text-[#0f766e]">
                  <span>Criar QR Code Agora</span>
                  <ArrowRight size={18} className="transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>

              {/* Card 2: Cartões e Placas */}
              <Link
                href="/cartoes"
                className="group relative bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#202C39] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#202C39] text-[#99E1D9] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <CreditCard size={32} className="stroke-[2.2]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#202C39] group-hover:text-[#18222D] transition-colors">
                    Galeria de Cartões & Placas
                  </h3>
                  <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                    Modelos profissionais de cartões de visita clássicos, crachás tech com foto e placas de mesa verticais. Suporta até 3 QR codes em linha no verso e exportação em PDF de 300 DPI com sangria.
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-[#202C39]">
                  <span>Explorar Modelos de Cartão</span>
                  <ArrowRight size={18} className="transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* 3. TIPOS DE QR SUPORTADOS (FAIXA EM FUNDO TIFFANY CLARO) */}
        <section className="py-12 bg-[#99E1D9]/20 border-b border-[#99E1D9]/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#0f766e]">
                Versatilidade Total
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#202C39] mt-1">
                Tipos de QR Code Suportados
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {supportedTypes.map((t, idx) => {
                const Icon = t.icon;
                return (
                  <Link
                    key={idx}
                    href="/qrcode"
                    className="flex items-center gap-3 p-3.5 bg-white/90 hover:bg-white rounded-2xl border border-white/60 shadow-xs hover:shadow-md transition-all group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#99E1D9]/40 text-[#202C39] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Icon size={16} />
                    </div>
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {t.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. MODELOS EM DESTAQUE */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#0f766e]">
                  Colecção de Design
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202C39] tracking-tight mt-1">
                  Modelos de Cartão em Destaque
                </h2>
                <p className="text-sm text-slate-600 mt-2">
                  Escolha um modelo e comece a editar instantaneamente
                </p>
              </div>

              <Link href="/cartoes">
                <Button variant="outline" size="md" icon={ArrowRight} iconPosition="right">
                  Ver todos os modelos
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredModels.map((item) => (
                <Link
                  key={item.id}
                  href={`/cartoes/${item.id}`}
                  className="group bg-slate-50/70 border border-slate-200 rounded-3xl p-4 flex flex-col justify-between hover:shadow-xl hover:border-slate-300 transition-all duration-300"
                >
                  <div className="w-full flex items-center justify-center p-2 mb-3">
                    <div className="w-full transform group-hover:scale-[1.03] transition-transform">
                      {item.component}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#99E1D9]/30 text-[#0f766e]">
                        {item.badge}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#202C39] group-hover:text-[#0f766e] transition-colors truncate">
                      {item.name}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 5. COMO FUNCIONA (3 PASSOS) */}
        <section className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#0f766e]">
                Fluxo Simplificado
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202C39] tracking-tight mt-1">
                Como Funciona
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Três passos simples para ter o seu material pronto para uso ou impressão
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((st, idx) => {
                const Icon = st.icon;
                return (
                  <div
                    key={idx}
                    className="relative bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-3xl font-extrabold text-[#99E1D9] font-mono">
                          {st.number}
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#202C39]">
                          <Icon size={20} />
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-[#202C39] mb-2">
                        {st.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {st.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
