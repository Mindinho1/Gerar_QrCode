'use client';

import React, { useState } from 'react';
import { CardFormData, CARD_MODELS, QRCodeItem } from '@/lib/cardModels';
import { QRType, buildPayloadForQRItem } from '@/lib/builders';
import { isMandatorySocialType } from '@/lib/brandIcons';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { FileUpload } from '@/components/ui/FileUpload';
import { 
  Image as ImageIcon, 
  User, 
  QrCode, 
  Palette, 
  Plus, 
  Trash2, 
  Lock, 
  Briefcase, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  AtSign, 
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';

import { ViewFaceMode } from './SideToggle';

interface CardFormProps {
  formData: CardFormData;
  onChange: (updated: CardFormData) => void;
  activeFace?: ViewFaceMode;
  onNavigateToFace?: (face: 'front' | 'back') => void;
}

const QR_TYPE_CHOICES = [
  { value: 'whatsapp', label: 'WhatsApp (Directo)' },
  { value: 'instagram', label: 'Instagram (@handle)' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'url', label: 'Website / Link' },
  { value: 'vcard', label: 'Cartão de Contacto' },
  { value: 'tel', label: 'Telefone' },
  { value: 'email', label: 'E-mail' },
  { value: 'text', label: 'Texto Livre' },
];

export const CardForm: React.FC<CardFormProps> = ({
  formData,
  onChange,
  activeFace = 'front',
  onNavigateToFace,
}) => {
  const currentModel = CARD_MODELS.find((m) => m.id === formData.modelId) || CARD_MODELS[0];
  const maxAllowedQRs = currentModel.maxQRs || 1;
  const isBackOnly = currentModel.qrLocation === 'back_only';

  // Open accordion states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    imagem: true,
    textos: true,
    qrcodes: true,
    cores: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Add QR code item
  const handleAddQR = () => {
    if (formData.qrItems.length >= maxAllowedQRs) return;
    const newId = `qr-${Date.now()}`;
    const nextItem: QRCodeItem = {
      id: newId,
      type: 'whatsapp',
      label: 'WhatsApp',
      value: formData.whatsappPhone || '351912345678',
    };
    onChange({
      ...formData,
      qrItems: [...formData.qrItems, nextItem],
    });
  };

  // Remove QR code item
  const handleRemoveQR = (index: number) => {
    if (formData.qrItems.length <= 1) return;
    const updated = [...formData.qrItems];
    updated.splice(index, 1);
    onChange({ ...formData, qrItems: updated });
  };

  // Update specific QR item
  const handleUpdateQR = (index: number, partial: Partial<QRCodeItem>) => {
    const updated = [...formData.qrItems];
    updated[index] = { ...updated[index], ...partial };
    onChange({ ...formData, qrItems: updated });
  };

  // Handle services list for services_card
  const [newServiceText, setNewServiceText] = useState('');
  const handleAddService = () => {
    if (!newServiceText.trim()) return;
    onChange({
      ...formData,
      servicesList: [...formData.servicesList, newServiceText.trim()],
    });
    setNewServiceText('');
  };

  const handleRemoveService = (index: number) => {
    const updated = [...formData.servicesList];
    updated.splice(index, 1);
    onChange({ ...formData, servicesList: updated });
  };

  return (
    <div className="w-full space-y-4">
      <Accordion>
        {/* SECÇÃO 1: IMAGEM & IDENTIDADE */}
        <AccordionItem
          id="imagem"
          title="1. Imagem & Identidade"
          subtitle="Logotipo, foto de perfil ou monograma"
          icon={ImageIcon}
          isOpen={openSections.imagem}
          onToggle={() => toggleSection('imagem')}
        >
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FileUpload
                label="Logotipo da Empresa"
                value={formData.logoUrl}
                onChange={(logo) => onChange({ ...formData, logoUrl: logo })}
                helperText="PNG transparente recomendado."
              />

              {formData.modelId === 'dark_green_id' ? (
                <FileUpload
                  label="Foto do Titular (Avatar)"
                  value={formData.photoUrl}
                  onChange={(photo) => onChange({ ...formData, photoUrl: photo })}
                  helperText="Aparece com moldura circular neon."
                />
              ) : (
                <Input
                  label="Monograma / Iniciais (Ex: DM)"
                  placeholder="DM"
                  value={formData.monogram}
                  onChange={(e) => onChange({ ...formData, monogram: e.target.value.toUpperCase() })}
                  helperText="Usado em selos dourados e cabeçalhos clássicos."
                  maxLength={4}
                />
              )}
            </div>
          </div>
        </AccordionItem>

        {/* SECÇÃO 2: TEXTOS & CONTACTOS */}
        <AccordionItem
          id="textos"
          title="2. Textos & Informações"
          subtitle="Nome, cargo, slogan e contactos"
          icon={User}
          isOpen={openSections.textos}
          onToggle={() => toggleSection('textos')}
        >
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Nome Completo"
                placeholder="Dr. David Montoya"
                icon={User}
                value={formData.name}
                onChange={(e) => onChange({ ...formData, name: e.target.value })}
              />
              <Input
                label="Cargo / Título Profissional"
                placeholder="Cirurgião Especialista"
                icon={Briefcase}
                value={formData.title}
                onChange={(e) => onChange({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Empresa / Consultório"
                placeholder="Torre Empresarial"
                value={formData.company}
                onChange={(e) => onChange({ ...formData, company: e.target.value })}
              />
              <Input
                label="Slogan / Subtítulo"
                placeholder="Medicina e Cirurgia de Ponta"
                value={formData.subtitle}
                onChange={(e) => onChange({ ...formData, subtitle: e.target.value })}
              />
            </div>

            {formData.modelId === 'dark_green_id' && (
              <Input
                label="Número de Identificação (ID)"
                placeholder="98/B-2079"
                value={formData.idNumber}
                onChange={(e) => onChange({ ...formData, idNumber: e.target.value })}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Telefone Principal"
                placeholder="+351 91 234 5678"
                icon={Phone}
                value={formData.phone}
                onChange={(e) => onChange({ ...formData, phone: e.target.value })}
              />
              <Input
                label="WhatsApp (Com indicativo)"
                placeholder="351912345678"
                icon={Phone}
                value={formData.whatsappPhone}
                onChange={(e) => onChange({ ...formData, whatsappPhone: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="E-mail"
                placeholder="contacto@empresa.com"
                icon={Mail}
                type="email"
                value={formData.email}
                onChange={(e) => onChange({ ...formData, email: e.target.value })}
              />
              <Input
                label="Website"
                placeholder="https://empresa.com"
                icon={Globe}
                value={formData.website}
                onChange={(e) => onChange({ ...formData, website: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Morada / Localização"
                placeholder="Av. Liberdade, Lisboa"
                icon={MapPin}
                value={formData.address}
                onChange={(e) => onChange({ ...formData, address: e.target.value })}
              />
              <Input
                label="Rede Social (@handle)"
                placeholder="@dr.davidmontoya"
                icon={AtSign}
                value={formData.handle}
                onChange={(e) => onChange({ ...formData, handle: e.target.value })}
              />
            </div>

            {/* Serviços (para Cartão de Serviços) */}
            {formData.modelId === 'services_card' && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <label className="text-xs font-bold text-slate-800 tracking-wide block">
                  Lista de Especialidades / Serviços
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Adicionar serviço (ex: Harmonização Facial)"
                    value={newServiceText}
                    onChange={(e) => setNewServiceText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddService();
                      }
                    }}
                  />
                  <Button variant="secondary" size="md" onClick={handleAddService}>
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.servicesList.map((service, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 text-xs bg-white border border-slate-200 px-3 py-1 rounded-xl text-slate-800 font-medium"
                    >
                      <CheckCircle2 size={12} className="text-[#0f766e]" />
                      <span>{service}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(idx)}
                        className="text-slate-400 hover:text-rose-500 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </AccordionItem>

        {/* SECÇÃO 3: QR CODES */}
        <AccordionItem
          id="qrcodes"
          title="3. QR Codes no Cartão"
          subtitle={`Configuração de ${formData.qrItems.length} de ${maxAllowedQRs} QR Codes`}
          icon={QrCode}
          badge={`${formData.qrItems.length}/${maxAllowedQRs}`}
          isOpen={openSections.qrcodes}
          onToggle={() => toggleSection('qrcodes')}
        >
          <div className="space-y-4 pt-2">
            {/* Aviso especial de localização do QR */}
            {isBackOnly && (
              <div className="p-3 bg-teal-50 border border-teal-200/80 rounded-2xl flex items-start justify-between gap-3 text-xs text-teal-900">
                <div className="flex items-start gap-2">
                  <Info size={16} className="text-teal-700 shrink-0 mt-0.5" />
                  <p>
                    <strong>Nota do modelo:</strong> Os QR codes deste cartão ficam posicionados no <strong>VERSO</strong> para manter a frente 100% limpa e sofisticada.
                  </p>
                </div>
                {onNavigateToFace && activeFace !== 'back' && (
                  <button
                    type="button"
                    onClick={() => onNavigateToFace('back')}
                    className="text-[11px] font-bold text-teal-800 underline shrink-0 hover:text-teal-950"
                  >
                    Ver Verso
                  </button>
                )}
              </div>
            )}

            {/* Lista de blocos QR */}
            <div className="space-y-3">
              {formData.qrItems.map((qr, index) => {
                const isSocial = isMandatorySocialType(qr.type);
                return (
                  <div
                    key={qr.id}
                    className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <QrCode size={14} className="text-[#0f766e]" />
                        Código #{index + 1}
                      </span>
                      {formData.qrItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQR(index)}
                          className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-semibold"
                        >
                          <Trash2 size={13} />
                          Remover
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Select
                        label="Tipo de QR"
                        value={qr.type}
                        options={QR_TYPE_CHOICES}
                        onChange={(e) =>
                          handleUpdateQR(index, {
                            type: e.target.value as any,
                            label: e.target.options[e.target.selectedIndex].text.split(' ')[0],
                          })
                        }
                      />
                      <Input
                        label="Legenda Exibida"
                        placeholder="Ex: WhatsApp ou Portfolio"
                        value={qr.label}
                        onChange={(e) => handleUpdateQR(index, { label: e.target.value })}
                      />
                    </div>

                    <Input
                      label={
                        qr.type === 'whatsapp'
                          ? 'Número de WhatsApp (com indicativo)'
                          : qr.type === 'instagram'
                          ? 'Perfil Instagram (@handle)'
                          : 'Destino / Link / Valor'
                      }
                      placeholder={
                        qr.type === 'whatsapp'
                          ? '351912345678'
                          : qr.type === 'instagram'
                          ? 'meu_perfil'
                          : 'https://minhapagina.com'
                      }
                      value={qr.value}
                      onChange={(e) => handleUpdateQR(index, { value: e.target.value })}
                    />

                    {isSocial && (
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Lock size={12} className="text-amber-600" />
                        Logótipo oficial da rede aplicado automaticamente no centro do QR.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Botão de adicionar QR (até maxAllowedQRs) */}
            {formData.qrItems.length < maxAllowedQRs && (
              <Button
                variant="outline"
                size="md"
                icon={Plus}
                onClick={handleAddQR}
                className="w-full border-dashed border-2 py-3"
              >
                Adicionar mais um QR Code (até {maxAllowedQRs})
              </Button>
            )}
          </div>
        </AccordionItem>

        {/* SECÇÃO 4: CORES DO MODELO */}
        <AccordionItem
          id="cores"
          title="4. Cores do Modelo"
          subtitle="Paleta de cores e personalização visual"
          icon={Palette}
          isOpen={openSections.cores}
          onToggle={() => toggleSection('cores')}
        >
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ColorPicker
                label="Cor Primária (Fundo Principal)"
                value={formData.primaryColor}
                onChange={(c) => onChange({ ...formData, primaryColor: c })}
              />
              <ColorPicker
                label="Cor Secundária (Fundo Secundário)"
                value={formData.secondaryColor}
                onChange={(c) => onChange({ ...formData, secondaryColor: c })}
              />
              <ColorPicker
                label="Cor de Acento (Destaques)"
                value={formData.accentColor}
                onChange={(c) => onChange({ ...formData, accentColor: c })}
              />
              <ColorPicker
                label="Cor do Texto"
                value={formData.textColor}
                onChange={(c) => onChange({ ...formData, textColor: c })}
              />
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
