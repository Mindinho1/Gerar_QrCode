/**
 * Card Models and Layout Definitions
 */

export type ModelId =
  | 'classic_card'
  | 'social_card'
  | 'dark_green_id'
  | 'gold_premium'
  | 'table_tent'
  | 'services_card';

export interface CardModelDefinition {
  id: ModelId;
  name: string;
  tagline: string;
  maxQRs: number;
  qrLocation: 'back_only' | 'front_only' | 'center_only' | 'choice';
  dimensionsMm: { width: number; height: number };
  aspectRatio: string;
  description: string;
  features: string[];
}

export const CARD_MODELS: CardModelDefinition[] = [
  {
    id: 'classic_card',
    name: 'Cartão de Visita Clássico',
    tagline: '90×50 mm • Até 3 QR Codes no Verso',
    maxQRs: 3,
    qrLocation: 'back_only',
    dimensionsMm: { width: 90, height: 50 },
    aspectRatio: '90 / 50',
    description: 'Frente limpa e sofisticada para marca, nome e contactos. Verso dinâmico com até 3 QR codes em linha.',
    features: ['Até 3 QR no verso', 'Frente 100% livre', 'Layout dinâmico 1-3 códigos'],
  },
  {
    id: 'social_card',
    name: 'Cartão para Redes Sociais',
    tagline: '90×50 mm • Até 3 Redes Sociais no Verso',
    maxQRs: 3,
    qrLocation: 'back_only',
    dimensionsMm: { width: 90, height: 50 },
    aspectRatio: '90 / 50',
    description: 'Ideal para criadores, influencers e marcas com múltiplos perfis sociais (Instagram, WhatsApp, X, Facebook).',
    features: ['Ícones oficiais fixos', 'Até 3 QR no verso', 'Destaque para @handle'],
  },
  {
    id: 'dark_green_id',
    name: 'Cartão ID Escuro / Verde',
    tagline: 'Estilo Crachá Tech WhatsApp • 1 QR na Frente',
    maxQRs: 1,
    qrLocation: 'front_only',
    dimensionsMm: { width: 90, height: 54 },
    aspectRatio: '90 / 54',
    description: 'Estética cyber neon com circuitos luminosos, moldura de foto do titular, ID numérico e QR code frontal.',
    features: ['1 QR na Frente', 'Foto / Avatar tech', 'Efeito neon esmeralda'],
  },
  {
    id: 'gold_premium',
    name: 'Preto e Dourado Premium',
    tagline: 'Estilo Luxury • 1 QR (Frente ou Verso)',
    maxQRs: 1,
    qrLocation: 'choice',
    dimensionsMm: { width: 90, height: 50 },
    aspectRatio: '90 / 50',
    description: 'Paleta navy/preto profundo e gradiente dourado, monograma de luxo e tipografia serifada de alto padrão.',
    features: ['1 QR à escolha (Frente ou Verso)', 'Monograma dourado', 'Acabamento premium'],
  },
  {
    id: 'table_tent',
    name: 'Placa de Mesa Vertical',
    tagline: 'Display de Balcão • 1 QR na Zona Central',
    maxQRs: 1,
    qrLocation: 'center_only',
    dimensionsMm: { width: 105, height: 148 },
    aspectRatio: '105 / 148',
    description: 'Formato vertical ideal para mesas de restaurantes, balcões de recepção e eventos. QR code de alto impacto no centro.',
    features: ['1 QR Central gigante', 'Leitura rápida a distância', 'Display vertical'],
  },
  {
    id: 'services_card',
    name: 'Cartão de Serviços',
    tagline: 'Clínica & Especialidades • 1 QR (Frente ou Verso)',
    maxQRs: 1,
    qrLocation: 'choice',
    dimensionsMm: { width: 90, height: 50 },
    aspectRatio: '90 / 50',
    description: 'Inspirado em cartões de estética e medicina com lista de serviços detalhada, linha divisória elegante e QR code.',
    features: ['Lista de serviços com bullets', 'Divisão em 2 colunas', 'QR na Frente ou Verso'],
  },
];

export interface QRCodeItem {
  id: string;
  type: 'whatsapp' | 'instagram' | 'facebook' | 'x' | 'url' | 'vcard' | 'tel' | 'email' | 'text' | 'wifi';
  label: string;
  value: string; // URL, phone, handle, etc.
  customLogoUrl?: string; // Optional for non-social types
}

export interface CardFormData {
  modelId: ModelId;
  qrPosition: 'front' | 'back'; // Only relevant when model has 'choice'
  
  // Titular / Marca
  name: string;
  title: string;
  company: string;
  subtitle: string;
  handle: string; // e.g. @dr.davidmontoya
  idNumber: string; // e.g. 98/b-2079
  
  // Contactos
  phone: string;
  whatsappPhone: string;
  email: string;
  website: string;
  address: string;
  
  // Serviços (para Cartão de Serviços)
  servicesList: string[];
  
  // Mídia / Logos
  logoUrl?: string;
  photoUrl?: string;
  monogram: string; // e.g. "DM", "JS", "LD"
  
  // Cores
  wifiSsid?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  
  // Lista de QR Codes (1 a 3)
  qrItems: QRCodeItem[];
}
