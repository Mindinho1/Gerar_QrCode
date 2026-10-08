'use client';

import React from 'react';
import { QRType, VCardData, WifiData, EmailData, WhatsAppData } from '@/lib/builders';
import { Globe, User, Building, Phone, Mail, MapPin, AlignLeft, ShieldCheck, Wifi, MessageSquare, Sparkles } from 'lucide-react';

interface FormFieldsProps {
  type: QRType;
  // URL state
  url: string;
  setUrl: (v: string) => void;
  // vCard state
  vcard: VCardData;
  setVcard: React.Dispatch<React.SetStateAction<VCardData>>;
  // WhatsApp state
  whatsapp: WhatsAppData;
  setWhatsapp: React.Dispatch<React.SetStateAction<WhatsAppData>>;
  // Wi-Fi state
  wifi: WifiData;
  setWifi: React.Dispatch<React.SetStateAction<WifiData>>;
  // Phone state
  phone: string;
  setPhone: (v: string) => void;
  // Email state
  email: EmailData;
  setEmail: React.Dispatch<React.SetStateAction<EmailData>>;
  // Text state
  text: string;
  setText: (v: string) => void;
}

export const FormFields: React.FC<FormFieldsProps> = ({
  type,
  url,
  setUrl,
  vcard,
  setVcard,
  whatsapp,
  setWhatsapp,
  wifi,
  setWifi,
  phone,
  setPhone,
  email,
  setEmail,
  text,
  setText,
}) => {
  return (
    <div className="form-fields-wrapper">
      {type === 'url' && (
        <div className="form-section animate-fade">
          <div className="form-group">
            <label className="form-label" htmlFor="url-input">
              <span>Endereço do Site (URL)</span>
              <span className="label-tip">Comece com https://</span>
            </label>
            <div className="input-with-icon">
              <Globe className="input-icon" size={18} />
              <input
                id="url-input"
                type="url"
                className="form-control"
                placeholder="https://exemplo.com ou meulink.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                autoFocus
              />
            </div>
            <div className="quick-presets">
              <span className="preset-label">Atalhos rápidos:</span>
              <button
                type="button"
                className="chip-btn"
                onClick={() => setUrl('https://instagram.com/')}
              >
                Instagram
              </button>
              <button
                type="button"
                className="chip-btn"
                onClick={() => setUrl('https://linkedin.com/in/')}
              >
                LinkedIn
              </button>
              <button
                type="button"
                className="chip-btn"
                onClick={() => setUrl('https://google.com')}
              >
                Google
              </button>
            </div>
          </div>
        </div>
      )}

      {type === 'vcard' && (
        <div className="form-section animate-fade">
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="vc-firstname">
                Primeiro Nome *
              </label>
              <div className="input-with-icon">
                <User className="input-icon" size={18} />
                <input
                  id="vc-firstname"
                  type="text"
                  className="form-control"
                  placeholder="Ex: João"
                  value={vcard.firstName}
                  onChange={(e) => setVcard({ ...vcard, firstName: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="vc-lastname">
                Apelido / Sobrenome
              </label>
              <input
                id="vc-lastname"
                type="text"
                className="form-control"
                placeholder="Ex: Silva"
                value={vcard.lastName || ''}
                onChange={(e) => setVcard({ ...vcard, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="vc-phone">
                Número de Telefone *
              </label>
              <div className="input-with-icon">
                <Phone className="input-icon" size={18} />
                <input
                  id="vc-phone"
                  type="tel"
                  className="form-control"
                  placeholder="+258 84 123 4567"
                  value={vcard.phone || ''}
                  onChange={(e) => setVcard({ ...vcard, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="vc-email">
                E-mail
              </label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={18} />
                <input
                  id="vc-email"
                  type="email"
                  className="form-control"
                  placeholder="joao@empresa.com"
                  value={vcard.email || ''}
                  onChange={(e) => setVcard({ ...vcard, email: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="vc-org">
                Empresa / Organização
              </label>
              <div className="input-with-icon">
                <Building className="input-icon" size={18} />
                <input
                  id="vc-org"
                  type="text"
                  className="form-control"
                  placeholder="Ex: Inovação Lda"
                  value={vcard.organization || ''}
                  onChange={(e) => setVcard({ ...vcard, organization: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="vc-job">
                Cargo / Função
              </label>
              <input
                id="vc-job"
                type="text"
                className="form-control"
                placeholder="Ex: Director Geral"
                value={vcard.jobTitle || ''}
                onChange={(e) => setVcard({ ...vcard, jobTitle: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="vc-website">
              Website
            </label>
            <div className="input-with-icon">
              <Globe className="input-icon" size={18} />
              <input
                id="vc-website"
                type="url"
                className="form-control"
                placeholder="https://empresa.co.mz"
                value={vcard.website || ''}
                onChange={(e) => setVcard({ ...vcard, website: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="vc-address">
              Morada / Localização
            </label>
            <div className="input-with-icon">
              <MapPin className="input-icon" size={18} />
              <input
                id="vc-address"
                type="text"
                className="form-control"
                placeholder="Av. Julius Nyerere, Maputo"
                value={vcard.address || ''}
                onChange={(e) => setVcard({ ...vcard, address: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="vc-notes">
              Notas Adicionais
            </label>
            <textarea
              id="vc-notes"
              rows={2}
              className="form-control textarea"
              placeholder="Ex: Horário de atendimento, ramal ou bio rápida"
              value={vcard.notes || ''}
              onChange={(e) => setVcard({ ...vcard, notes: e.target.value })}
            />
          </div>
        </div>
      )}

      {type === 'whatsapp' && (
        <div className="form-section animate-fade">
          <div className="form-group">
            <label className="form-label" htmlFor="wa-phone">
              Número de WhatsApp (com código do país)
            </label>
            <div className="input-with-icon">
              <Phone className="input-icon" size={18} />
              <input
                id="wa-phone"
                type="tel"
                className="form-control"
                placeholder="Ex: 258841234567 ou +258 84 123 4567"
                value={whatsapp.phone}
                onChange={(e) => setWhatsapp({ ...whatsapp, phone: e.target.value })}
              />
            </div>
            <div className="field-hint">
              Exemplo Moçambique: <code>258841234567</code> | Brasil: <code>5511999998888</code> | Portugal: <code>351912345678</code>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="wa-msg">
              Mensagem Pré-preenchida (Opcional)
            </label>
            <div className="input-with-icon">
              <MessageSquare className="input-icon" size={18} />
              <textarea
                id="wa-msg"
                rows={3}
                className="form-control textarea"
                placeholder="Olá! Gostaria de obter mais informações sobre os vossos serviços..."
                value={whatsapp.message || ''}
                onChange={(e) => setWhatsapp({ ...whatsapp, message: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {type === 'wifi' && (
        <div className="form-section animate-fade">
          <div className="form-group">
            <label className="form-label" htmlFor="wifi-ssid">
              Nome da Rede (SSID) *
            </label>
            <div className="input-with-icon">
              <Wifi className="input-icon" size={18} />
              <input
                id="wifi-ssid"
                type="text"
                className="form-control"
                placeholder="Ex: MinhaCasa_5G ou Empresa_Visitantes"
                value={wifi.ssid}
                onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="wifi-enc">
                Tipo de Segurança
              </label>
              <select
                id="wifi-enc"
                className="form-control select-control"
                value={wifi.encryption}
                onChange={(e) =>
                  setWifi({ ...wifi, encryption: e.target.value as 'WPA' | 'WEP' | 'nopass' })
                }
              >
                <option value="WPA">WPA / WPA2 / WPA3 (Padrão)</option>
                <option value="WEP">WEP (Antigo)</option>
                <option value="nopass">Sem Senha (Aberta)</option>
              </select>
            </div>

            {wifi.encryption !== 'nopass' && (
              <div className="form-group">
                <label className="form-label" htmlFor="wifi-pass">
                  Senha da Rede
                </label>
                <div className="input-with-icon">
                  <ShieldCheck className="input-icon" size={18} />
                  <input
                    id="wifi-pass"
                    type="text"
                    className="form-control"
                    placeholder="Chave de segurança Wi-Fi"
                    value={wifi.password || ''}
                    onChange={(e) => setWifi({ ...wifi, password: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={wifi.hidden || false}
                onChange={(e) => setWifi({ ...wifi, hidden: e.target.checked })}
              />
              <span>Rede Oculta (Não transmite SSID)</span>
            </label>
          </div>
        </div>
      )}

      {type === 'tel' && (
        <div className="form-section animate-fade">
          <div className="form-group">
            <label className="form-label" htmlFor="tel-input">
              Número de Telefone para Chamada Directa
            </label>
            <div className="input-with-icon">
              <Phone className="input-icon" size={18} />
              <input
                id="tel-input"
                type="tel"
                className="form-control"
                placeholder="+258 84 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="field-hint">
              Ao ler este QR Code, o telemóvel abrirá o discador pronto para telefonar.
            </div>
          </div>
        </div>
      )}

      {type === 'email' && (
        <div className="form-section animate-fade">
          <div className="form-group">
            <label className="form-label" htmlFor="email-to">
              Endereço de E-mail de Destino *
            </label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                id="email-to"
                type="email"
                className="form-control"
                placeholder="contacto@empresa.com"
                value={email.to}
                onChange={(e) => setEmail({ ...email, to: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email-subject">
              Assunto Pré-definido
            </label>
            <input
              id="email-subject"
              type="text"
              className="form-control"
              placeholder="Ex: Pedido de Cotação ou Dúvida"
              value={email.subject || ''}
              onChange={(e) => setEmail({ ...email, subject: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email-body">
              Corpo da Mensagem
            </label>
            <textarea
              id="email-body"
              rows={3}
              className="form-control textarea"
              placeholder="Ex: Olá, venho através do QR Code e gostaria de..."
              value={email.body || ''}
              onChange={(e) => setEmail({ ...email, body: e.target.value })}
            />
          </div>
        </div>
      )}

      {type === 'text' && (
        <div className="form-section animate-fade">
          <div className="form-group">
            <label className="form-label" htmlFor="text-area">
              <span>Texto Puro ou Informação</span>
              <span className="label-tip">{text.length} caracteres</span>
            </label>
            <div className="input-with-icon">
              <AlignLeft className="input-icon" size={18} />
              <textarea
                id="text-area"
                rows={5}
                className="form-control textarea"
                placeholder="Escreva aqui qualquer texto simples, código de série, instruções de acesso, etc."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
