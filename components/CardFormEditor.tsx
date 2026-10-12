'use client';

import React from 'react';
import { CardFormData, CARD_MODELS, QRCodeItem } from '@/lib/cardModels';
import { isMandatorySocialType } from '@/lib/brandIcons';
import { 
  Plus, 
  Trash2, 
  Lock, 
  Image as ImageIcon, 
  HelpCircle, 
  Sparkles, 
  User, 
  Briefcase, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  AtSign, 
  ListPlus,
  Palette,
  Camera
} from 'lucide-react';

interface CardFormEditorProps {
  formData: CardFormData;
  onChange: (updated: CardFormData) => void;
}

const QR_TYPE_OPTIONS = [
  { id: 'whatsapp', label: 'WhatsApp', isSocial: true },
  { id: 'instagram', label: 'Instagram', isSocial: true },
  { id: 'facebook', label: 'Facebook', isSocial: true },
  { id: 'x', label: 'X (Twitter)', isSocial: true },
  { id: 'url', label: 'Website / Link', isSocial: false },
  { id: 'vcard', label: 'Cartão de Contacto', isSocial: false },
  { id: 'tel', label: 'Telefone', isSocial: false },
  { id: 'email', label: 'E-mail', isSocial: false },
  { id: 'wifi', label: 'Rede Wi-Fi', isSocial: false },
  { id: 'text', label: 'Texto', isSocial: false },
] as const;

const THEME_PRESETS = [
  { name: 'Navy Montoya', primary: '#182B49', label: 'Azul Marinho Corporativo' },
  { name: 'Petrol Strepchenkova', primary: '#1A4959', label: 'Petrol & Creme Luxo' },
  { name: 'Sálvia Botelho', primary: '#5B6E64', label: 'Verde Sálvia Suave' },
  { name: 'Obsidian & Ouro', primary: '#0B1220', label: 'Preto & Ouro Premium' },
  { name: 'Cyber WhatsApp', primary: '#060B0E', label: 'Cyber Tech Neon' },
];

export const CardFormEditor: React.FC<CardFormEditorProps> = ({
  formData,
  onChange,
}) => {
  const currentModel = CARD_MODELS.find((m) => m.id === formData.modelId) || CARD_MODELS[0];
  const allowsMultipleQRs = currentModel.maxQRs > 1;

  // Add QR code (up to maxQRs)
  const handleAddQR = () => {
    if (formData.qrItems.length >= currentModel.maxQRs) return;
    const newId = `qr-${Date.now()}`;
    const nextItem: QRCodeItem = {
      id: newId,
      type: 'whatsapp',
      label: 'WhatsApp',
      value: formData.whatsappPhone || '258841234567',
    };
    onChange({
      ...formData,
      qrItems: [...formData.qrItems, nextItem],
    });
  };

  // Remove QR code
  const handleRemoveQR = (index: number) => {
    if (formData.qrItems.length <= 1) return;
    const updated = [...formData.qrItems];
    updated.splice(index, 1);
    onChange({ ...formData, qrItems: updated });
  };

  // Update specific QR code
  const handleUpdateQR = (index: number, patch: Partial<QRCodeItem>) => {
    const updated = [...formData.qrItems];
    const prev = updated[index];
    const next = { ...prev, ...patch };

    // Auto update default label when switching type
    if (patch.type && patch.type !== prev.type) {
      if (patch.type === 'whatsapp') next.label = 'WhatsApp';
      else if (patch.type === 'instagram') next.label = 'Instagram';
      else if (patch.type === 'facebook') next.label = 'Facebook';
      else if (patch.type === 'x') next.label = 'X / Twitter';
      else if (patch.type === 'url') next.label = 'Website';
      else if (patch.type === 'vcard') next.label = 'Contacto';
      else if (patch.type === 'wifi') next.label = 'Wi-Fi';
    }

    updated[index] = next;
    onChange({ ...formData, qrItems: updated });
  };

  // Handle Custom Logo upload for non-social QR
  const handleCustomLogoUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        handleUpdateQR(index, { customLogoUrl: e.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Photo upload for ID card or Avatar
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange({ ...formData, photoUrl: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Services list management (for Services Card)
  const handleAddService = () => {
    const list = formData.servicesList || [];
    onChange({
      ...formData,
      servicesList: [...list, 'Novo serviço de tratamento'],
    });
  };

  const handleUpdateService = (idx: number, text: string) => {
    const list = [...(formData.servicesList || [])];
    list[idx] = text;
    onChange({ ...formData, servicesList: list });
  };

  const handleRemoveService = (idx: number) => {
    const list = [...(formData.servicesList || [])];
    list.splice(idx, 1);
    onChange({ ...formData, servicesList: list });
  };

  return (
    <div className="editor-panels-stack">
      {/* SEÇÃO 1: CONFIGURAÇÃO DOS CÓDIGOS QR */}
      <div className="panel-card">
        <div className="panel-header">
          <div className="step-badge">1</div>
          <div>
            <h2 className="panel-title">Configuração de Códigos QR</h2>
            <p className="panel-subtitle">
              {allowsMultipleQRs
                ? `Modelo suporta até ${currentModel.maxQRs} códigos no verso.`
                : currentModel.qrLocation === 'front_only'
                ? 'Modelo com 1 QR Code fixo na frente.'
                : currentModel.qrLocation === 'center_only'
                ? 'Modelo com 1 QR Code na zona central.'
                : 'Modelo com 1 QR Code (frente ou verso à escolha).'}
            </p>
          </div>
        </div>

        {/* Escolha de posição quando aplicável (Preto e dourado / Cartão de serviços) */}
        {currentModel.qrLocation === 'choice' && (
          <div className="qr-location-selector">
            <span className="location-label">Onde colocar o QR Code?</span>
            <div className="segmented-tabs">
              <button
                type="button"
                className={`segmented-tab ${formData.qrPosition === 'front' ? 'active' : ''}`}
                onClick={() => onChange({ ...formData, qrPosition: 'front' })}
              >
                Na Frente
              </button>
              <button
                type="button"
                className={`segmented-tab ${formData.qrPosition === 'back' ? 'active' : ''}`}
                onClick={() => onChange({ ...formData, qrPosition: 'back' })}
              >
                No Verso (Recomendado)
              </button>
            </div>
          </div>
        )}

        {/* Info banner de localização */}
        <div className="location-info-banner">
          <Sparkles size={16} className="text-amber-500 shrink-0" />
          <div className="banner-text">
            {allowsMultipleQRs ? (
              <span>
                <strong>Regra do Modelo:</strong> Códigos ficam <strong>só no verso</strong> com reorganização automática (1, 2 ou 3 em linha). A frente fica 100% livre para o design.
              </span>
            ) : currentModel.qrLocation === 'front_only' ? (
              <span>
                <strong>Regra do Modelo:</strong> 1 QR Code posicionado <strong>na frente</strong> do cartão estilo Cyber Tech ID.
              </span>
            ) : currentModel.qrLocation === 'center_only' ? (
              <span>
                <strong>Regra do Modelo:</strong> 1 QR Code em grande destaque na <strong>zona central</strong> para leitura fácil à distância.
              </span>
            ) : (
              <span>
                <strong>Regra do Modelo:</strong> 1 QR Code posicionado <strong>{formData.qrPosition === 'front' ? 'na frente' : 'no verso'}</strong>.
              </span>
            )}
          </div>
        </div>

        {/* Lista de Blocos QR */}
        <div className="qr-blocks-list">
          {formData.qrItems.map((qrItem, index) => {
            const isSocial = isMandatorySocialType(qrItem.type);

            return (
              <div key={qrItem.id || index} className="qr-editor-block">
                <div className="qr-block-header">
                  <div className="qr-number-badge">QR #{index + 1}</div>
                  <span className="qr-type-name">{qrItem.label || qrItem.type}</span>

                  {allowsMultipleQRs && formData.qrItems.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove-qr"
                      onClick={() => handleRemoveQR(index)}
                      title="Remover este código"
                    >
                      <Trash2 size={14} />
                      <span>Remover</span>
                    </button>
                  )}
                </div>

                <div className="qr-block-fields">
                  {/* Tipo de QR */}
                  <div className="form-group">
                    <label className="field-label">Tipo de Destino</label>
                    <select
                      value={qrItem.type}
                      onChange={(e) => handleUpdateQR(index, { type: e.target.value as any })}
                      className="form-select"
                    >
                      {QR_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label} {opt.isSocial ? '(Ícone Oficial Central)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Destino / Valor */}
                  <div className="form-group">
                    <label className="field-label">
                      {qrItem.type === 'whatsapp'
                        ? 'Número WhatsApp (com indicativo, ex: 258841234567)'
                        : qrItem.type === 'instagram'
                        ? 'Nome de Utilizador Instagram (ex: dr.montoya)'
                        : qrItem.type === 'facebook'
                        ? 'Página / Perfil Facebook'
                        : qrItem.type === 'x'
                        ? 'Handle do X / Twitter (ex: meuperfil)'
                        : 'Link / URL ou Dado'}
                    </label>
                    <input
                      type="text"
                      value={qrItem.value}
                      onChange={(e) => handleUpdateQR(index, { value: e.target.value })}
                      placeholder={
                        qrItem.type === 'whatsapp'
                          ? '258841234567'
                          : qrItem.type === 'instagram'
                          ? 'dr.davidmontoya'
                          : 'https://exemplo.com'
                      }
                      className="form-input"
                    />
                    <span className="field-hint">
                      {isSocial
                        ? 'Dica: Gere URLs curtas (ex: wa.me/258... ou instagram.com/nome) para manter o QR simples e legível.'
                        : 'URLs curtas geram códigos menos densos com leitura mais rápida.'}
                    </span>
                  </div>

                  {/* Legenda do QR */}
                  <div className="form-group">
                    <label className="field-label">Legenda Exibida no Cartão</label>
                    <input
                      type="text"
                      value={qrItem.label}
                      onChange={(e) => handleUpdateQR(index, { label: e.target.value })}
                      placeholder="Ex: WhatsApp, Instagram, Website..."
                      className="form-input"
                    />
                  </div>

                  {/* Regra do Ícone Central */}
                  <div className="icon-rule-box">
                    {isSocial ? (
                      <div className="mandatory-icon-pill">
                        <Lock size={15} className="text-emerald-500 shrink-0" />
                        <div>
                          <strong className="text-emerald-700 dark:text-emerald-300">
                            Ícone Oficial Obrigatório no Centro
                          </strong>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            O ícone de {qrItem.type} foi inserido automaticamente a 20% da área com margem branca e correção de erros nível H. Não pode ser removido conforme regra.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="custom-logo-area">
                        <div className="custom-logo-header">
                          <ImageIcon size={15} className="text-indigo-500" />
                          <span className="text-sm font-medium">Logótipo Central (Opcional)</span>
                        </div>
                        {qrItem.customLogoUrl ? (
                          <div className="logo-uploaded-row">
                            <img src={qrItem.customLogoUrl} alt="Logo" className="w-8 h-8 rounded border object-contain bg-white" />
                            <button
                              type="button"
                              className="text-xs text-red-500 hover:underline"
                              onClick={() => handleUpdateQR(index, { customLogoUrl: undefined })}
                            >
                              Remover logótipo
                            </button>
                          </div>
                        ) : (
                          <label className="upload-inline-btn">
                            <input
                              type="file"
                              accept="image/png, image/jpeg, image/svg+xml"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleCustomLogoUpload(index, f);
                              }}
                              className="hidden"
                            />
                            <span>+ Carregar Logótipo / Imagem</span>
                          </label>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Botão de Adicionar QR (para modelos que suportam múltiplos) */}
        {allowsMultipleQRs && (
          <div className="add-qr-action-row">
            <button
              type="button"
              className="btn-add-qr"
              onClick={handleAddQR}
              disabled={formData.qrItems.length >= currentModel.maxQRs}
            >
              <Plus size={16} />
              <span>Adicionar QR Code ({formData.qrItems.length}/{currentModel.maxQRs})</span>
            </button>
            {formData.qrItems.length >= currentModel.maxQRs && (
              <span className="max-qr-notice">Limite máximo de 3 QR codes atingido para este cartão.</span>
            )}
          </div>
        )}
      </div>

      {/* SEÇÃO 2: DADOS DO TITULAR & DESIGN DO CARTÃO */}
      <div className="panel-card">
        <div className="panel-header">
          <div className="step-badge">2</div>
          <div>
            <h2 className="panel-title">Informações do Titular & Marca</h2>
            <p className="panel-subtitle">Personalize a identidade visual e o texto impresso</p>
          </div>
        </div>

        <div className="form-grid-2">
          {/* Nome */}
          <div className="form-group">
            <label className="field-label">
              <User size={14} /> Nome Completo / Marca
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                const name = e.target.value;
                // Auto generate 2-letter monogram if not customized
                const words = name.trim().split(/\s+/);
                const mono = words.length >= 2 ? (words[0][0] + words[words.length - 1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
                onChange({ ...formData, name, monogram: mono || formData.monogram });
              }}
              placeholder="Ex: Dr. David Montoya"
              className="form-input"
            />
          </div>

          {/* Cargo / Subtítulo */}
          <div className="form-group">
            <label className="field-label">
              <Briefcase size={14} /> Cargo / Especialidade
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onChange({ ...formData, title: e.target.value })}
              placeholder="Ex: Cirujano Plastico / Estética"
              className="form-input"
            />
          </div>

          {/* Monograma */}
          <div className="form-group">
            <label className="field-label">Monograma / Iniciais (Logo)</label>
            <input
              type="text"
              maxLength={3}
              value={formData.monogram}
              onChange={(e) => onChange({ ...formData, monogram: e.target.value.toUpperCase() })}
              placeholder="Ex: DM ou JS"
              className="form-input uppercase"
            />
          </div>

          {/* Telefone */}
          <div className="form-group">
            <label className="field-label">
              <Phone size={14} /> Telefone / WhatsApp
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => onChange({ ...formData, phone: e.target.value })}
              placeholder="Ex: +258 84 123 4567"
              className="form-input"
            />
          </div>

          {/* Handle / Redes */}
          <div className="form-group">
            <label className="field-label">
              <AtSign size={14} /> Perfil / @Handle
            </label>
            <input
              type="text"
              value={formData.handle}
              onChange={(e) => onChange({ ...formData, handle: e.target.value })}
              placeholder="Ex: @dr.davidmontoya"
              className="form-input"
            />
          </div>

          {/* Endereço */}
          <div className="form-group">
            <label className="field-label">
              <MapPin size={14} /> Endereço / Localização
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => onChange({ ...formData, address: e.target.value })}
              placeholder="Ex: Av. Santander # 62-39, Caldas"
              className="form-input"
            />
          </div>

          {/* ID / Matrícula (para Cartão ID Tech) */}
          {formData.modelId === 'dark_green_id' && (
            <div className="form-group">
              <label className="field-label">Matrícula / Código ID</label>
              <input
                type="text"
                value={formData.idNumber}
                onChange={(e) => onChange({ ...formData, idNumber: e.target.value })}
                placeholder="Ex: 98/b-2079"
                className="form-input"
              />
            </div>
          )}
        </div>

        {/* Upload de Foto / Avatar para modelos com foto */}
        {(formData.modelId === 'dark_green_id' || formData.modelId === 'social_card') && (
          <div className="photo-upload-container mt-4">
            <label className="field-label">
              <Camera size={14} /> Foto do Titular / Avatar
            </label>
            <div className="photo-upload-row">
              {formData.photoUrl ? (
                <div className="photo-preview-box">
                  <img src={formData.photoUrl} alt="Foto" className="photo-thumb" />
                  <button
                    type="button"
                    className="btn-remove-photo"
                    onClick={() => onChange({ ...formData, photoUrl: undefined })}
                  >
                    Remover Foto
                  </button>
                </div>
              ) : (
                <label className="upload-photo-label">
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  <Camera size={18} />
                  <span>Carregar Foto de Perfil (.png, .jpg)</span>
                </label>
              )}
            </div>
          </div>
        )}

        {/* Editor de Serviços para o Cartão de Serviços (Foto 2) */}
        {formData.modelId === 'services_card' && (
          <div className="services-editor-box mt-4">
            <div className="services-header-row">
              <label className="field-label">
                <ListPlus size={14} /> Lista de Procedimentos / Serviços (Verso)
              </label>
              <button
                type="button"
                className="btn-add-service-item"
                onClick={handleAddService}
              >
                + Adicionar Procedimento
              </button>
            </div>

            <div className="services-items-list">
              {(formData.servicesList || []).map((srv, idx) => (
                <div key={idx} className="service-item-row">
                  <span className="bullet-indicator">•</span>
                  <input
                    type="text"
                    value={srv}
                    onChange={(e) => handleUpdateService(idx, e.target.value)}
                    className="service-input"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveService(idx)}
                    className="btn-trash-service"
                    title="Remover serviço"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Temas Rápidos / Cores */}
        <div className="theme-presets-section mt-5">
          <label className="field-label">
            <Palette size={14} /> Paleta de Cores Inspirada nas Referências
          </label>
          <div className="theme-chips-row">
            {THEME_PRESETS.map((t) => (
              <button
                key={t.name}
                type="button"
                className={`theme-chip ${formData.primaryColor === t.primary ? 'active-theme' : ''}`}
                onClick={() => onChange({ ...formData, primaryColor: t.primary })}
              >
                <span className="color-swatch-dot" style={{ backgroundColor: t.primary }} />
                <span>{t.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
