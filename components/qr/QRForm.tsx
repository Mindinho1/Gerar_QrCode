'use client';

import React from 'react';
import { QRType, VCardData, WifiData, EmailData, WhatsAppData } from '@/lib/builders';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { 
  Globe, 
  MessageSquare, 
  User, 
  Briefcase, 
  Phone, 
  Mail, 
  MapPin, 
  Wifi, 
  Key, 
  FileText 
} from 'lucide-react';
import { FaInstagram, FaFacebookF, FaXTwitter } from 'react-icons/fa6';

export interface QRFormValues {
  url: string;
  whatsapp: WhatsAppData;
  instagram: string;
  facebook: string;
  x: string;
  vcard: VCardData;
  wifi: WifiData;
  tel: string;
  email: EmailData;
  text: string;
}

interface QRFormProps {
  type: QRType;
  values: QRFormValues;
  onChange: (updated: QRFormValues) => void;
}

export const QRForm: React.FC<QRFormProps> = ({ type, values, onChange }) => {
  switch (type) {
    case 'url':
      return (
        <div className="space-y-4">
          <Input
            label="Endereço do Website (URL)"
            placeholder="https://exemplo.com/pagina"
            icon={Globe}
            value={values.url}
            onChange={(e) => onChange({ ...values, url: e.target.value })}
            helperText="Pode inserir qualquer link web, rede social, catálogo ou loja virtual."
          />
        </div>
      );

    case 'whatsapp':
      return (
        <div className="space-y-4">
          <Input
            label="Número de Telefone WhatsApp (com indicativo de país)"
            placeholder="258841234567 ou 351912345678"
            icon={MessageSquare}
            value={values.whatsapp.phone}
            onChange={(e) =>
              onChange({
                ...values,
                whatsapp: { ...values.whatsapp, phone: e.target.value },
              })
            }
            helperText="Insira com o código do país (ex: Moçambique +258, Portugal +351, Brasil +55)."
          />
          <div>
            <label className="text-xs font-semibold text-slate-700 tracking-wide block mb-1.5">
              Mensagem Pré-definida (Opcional)
            </label>
            <textarea
              rows={3}
              placeholder="Olá! Gostaria de mais informações sobre os vossos serviços..."
              value={values.whatsapp.message || ''}
              onChange={(e) =>
                onChange({
                  ...values,
                  whatsapp: { ...values.whatsapp, message: e.target.value },
                })
              }
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:border-[#99E1D9] focus:ring-2 focus:ring-[#99E1D9]/30 transition-all placeholder:text-slate-400 placeholder:text-xs"
            />
            <p className="text-xs text-slate-500 mt-1">
              Esta mensagem aparecerá pré-preenchida para o cliente quando o QR for lido.
            </p>
          </div>
        </div>
      );

    case 'instagram':
      return (
        <div className="space-y-4">
          <Input
            label="Nome de Utilizador Instagram"
            placeholder="minhaempresa"
            prefixAddon="@"
            icon={FaInstagram}
            value={values.instagram.replace(/^@/, '')}
            onChange={(e) => onChange({ ...values, instagram: e.target.value })}
            helperText="Insira o seu utilizador (ex: @estudio_design ou estudio_design)."
          />
        </div>
      );

    case 'facebook':
      return (
        <div className="space-y-4">
          <Input
            label="Página ou Perfil Facebook"
            placeholder="https://facebook.com/minhapagina"
            icon={FaFacebookF}
            value={values.facebook}
            onChange={(e) => onChange({ ...values, facebook: e.target.value })}
            helperText="Insira o link completo da sua página ou apenas o identificador."
          />
        </div>
      );

    case 'x':
      return (
        <div className="space-y-4">
          <Input
            label="Nome de Utilizador no X (Twitter)"
            placeholder="perfiloficial"
            prefixAddon="@"
            icon={FaXTwitter}
            value={values.x.replace(/^@/, '')}
            onChange={(e) => onChange({ ...values, x: e.target.value })}
            helperText="Insira o identificador oficial no X."
          />
        </div>
      );

    case 'vcard':
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Nome"
              placeholder="David"
              icon={User}
              value={values.vcard.firstName}
              onChange={(e) =>
                onChange({
                  ...values,
                  vcard: { ...values.vcard, firstName: e.target.value },
                })
              }
            />
            <Input
              label="Apelido / Sobrenome"
              placeholder="Montoya"
              value={values.vcard.lastName || ''}
              onChange={(e) =>
                onChange({
                  ...values,
                  vcard: { ...values.vcard, lastName: e.target.value },
                })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Empresa / Organização"
              placeholder="Clínica Capitalia"
              icon={Briefcase}
              value={values.vcard.organization || ''}
              onChange={(e) =>
                onChange({
                  ...values,
                  vcard: { ...values.vcard, organization: e.target.value },
                })
              }
            />
            <Input
              label="Cargo / Título"
              placeholder="Cirurgião Especialista"
              value={values.vcard.jobTitle || ''}
              onChange={(e) =>
                onChange({
                  ...values,
                  vcard: { ...values.vcard, jobTitle: e.target.value },
                })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Telemóvel / Telefone"
              placeholder="+258 84 000 0000"
              icon={Phone}
              value={values.vcard.phone || ''}
              onChange={(e) =>
                onChange({
                  ...values,
                  vcard: { ...values.vcard, phone: e.target.value },
                })
              }
            />
            <Input
              label="E-mail"
              placeholder="contacto@empresa.com"
              icon={Mail}
              type="email"
              value={values.vcard.email || ''}
              onChange={(e) =>
                onChange({
                  ...values,
                  vcard: { ...values.vcard, email: e.target.value },
                })
              }
            />
          </div>

          <Input
            label="Website"
            placeholder="https://empresa.com"
            icon={Globe}
            value={values.vcard.website || ''}
            onChange={(e) =>
              onChange({
                ...values,
                vcard: { ...values.vcard, website: e.target.value },
              })
            }
          />

          <Input
            label="Morada / Localização"
            placeholder="Av. Julius Nyerere, Maputo"
            icon={MapPin}
            value={values.vcard.address || ''}
            onChange={(e) =>
              onChange({
                ...values,
                vcard: { ...values.vcard, address: e.target.value },
              })
            }
          />
        </div>
      );

    case 'wifi':
      return (
        <div className="space-y-4">
          <Input
            label="Nome da Rede Wi-Fi (SSID)"
            placeholder="Ex: Sala_VIP_5G"
            icon={Wifi}
            value={values.wifi.ssid}
            onChange={(e) =>
              onChange({
                ...values,
                wifi: { ...values.wifi, ssid: e.target.value },
              })
            }
          />
          <Input
            label="Palavra-passe (Senha)"
            placeholder="Senha da rede"
            type="password"
            icon={Key}
            value={values.wifi.password || ''}
            onChange={(e) =>
              onChange({
                ...values,
                wifi: { ...values.wifi, password: e.target.value },
              })
            }
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <Select
              label="Segurança / Criptografia"
              value={values.wifi.encryption}
              options={[
                { value: 'WPA', label: 'WPA / WPA2 / WPA3 (Padrão)' },
                { value: 'WEP', label: 'WEP' },
                { value: 'nopass', label: 'Rede Aberta (Sem Senha)' },
              ]}
              onChange={(e) =>
                onChange({
                  ...values,
                  wifi: {
                    ...values.wifi,
                    encryption: e.target.value as any,
                  },
                })
              }
            />
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer pt-4">
              <input
                type="checkbox"
                checked={values.wifi.hidden || false}
                onChange={(e) =>
                  onChange({
                    ...values,
                    wifi: { ...values.wifi, hidden: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded text-[#202C39] focus:ring-[#99E1D9]"
              />
              <span>Rede Oculta (SSID Invisível)</span>
            </label>
          </div>
        </div>
      );

    case 'tel':
      return (
        <div className="space-y-4">
          <Input
            label="Número de Telefone"
            placeholder="+258 84 123 4567"
            icon={Phone}
            value={values.tel}
            onChange={(e) => onChange({ ...values, tel: e.target.value })}
            helperText="Ao escanear, o telemóvel abre o discador com o número pronto."
          />
        </div>
      );

    case 'email':
      return (
        <div className="space-y-4">
          <Input
            label="Destinatário (E-mail)"
            placeholder="contacto@empresa.com"
            icon={Mail}
            type="email"
            value={values.email.to}
            onChange={(e) =>
              onChange({
                ...values,
                email: { ...values.email, to: e.target.value },
              })
            }
          />
          <Input
            label="Assunto (Subject)"
            placeholder="Pedido de Orçamento / Informações"
            value={values.email.subject || ''}
            onChange={(e) =>
              onChange({
                ...values,
                email: { ...values.email, subject: e.target.value },
              })
            }
          />
          <div>
            <label className="text-xs font-semibold text-slate-700 tracking-wide block mb-1.5">
              Corpo da Mensagem (Opcional)
            </label>
            <textarea
              rows={3}
              placeholder="Escreva a mensagem pré-preenchida..."
              value={values.email.body || ''}
              onChange={(e) =>
                onChange({
                  ...values,
                  email: { ...values.email, body: e.target.value },
                })
              }
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:border-[#99E1D9] focus:ring-2 focus:ring-[#99E1D9]/30 transition-all placeholder:text-slate-400 placeholder:text-xs"
            />
          </div>
        </div>
      );

    case 'text':
    default:
      return (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 tracking-wide block mb-1.5">
              Texto Livre
            </label>
            <textarea
              rows={4}
              placeholder="Digite qualquer texto, código, cupão ou instrução..."
              value={values.text}
              onChange={(e) => onChange({ ...values, text: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:border-[#99E1D9] focus:ring-2 focus:ring-[#99E1D9]/30 transition-all placeholder:text-slate-400 placeholder:text-xs"
            />
            <p className="text-xs text-slate-500 mt-1">
              Ideal para códigos de série, instruções de acesso ou chaves curtas.
            </p>
          </div>
        </div>
      );
  }
};
