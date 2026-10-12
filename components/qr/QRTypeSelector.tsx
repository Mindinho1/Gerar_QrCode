'use client';

import React from 'react';
import { QRType } from '@/lib/builders';
import { 
  Globe, 
  MessageSquare, 
  UserCheck, 
  Wifi, 
  Phone, 
  Mail, 
  FileText 
} from 'lucide-react';
import { FaInstagram, FaFacebookF, FaXTwitter, FaWhatsapp } from 'react-icons/fa6';

export interface QRTypeOption {
  id: QRType;
  label: string;
  badge?: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  isSocial?: boolean;
}

export const QR_TYPE_LIST: QRTypeOption[] = [
  {
    id: 'url',
    label: 'Link / URL',
    badge: 'Popular',
    description: 'Página web, loja ou catálogo',
    icon: Globe,
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    badge: 'Directo',
    description: 'Inicia conversa com mensagem pré-definida',
    icon: MessageSquare,
    isSocial: true,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    badge: 'Social',
    description: 'Abre perfil do Instagram pelo @handle',
    icon: FaInstagram,
    isSocial: true,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    badge: 'Social',
    description: 'Página ou perfil no Facebook',
    icon: FaFacebookF,
    isSocial: true,
  },
  {
    id: 'x',
    label: 'X (Twitter)',
    badge: 'Social',
    description: 'Perfil no X / Twitter',
    icon: FaXTwitter,
    isSocial: true,
  },
  {
    id: 'vcard',
    label: 'Contacto vCard',
    badge: 'Agenda',
    description: 'Salva contacto com nome, tel, e-mail e empresa',
    icon: UserCheck,
  },
  {
    id: 'wifi',
    label: 'Rede Wi-Fi',
    badge: 'Conexão',
    description: 'Conecta ao Wi-Fi sem digitar palavra-passe',
    icon: Wifi,
  },
  {
    id: 'tel',
    label: 'Telefone',
    badge: 'Chamada',
    description: 'Disca um número imediatamente',
    icon: Phone,
  },
  {
    id: 'email',
    label: 'E-mail',
    badge: 'Mailto',
    description: 'Envia mensagem com assunto definido',
    icon: Mail,
  },
  {
    id: 'text',
    label: 'Texto Livre',
    badge: 'Geral',
    description: 'Anotações, recibos ou mensagens',
    icon: FileText,
  },
];

interface QRTypeSelectorProps {
  currentType: QRType;
  onSelect: (type: QRType) => void;
}

export const QRTypeSelector: React.FC<QRTypeSelectorProps> = ({ currentType, onSelect }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {QR_TYPE_LIST.map((item) => {
          const Icon = item.icon;
          const isActive = currentType === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`
                flex flex-col items-start p-3 rounded-2xl border text-left transition-all duration-200 select-none
                ${isActive
                  ? 'border-[#99E1D9] bg-[#99E1D9]/15 shadow-sm ring-2 ring-[#99E1D9]/40'
                  : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/80 shadow-xs'
                }
              `}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  isActive ? 'bg-[#202C39] text-[#99E1D9]' : 'bg-slate-100 text-slate-700'
                }`}>
                  <Icon size={16} />
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-[#99E1D9] text-[#202C39]' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-xs font-bold leading-tight ${isActive ? 'text-[#202C39]' : 'text-slate-800'}`}>
                {item.label}
              </span>
              <span className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                {item.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
