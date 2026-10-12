'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { QRTypeSelector } from '@/components/qr/QRTypeSelector';
import { QRForm, QRFormValues } from '@/components/qr/QRForm';
import { QRStyleOptions, QRStyleSettings } from '@/components/qr/QRStyleOptions';
import { QRPreview } from '@/components/qr/QRPreview';
import { 
  QRType, 
  buildUrlPayload, 
  buildWhatsAppPayload, 
  buildInstagramPayload, 
  buildFacebookPayload, 
  buildXPayload, 
  buildVCardPayload, 
  buildWifiPayload, 
  buildTelPayload, 
  buildEmailPayload, 
  buildTextPayload 
} from '@/lib/builders';
import { QrCode, Sliders, ShieldCheck, Sparkles, Layers } from 'lucide-react';

const INITIAL_FORM_VALUES: QRFormValues = {
  url: 'https://exemplo.com',
  whatsapp: { phone: '351912345678', message: 'Olá! Gostaria de mais informações.' },
  instagram: 'estudio_design',
  facebook: 'minhapagina',
  x: 'perfiloficial',
  vcard: {
    firstName: 'David',
    lastName: 'Montoya',
    organization: 'Torre Empresarial',
    jobTitle: 'Diretor Geral',
    phone: '+351 91 234 5678',
    email: 'contacto@davidmontoya.com',
    website: 'https://davidmontoya.com',
    address: 'Av. Liberdade, 120, Lisboa',
  },
  wifi: {
    ssid: 'Studio_Guest_5G',
    password: 'senha_segura_2026',
    encryption: 'WPA',
    hidden: false,
  },
  tel: '+351 91 234 5678',
  email: {
    to: 'contacto@empresa.com',
    subject: 'Pedido de Proposta',
    body: 'Olá, pretendo solicitar um orçamento...',
  },
  text: 'Código promocional: DESCONTO10',
};

const INITIAL_STYLE_SETTINGS: QRStyleSettings = {
  fgColor: '#202C39',
  bgColor: '#FFFFFF',
  errorCorrection: 'H',
  logoSizePercent: 22,
  margin: 2,
};

export default function QRCodePage() {
  const [currentType, setCurrentType] = useState<QRType>('url');

  // Load from localStorage or defaults
  const [formValues, setFormValues] = useState<QRFormValues>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('standalone_qr_values');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn(e);
      }
    }
    return INITIAL_FORM_VALUES;
  });

  const [styleSettings, setStyleSettings] = useState<QRStyleSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('standalone_qr_styles');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn(e);
      }
    }
    return INITIAL_STYLE_SETTINGS;
  });

  // Save to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('standalone_qr_values', JSON.stringify(formValues));
    }
  }, [formValues]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('standalone_qr_styles', JSON.stringify(styleSettings));
    }
  }, [styleSettings]);

  // Compute payload for current type
  const payload = useMemo(() => {
    switch (currentType) {
      case 'url':
        return buildUrlPayload(formValues.url);
      case 'whatsapp':
        return buildWhatsAppPayload(formValues.whatsapp);
      case 'instagram':
        return buildInstagramPayload(formValues.instagram);
      case 'facebook':
        return buildFacebookPayload(formValues.facebook);
      case 'x':
        return buildXPayload(formValues.x);
      case 'vcard':
        return buildVCardPayload(formValues.vcard);
      case 'wifi':
        return buildWifiPayload(formValues.wifi);
      case 'tel':
        return buildTelPayload(formValues.tel);
      case 'email':
        return buildEmailPayload(formValues.email);
      case 'text':
      default:
        return buildTextPayload(formValues.text);
    }
  }, [currentType, formValues]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFFFF]">
      <Header />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Title */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#99E1D9]/25 text-[#0f766e] text-xs font-bold mb-2">
              <QrCode size={14} />
              <span>Gerador Estático e Gratuito</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#202C39] tracking-tight">
              Gerador de QR Code Avulso
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Crie códigos QR para qualquer finalidade. Processado 100% no seu computador, sem expiração e com download imediato em PNG e SVG.
            </p>
          </div>

          {/* Step 1: Type Selector */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-[#202C39] uppercase tracking-wider">
                1. Escolha o tipo de conteúdo
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                10 Formatos Disponíveis
              </span>
            </div>
            <QRTypeSelector currentType={currentType} onSelect={setCurrentType} />
          </div>

          {/* Two-Column Workspace Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Coluna Esquerda (Formulário e Estilo) - 7 Colunas */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 2: Content Form */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-[#202C39] uppercase tracking-wider">
                    2. Preencha o conteúdo
                  </span>
                </div>
                <QRForm
                  type={currentType}
                  values={formValues}
                  onChange={setFormValues}
                />
              </div>

              {/* Step 3: Style Options */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-[#202C39] uppercase tracking-wider">
                    3. Personalização & Estilo
                  </span>
                </div>
                <QRStyleOptions
                  type={currentType}
                  styleSettings={styleSettings}
                  onChange={setStyleSettings}
                />
              </div>
            </div>

            {/* Coluna Direita (Pré-visualização e Descarga) - 5 Colunas (Sticky no desktop) */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
              <QRPreview
                payload={payload}
                type={currentType}
                styleSettings={styleSettings}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
