'use client';

import React from 'react';
import { QRType } from '@/lib/builders';
import { Globe, UserCheck, Phone, Mail, MessageSquare, Wifi, FileText } from 'lucide-react';

interface TypeSelectorProps {
  currentType: QRType;
  onSelect: (type: QRType) => void;
}

interface TypeOption {
  id: QRType;
  label: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

const TYPE_OPTIONS: TypeOption[] = [
  {
    id: 'url',
    label: 'Link / URL',
    badge: 'Popular',
    description: 'Página web, redes sociais ou loja',
    icon: Globe,
  },
  {
    id: 'vcard',
    label: 'Cartão de Contacto',
    badge: 'vCard',
    description: 'Nome, telefone, email e empresa',
    icon: UserCheck,
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    badge: 'Directo',
    description: 'Abre conversa com mensagem pronta',
    icon: MessageSquare,
  },
  {
    id: 'wifi',
    label: 'Rede Wi-Fi',
    badge: 'Conexão',
    description: 'Conecta ao Wi-Fi sem digitar senha',
    icon: Wifi,
  },
  {
    id: 'tel',
    label: 'Telefone',
    badge: 'Chamada',
    description: 'Disca um número directamente',
    icon: Phone,
  },
  {
    id: 'email',
    label: 'E-mail',
    badge: 'Mailto',
    description: 'Envia e-mail com assunto pré-definido',
    icon: Mail,
  },
  {
    id: 'text',
    label: 'Texto Livre',
    badge: 'Geral',
    description: 'Anotação, mensagem ou código',
    icon: FileText,
  },
];

export const TypeSelector: React.FC<TypeSelectorProps> = ({ currentType, onSelect }) => {
  return (
    <div className="type-selector-container">
      <div className="type-grid">
        {TYPE_OPTIONS.map((item) => {
          const Icon = item.icon;
          const isActive = currentType === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`type-card ${isActive ? 'active' : ''}`}
              aria-pressed={isActive}
            >
              <div className="type-card-header">
                <div className={`type-icon-wrapper ${isActive ? 'active-icon' : ''}`}>
                  <Icon size={20} />
                </div>
                {item.badge && <span className="type-badge">{item.badge}</span>}
              </div>
              <div className="type-card-body">
                <div className="type-card-title">{item.label}</div>
                <div className="type-card-desc">{item.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
