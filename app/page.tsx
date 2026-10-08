'use client';

import React, { useState, useMemo } from 'react';
import { TypeSelector } from '@/components/TypeSelector';
import { FormFields } from '@/components/FormFields';
import { QRPreview } from '@/components/QRPreview';
import { 
  QRType, 
  VCardData, 
  WifiData, 
  EmailData, 
  WhatsAppData,
  buildUrlPayload,
  buildVCardPayload,
  buildTelPayload,
  buildEmailPayload,
  buildWhatsAppPayload,
  buildWifiPayload,
  buildTextPayload
} from '@/lib/builders';
import { QrCode, ShieldCheck, Zap, Infinity as InfinityIcon, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const [currentType, setCurrentType] = useState<QRType>('url');

  // Form states
  const [url, setUrl] = useState<string>('https://google.com');
  const [vcard, setVcard] = useState<VCardData>({
    firstName: 'Américo',
    lastName: 'Nhantumbo',
    organization: 'Mindinho Tech',
    jobTitle: 'Gestor de Projetos',
    phone: '+258 84 123 4567',
    email: 'contacto@mindinho.co.mz',
    website: 'https://mindinho.co.mz',
    address: 'Maputo, Moçambique',
    notes: 'Disponível de Seg a Sex das 8h às 17h',
  });
  const [whatsapp, setWhatsapp] = useState<WhatsAppData>({
    phone: '258841234567',
    message: 'Olá! Gostaria de falar sobre os vossos serviços.',
  });
  const [wifi, setWifi] = useState<WifiData>({
    ssid: 'MinhaRede_Wi-Fi',
    password: 'senha_segura_123',
    encryption: 'WPA',
    hidden: false,
  });
  const [phone, setPhone] = useState<string>('+258 84 123 4567');
  const [email, setEmail] = useState<EmailData>({
    to: 'suporte@empresa.com',
    subject: 'Contacto via QR Code',
    body: 'Olá, envio esta mensagem através do QR Code do vosso folheto.',
  });
  const [text, setText] = useState<string>('Este é um QR Code estático totalmente seguro e duradouro.');

  // Dynamically compute the QR Code payload
  const payload = useMemo(() => {
    switch (currentType) {
      case 'url':
        return buildUrlPayload(url);
      case 'vcard':
        return buildVCardPayload(vcard);
      case 'whatsapp':
        return buildWhatsAppPayload(whatsapp);
      case 'wifi':
        return buildWifiPayload(wifi);
      case 'tel':
        return buildTelPayload(phone);
      case 'email':
        return buildEmailPayload(email);
      case 'text':
        return buildTextPayload(text);
      default:
        return '';
    }
  }, [currentType, url, vcard, whatsapp, wifi, phone, email, text]);

  const typeLabels: Record<QRType, string> = {
    url: 'URL / Link',
    vcard: 'Cartão de Contacto',
    whatsapp: 'WhatsApp Directo',
    wifi: 'Rede Wi-Fi',
    tel: 'Chamada Telefónica',
    email: 'Mensagem de Email',
    text: 'Texto Livre',
  };

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
              <QrCode size={26} className="brand-icon" />
            </div>
            <div>
              <div className="brand-title-row">
                <h1 className="brand-title">Gerador de QR Code Estático</h1>
                <span className="static-pill">100% Estático &bull; Ilimitado</span>
              </div>
              <p className="brand-subtitle">
                Gere QR Codes profissionais directamente no seu navegador. Sem servidor, sem expiração, sem limites.
              </p>
            </div>
          </div>

          <div className="header-badges">
            <div className="badge-item">
              <InfinityIcon size={16} className="text-cyan" />
              <span>Nunca Expira</span>
            </div>
            <div className="badge-item">
              <ShieldCheck size={16} className="text-emerald" />
              <span>100% Privado</span>
            </div>
            <div className="badge-item">
              <Zap size={16} className="text-amber" />
              <span>Zero Custos</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="container main-content">
        <div className="workspace-grid">
          {/* Left Column: Selector & Form */}
          <div className="generator-column">
            {/* Step 1: Tipo */}
            <div className="panel-card">
              <div className="panel-header">
                <span className="step-number">1</span>
                <div>
                  <h2 className="panel-title">Escolha o Tipo de QR Code</h2>
                  <p className="panel-subtitle">Selecione o formato de dados que pretende codificar</p>
                </div>
              </div>
              <TypeSelector currentType={currentType} onSelect={setCurrentType} />
            </div>

            {/* Step 2: Formulário do Tipo */}
            <div className="panel-card">
              <div className="panel-header">
                <span className="step-number">2</span>
                <div>
                  <h2 className="panel-title">Preencha as Informações</h2>
                  <p className="panel-subtitle">
                    Configuração para {typeLabels[currentType]}
                  </p>
                </div>
              </div>

              <FormFields
                type={currentType}
                url={url}
                setUrl={setUrl}
                vcard={vcard}
                setVcard={setVcard}
                whatsapp={whatsapp}
                setWhatsapp={setWhatsapp}
                wifi={wifi}
                setWifi={setWifi}
                phone={phone}
                setPhone={setPhone}
                email={email}
                setEmail={setEmail}
                text={text}
                setText={setText}
              />
            </div>

            {/* Explanatory Info Card */}
            <div className="info-banner-card">
              <div className="info-banner-icon">
                <Sparkles size={22} />
              </div>
              <div>
                <h4 className="info-banner-title">Por que os QR Codes Estáticos são melhores para cartões e impressos?</h4>
                <p className="info-banner-desc">
                  Como todos os dados ficam salvos dentro dos próprios módulos do código (sem redireccionamento por servidor ou banco de dados), o seu código <strong>nunca vai expirar</strong> nem parar de funcionar se uma plataforma externa fechar ou cobrar mensalidade.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Preview & Download Options */}
          <div className="preview-column">
            <div className="sticky-wrapper">
              <QRPreview payload={payload} typeLabel={typeLabels[currentType]} />
            </div>
          </div>
        </div>

        {/* Feature comparison table / FAQ */}
        <section className="features-section">
          <div className="section-header text-center">
            <h3 className="section-title">Vantagens do Gerador Estático</h3>
            <p className="section-desc">Entenda como a arquitectura sem servidor protege os seus códigos</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-circle emerald-circle">
                <ShieldCheck size={24} />
              </div>
              <h4 className="feature-title">Privacidade e Segurança Total</h4>
              <p className="feature-text">
                Nenhum dado que digita sai do seu computador. Os cálculos matemáticos do QR Code acontecem 100% no motor JavaScript do seu navegador.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-circle cyan-circle">
                <InfinityIcon size={24} />
              </div>
              <h4 className="feature-title">Validade Eterna &amp; Sem Dependências</h4>
              <p className="feature-text">
                Não há servidor intermédio nem links curtos propensos a expirar. Ideal para cartões de visita, embalagens, crachás e montras.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-circle amber-circle">
                <Zap size={24} />
              </div>
              <h4 className="feature-title">Hospedagem 100% Gratuita</h4>
              <p className="feature-text">
                Compatível com exportação estática (<code>output: &apos;export&apos;</code>). Pode ser hospedado na Vercel, Netlify, Cloudflare Pages ou GitHub Pages sem custos de infraestrutura.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="container footer-content">
          <p>&copy; {new Date().getFullYear()} Gerador de QR Code Estático. Construído para máxima durabilidade e simplicidade.</p>
        </div>
      </footer>
    </div>
  );
}
