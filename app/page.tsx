'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ModelCardPicker } from '@/components/ModelCardPicker';
import { CardFormEditor } from '@/components/CardFormEditor';
import { ModelId, CardFormData, CARD_MODELS } from '@/lib/cardModels';

const CardLivePreview = dynamic(
  () => import('@/components/CardLivePreview').then((mod) => mod.CardLivePreview),
  {
    ssr: false,
    loading: () => (
      <div className="preview-card-wrapper flex items-center justify-center p-12 text-slate-400">
        Carregando pré-visualização...
      </div>
    ),
  }
);
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Infinity as InfinityIcon, 
  CreditCard, 
  Printer, 
  FileCheck2,
  Sliders,
  CheckCircle2
} from 'lucide-react';

const INITIAL_MODEL_DATA: Record<ModelId, CardFormData> = {
  classic_card: {
    modelId: 'classic_card',
    qrPosition: 'back',
    name: 'Dr. David Montoya',
    title: 'Cirujano Plastico',
    company: 'Torre Empresarial Capitalia',
    subtitle: 'Medicina e Cirurgia Especializada',
    handle: '@dr.davidmontoya',
    idNumber: '',
    phone: '+57 315 282 5246',
    whatsappPhone: '573152825246',
    email: 'contacto@davidmontoya.com',
    website: 'https://davidmontoya.com',
    address: 'Av. Santander # 62-39, Caldas',
    servicesList: [],
    monogram: 'DM',
    primaryColor: '#182B49',
    secondaryColor: '#FFFFFF',
    accentColor: '#D4AF37',
    textColor: '#182B49',
    qrItems: [
      {
        id: 'qr-1',
        type: 'whatsapp',
        label: 'WhatsApp',
        value: '573152825246',
      },
    ],
  },
  social_card: {
    modelId: 'social_card',
    qrPosition: 'back',
    name: 'Alexandre Silva',
    title: 'Criador de Conteúdo & Design',
    company: 'Studio Digital',
    subtitle: 'Conecte-se comigo nas redes sociais',
    handle: '@alexandredesign',
    idNumber: '',
    phone: '+258 84 123 4567',
    whatsappPhone: '258841234567',
    email: 'alexandre@design.co.mz',
    website: 'https://alexandredesign.me',
    address: 'Maputo, Moçambique',
    servicesList: [],
    monogram: 'AS',
    primaryColor: '#0F172A',
    secondaryColor: '#1E293B',
    accentColor: '#E1306C',
    textColor: '#FFFFFF',
    qrItems: [
      {
        id: 'qr-1',
        type: 'instagram',
        label: 'Instagram',
        value: 'alexandredesign',
      },
      {
        id: 'qr-2',
        type: 'whatsapp',
        label: 'WhatsApp',
        value: '258841234567',
      },
    ],
  },
  dark_green_id: {
    modelId: 'dark_green_id',
    qrPosition: 'front',
    name: 'Makhdoom Nouman',
    title: 'Security Verified Member',
    company: 'WHATSAPP OFFICIAL IDENTITY',
    subtitle: 'Authorized Personnel',
    handle: '@makhdoom',
    idNumber: '98/b-2079',
    phone: '+258 84 123 4567',
    whatsappPhone: '258841234567',
    email: 'makhdoom@secure.com',
    website: 'https://wa.me/258841234567',
    address: 'Global Hub',
    servicesList: [],
    monogram: 'MN',
    primaryColor: '#060B0E',
    secondaryColor: '#00E676',
    accentColor: '#00E676',
    textColor: '#FFFFFF',
    qrItems: [
      {
        id: 'qr-1',
        type: 'whatsapp',
        label: 'WhatsApp ID',
        value: '258841234567',
      },
    ],
  },
  gold_premium: {
    modelId: 'gold_premium',
    qrPosition: 'back',
    name: 'Laurenzo Donatelli',
    title: 'Executive Wealth Advisor',
    company: 'Private Consulting Group',
    subtitle: 'Serviços Financeiros Exclusivos',
    handle: '@donatelli.vip',
    idNumber: '',
    phone: '+258 84 999 8888',
    whatsappPhone: '258849998888',
    email: 'laurenzo@donatellivip.com',
    website: 'https://donatelli.vip',
    address: 'Av. Julius Nyerere, Polana',
    servicesList: [],
    monogram: 'LD',
    primaryColor: '#0B1220',
    secondaryColor: '#D4AF37',
    accentColor: '#D4AF37',
    textColor: '#FAF6EE',
    qrItems: [
      {
        id: 'qr-1',
        type: 'url',
        label: 'Acesso VIP',
        value: 'https://donatelli.vip',
      },
    ],
  },
  table_tent: {
    modelId: 'table_tent',
    qrPosition: 'front',
    name: 'Bistro & Lounge Gourmet',
    title: 'Menu Digital & Wi-Fi',
    company: 'BISTRO & LOUNGE GOURMET',
    subtitle: 'Aponte a câmara do seu telemóvel para aceder',
    handle: '@bistrogourmet',
    idNumber: '',
    phone: '+258 84 555 1234',
    whatsappPhone: '258845551234',
    email: 'contacto@bistrogourmet.mz',
    website: 'https://bistrogourmet.mz/menu',
    address: 'Zona Gastronómica, Maputo',
    wifiSsid: 'Bistro_Gourmet_Guest',
    servicesList: [],
    monogram: 'BG',
    primaryColor: '#182B49',
    secondaryColor: '#FFFFFF',
    accentColor: '#F59E0B',
    textColor: '#0F172A',
    qrItems: [
      {
        id: 'qr-1',
        type: 'wifi',
        label: 'Wi-Fi & Cardápio',
        value: 'WIFI:T:WPA;S:Bistro_Gourmet_Guest;P:bistro2026;;',
      },
    ],
  },
  services_card: {
    modelId: 'services_card',
    qrPosition: 'back',
    name: 'Júlia Strepchenkova',
    title: 'estética e cosmetologia',
    company: 'Clínica de Estética Avançada',
    subtitle: 'Procedimentos faciais e corporais de alta precisão',
    handle: 'julia.st__cosm65',
    idNumber: '',
    phone: '+7 (914) 089-72-22',
    whatsappPhone: '79140897222',
    email: 'julia.strep@estetica.com',
    website: 'https://instagram.com/julia.st__cosm65',
    address: 'Clínica Bella Vita, Sala 402',
    servicesList: [
      'Contorno e preenchimento labial',
      'Mesoterapia e bio-revitalização facial',
      'Lipoescultura e drenagem enzimática',
      'Harmonização e toxina botulínica',
    ],
    monogram: 'JS',
    primaryColor: '#1A4959',
    secondaryColor: '#FAF8F3',
    accentColor: '#D4AF37',
    textColor: '#1F2937',
    qrItems: [
      {
        id: 'qr-1',
        type: 'instagram',
        label: 'Instagram',
        value: 'julia.st__cosm65',
      },
    ],
  },
};

export default function HomePage() {
  const [selectedModel, setSelectedModel] = useState<ModelId>('classic_card');
  const [formData, setFormData] = useState<CardFormData>(INITIAL_MODEL_DATA['classic_card']);

  // Handle switching model
  const handleModelSelect = (modelId: ModelId) => {
    setSelectedModel(modelId);
    const template = INITIAL_MODEL_DATA[modelId];

    // Preserve custom contact info if user already typed it
    setFormData((prev) => ({
      ...template,
      name: prev.name !== INITIAL_MODEL_DATA[prev.modelId].name ? prev.name : template.name,
      phone: prev.phone !== INITIAL_MODEL_DATA[prev.modelId].phone ? prev.phone : template.phone,
      email: prev.email !== INITIAL_MODEL_DATA[prev.modelId].email ? prev.email : template.email,
      monogram: prev.monogram !== INITIAL_MODEL_DATA[prev.modelId].monogram ? prev.monogram : template.monogram,
      photoUrl: prev.photoUrl,
    }));
  };

  const currentDef = CARD_MODELS.find((m) => m.id === selectedModel) || CARD_MODELS[0];

  return (
    <div className="main-layout">
      {/* Background ambient lighting */}
      <div className="ambient-glow glow-top-left" />
      <div className="ambient-glow glow-top-right" />

      {/* Header */}
      <header className="app-header">
        <div className="container header-inner">
          <div className="brand-group">
            <div className="brand-logo-badge">
              <CreditCard size={26} className="brand-icon" />
            </div>
            <div>
              <div className="brand-title-row">
                <h1 className="brand-title">Estúdio de Cartões &amp; QR Codes</h1>
              </div>
              <p className="brand-subtitle">
                Gere cartões profissionais e placas com QR Codes de alta durabilidade, frente e verso, exportação PNG 300 DPI e PDF com marcas de corte.
              </p>
            </div>
          </div>

        </div>
      </header>

      {/* Main Workspace */}
      <main className="container main-content py-8">
        {/* Step 1: Model Selection */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Sliders size={20} className="text-indigo-600" />
                <span>Escolha o Modelo de Cartão ou Placa</span>
              </h2>
              <p className="text-xs text-slate-500">
                Selecione o formato desejado para configurar a quantidade e a posição ideal dos QR codes.
              </p>
            </div>
            <div className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
              Modelo ativo: {currentDef.name}
            </div>
          </div>

          <ModelCardPicker
            selectedModel={selectedModel}
            onSelect={handleModelSelect}
          />
        </section>

        {/* 2-Column Studio Grid: Editor on Left, Sticky Preview on Right */}
        <div className="workspace-grid">
          {/* Left Column: Form Editor */}
          <div className="generator-column">
            <CardFormEditor
              formData={formData}
              onChange={setFormData}
            />

            {/* Informational Guidance Banner */}
            <div className="info-banner-card mt-6">
              <div className="info-banner-icon">
                <Sparkles size={22} />
              </div>
              <div>
                <h4 className="info-banner-title">
                  Regras Técnicas de Alta Legibilidade e Impressão
                </h4>
                <ul className="text-xs text-slate-600 dark:text-slate-300 mt-2 space-y-1.5 list-disc pl-4">
                  <li>
                    <strong>Correção de Erros Nível H:</strong> Garante 30% de tolerância para manter a leitura do código intacta mesmo com o logótipo oficial no centro.
                  </li>
                  <li>
                    <strong>Área Central a 20%:</strong> Ícone proporcionalmente calibrado com margem limpa para não tocar nos padrões de sincronização do QR.
                  </li>
                  <li>
                    <strong>Dimensão Mínima de 20 mm:</strong> No verso de cartões 90×50 mm com até 3 QR codes em linha, cada código preserva o tamanho mínimo recomendado para qualquer câmara de smartphone.
                  </li>
                  <li>
                    <strong>URLs Curtas Recomendadas:</strong> Links diretos e limpos (ex: <code>wa.me/258...</code> ou <code>instagram.com/nome</code>) produzem matrizes mais simples e rápidas de escanear.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Live Preview & Export */}
          <div className="preview-column">
            <div className="sticky-wrapper">
              <CardLivePreview formData={formData} />
            </div>
          </div>
        </div>

        {/* Comparative Models Summary Table */}
        <section className="features-section mt-16">
          <div className="section-header text-center">
            <h3 className="section-title">Resumo das Especificações por Modelo</h3>
            <p className="section-desc">Estrutura definida para máxima harmonia visual e funcionalidade</p>
          </div>

          <div className="overflow-x-auto mt-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-4">Modelo</th>
                  <th className="py-3 px-4">Dimensões</th>
                  <th className="py-3 px-4">Qtd. QR Codes</th>
                  <th className="py-3 px-4">Localização dos Códigos</th>
                  <th className="py-3 px-4">Destaque do Design</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Cartão de visita clássico</td>
                  <td className="py-3 px-4 font-mono text-xs">90×50 mm</td>
                  <td className="py-3 px-4 font-bold text-indigo-600">Até 3</td>
                  <td className="py-3 px-4">Só no Verso</td>
                  <td className="py-3 px-4 text-xs">Frente livre para monograma, nome e contactos</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Cartão para redes sociais</td>
                  <td className="py-3 px-4 font-mono text-xs">90×50 mm</td>
                  <td className="py-3 px-4 font-bold text-pink-600">Até 3</td>
                  <td className="py-3 px-4">Só no Verso</td>
                  <td className="py-3 px-4 text-xs">Foco em @handle, avatar de perfil e ícones oficiais</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Cartão ID escuro/verde</td>
                  <td className="py-3 px-4 font-mono text-xs">90×54 mm</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">1</td>
                  <td className="py-3 px-4">Frente</td>
                  <td className="py-3 px-4 text-xs">Estilo Crachá WhatsApp Tech c/ circuitos neon e foto</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Preto e dourado premium</td>
                  <td className="py-3 px-4 font-mono text-xs">90×50 mm</td>
                  <td className="py-3 px-4 font-bold text-amber-600">1</td>
                  <td className="py-3 px-4">Frente ou Verso (à escolha)</td>
                  <td className="py-3 px-4 text-xs">Paleta Obsidian / Navy com monograma dourado luxo</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Placa de mesa vertical</td>
                  <td className="py-3 px-4 font-mono text-xs">105×148 mm</td>
                  <td className="py-3 px-4 font-bold text-cyan-600">1</td>
                  <td className="py-3 px-4">Zona Central</td>
                  <td className="py-3 px-4 text-xs">Display de balcão/mesa para leitura rápida e Wi-Fi</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Cartão de serviços</td>
                  <td className="py-3 px-4 font-mono text-xs">90×50 mm</td>
                  <td className="py-3 px-4 font-bold text-teal-600">1</td>
                  <td className="py-3 px-4">Frente ou Verso (à escolha)</td>
                  <td className="py-3 px-4 text-xs">Divisão em 2 colunas com lista de procedimentos e bullets</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="container footer-content">
          <p>&copy; {new Date().getFullYear()} Estúdio de Cartões &amp; QR Codes Estáticos. Construído para impressão profissional de alta fidelidade.</p>
        </div>
      </footer>
    </div>
  );
}
